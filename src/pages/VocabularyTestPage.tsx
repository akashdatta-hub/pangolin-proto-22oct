import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Card,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  LinearProgress,
} from '@mui/material';
import { Close, CheckCircle, Cancel, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { speak, getSpeechLanguage } from '../utils/speech';
import { colors, typography } from '../theme/theme';
import { LanguageSelector } from '../components/LanguageSelector';
import { vocabularyTestQuestions } from '../data/challenges';
import { challengeLabels } from '../data/challenges';
import { getSpeechMessage } from '../config/speechMessages';

export const VocabularyTestPage = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const analytics = useAnalytics();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const hasTrackedStartRef = useRef(false);

  // Track vocab test started on mount
  useEffect(() => {
    if (!hasTrackedStartRef.current) {
      analytics.trackVocabTestStarted('kite-festival');
      hasTrackedStartRef.current = true;
    }
  }, [analytics]);

  const currentQuestion = vocabularyTestQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === vocabularyTestQuestions.length - 1;
  const progress = ((currentQuestionIndex + 1) / vocabularyTestQuestions.length) * 100;

  const handleSubmit = () => {
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    // Track answer
    analytics.trackVocabQuestionAnswered(
      currentQuestionIndex + 1,
      correct ? 'correct' : 'incorrect'
    );

    // Get effective speech language (falls back to Hindi if Telugu voice unavailable)
    const speechLang = getSpeechLanguage(language);

    if (correct) {
      setCorrectCount(correctCount + 1);
      const correctMessage = getSpeechMessage('challenge-correct-first', speechLang);
      speak(correctMessage, speechLang, 'challenge-correct');
    } else {
      const incorrectMessage = getSpeechMessage('challenge-incorrect-first', speechLang);
      speak(incorrectMessage, speechLang, 'challenge-incorrect');
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate final score (include current question if answered correctly)
      const finalCount = isCorrect ? correctCount + 1 : correctCount;

      // Track vocab test completion
      analytics.trackVocabTestCompleted(finalCount, vocabularyTestQuestions.length);

      // Store score for ThankYouPage
      localStorage.setItem('vocab_score', String(finalCount));

      // Go to Thank You page
      navigate(`/thank-you?correct=${finalCount}`);
    } else {
      // Next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
      setIsCorrect(false);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer('');
      setShowFeedback(false);
      setIsCorrect(false);
    }
  };

  const renderBottomBar = () => {
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
          onClick={handleBack}
          disabled={currentQuestionIndex === 0}
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

        {!showFeedback ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            sx={{
              bgcolor: colors.primary.main,
              color: 'white',
              textTransform: 'none',
              px: 6,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: 3,
              '&:hover': { bgcolor: colors.primary.dark },
            }}
          >
            {challengeLabels[language].submit}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForward />}
            sx={{
              bgcolor: colors.primary.main,
              color: 'white',
              textTransform: 'none',
              px: 6,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: 3,
              '&:hover': { bgcolor: colors.primary.dark },
            }}
          >
            {isLastQuestion ? t('finish') : t('nextQuestion')}
          </Button>
        )}
      </Box>
    );
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
      {/* Outer container with 48px padding */}
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
          {/* Top Bar - Close button, Progress, and Language Selector */}
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            {/* Top row: Close button and Language Selector */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
              }}
            >
              <IconButton onClick={() => navigate('/')} size="large">
                <Close />
              </IconButton>
              <LanguageSelector />
            </Box>

            {/* Progress Bar */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color={colors.neutral[40]}>
                  {t('question')} {currentQuestionIndex + 1} {t('of')} {vocabularyTestQuestions.length}
                </Typography>
                <Typography variant="body2" color={colors.primary.main} sx={{ fontWeight: 600 }}>
                  {correctCount} {t('correctCount')}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 2,
                  bgcolor: colors.neutral[90],
                  '& .MuiLinearProgress-bar': {
                    bgcolor: colors.tertiary.main,
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Main Content Area - Scrollable */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
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
                {t('questionPrefix')} "{currentQuestion.targetWord}" {t('questionSuffix')}
              </Typography>
              <Typography
                variant="body2"
                color={colors.neutral[40]}
                sx={{ textAlign: 'center', mb: 6 }}
              >
                {t('selectCorrectAnswer')}
              </Typography>

              {/* Options */}
              <Card
                sx={{
                  bgcolor: colors.background.elevated,
                  borderRadius: 3,
                  p: 4,
                  mb: 4,
                }}
              >
                <RadioGroup
                  value={selectedAnswer}
                  onChange={(e) => !showFeedback && setSelectedAnswer(e.target.value)}
                >
                  <Stack spacing={2}>
                    {currentQuestion.options.map((option) => {
                      let cardBgColor = colors.background.elevated;
                      let cardBorder = '3px solid transparent';

                      if (showFeedback) {
                        if (option === currentQuestion.correctAnswer) {
                          cardBgColor = colors.success.light;
                          cardBorder = `3px solid ${colors.success.main}`;
                        } else if (option === selectedAnswer && !isCorrect) {
                          cardBgColor = colors.error.light;
                          cardBorder = `3px solid ${colors.error.main}`;
                        }
                      } else if (selectedAnswer === option) {
                        cardBgColor = colors.primary.light;
                        cardBorder = `3px solid ${colors.primary.main}`;
                      }

                      return (
                        <Card
                          key={option}
                          sx={{
                            bgcolor: cardBgColor,
                            borderRadius: 2,
                            transition: 'all 0.3s',
                            cursor: showFeedback ? 'default' : 'pointer',
                            border: cardBorder,
                            '&:hover': {
                              bgcolor: showFeedback ? cardBgColor : colors.primary.light,
                            },
                          }}
                          onClick={() =>
                            !showFeedback && setSelectedAnswer(option)
                          }
                        >
                          <FormControlLabel
                            value={option}
                            control={
                              <Radio
                                disabled={showFeedback}
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
                            disabled={showFeedback}
                          />
                        </Card>
                      );
                    })}
                  </Stack>
                </RadioGroup>
              </Card>

              {/* Feedback - Only show when there's feedback */}
              {showFeedback && (
                <Box
                  sx={{
                    bgcolor: isCorrect ? colors.success.light : colors.error.light,
                    borderRadius: 3,
                    p: 3,
                    textAlign: 'center',
                    maxWidth: 500,
                    mx: 'auto',
                  }}
                >
                  {isCorrect ? (
                    <CheckCircle sx={{ fontSize: 80, color: colors.success.main }} />
                  ) : (
                    <Cancel sx={{ fontSize: 80, color: colors.error.main }} />
                  )}
                  <Typography
                    variant="h6"
                    sx={{
                      color: isCorrect ? colors.success.main : colors.error.main,
                      mt: 2,
                      fontWeight: 600,
                    }}
                  >
                    {isCorrect
                      ? challengeLabels[language].correct
                      : challengeLabels[language].incorrect}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Bottom Bar - Sticky to bottom of white container */}
          <Box
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'white',
              px: 3,
              py: 2,
            }}
          >
            {renderBottomBar()}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
