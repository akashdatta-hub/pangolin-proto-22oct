import { Box, Typography } from '@mui/material';
import { Redo } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { colors } from '../theme/theme';

export const RetryMistakeBadge = () => {
  const { t } = useLanguage();

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: colors.tertiary.light,
        borderRadius: 100,
        px: 2,
        py: 1,
      }}
    >
      <Redo sx={{ fontSize: 20, color: colors.tertiary.main }} />
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 500,
          color: colors.tertiary.dark,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {t('retryMistake')}
      </Typography>
    </Box>
  );
};
