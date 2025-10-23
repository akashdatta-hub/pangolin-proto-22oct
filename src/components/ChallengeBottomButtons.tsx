import { Box, Button } from '@mui/material';
import { Check } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { colors } from '../theme/theme';

interface ChallengeBottomButtonsProps {
  onBack: () => void;
  onCheckAnswer: () => void;
  checkAnswerDisabled?: boolean;
  checkAnswerLabel?: string; // Optional custom label (defaults to "Check Answer")
}

export const ChallengeBottomButtons = ({
  onBack,
  onCheckAnswer,
  checkAnswerDisabled = false,
  checkAnswerLabel,
}: ChallengeBottomButtonsProps) => {
  const { t } = useLanguage();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Button
        variant="outlined"
        onClick={onBack}
        sx={{
          borderColor: colors.neutral[80],
          color: colors.neutral[40],
          textTransform: 'none',
          px: 4,
          py: 1.5,
          fontSize: '1.1rem',
          borderRadius: 3,
        }}
      >
        {t('back')}
      </Button>

      <Button
        variant="contained"
        startIcon={<Check />}
        onClick={onCheckAnswer}
        disabled={checkAnswerDisabled}
        sx={{
          bgcolor: colors.primary.main,
          color: 'white',
          textTransform: 'none',
          px: 4,
          py: 1.5,
          fontSize: '1.1rem',
          borderRadius: 3,
          '&:hover': { bgcolor: colors.primary.dark },
        }}
      >
        {checkAnswerLabel || t('checkAnswer')}
      </Button>
    </Box>
  );
};
