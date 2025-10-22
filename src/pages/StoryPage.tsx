import { Box, Container, Typography, Button, IconButton, Chip } from '@mui/material';
import { Close, VolumeUp } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { stories } from '../data/stories';
import { colors, typography } from '../theme/theme';
import { LanguageSelector } from '../components/LanguageSelector';
import { useState } from 'react';

// Progress bar component
const ProgressBar = ({ currentPage, totalPages }: { currentPage: number; totalPages: number }) => {
  const items = [];

  for (let i = 1; i <= totalPages; i++) {
    if (i < currentPage) {
      // Past page - straight line
      items.push(
        <Box
          key={`line-${i}`}
          sx={{ width: 40, height: 3, bgcolor: colors.tertiary.main, borderRadius: 2 }}
        />
      );
    } else if (i === currentPage) {
      // Current page - squiggly line
      items.push(
        <Box
          key={`current-${i}`}
          sx={{
            width: 40,
            height: 8,
            background: `repeating-linear-gradient(90deg, ${colors.tertiary.main} 0px, ${colors.tertiary.main} 6px, transparent 6px, transparent 10px)`,
            borderRadius: 2,
          }}
        />
      );
    } else {
      // Future page - light line
      items.push(
        <Box
          key={`future-${i}`}
          sx={{ width: 40, height: 3, bgcolor: colors.neutral[90], borderRadius: 2 }}
        />
      );
    }

    // Add star after each page except the last
    if (i < totalPages) {
      items.push(
        <Box
          key={`star-${i}`}
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: `2px solid ${colors.secondary.main}`,
            bgcolor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            color: colors.secondary.main,
          }}
        >
          ★
        </Box>
      );
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
      {items}
    </Box>
  );
};

// Text-to-Speech function
const speak = (text: string, lang: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);

    // Map language codes to speech synthesis voices
    const langMap: Record<string, string> = {
      en: 'en-US',
      te: 'te-IN',
      hi: 'hi-IN',
    };

    utterance.lang = langMap[lang] || 'en-US';
    utterance.rate = 0.9; // Slightly slower for learning
    window.speechSynthesis.speak(utterance);
  }
};

export const StoryPage = () => {
  const { storyId, pageNumber } = useParams<{ storyId: string; pageNumber: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [clickedWords, setClickedWords] = useState<Set<string>>(new Set());

  const story = stories[storyId || ''];
  const currentPageNum = parseInt(pageNumber || '1');
  const currentPage = story?.pages.find((p) => p.pageNumber === currentPageNum);

  if (!story || !currentPage) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4">Story not found</Typography>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </Box>
    );
  }

  // Split text into sentences for sentence-level audio
  const sentences = currentPage.text.match(/[^.!?]+[.!?]+/g) || [currentPage.text];

  // Split text into words and punctuation
  const wordsAndPunctuation = currentPage.text.split(/(\s+|[.,!?;:"'()—-])/);

  const handleWordClick = (word: string) => {
    const cleanWord = word.trim().toLowerCase().replace(/[.,!?;:"'()—-]/g, '');
    if (cleanWord) {
      speak(cleanWord, language);
      setClickedWords(new Set([...clickedWords, cleanWord]));
    }
  };

  const handleSentenceClick = (sentence: string) => {
    speak(sentence, language);
  };

  const handleNext = () => {
    if (currentPageNum < story.pages.length) {
      navigate(`/story/${storyId}/page/${currentPageNum + 1}`);
    } else {
      // Go to first challenge
      navigate(`/story/${storyId}/challenge/1`);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: colors.background.default,
      }}
    >
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
            <ProgressBar currentPage={currentPageNum} totalPages={story.pages.length} />
          </Box>
          <LanguageSelector />
        </Box>

        {/* Main Content */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, mt: 4 }}>
          {/* Left - Text Content */}
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: typography.displayFont,
                color: colors.primary.dark,
                mb: 1,
              }}
            >
              {t('readThisPage')}
            </Typography>
            <Typography variant="body2" color={colors.neutral[40]} paragraph>
              {t('clickWordsInstruction')}
            </Typography>

            {/* Interactive Text */}
            <Box sx={{ mt: 3 }}>
              {sentences.map((sentence, sentenceIndex) => (
                <Box key={sentenceIndex} sx={{ mb: 3, display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleSentenceClick(sentence)}
                    sx={{
                      bgcolor: colors.primary.main,
                      color: 'white',
                      width: 32,
                      height: 32,
                      '&:hover': { bgcolor: colors.primary.dark },
                    }}
                  >
                    <VolumeUp sx={{ fontSize: 18 }} />
                  </IconButton>
                  <Box sx={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {sentence.split(/(\s+|[.,!?;:"'()—-])/).map((part, wordIndex) => {
                      const cleanWord = part.trim().toLowerCase().replace(/[.,!?;:"'()—-]/g, '');
                      const isWord = cleanWord.length > 0 && /\w/.test(cleanWord);
                      const isClicked = clickedWords.has(cleanWord);

                      if (!isWord || !part.trim()) {
                        return <span key={wordIndex}>{part}</span>;
                      }

                      return (
                        <Chip
                          key={wordIndex}
                          label={part.trim()}
                          onClick={() => handleWordClick(part)}
                          sx={{
                            bgcolor: isClicked ? colors.tertiary.main : colors.tertiary.light,
                            color: colors.primary.dark,
                            cursor: 'pointer',
                            fontSize: '1rem',
                            height: 'auto',
                            py: 0.5,
                            '&:hover': {
                              bgcolor: colors.tertiary.main,
                            },
                            transition: 'all 0.2s',
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Bottom CTA */}
            <Box
              sx={{
                mt: 6,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: typography.displayFont,
                  color: colors.primary.dark,
                }}
              >
                {t('readyForChallenge')}
              </Typography>
              <Button
                variant="contained"
                onClick={handleNext}
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
                {currentPageNum < story.pages.length ? 'Next Page' : t('playChallenge')}
              </Button>
            </Box>
          </Box>

          {/* Right - Illustration */}
          <Box
            sx={{
              bgcolor: colors.tertiary.light,
              borderRadius: 3,
              minHeight: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
            }}
          >
            <Typography variant="h3" sx={{ opacity: 0.3, textAlign: 'center' }}>
              Illustration
              <br />
              Page {currentPageNum}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
