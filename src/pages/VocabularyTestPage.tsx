import { useState } from 'react';
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
import { colors, typography } from '../theme/theme';
import { LanguageSelector } from '../components/LanguageSelector';
import { vocabularyTestQuestions } from '../data/challenges';
import { challengeLabels } from '../data/challenges';

export const VocabularyTestPage = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion = vocabularyTestQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === vocabularyTestQuestions.length - 1;
  const progress = ((currentQuestionIndex + 1) / vocabularyTestQuestions.length) * 100;

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
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setCorrectCount(correctCount + 1);
      speak(challengeLabels[language].correct);
    } else {
      speak(challengeLabels[language].incorrect);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Go to Thank You page
      navigate(`/thank-you?correct=${correctCount}`);
    } else {
      // Next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
      setIsCorrect(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.background.default }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            pt: 2,
            pb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/')} size="large">
              <Close />
            </IconButton>
            <Typography variant="body2" color={colors.neutral[40]}>
              {t('vocabularyTest')}
            </Typography>
          </Box>
          <LanguageSelector />
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 4 }}>
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

        {/* Main Content */}
        <Box sx={{ mt: 6, maxWidth: 700, mx: 'auto' }}>
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
              bgcolor: 'white',
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

          {/* Submit/Next Button */}
          {!showFeedback ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
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
            </Box>
          ) : (
            <>
              {/* Feedback */}
              <Box
                sx={{
                  bgcolor: isCorrect ? colors.success.light : colors.error.light,
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'center',
                  maxWidth: 500,
                  mx: 'auto',
                  mb: 4,
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

              {/* Next Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
              </Box>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};
