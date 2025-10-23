import { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Divider,
} from '@mui/material';
import { VolumeUp, Star, StarBorder } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useChallengeProgress } from '../contexts/ChallengeProgressContext';
import { colors, typography } from '../theme/theme';
import { LanguageSelector } from '../components/LanguageSelector';
import { stories } from '../data/stories';
import { storyChallenges } from '../data/challenges';

interface VocabularyWord {
  word: string;
  type: string; // e.g., "verb", "noun", "adjective"
}

export const StoryCompletePage = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const {
    getStoryResults,
    hasCompletedFirstStory,
    hasEarnedStrongStart,
    markFirstStoryComplete,
    markStrongStartEarned
  } = useChallengeProgress();

  const story = stories[storyId || ''];
  const challenges = storyChallenges[storyId || ''];
  const results = getStoryResults(storyId || '');

  // Calculate stars from context results (not URL params)
  const starsEarned = results.filter((r) => r.correct).length;

  // Determine which badges to award
  const earnedWordExplorer = !hasCompletedFirstStory; // First story completion
  const earnedStrongStart = !hasEarnedStrongStart && (starsEarned === 4 || starsEarned === 5); // First time getting 4-5 stars

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

  // Auto-play congratulations message and mark badges as earned
  useEffect(() => {
    speak(t('storyComplete'));

    // Mark badges as earned (only on first completion)
    if (earnedWordExplorer) {
      markFirstStoryComplete();
    }
    if (earnedStrongStart) {
      markStrongStartEarned();
    }
  }, []);

  if (!story) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4">Story not found</Typography>
      </Box>
    );
  }

  // Extract vocabulary from challenges - use explicit goalWords
  const extractVocabularyFromChallenges = (): {learned: VocabularyWord[], missed: VocabularyWord[]} => {
    if (!challenges) {
      return { learned: [], missed: [] };
    }

    const learnedWords: VocabularyWord[] = [];
    const missedWords: VocabularyWord[] = [];
    const learnedWordSet = new Set<string>();
    const missedWordSet = new Set<string>();

    challenges.challenges.forEach((challenge, challengeIndex) => {
      // Get result for this challenge
      const result = results.find((r) => r.challengeIndex === challengeIndex);
      const wasCorrect = result?.correct || false;

      // Use goalWords defined for each challenge
      const goalWords = challenge.goalWords || [];

      goalWords.forEach((word) => {
        const wordLower = word.toLowerCase();
        const vocabularyWord: VocabularyWord = {
          word: word.charAt(0).toUpperCase() + word.slice(1),
          type: getWordType(word),
        };

        if (wasCorrect) {
          // Add to learned if not already there
          if (!learnedWordSet.has(wordLower) && !missedWordSet.has(wordLower)) {
            learnedWordSet.add(wordLower);
            learnedWords.push(vocabularyWord);
          }
        } else {
          // Add to missed if not already in learned
          if (!learnedWordSet.has(wordLower) && !missedWordSet.has(wordLower)) {
            missedWordSet.add(wordLower);
            missedWords.push(vocabularyWord);
          }
        }
      });
    });

    return { learned: learnedWords, missed: missedWords };
  };

  // Simple word type classifier for goal words
  const getWordType = (word: string): string => {
    const wordLower = word.toLowerCase();

    // Verbs
    const verbs = ['held'];
    if (verbs.includes(wordLower)) return 'verb';

    // Adjectives
    const adjectives = ['blue', 'tight'];
    if (adjectives.includes(wordLower)) return 'adjective';

    // Nouns (default)
    // kite, bird, plane, air, wind, sky, tree, spool
    return 'noun';
  };

  const { learned, missed } = extractVocabularyFromChallenges();

  // Word Bubble Component
  const WordBubble = ({ word, type, isLearned }: { word: string; type: string; isLearned: boolean }) => (
    <Box
      sx={{
        bgcolor: isLearned ? colors.tertiary.light : '#FFE8E8',
        borderRadius: 100,
        px: 2,
        py: 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        mr: 1.5,
        mb: 1.5,
      }}
    >
      <IconButton
        size="small"
        onClick={() => speak(word)}
        sx={{
          bgcolor: isLearned ? colors.primary.main : '#D32F2F',
          color: 'white',
          width: 32,
          height: 32,
          '&:hover': { bgcolor: isLearned ? colors.primary.dark : '#B71C1C' },
        }}
      >
        <VolumeUp sx={{ fontSize: 16 }} />
      </IconButton>
      <Box>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: isLearned ? colors.primary.dark : '#D32F2F',
            lineHeight: 1.2,
          }}
        >
          {word}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: colors.neutral[40],
            fontSize: '0.7rem',
            lineHeight: 1,
          }}
        >
          {type}
        </Typography>
      </Box>
    </Box>
  );

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
            }}
          >
            {/* Title */}
            <Typography
              variant="h3"
              sx={{
                fontFamily: typography.displayFont,
                color: colors.primary.dark,
                mb: 4,
              }}
            >
              {t('storyComplete')}
            </Typography>

            {/* Two Column Layout */}
            <Box
              sx={{
                display: 'flex',
                gap: 6,
                maxWidth: 1400,
              }}
            >
              {/* Left Column - Vocabulary */}
              <Box sx={{ flex: 1 }}>
                {/* Words Learned */}
                <Typography
                  variant="body1"
                  sx={{
                    color: colors.neutral[20],
                    mb: 2,
                    fontWeight: 400,
                  }}
                >
                  {learned.length} words learned in this story
                </Typography>

                <Box sx={{ mb: 4 }}>
                  {learned.map((item, index) => (
                    <WordBubble
                      key={index}
                      word={item.word}
                      type={item.type}
                      isLearned={true}
                    />
                  ))}
                </Box>

                {/* More Words to Learn */}
                {missed.length > 0 && (
                  <>
                    <Typography
                      variant="body1"
                      sx={{
                        color: colors.neutral[20],
                        mb: 2,
                        fontWeight: 400,
                      }}
                    >
                      {missed.length} more {missed.length === 1 ? 'word' : 'words'} to learn in this story
                    </Typography>

                    <Box>
                      {missed.map((item, index) => (
                        <WordBubble
                          key={index}
                          word={item.word}
                          type={item.type}
                          isLearned={false}
                        />
                      ))}
                    </Box>
                  </>
                )}
              </Box>

              {/* Right Column - Stars & Badge */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                {/* Stars Display */}
                <Box
                  sx={{
                    bgcolor: colors.tertiary.light,
                    borderRadius: 3,
                    px: 3,
                    py: 2,
                    textAlign: 'center',
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      i <= starsEarned ? (
                        <img
                          key={i}
                          src="/assets/star-filled.svg"
                          alt="Filled star"
                          style={{ width: '32px', height: '32px' }}
                        />
                      ) : (
                        <img
                          key={i}
                          src="/assets/star-outline.svg"
                          alt="Outline star"
                          style={{ width: '32px', height: '32px' }}
                        />
                      )
                    ))}
                  </Box>
                  <Typography variant="body2" color={colors.neutral[40]}>
                    {starsEarned} of 5 stars collected
                  </Typography>
                </Box>

                {/* Badge Section - Show if any badges earned */}
                {(earnedWordExplorer || earnedStrongStart) && (
                  <>
                    {/* Word Explorer Badge */}
                    {earnedWordExplorer && (
                      <Box
                        sx={{
                          bgcolor: colors.tertiary.light,
                          borderRadius: 3,
                          px: 3,
                          py: 2,
                          textAlign: 'center',
                          display: 'inline-flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: colors.primary.dark,
                            mb: 1,
                            fontWeight: 600,
                          }}
                        >
                          You collected a badge!
                        </Typography>

                        <Divider sx={{ width: '100%', mb: 2 }} />

                        <Box
                          sx={{
                            width: 120,
                            height: 120,
                            mb: 2,
                          }}
                        >
                          <img
                            src="/assets/badge-word-explorer-visual.png"
                            alt="Word explorer badge"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </Box>

                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: typography.displayFont,
                            color: colors.primary.dark,
                            mb: 0.5,
                          }}
                        >
                          Word Explorer
                        </Typography>
                        <Typography variant="body2" color={colors.neutral[40]}>
                          Completed your first story
                        </Typography>
                      </Box>
                    )}

                    {/* Strong Start Badge */}
                    {earnedStrongStart && (
                      <Box
                        sx={{
                          bgcolor: colors.tertiary.light,
                          borderRadius: 3,
                          px: 3,
                          py: 2,
                          textAlign: 'center',
                          display: 'inline-flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: colors.primary.dark,
                            mb: 1,
                            fontWeight: 600,
                          }}
                        >
                          You collected a badge!
                        </Typography>

                        <Divider sx={{ width: '100%', mb: 2 }} />

                        <Box
                          sx={{
                            width: 120,
                            height: 120,
                            mb: 2,
                          }}
                        >
                          <img
                            src="/assets/badge-all-correct.png"
                            alt="Strong start badge"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </Box>

                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: typography.displayFont,
                            color: colors.primary.dark,
                            mb: 0.5,
                          }}
                        >
                          Strong Start
                        </Typography>
                        <Typography variant="body2" color={colors.neutral[40]}>
                          Earned 4 or 5 stars on a story
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
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
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: typography.displayFont,
                color: colors.neutral[20],
                fontWeight: 400,
              }}
            >
              {t('lastChallenge')}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/vocabulary-test')}
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
              Answer 3 questions
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
