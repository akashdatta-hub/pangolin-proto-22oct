import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import { colors, typography } from '../theme/theme';
import { ChallengeLayout } from './ChallengeLayout';
import { ChallengeFeedback } from './ChallengeFeedback';
import { ChallengeBottomButtons } from './ChallengeBottomButtons';
import { HintModal } from './HintModal';
import type { MCQChallenge as MCQChallengeType } from '../data/challenges';
import { challengeLabels } from '../data/challenges';

interface MCQChallengeProps {
  challenge: MCQChallengeType;
  challengeNumber: number;
  totalChallenges: number;
  onComplete: (success: boolean) => void;
}

type AttemptState = 'initial' | 'correct' | 'wrong-first' | 'wrong-second';

export const MCQChallenge = ({
  challenge,
  challengeNumber,
  totalChallenges,
  onComplete,
}: MCQChallengeProps) => {
  const { language, t } = useLanguage();
  const [selectedAnswer, setSelectedAnswer] = useState('');
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
    const isCorrect = selectedAnswer === challenge.correctAnswer;

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
    setSelectedAnswer('');
    setAttemptState('initial');
  };

  const handleSkip = () => {
    onComplete(false);
  };

  const handleHintSuccess = () => {
    setSelectedAnswer('');
    setAttemptState('initial');
  };

  const renderBottomBar = () => {
    if (attemptState === 'initial') {
      return (
        <ChallengeBottomButtons
          onBack={() => window.history.back()}
          onCheckAnswer={handleSubmit}
          checkAnswerDisabled={!selectedAnswer}
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
          {t('mcqInstruction')}
        </Typography>

        {/* Options */}
        <Card
          sx={{
            bgcolor: 'white',
            borderRadius: 3,
            p: 4,
          }}
        >
          <RadioGroup
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
          >
            <Stack spacing={2}>
              {challenge.options.map((option) => (
                <Card
                  key={option}
                  sx={{
                    bgcolor:
                      selectedAnswer === option
                        ? colors.primary.light
                        : colors.background.elevated,
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    border:
                      selectedAnswer === option
                        ? `3px solid ${colors.primary.main}`
                        : '3px solid transparent',
                    '&:hover': {
                      bgcolor: colors.primary.light,
                    },
                  }}
                  onClick={() => attemptState === 'initial' && setSelectedAnswer(option)}
                >
                  <FormControlLabel
                    value={option}
                    control={
                      <Radio
                        disabled={attemptState === 'correct'}
                        sx={{
                          color: colors.primary.main,
                          '&.Mui-checked': {
                            color: colors.primary.main,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: selectedAnswer === option ? 600 : 400,
                          color: colors.primary.dark,
                        }}
                      >
                        {option}
                      </Typography>
                    }
                    sx={{ p: 2, m: 0, width: '100%' }}
                    disabled={attemptState === 'correct'}
                  />
                </Card>
              ))}
            </Stack>
          </RadioGroup>
        </Card>
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
