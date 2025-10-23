import { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { speak } from '../utils/speech';
import { colors, typography } from '../theme/theme';
import { LanguageSelector } from '../components/LanguageSelector';
import { getSpeechMessage } from '../config/speechMessages';

export const ThankYouPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const correctCount = parseInt(searchParams.get('correct') || '0');
  const totalQuestions = 3;

  // Auto-play thank you message
  useEffect(() => {
    const message = getSpeechMessage('thankyou-intro', language);
    speak(message, language, 'completion');
  }, [language]);

  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const isExcellent = percentage >= 80;
  const isGood = percentage >= 60;

  const getMessage = () => {
    if (isExcellent) return getSpeechMessage('thankyou-excellent', language);
    if (isGood) return getSpeechMessage('thankyou-good', language);
    return getSpeechMessage('thankyou-keep-practicing', language);
  };

  const getDescription = () => {
    return getSpeechMessage('thankyou-description', language);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#FFF4EB',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Outer container with padding */}
      <Box sx={{ px: 6, py: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* White container */}
        <Container
          maxWidth={false}
          sx={{
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: 2,
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            p: 0,
            overflow: 'hidden',
          }}
        >
          {/* Top Bar - Close button and Language Selector */}
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <IconButton onClick={() => navigate('/')} size="large">
                <Close />
              </IconButton>
              <LanguageSelector />
            </Box>
          </Box>

          {/* Main Content Area - Scrollable */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              px: 6,
              py: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ maxWidth: 800, width: '100%', textAlign: 'center' }}>
              {/* Assets Container */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  mx: 'auto',
                  mb: 6,
                }}
              >
                {/* Filled Star */}
                <Box sx={{ width: 120, height: 120 }}>
                  <img
                    src="/assets/star-filled.svg"
                    alt="Star"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </Box>

                {/* Word Explorer Badge */}
                <Box sx={{ width: 120, height: 120 }}>
                  <img
                    src="/assets/badge-word-explorer-visual.png"
                    alt="Word Explorer Badge"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </Box>

                {/* Pangolin Smiling in Circle */}
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src="/assets/pangolin-smiling.png"
                    alt="Pangolin"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              </Box>

              {/* Thank You Message */}
              <Typography
                variant="h3"
                sx={{
                  fontFamily: typography.displayFont,
                  color: colors.primary.dark,
                  mb: 1.5,
                }}
              >
                {language === 'en'
                  ? 'Thank You'
                  : language === 'te'
                  ? 'ధన్యవాదాలు'
                  : 'धन्यवाद'}
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  color: colors.neutral[30],
                  lineHeight: 1.8,
                  mb: 6,
                  maxWidth: '60%',
                  mx: 'auto',
                }}
              >
                {getDescription()}
              </Typography>

              {/* Results Card */}
              <Box
                sx={{
                  bgcolor: isExcellent
                    ? colors.success.light
                    : isGood
                    ? colors.tertiary.light
                    : colors.error.light,
                  borderRadius: 3,
                  px: 6,
                  py: 4,
                  display: 'inline-flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: typography.displayFont,
                    color: isExcellent
                      ? colors.success.main
                      : isGood
                      ? colors.tertiary.dark
                      : colors.error.main,
                    mb: 1,
                  }}
                >
                  {correctCount} / {totalQuestions}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: isExcellent
                      ? colors.success.main
                      : isGood
                      ? colors.tertiary.dark
                      : colors.error.main,
                  }}
                >
                  {percentage}%{' '}
                  {language === 'en' ? 'Correct' : language === 'te' ? 'సరైनది' : 'सही'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Bottom Bar - Sticky to bottom */}
          <Box
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'white',
              px: 3,
              py: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                variant="contained"
                onClick={() => navigate('/')}
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
                {language === 'en'
                  ? 'Back to Home'
                  : language === 'te'
                  ? 'హోమ్‌కు తిరిగి వెళ్లండి'
                  : 'होम पर वापस जाएं'}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
