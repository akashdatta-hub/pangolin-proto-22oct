import { Box, Container, Typography, Button, IconButton, Chip } from '@mui/material';
import { Close, VolumeUp } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useChallengeProgress } from '../contexts/ChallengeProgressContext';
import { stories } from '../data/stories';
import { colors, typography } from '../theme/theme';
import { LanguageSelector } from '../components/LanguageSelector';
import { ProgressBar } from '../components/ProgressBar';
import { useState } from 'react';

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
  const { getStoryResults } = useChallengeProgress();
  const [clickedWords, setClickedWords] = useState<Set<string>>(new Set());

  const story = stories[storyId || ''];
  const currentPageNum = parseInt(pageNumber || '1');
  const currentPage = story?.pages.find((p) => p.pageNumber === currentPageNum);

  // Get challenge results for progress bar
  const results = getStoryResults(storyId || '');
  // Convert results to boolean array: [true, false, true, ...] for each challenge
  const challengeResults = Array(story?.pages.length || 0).fill(false).map((_, index) => {
    const result = results.find((r) => r.challengeIndex === index);
    return result?.correct || false;
  });

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

  const handleWordClick = (word: string) => {
    // Extract only the core word, removing leading/trailing punctuation but keeping internal apostrophes/hyphens
    const cleanWord = word.trim().replace(/^["']+|["'.,!?;:—-]+$/g, '').toLowerCase();
    if (cleanWord) {
      speak(cleanWord, language);
      setClickedWords(new Set([...clickedWords, cleanWord]));
    }
  };

  const handleSentenceClick = (sentence: string) => {
    speak(sentence, language);
  };

  const handleNext = () => {
    // After each page, go to the corresponding challenge
    navigate(`/story/${storyId}/challenge/${currentPageNum}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#FFF4EB',
        pb: '100px', // Add padding to prevent content from being hidden behind fixed bottom bar
        pt: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Main Content - White Container */}
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 3,
            mb: 3,
          }}
        >
          {/* Header inside white container */}
          <Box
            sx={{
              px: 4,
              pt: 3,
              pb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => navigate('/')} size="large">
                <Close />
              </IconButton>
              <ProgressBar
                currentPosition={currentPageNum * 2 - 1}
                totalPositions={story.pages.length * 2}
                challengeResults={challengeResults}
              />
            </Box>
            <LanguageSelector />
          </Box>

          {/* Horizontal Rule */}
          <Box
            sx={{
              height: '1px',
              bgcolor: '#CAC4D0',
              mx: 4,
            }}
          />

          {/* Content Grid */}
          <Box
            sx={{
              p: 4,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 4,
            }}
          >
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
                <Box key={sentenceIndex} sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleSentenceClick(sentence)}
                      sx={{
                        bgcolor: colors.primary.main,
                        color: 'white',
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        '&:hover': { bgcolor: colors.primary.dark },
                      }}
                    >
                      <VolumeUp sx={{ fontSize: 20 }} />
                    </IconButton>
                    <Box
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        alignItems: 'center',
                        rowGap: 1.5,
                      }}
                    >
                      {sentence.split(/[\s—]+/).map((word, wordIndex) => {
                        // Skip empty strings
                        if (!word.trim()) {
                          return null;
                        }

                        // Extract the core word and any leading/trailing punctuation
                        // Keep apostrophes and hyphens as part of the word (contractions, possessives, hyphenated words)
                        const match = word.match(/^(["']*)([A-Za-z0-9'-]+)(["'.,!?;:-]*)$/);

                        if (!match) {
                          return null;
                        }

                        const [, leadingQuotes, coreWord, trailingPunct] = match;
                        const fullWord = leadingQuotes + coreWord + trailingPunct;
                        const cleanWord = coreWord.toLowerCase();
                        const isClicked = clickedWords.has(cleanWord);

                        return (
                          <Button
                            key={wordIndex}
                            onClick={() => handleWordClick(fullWord)}
                            sx={{
                              bgcolor: isClicked ? colors.tertiary.main : '#FFDCBF',
                              color: '#1E0D00',
                              cursor: 'pointer',
                              fontSize: '1.125rem',
                              fontWeight: 500,
                              px: 3,
                              py: 1.25,
                              borderRadius: 8,
                              textTransform: 'none',
                              minWidth: 'auto',
                              transition: 'all 0.2s',
                              '&:hover': {
                                bgcolor: isClicked ? colors.tertiary.main : '#FFD0A3',
                              },
                              '&:active': {
                                bgcolor: isClicked ? colors.tertiary.main : '#FFC48A',
                              },
                            }}
                          >
                            {fullWord}
                          </Button>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

          </Box>

          {/* Right - Illustration */}
          <Box
            sx={{
              borderRadius: 3,
              width: '100%',
              height: '750px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {currentPage.illustration ? (
              <img
                src={currentPage.illustration}
                alt={`Story illustration for page ${currentPageNum}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '12px',
                }}
              />
            ) : (
              <Typography variant="h3" sx={{ opacity: 0.3, textAlign: 'center' }}>
                Illustration
                <br />
                Page {currentPageNum}
              </Typography>
            )}
          </Box>
          </Box>
        </Box>

      </Container>

      {/* Bottom CTA - Fixed to bottom */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: '#FFF4EB',
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          py: 2,
          zIndex: 1000,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: 3,
              p: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
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
              startIcon={
                <Box
                  component="img"
                  src="/assets/icon-play-challenge-button.svg"
                  alt=""
                  sx={{ width: 20, height: 20 }}
                />
              }
              sx={{
                bgcolor: '#743799',
                color: '#FFFFFF',
                textTransform: 'none',
                px: 2,
                py: '10px',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '20px',
                letterSpacing: '0.1px',
                borderRadius: '100px',
                '&:hover': { bgcolor: '#5c2c7a' },
              }}
            >
              {t('playChallenge')}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
