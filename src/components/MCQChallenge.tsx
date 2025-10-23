import { useState, useEffect } from 'react';
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
import { useChallengeProgress } from '../contexts/ChallengeProgressContext';
import { speak, getSpeechLanguage } from '../utils/speech';
import { colors, typography } from '../theme/theme';
import { ChallengeLayout } from './ChallengeLayout';
import { ChallengeFeedback } from './ChallengeFeedback';
import { ChallengeBottomButtons } from './ChallengeBottomButtons';
import { HintModal } from './HintModal';
import { RetryMistakeBadge } from './RetryMistakeBadge';
import type { MCQChallenge as MCQChallengeType } from '../data/challenges';
import { challengeLabels } from '../data/challenges';
import { getSpeechMessage } from '../config/speechMessages';

interface MCQChallengeProps {
  challenge: MCQChallengeType;
  storyId: string;
  challengeNumber: number;
  totalChallenges: number;
  onComplete: (success: boolean) => void;
  isRevisit?: boolean;
}

type AttemptState = 'initial' | 'correct' | 'wrong-first' | 'wrong-second';

export const MCQChallenge = ({
  challenge,
  storyId,
  challengeNumber,
  totalChallenges,
  onComplete,
  isRevisit = false,
}: MCQChallengeProps) => {
  const { language, t } = useLanguage();
  const { checkAndCelebrateStreak, markChallengeAsFailed, clearFailedChallenge } = useChallengeProgress();
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [attemptState, setAttemptState] = useState<AttemptState>('initial');
  const [attemptCount, setAttemptCount] = useState(0);
  const [hintModalOpen, setHintModalOpen] = useState(false);

  // Speak challenge question + instruction when opening
  useEffect(() => {
    const speakChallengeIntro = async () => {
      // Get effective speech language (falls back to Hindi if Telugu voice unavailable)
      const speechLang = getSpeechLanguage(language);

      const questionText = challenge.question[speechLang];
      const instruction = getSpeechMessage('instruction-mcq', speechLang);
      const fullMessage = `${questionText}. ${instruction}`;
      await speak(fullMessage, speechLang, 'default');
    };

    speakChallengeIntro();
  }, [challenge, language]);

  const handleSubmit = async () => {
    const isCorrect = selectedAnswer === challenge.correctAnswer;
    // Get effective speech language (falls back to Hindi if Telugu voice unavailable)
    const speechLang = getSpeechLanguage(language);

    if (isCorrect) {
      setAttemptState('correct');

      // Determine which correct message to use
      let feedbackMessage: string;
      if (attemptCount === 0) {
        // First try correct
        feedbackMessage = getSpeechMessage('challenge-correct-first', speechLang);
      } else {
        // Second try correct
        feedbackMessage = getSpeechMessage('challenge-correct-second', speechLang);
      }

      await speak(feedbackMessage, speechLang, 'challenge-correct');

      // Check for streak celebration (3 in a row)
      const justHitStreak = checkAndCelebrateStreak();
      if (justHitStreak) {
        setTimeout(() => {
          const streakMessage = getSpeechMessage('challenge-streak-3', speechLang);
          speak(streakMessage, speechLang, 'challenge-correct');
        }, 2000); // 2 seconds after correct feedback
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
    setSelectedAnswer('');
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
