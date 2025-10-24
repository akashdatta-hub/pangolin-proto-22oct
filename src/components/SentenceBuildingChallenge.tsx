import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Stack,
  Chip,
} from '@mui/material';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useLanguage } from '../contexts/LanguageContext';
import { useChallengeProgress } from '../contexts/ChallengeProgressContext';
import { speak, getSpeechLanguage } from '../utils/speech';
import { colors, typography } from '../theme/theme';
import { ChallengeLayout } from './ChallengeLayout';
import { ChallengeFeedback } from './ChallengeFeedback';
import { ChallengeBottomButtons } from './ChallengeBottomButtons';
import { HintModal } from './HintModal';
import { RetryMistakeBadge } from './RetryMistakeBadge';
import type { SentenceBuildingChallenge as SentenceBuildingChallengeType } from '../data/challenges';
import { challengeLabels } from '../data/challenges';
import { getSpeechMessage } from '../config/speechMessages';

interface SentenceBuildingChallengeProps {
  challenge: SentenceBuildingChallengeType;
  storyId: string;
  challengeNumber: number;
  totalChallenges: number;
  onComplete: (success: boolean) => void;
  isRevisit?: boolean;
}

type AttemptState = 'initial' | 'correct' | 'wrong-first' | 'wrong-second';

interface WordItem {
  id: string;
  word: string;
}

// Draggable word chip component
const DraggableWordChip = ({
  item,
  isInSentence,
  onClick,
  disabled,
}: {
  item: WordItem;
  isInSentence: boolean;
  onClick: () => void;
  disabled: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Chip
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      label={item.word}
      onClick={onClick}
      disabled={disabled}
      sx={{
        bgcolor: isInSentence ? colors.secondary.main : colors.primary.light,
        color: isInSentence ? 'white' : colors.primary.dark,
        fontSize: '1.1rem',
        py: 2.5,
        px: 1,
        cursor: disabled ? 'default' : 'grab',
        '&:active': {
          cursor: disabled ? 'default' : 'grabbing',
        },
        '&:hover': {
          bgcolor: isInSentence ? colors.secondary.dark : colors.primary.main,
          color: isInSentence ? 'white' : 'white',
        },
      }}
    />
  );
};

// Drop zone indicator component
const DropIndicator = ({ isOver }: { isOver: boolean }) => (
  <Box
    sx={{
      width: '4px',
      height: '40px',
      bgcolor: isOver ? colors.primary.main : 'transparent',
      transition: 'background-color 0.2s',
      mx: 0.5,
    }}
  />
);

export const SentenceBuildingChallenge = ({
  challenge,
  storyId,
  challengeNumber,
  totalChallenges,
  onComplete,
  isRevisit = false,
}: SentenceBuildingChallengeProps) => {
  const { language, t } = useLanguage();
  const { checkAndCelebrateStreak, markChallengeAsFailed, clearFailedChallenge } = useChallengeProgress();
  const [availableWords, setAvailableWords] = useState<WordItem[]>([]);
  const [selectedWords, setSelectedWords] = useState<WordItem[]>([]);
  const [attemptState, setAttemptState] = useState<AttemptState>('initial');
  const [attemptCount, setAttemptCount] = useState(0);
  const [hintModalOpen, setHintModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Speak challenge question + instruction when opening
  useEffect(() => {
    const speakChallengeIntro = async () => {
      const speechLang = getSpeechLanguage(language);
      const questionText = challenge.question[speechLang];
      const instruction = getSpeechMessage('instruction-sentence-building', speechLang);
      const fullMessage = `${questionText}. ${instruction}`;
      await speak(fullMessage, speechLang, 'default');
    };

    speakChallengeIntro();
  }, [challenge, language]);

  // Initialize shuffled words
  useEffect(() => {
    const shuffled = [...challenge.words]
      .sort(() => Math.random() - 0.5)
      .map((word, index) => ({
        id: `available-${word}-${index}`,
        word,
      }));
    setAvailableWords(shuffled);
  }, [challenge]);

  const handleWordClick = (item: WordItem, fromAvailable: boolean) => {
    if (attemptState === 'correct') return;

    if (fromAvailable) {
      // Add to sentence
      const newSelectedWords = [...selectedWords, item];
      setAvailableWords(availableWords.filter((w) => w.id !== item.id));
      setSelectedWords(newSelectedWords);

      // Read the cumulative sentence
      const cumulativeSentence = newSelectedWords.map(w => w.word).join(' ');
      speak(cumulativeSentence, 'en', 'story-sentence');
    } else {
      // Remove from sentence, return to available
      setSelectedWords(selectedWords.filter((w) => w.id !== item.id));
      setAvailableWords([...availableWords, item]);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over ? (over.id as string) : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || attemptState === 'correct') {
      setActiveId(null);
      setOverId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeInSentence = selectedWords.find(w => w.id === activeId);
    const activeInAvailable = availableWords.find(w => w.id === activeId);
    const overInSentence = selectedWords.find(w => w.id === overId);
    const overInAvailable = availableWords.find(w => w.id === overId);

    // Case 1: Dragging from available to sentence area
    if (activeInAvailable && overId === 'sentence-area') {
      setAvailableWords(availableWords.filter(w => w.id !== activeId));
      setSelectedWords([...selectedWords, activeInAvailable]);

      // Read the sentence
      const newSentence = [...selectedWords, activeInAvailable].map(w => w.word).join(' ');
      speak(newSentence, 'en', 'story-sentence');
    }
    // Case 2: Dragging from available to a specific position in sentence
    else if (activeInAvailable && overInSentence) {
      const overIndex = selectedWords.findIndex(w => w.id === overId);
      setAvailableWords(availableWords.filter(w => w.id !== activeId));
      const newSelected = [...selectedWords];
      newSelected.splice(overIndex, 0, activeInAvailable);
      setSelectedWords(newSelected);

      // Read the sentence
      const newSentence = newSelected.map(w => w.word).join(' ');
      speak(newSentence, 'en', 'story-sentence');
    }
    // Case 3: Reordering within sentence
    else if (activeInSentence && overInSentence && activeId !== overId) {
      const oldIndex = selectedWords.findIndex(w => w.id === activeId);
      const newIndex = selectedWords.findIndex(w => w.id === overId);
      const reordered = arrayMove(selectedWords, oldIndex, newIndex);
      setSelectedWords(reordered);

      // Read the sentence
      const newSentence = reordered.map(w => w.word).join(' ');
      speak(newSentence, 'en', 'story-sentence');
    }
    // Case 4: Dragging from sentence back to available
    else if (activeInSentence && overId === 'available-area') {
      setSelectedWords(selectedWords.filter(w => w.id !== activeId));
      setAvailableWords([...availableWords, activeInSentence]);
    }
    // Case 5: Dragging from sentence to available word (treat as return to available)
    else if (activeInSentence && overInAvailable) {
      setSelectedWords(selectedWords.filter(w => w.id !== activeId));
      setAvailableWords([...availableWords, activeInSentence]);
    }

    setActiveId(null);
    setOverId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
  };

  const handleSubmit = async () => {
    const userSentence = selectedWords.map(w => w.word).join(' ');
    const isCorrect = userSentence === challenge.correctSentence;

    const speechLang = getSpeechLanguage(language);

    if (isCorrect) {
      setAttemptState('correct');

      let feedbackMessage: string;
      if (attemptCount === 0) {
        feedbackMessage = getSpeechMessage('challenge-correct-first', speechLang);
      } else {
        feedbackMessage = getSpeechMessage('challenge-correct-second', speechLang);
      }

      await speak(feedbackMessage, speechLang, 'challenge-correct');

      const justHitStreak = checkAndCelebrateStreak();
      if (justHitStreak) {
        setTimeout(() => {
          const streakMessage = getSpeechMessage('challenge-streak-3', speechLang);
          speak(streakMessage, speechLang, 'challenge-correct');
        }, 2000);
      }
    } else {
      setAttemptCount(attemptCount + 1);
      if (attemptCount === 0) {
        setAttemptState('wrong-first');
        const incorrectMessage = getSpeechMessage('challenge-incorrect-first', speechLang);
        await speak(incorrectMessage, speechLang, 'challenge-incorrect');
      } else if (attemptCount >= 1) {
        setAttemptState('wrong-second');
        const incorrectSecondMessage = getSpeechMessage('challenge-incorrect-second', speechLang);
        await speak(incorrectSecondMessage, speechLang, 'challenge-incorrect');
      }
    }
  };

  const handleCollectStar = () => {
    // If this is a revisit and they succeeded, clear it from failed challenges
    if (isRevisit) {
      clearFailedChallenge(storyId, challengeNumber - 1);
      console.log(`✅ Challenge ${challengeNumber} cleared from failed list - earned star on revisit!`);
    }
    onComplete(true);
  };

  const handleTryAgain = () => {
    const shuffled = [...challenge.words]
      .sort(() => Math.random() - 0.5)
      .map((word, index) => ({
        id: `available-${word}-${index}-retry`,
        word,
      }));
    setAvailableWords(shuffled);
    setSelectedWords([]);
    setAttemptState('initial');
  };

  const handleSkip = () => {
    // If user is on wrong-second (ran out of retries) and it's not a revisit,
    // mark this challenge as failed for later revisit
    if (attemptState === 'wrong-second' && !isRevisit) {
      markChallengeAsFailed(storyId, challengeNumber - 1);
      console.log(`❌ Challenge ${challengeNumber} marked as failed - will revisit after challenge 5`);
    }
    onComplete(false);
  };

  const handleHintSuccess = () => {
    const shuffled = [...challenge.words]
      .sort(() => Math.random() - 0.5)
      .map((word, index) => ({
        id: `available-${word}-${index}-hint`,
        word,
      }));
    setAvailableWords(shuffled);
    setSelectedWords([]);
    setAttemptState('initial');
  };

  const renderBottomBar = () => {
    if (attemptState === 'initial') {
      return (
        <ChallengeBottomButtons
          onBack={() => window.history.back()}
          onCheckAnswer={handleSubmit}
          checkAnswerDisabled={selectedWords.length !== challenge.words.length}
          onSkip={isRevisit ? handleSkip : undefined}
        />
      );
    }

    if (attemptState === 'correct' || attemptState === 'wrong-first' || attemptState === 'wrong-second') {
      return (
        <ChallengeFeedback
          feedbackType={attemptState}
          onCollectStar={attemptState === 'correct' ? handleCollectStar : undefined}
          onTryAgain={attemptState === 'wrong-first' ? handleTryAgain : undefined}
          onHint={attemptState === 'wrong-first' ? () => setHintModalOpen(true) : undefined}
          onSkip={attemptState === 'wrong-first' || attemptState === 'wrong-second' ? handleSkip : undefined}
        />
      );
    }

    return null;
  };

  // Find active item for drag overlay
  const activeItem = activeId
    ? selectedWords.find(w => w.id === activeId) || availableWords.find(w => w.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <ChallengeLayout bottomBar={renderBottomBar()}>
        {/* Main Content */}
        <Box sx={{ px: 4, pt: 4, pb: 4, maxWidth: 700, mx: 'auto', flex: 1 }}>
          {isRevisit && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <RetryMistakeBadge />
            </Box>
          )}
          <Typography
            variant="h4"
            sx={{
              fontFamily: typography.displayFont,
              color: colors.primary.dark,
              mb: 1,
              textAlign: 'center',
            }}
          >
            {challenge.question[language]}
          </Typography>
          <Typography
            variant="body2"
            color={colors.neutral[40]}
            sx={{ textAlign: 'center', mb: 6 }}
          >
            {t('sentenceBuildingInstruction')}
          </Typography>

          {/* User's Sentence - Droppable and Sortable */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle1"
              color={colors.neutral[40]}
              sx={{ mb: 2, textAlign: 'center' }}
            >
              {t('yourAnswer')}
            </Typography>
            <Card
              id="sentence-area"
              sx={{
                bgcolor: overId === 'sentence-area' ? colors.tertiary.main : colors.tertiary.light,
                borderRadius: 3,
                p: 3,
                minHeight: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
                border: overId === 'sentence-area' ? `2px dashed ${colors.primary.main}` : '2px dashed transparent',
              }}
            >
              {selectedWords.length === 0 ? (
                <Typography variant="body2" color={colors.neutral[40]}>
                  {t('sentenceBuildingInstruction')}
                </Typography>
              ) : (
                <SortableContext items={selectedWords.map(w => w.id)} strategy={horizontalListSortingStrategy}>
                  <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                    {selectedWords.map((item) => (
                      <DraggableWordChip
                        key={item.id}
                        item={item}
                        isInSentence={true}
                        onClick={() => handleWordClick(item, false)}
                        disabled={attemptState === 'correct'}
                      />
                    ))}
                  </Stack>
                </SortableContext>
              )}
            </Card>
          </Box>

          {/* Available Words - Draggable */}
          <Box>
            <Typography
              variant="subtitle1"
              color={colors.neutral[40]}
              sx={{ mb: 2, textAlign: 'center' }}
            >
              {t('availableWords')}:
            </Typography>
            <Box
              id="available-area"
              sx={{
                bgcolor: overId === 'available-area' ? colors.primary.light : 'transparent',
                borderRadius: 2,
                p: 2,
                minHeight: 80,
                transition: 'background-color 0.2s',
                border: overId === 'available-area' ? `2px dashed ${colors.primary.main}` : '2px dashed transparent',
              }}
            >
              <SortableContext items={availableWords.map(w => w.id)} strategy={horizontalListSortingStrategy}>
                <Stack
                  direction="row"
                  spacing={2}
                  flexWrap="wrap"
                  justifyContent="center"
                  sx={{ rowGap: 2 }}
                >
                  {availableWords.map((item) => (
                    <DraggableWordChip
                      key={item.id}
                      item={item}
                      isInSentence={false}
                      onClick={() => handleWordClick(item, true)}
                      disabled={attemptState === 'correct'}
                    />
                  ))}
                </Stack>
              </SortableContext>
            </Box>
          </Box>
        </Box>

        {/* Hint Modal */}
        <HintModal
          open={hintModalOpen}
          onClose={() => setHintModalOpen(false)}
          hint={challenge.hint}
          challengeId={`${storyId}_c${challengeNumber}`}
          onSuccess={handleHintSuccess}
        />
      </ChallengeLayout>

      {/* Drag Overlay - Ghost preview */}
      <DragOverlay>
        {activeItem ? (
          <Chip
            label={activeItem.word}
            sx={{
              bgcolor: colors.primary.main,
              color: 'white',
              fontSize: '1.1rem',
              py: 2.5,
              px: 1,
              cursor: 'grabbing',
              opacity: 0.8,
              boxShadow: 3,
            }}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
