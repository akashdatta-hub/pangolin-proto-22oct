import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Modal,
  TextField,
} from '@mui/material';
import { Close, VolumeUp } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { speak, getSpeechLanguage } from '../utils/speech';
import { getWordTranslation } from '../data/wordTranslations';
import { colors, typography } from '../theme/theme';
import { challengeLabels } from '../data/challenges';
import { getSpeechMessage } from '../config/speechMessages';
import type { Hint } from '../data/challenges';

interface HintModalProps {
  open: boolean;
  onClose: () => void;
  hint: Hint;
  onSuccess: () => void;
  challengeId: string;
}

export const HintModal = ({ open, onClose, hint, onSuccess, challengeId }: HintModalProps) => {
  const { language } = useLanguage();
  const analytics = useAnalytics();
  const [hintAnswer, setHintAnswer] = useState('');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const hasTrackedOpenRef = useRef(false);

  // Track hint opened when modal opens
  useEffect(() => {
    if (open && !hasTrackedOpenRef.current) {
      analytics.trackHintOpened(challengeId);
      hasTrackedOpenRef.current = true;
    }
  }, [open, challengeId, analytics]);

  const handleSubmit = () => {
    let cleanAnswer = '';
    let isCorrect = false;
    let correctAnswer = '';

    // Prepare the answer based on hint type
    if (hint.type === 'riddle' && hint.options) {
      // For riddle with options, use selected words
      cleanAnswer = selectedWords.join(' ').toLowerCase();
    } else {
      cleanAnswer = hintAnswer.trim().toLowerCase();
    }

    // Handle different answer types
    if (hint.type === 'image-unscramble') {
      isCorrect = cleanAnswer === hint.answer.toLowerCase();
      correctAnswer = hint.answer;
    } else if (hint.type === 'riddle') {
      // For riddle, check if answer is array or string
      if (Array.isArray(hint.answer)) {
        // For multiple words, check if both are present (order doesn't matter)
        const answers = hint.answer.map(a => a.toLowerCase());
        const inputWords = cleanAnswer.split(/[\s,]+/).filter(w => w.length > 0);
        isCorrect = answers.every(a => inputWords.includes(a)) && inputWords.length === answers.length;
        correctAnswer = hint.answer.join(' and ');
      } else {
        isCorrect = cleanAnswer === hint.answer.toLowerCase();
        correctAnswer = hint.answer;
      }
    }

    if (isCorrect) {
      setHintAnswer('');
      setSelectedWords([]);
      setAttemptCount(0);
      setShowAnswer(false);
      onSuccess();
      onClose();
    } else {
      const speechLang = getSpeechLanguage(language);
      const incorrectMessage = getSpeechMessage('challenge-incorrect-first', speechLang);
      speak(incorrectMessage, speechLang, 'challenge-hint');

      // After first wrong attempt, show the answer
      setAttemptCount(attemptCount + 1);
      setShowAnswer(true);

      // Speak the correct answer in English and then translation
      setTimeout(async () => {
        await speak(correctAnswer, 'en', 'story-word');

        // Get translation for each word
        if (hint.type === 'image-unscramble' || (hint.type === 'riddle' && !Array.isArray(hint.answer))) {
          setTimeout(() => {
            const translation = getWordTranslation(correctAnswer, speechLang as 'te' | 'hi');
            speak(translation, speechLang, 'story-word');
          }, 800);
        } else if (hint.type === 'riddle' && Array.isArray(hint.answer)) {
          // For multiple words, speak each with translation
          let delay = 800;
          hint.answer.forEach((word, index) => {
            setTimeout(async () => {
              await speak(word, 'en', 'story-word');
              setTimeout(() => {
                const translation = getWordTranslation(word, speechLang as 'te' | 'hi');
                speak(translation, speechLang, 'story-word');
              }, 800);
            }, delay * index);
          });
        }
      }, 1500);
    }
  };

  const handleClose = () => {
    // Track hint completed when closing
    analytics.trackHintCompleted(challengeId);
    hasTrackedOpenRef.current = false; // Reset for next time

    setHintAnswer('');
    setSelectedWords([]);
    setAttemptCount(0);
    setShowAnswer(false);
    onClose();
  };

  const handleWordBubbleClick = async (word: string) => {
    // Speak English word first
    await speak(word, 'en', 'story-word');

    // Then speak Hindi translation after a pause
    setTimeout(() => {
      const hindiTranslation = getWordTranslation(word, 'hi');
      speak(hindiTranslation, 'hi', 'story-word');
    }, 800);
  };

  const handleRiddleOptionClick = (word: string) => {
    if (selectedWords.includes(word)) {
      // Deselect word
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      // Select word
      setSelectedWords([...selectedWords, word]);
    }
  };

  // Render content based on hint type
  const renderHintContent = () => {
    switch (hint.type) {
      case 'image-unscramble':
        return (
          <>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {hint.question[language]}
            </Typography>

            {/* Image */}
            <Box
              sx={{
                width: '100%',
                mb: 2,
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img
                src={hint.imagePath}
                alt="Hint"
                style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px', objectFit: 'contain' }}
              />
            </Box>

            {/* Jumbled Letters */}
            <Box
              sx={{
                bgcolor: colors.tertiary.light,
                p: 2,
                borderRadius: 2,
                mb: 3,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontFamily: typography.displayFont, letterSpacing: 4 }}
              >
                {hint.jumbledLetters}
              </Typography>
            </Box>

            {/* Show answer if wrong */}
            {showAnswer && (
              <Box
                sx={{
                  bgcolor: '#FFE8E8',
                  p: 2,
                  borderRadius: 2,
                  mb: 2,
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: colors.neutral[40], mb: 0.5 }}
                >
                  {language === 'en' ? 'The answer is:' : language === 'hi' ? 'सही जवाब है:' : 'సరైన సమాధానం:'}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: typography.displayFont,
                    color: colors.primary.dark,
                  }}
                >
                  {hint.answer}
                </Typography>
              </Box>
            )}

            {/* Answer Input */}
            <TextField
              value={hintAnswer}
              onChange={(e) => setHintAnswer(e.target.value)}
              placeholder={challengeLabels[language].typeHere}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />

            <Button
              variant="contained"
              onClick={handleSubmit}
              fullWidth
              sx={{
                bgcolor: colors.primary.main,
                color: 'white',
                textTransform: 'none',
                '&:hover': { bgcolor: colors.primary.dark },
              }}
            >
              {challengeLabels[language].submit}
            </Button>
          </>
        );

      case 'image-question':
        return (
          <>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {hint.question[language]}
            </Typography>

            {/* Image with aspect ratio */}
            <Box
              sx={{
                width: '100%',
                aspectRatio: hint.imageAspectRatio || 'auto',
                mb: 2,
                borderRadius: 2,
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src={hint.imagePath}
                alt="Hint"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>

            <Button
              variant="contained"
              onClick={handleClose}
              fullWidth
              sx={{
                bgcolor: colors.primary.main,
                color: 'white',
                textTransform: 'none',
                '&:hover': { bgcolor: colors.primary.dark },
              }}
            >
              {challengeLabels[language].close}
            </Button>
          </>
        );

      case 'riddle':
        return (
          <>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {hint.question[language]}
            </Typography>

            {/* Show word options if available */}
            {hint.options && hint.options.length > 0 ? (
              <>
                {/* Selected words display */}
                {selectedWords.length > 0 && (
                  <Box
                    sx={{
                      bgcolor: colors.tertiary.light,
                      p: 2,
                      borderRadius: 2,
                      mb: 2,
                      textAlign: 'center',
                      minHeight: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                    }}
                  >
                    {selectedWords.map((word, index) => (
                      <Typography
                        key={index}
                        variant="h6"
                        sx={{
                          fontFamily: typography.displayFont,
                          color: colors.primary.dark,
                        }}
                      >
                        {word}
                        {index < selectedWords.length - 1 && ', '}
                      </Typography>
                    ))}
                  </Box>
                )}

                {/* Show answer if wrong */}
                {showAnswer && (
                  <Box
                    sx={{
                      bgcolor: '#FFE8E8',
                      p: 2,
                      borderRadius: 2,
                      mb: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: colors.neutral[40], mb: 0.5 }}
                    >
                      {language === 'en' ? 'The answers are:' : language === 'hi' ? 'सही जवाब हैं:' : 'సరైన సమాధానాలు:'}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: typography.displayFont,
                        color: colors.primary.dark,
                      }}
                    >
                      {Array.isArray(hint.answer) ? hint.answer.join(' and ') : hint.answer}
                    </Typography>
                  </Box>
                )}

                {/* Word options */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3, justifyContent: 'center' }}>
                  {hint.options.map((word) => (
                    <Box
                      key={word}
                      sx={{
                        bgcolor: selectedWords.includes(word) ? colors.primary.main : colors.tertiary.light,
                        borderRadius: 100,
                        px: 3,
                        py: 1.5,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: selectedWords.includes(word) ? colors.primary.dark : colors.tertiary.main,
                        },
                      }}
                      onClick={() => handleRiddleOptionClick(word)}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: selectedWords.includes(word) ? 'white' : colors.primary.dark,
                        }}
                      >
                        {word}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  fullWidth
                  disabled={selectedWords.length === 0}
                  sx={{
                    bgcolor: colors.primary.main,
                    color: 'white',
                    textTransform: 'none',
                    '&:hover': { bgcolor: colors.primary.dark },
                    '&:disabled': { bgcolor: colors.neutral[80] },
                  }}
                >
                  {challengeLabels[language].submit}
                </Button>
              </>
            ) : (
              <>
                {/* Show answer if wrong */}
                {showAnswer && (
                  <Box
                    sx={{
                      bgcolor: '#FFE8E8',
                      p: 2,
                      borderRadius: 2,
                      mb: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: colors.neutral[40], mb: 0.5 }}
                    >
                      {language === 'en' ? 'The answer is:' : language === 'hi' ? 'सही जवाब है:' : 'సరైన సమాధానం:'}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: typography.displayFont,
                        color: colors.primary.dark,
                      }}
                    >
                      {Array.isArray(hint.answer) ? hint.answer.join(' and ') : hint.answer}
                    </Typography>
                  </Box>
                )}

                {/* Text input fallback */}
                <TextField
                  value={hintAnswer}
                  onChange={(e) => setHintAnswer(e.target.value)}
                  placeholder={challengeLabels[language].typeHere}
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit();
                    }
                  }}
                />

                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  fullWidth
                  sx={{
                    bgcolor: colors.primary.main,
                    color: 'white',
                    textTransform: 'none',
                    '&:hover': { bgcolor: colors.primary.dark },
                  }}
                >
                  {challengeLabels[language].submit}
                </Button>
              </>
            )}
          </>
        );

      case 'word-bubbles':
        return (
          <>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {hint.question[language]}
            </Typography>

            {/* Word Bubbles */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
              {hint.words.map((word) => (
                <Box
                  key={word}
                  sx={{
                    bgcolor: colors.tertiary.light,
                    borderRadius: 100,
                    px: 2,
                    py: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: colors.tertiary.main,
                    },
                  }}
                  onClick={() => handleWordBubbleClick(word)}
                >
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: colors.primary.main,
                      color: 'white',
                      width: 32,
                      height: 32,
                      '&:hover': { bgcolor: colors.primary.dark },
                    }}
                  >
                    <VolumeUp sx={{ fontSize: 16 }} />
                  </IconButton>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: colors.primary.dark,
                    }}
                  >
                    {word}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Button
              variant="contained"
              onClick={handleClose}
              fullWidth
              sx={{
                bgcolor: colors.primary.main,
                color: 'white',
                textTransform: 'none',
                '&:hover': { bgcolor: colors.primary.dark },
              }}
            >
              {challengeLabels[language].close}
            </Button>
          </>
        );

      case 'translation':
        return (
          <>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {hint.question[language]}
            </Typography>

            {/* Show sentence in Telugu or Hindi based on selected language */}
            <Box
              sx={{
                bgcolor: colors.tertiary.light,
                p: 3,
                borderRadius: 2,
                mb: 3,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: typography.displayFont,
                  color: colors.primary.dark,
                }}
              >
                {language === 'te' ? hint.sentence.te : hint.sentence.hi}
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={handleClose}
              fullWidth
              sx={{
                bgcolor: colors.primary.main,
                color: 'white',
                textTransform: 'none',
                '&:hover': { bgcolor: colors.primary.dark },
              }}
            >
              {challengeLabels[language].close}
            </Button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          minWidth: 400,
          maxWidth: 600,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: typography.displayFont }}>
            {challengeLabels[language].hint}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>

        {renderHintContent()}
      </Box>
    </Modal>
  );
};
