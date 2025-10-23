import { useRef, useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { CheckCircle, Star, PanTool, PlayArrow, Refresh } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { colors } from '../theme/theme';
import { challengeLabels } from '../data/challenges';
import { ConfettiEffect } from './ConfettiEffect';

export type FeedbackType = 'correct' | 'wrong-first' | 'wrong-second';

interface ChallengeFeedbackProps {
  feedbackType: FeedbackType;
  onCollectStar?: () => void;
  onTryAgain?: () => void;
  onHint?: () => void;
  onSkip?: () => void;
  customMessage?: string; // Optional custom message override
}

export const ChallengeFeedback = ({
  feedbackType,
  onCollectStar,
  onTryAgain,
  onHint,
  onSkip,
  customMessage,
}: ChallengeFeedbackProps) => {
  const { language, t } = useLanguage();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonCenter, setButtonCenter] = useState<{ x: number; y: number } | undefined>();

  useEffect(() => {
    if (feedbackType === 'correct' && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonCenter({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }, [feedbackType]);

  // Correct state - green feedback with collect star button
  if (feedbackType === 'correct') {
    return (
      <>
        <ConfettiEffect active={true} origin={buttonCenter} />
        <Box
          sx={{
            bgcolor: colors.success.light,
            borderRadius: 3,
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircle sx={{ fontSize: 80, color: colors.success.main }} />
            <Typography variant="h6" sx={{ color: colors.success.main, fontWeight: 600 }}>
              {customMessage || challengeLabels[language].correct}
            </Typography>
          </Box>
          {onCollectStar && (
            <Button
              ref={buttonRef}
              variant="contained"
              startIcon={<Star />}
              onClick={onCollectStar}
              sx={{
                bgcolor: colors.success.main,
                color: 'white',
                textTransform: 'none',
                '&:hover': { bgcolor: colors.success.dark },
              }}
            >
              {t('collectStar')}
            </Button>
          )}
        </Box>
      </>
    );
  }

  // Wrong-first state - yellow/orange feedback with hint, skip, try again buttons
  if (feedbackType === 'wrong-first') {
    return (
      <Box
        sx={{
          bgcolor: '#FEF3C7',
          borderRadius: 3,
          p: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ color: '#D97706', fontWeight: 600, mb: 0.5 }}>
              {customMessage || t('tryAgainMessage')}
            </Typography>
            <Typography variant="body2" sx={{ color: '#D97706' }}>
              1 {t('attemptsLeft')}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {onHint && (
              <Button
                variant="outlined"
                startIcon={<PanTool />}
                onClick={onHint}
                sx={{
                  borderColor: '#D97706',
                  color: '#D97706',
                  textTransform: 'none',
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: 3,
                }}
              >
                {t('hint')}
              </Button>
            )}
            {onSkip && (
              <Button
                variant="outlined"
                startIcon={<PlayArrow />}
                onClick={onSkip}
                sx={{
                  borderColor: '#D97706',
                  color: '#D97706',
                  textTransform: 'none',
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: 3,
                }}
              >
                {t('skip')}
              </Button>
            )}
            {onTryAgain && (
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={onTryAgain}
                sx={{
                  bgcolor: '#D97706',
                  color: 'white',
                  textTransform: 'none',
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: 3,
                  '&:hover': { bgcolor: '#B45309' },
                }}
              >
                {t('tryAgain')}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  // Wrong-second state - yellow/orange feedback with skip button only
  if (feedbackType === 'wrong-second') {
    return (
      <Box
        sx={{
          bgcolor: '#FEF3C7',
          borderRadius: 3,
          p: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ color: '#D97706', fontWeight: 600, mb: 0.5 }}>
              {customMessage || t('moveOnMessage')}
            </Typography>
            <Typography variant="body2" sx={{ color: '#D97706' }}>
              {t('revisitLater')}
            </Typography>
          </Box>
          {onSkip && (
            <Button
              variant="outlined"
              startIcon={<PlayArrow />}
              onClick={onSkip}
              sx={{
                borderColor: '#D97706',
                color: '#D97706',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                borderRadius: 3,
              }}
            >
              {t('skip')}
            </Button>
          )}
        </Box>
      </Box>
    );
  }

  return null;
};
