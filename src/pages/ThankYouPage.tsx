import { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { colors, typography } from '../theme/theme';
import { LanguageSelector } from '../components/LanguageSelector';

export const ThankYouPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const correctCount = parseInt(searchParams.get('correct') || '0');
  const totalQuestions = 3;

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

  // Auto-play thank you message
  useEffect(() => {
    const message =
      language === 'en'
        ? 'Thank you for completing the test!'
        : language === 'te'
        ? 'పరీక్షను పూర్తి చేసినందుకు ధన్యవాదాలు!'
        : 'परीक्षण पूरा करने के लिए धन्यवाद!';
    speak(message);
  }, []);

  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const isExcellent = percentage >= 80;
  const isGood = percentage >= 60;

  const getMessage = () => {
    if (language === 'en') {
      if (isExcellent) return 'Excellent work!';
      if (isGood) return 'Good job!';
      return 'Keep practicing!';
    } else if (language === 'te') {
      if (isExcellent) return 'అద్భుతమైన పని!';
      if (isGood) return 'మంచి పని!';
      return 'అభ్యాసం కొనసాగించండి!';
    } else {
      if (isExcellent) return 'उत्कृष्ट कार्य!';
      if (isGood) return 'अच्छा काम!';
      return 'अभ्यास जारी रखें!';
    }
  };

  const getDescription = () => {
    if (language === 'en') {
      return 'You have completed the Kite Festival story and vocabulary test. Thank you for participating in this learning experience!';
    } else if (language === 'te') {
      return 'మీరు పతంగాల పండుగ కథ మరియు పదజాల పరీక్షను పూర్తి చేసారు. ఈ అభ్యాస అనుభవంలో పాల్గొన్నందుకు ధన్యవాదాలు!';
    } else {
      return 'आपने पतंग महोत्सव की कहानी और शब्दावली परीक्षण पूरा कर लिया है। इस सीखने के अनुभव में भाग लेने के लिए धन्यवाद!';
    }
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
          {/* Top Bar - Language Selector */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: 3,
              py: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <LanguageSelector />
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
                  ? 'Thank You!'
                  : language === 'te'
                  ? 'ధన్యవాదాలు!'
                  : 'धन्यवाद!'}
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
        </Container>
      </Box>
    </Box>
  );
};
