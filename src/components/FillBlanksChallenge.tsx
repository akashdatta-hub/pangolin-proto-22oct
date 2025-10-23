import { useState } from 'react';
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
import { colors, typography } from '../theme/theme';
import { ChallengeLayout } from './ChallengeLayout';
import { ChallengeFeedback } from './ChallengeFeedback';
import { ChallengeBottomButtons } from './ChallengeBottomButtons';
import { HintModal } from './HintModal';
import type { FillBlanksChallenge as FillBlanksChallengeType } from '../data/challenges';
import { challengeLabels } from '../data/challenges';

interface FillBlanksChallengeProps {
  challenge: FillBlanksChallengeType;
  challengeNumber: number;
  totalChallenges: number;
  onComplete: (success: boolean) => void;
}

type AttemptState = 'initial' | 'correct' | 'wrong-first' | 'wrong-second';

export const FillBlanksChallenge = ({
  challenge,
  challengeNumber,
  totalChallenges,
  onComplete,
}: FillBlanksChallengeProps) => {
  const { language, t } = useLanguage();

  // Calculate number of blanks
  const sentenceParts = challenge.sentence.split('{blank}');
  const numberOfBlanks = sentenceParts.length - 1;

  // Initialize answers array based on number of blanks
  const [answers, setAnswers] = useState<string[]>(Array(numberOfBlanks).fill(''));
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

  const handleSubmit = () => {
    const correctAnswers = Array.isArray(challenge.correctAnswer)
      ? challenge.correctAnswer
      : [challenge.correctAnswer];

    // Check if all answers are correct
    const allCorrect = answers.every((answer, index) =>
      answer.trim().toLowerCase() === correctAnswers[index].toLowerCase()
    );

    if (allCorrect) {
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
  };

  const handleTryAgain = () => {
    setAnswers(Array(numberOfBlanks).fill(''));
    setAttemptState('initial');
  };

  const handleSkip = () => {
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
        onSuccess={handleHintSuccess}
      />
    </ChallengeLayout>
  );
};
