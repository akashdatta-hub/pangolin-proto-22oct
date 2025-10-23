import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Stack,
  Chip,
} from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import { colors, typography } from '../theme/theme';
import { ChallengeLayout } from './ChallengeLayout';
import { ChallengeFeedback } from './ChallengeFeedback';
import { ChallengeBottomButtons } from './ChallengeBottomButtons';
import { HintModal } from './HintModal';
import type { SentenceBuildingChallenge as SentenceBuildingChallengeType } from '../data/challenges';
import { challengeLabels } from '../data/challenges';

interface SentenceBuildingChallengeProps {
  challenge: SentenceBuildingChallengeType;
  challengeNumber: number;
  totalChallenges: number;
  onComplete: (success: boolean) => void;
}

type AttemptState = 'initial' | 'correct' | 'wrong-first' | 'wrong-second';

export const SentenceBuildingChallenge = ({
  challenge,
  challengeNumber,
  totalChallenges,
  onComplete,
}: SentenceBuildingChallengeProps) => {
  const { language, t } = useLanguage();
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [attemptState, setAttemptState] = useState<AttemptState>('initial');
  const [attemptCount, setAttemptCount] = useState(0);
  const [hintModalOpen, setHintModalOpen] = useState(false);

  // Text-to-Speech function
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap: Record<string, string> = { en: 'en-US', te: 'te-IN', hi: 'hi-IN' };
      utterance.lang = langMap[language] || 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Initialize shuffled words
  useEffect(() => {
    const shuffled = [...challenge.words].sort(() => Math.random() - 0.5);
    setAvailableWords(shuffled);
  }, [challenge]);

  const handleWordClick = (word: string, fromAvailable: boolean) => {
    if (attemptState === 'correct') return;

    if (fromAvailable) {
      setAvailableWords(availableWords.filter((w) => w !== word));
      setSelectedWords([...selectedWords, word]);
    } else {
      setSelectedWords(selectedWords.filter((w) => w !== word));
      setAvailableWords([...availableWords, word]);
    }
  };

  const handleSubmit = () => {
    const userSentence = selectedWords.join(' ');
    const isCorrect = userSentence === challenge.correctSentence;

    if (isCorrect) {
      setAttemptState('correct');
      speak(challengeLabels[language].correct);
    } else {
      setAttemptCount(attemptCount + 1);
      if (attemptCount === 0) {
        setAttemptState('wrong-first');
        speak(challengeLabels[language].incorrect);
      } else if (attemptCount >= 1) {
        setAttemptState('wrong-second');
        speak(challengeLabels[language].incorrectSecond);
      }
    }
  };

  const handleCollectStar = () => {
    onComplete(true);
  };

  const handleTryAgain = () => {
    const shuffled = [...challenge.words].sort(() => Math.random() - 0.5);
    setAvailableWords(shuffled);
    setSelectedWords([]);
    setAttemptState('initial');
  };

  const handleSkip = () => {
    onComplete(false);
  };

  const handleHintSuccess = () => {
    const shuffled = [...challenge.words].sort(() => Math.random() - 0.5);
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
      <Box sx={{ px: 4, pt: 4, pb: 4, maxWidth: 700, mx: 'auto', flex: 1 }}>
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

        {/* User's Sentence */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="subtitle1"
            color={colors.neutral[40]}
            sx={{ mb: 2, textAlign: 'center' }}
          >
            {t('yourAnswer')}
          </Typography>
          <Card
            sx={{
              bgcolor: colors.tertiary.light,
              borderRadius: 3,
              p: 3,
              minHeight: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {selectedWords.length === 0 ? (
              <Typography variant="body2" color={colors.neutral[40]}>
                {t('sentenceBuildingInstruction')}
              </Typography>
            ) : (
              <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                {selectedWords.map((word, index) => (
                  <Chip
                    key={`${word}-${index}`}
                    label={word}
                    onClick={() => handleWordClick(word, false)}
                    disabled={attemptState === 'correct'}
                    sx={{
                      bgcolor: colors.secondary.main,
                      color: 'white',
                      fontSize: '1.1rem',
                      py: 2.5,
                      px: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: colors.secondary.dark,
                      },
                    }}
                  />
                ))}
              </Stack>
            )}
          </Card>
        </Box>

        {/* Available Words */}
        <Box>
          <Typography
            variant="subtitle1"
            color={colors.neutral[40]}
            sx={{ mb: 2, textAlign: 'center' }}
          >
            {t('availableWords')}:
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            justifyContent="center"
            sx={{ rowGap: 2 }}
          >
            {availableWords.map((word, index) => (
              <Chip
                key={`${word}-${index}`}
                label={word}
                onClick={() => handleWordClick(word, true)}
                disabled={attemptState === 'correct'}
                sx={{
                  bgcolor: colors.primary.light,
                  color: colors.primary.dark,
                  fontSize: '1.1rem',
                  py: 2.5,
                  px: 1,
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
        onSuccess={handleHintSuccess}
      />
    </ChallengeLayout>
  );
};
