import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  Stack,
  Chip,
} from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import { useChallengeProgress } from '../contexts/ChallengeProgressContext';
import { speak, getSpeechLanguage } from '../utils/speech';
import { colors, typography } from '../theme/theme';
import { ChallengeLayout } from './ChallengeLayout';
import { ChallengeFeedback } from './ChallengeFeedback';
import { ChallengeBottomButtons } from './ChallengeBottomButtons';
import { HintModal } from './HintModal';
import { RetryMistakeBadge } from './RetryMistakeBadge';
import type { FillBlanksChallenge as FillBlanksChallengeType } from '../data/challenges';
import { challengeLabels } from '../data/challenges';
import { getSpeechMessage } from '../config/speechMessages';

interface FillBlanksChallengeProps {
  challenge: FillBlanksChallengeType;
  storyId: string;
  challengeNumber: number;
  totalChallenges: number;
  onComplete: (success: boolean) => void;
  isRevisit?: boolean;
}

type AttemptState = 'initial' | 'correct' | 'wrong-first' | 'wrong-second';

export const FillBlanksChallenge = ({
  challenge,
  storyId,
  challengeNumber,
  totalChallenges,
  onComplete,
  isRevisit = false,
}: FillBlanksChallengeProps) => {
  const { language, t } = useLanguage();
  const { checkAndCelebrateStreak, markChallengeAsFailed, clearFailedChallenge } = useChallengeProgress();

  // Calculate number of blanks
  const sentenceParts = challenge.sentence.split('{blank}');
  const numberOfBlanks = sentenceParts.length - 1;

  // Initialize answers array based on number of blanks
  const [answers, setAnswers] = useState<string[]>(Array(numberOfBlanks).fill(''));
  const [attemptState, setAttemptState] = useState<AttemptState>('initial');
  const [attemptCount, setAttemptCount] = useState(0);
  const [hintModalOpen, setHintModalOpen] = useState(false);

  // Speak challenge question + instruction when opening
  useEffect(() => {
    const speakChallengeIntro = async () => {
      // Get effective speech language (falls back to Hindi if Telugu voice unavailable)
      const speechLang = getSpeechLanguage(language);

      const questionText = challenge.question[speechLang];
      const instruction = getSpeechMessage('instruction-fill-blanks', speechLang);
      const fullMessage = `${questionText}. ${instruction}`;
      await speak(fullMessage, speechLang, 'default');
    };

    speakChallengeIntro();
  }, [challenge, language]);

  const handleSubmit = async () => {
    const correctAnswers = Array.isArray(challenge.correctAnswer)
      ? challenge.correctAnswer
      : [challenge.correctAnswer];

    // Check if all answers are correct
    const allCorrect = answers.every((answer, index) =>
      answer.trim().toLowerCase() === correctAnswers[index].toLowerCase()
    );

    // Get effective speech language (falls back to Hindi if Telugu voice unavailable)
    const speechLang = getSpeechLanguage(language);

    if (allCorrect) {
      setAttemptState('correct');

      // Determine which correct message to use
      let feedbackMessage: string;
      if (attemptCount === 0) {
        feedbackMessage = getSpeechMessage('challenge-correct-first', speechLang);
      } else {
        feedbackMessage = getSpeechMessage('challenge-correct-second', speechLang);
      }

      await speak(feedbackMessage, speechLang, 'challenge-correct');

      // Check for streak celebration
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

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSuggestionClick = (word: string) => {
    // Find the first empty blank and fill it
    const firstEmptyIndex = answers.findIndex(a => !a.trim());
    if (firstEmptyIndex !== -1) {
      handleAnswerChange(firstEmptyIndex, word);
    } else {
      // If all are filled, replace the last one
      handleAnswerChange(answers.length - 1, word);
    }

    // Speak the English word using the selected language's voice
    // Get effective speech language (falls back to Hindi if Telugu voice unavailable)
    const speechLang = getSpeechLanguage(language);
    speak(word, speechLang, 'story-word');
  };

  const handleTryAgain = () => {
    setAnswers(Array(numberOfBlanks).fill(''));
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
    setAnswers(Array(numberOfBlanks).fill(''));
    setAttemptState('initial');
  };

  const renderBottomBar = () => {
    if (attemptState === 'initial') {
      return (
        <ChallengeBottomButtons
          onBack={() => window.history.back()}
          onCheckAnswer={handleSubmit}
          checkAnswerDisabled={!answers.every(a => a.trim())}
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

  return (
    <ChallengeLayout bottomBar={renderBottomBar()}>
      {/* Main Content */}
      <Box sx={{ px: 4, pt: 4, pb: 4, maxWidth: '65%', mx: 'auto', flex: 1 }}>
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
          {challengeLabels[language].fillBlanksInstruction}
        </Typography>

        {/* Sentence with Blanks */}
        <Card
          sx={{
            bgcolor: colors.tertiary.light,
            borderRadius: 3,
            p: 4,
            mb: 4,
            boxShadow: 'none',
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
            {sentenceParts.map((part, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="h5" sx={{ fontWeight: 500 }}>
                  {part}
                </Typography>
                {index < sentenceParts.length - 1 && (
                  <TextField
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="____"
                    variant="outlined"
                    disabled={attemptState === 'correct'}
                    sx={{
                      minWidth: 150,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'white',
                        fontWeight: 600,
                        fontSize: '1.25rem',
                      },
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Card>

        {/* Suggested Words */}
        <Box>
          <Typography
            variant="subtitle2"
            color={colors.neutral[40]}
            sx={{ mb: 2, textAlign: 'center' }}
          >
            {t('suggestedWords')}:
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            {challenge.suggestedWords.map((word) => (
              <Chip
                key={word}
                label={word}
                onClick={() => handleSuggestionClick(word)}
                disabled={attemptState === 'correct'}
                sx={{
                  bgcolor: answers.includes(word) ? colors.primary.main : colors.primary.light,
                  color: answers.includes(word) ? 'white' : colors.primary.dark,
                  fontSize: '1rem',
                  py: 2.5,
                  px: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: colors.primary.main,
                    color: 'white',
                  },
                }}
              />
            ))}
          </Stack>
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
  );
};
