import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
} from '@mui/material';
import { CheckCircle, Star, PanTool, PlayArrow } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { useChallengeProgress } from '../contexts/ChallengeProgressContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { speak, getSpeechLanguage } from '../utils/speech';
import { colors, typography } from '../theme/theme';
import { ChallengeLayout } from './ChallengeLayout';
import { ChallengeBottomButtons } from './ChallengeBottomButtons';
import { HintModal } from './HintModal';
import { RetryMistakeBadge } from './RetryMistakeBadge';
import type { MatchPairsChallenge as MatchPairsChallengeType } from '../data/challenges';
import { challengeLabels } from '../data/challenges';
import { getSpeechMessage } from '../config/speechMessages';

interface MatchPairsChallengeProps {
  challenge: MatchPairsChallengeType;
  storyId: string;
  challengeNumber: number;
  totalChallenges: number;
  onComplete: (success: boolean) => void;
  isRevisit?: boolean;
}

type CardType = 'english' | 'translation';

interface CardItem {
  id: string;
  text: string;
  type: CardType;
  matched: boolean;
}

export const MatchPairsChallenge = ({
  challenge,
  storyId,
  challengeNumber,
  totalChallenges,
  onComplete,
  isRevisit = false,
}: MatchPairsChallengeProps) => {
  const { language, t } = useLanguage();
  const analytics = useAnalytics();
  const { checkAndCelebrateStreak, markChallengeAsFailed, clearFailedChallenge } = useChallengeProgress();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardItem[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [attemptCount, setAttemptCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showWrongFeedback, setShowWrongFeedback] = useState(false);
  const [hintModalOpen, setHintModalOpen] = useState(false);
  const [hasSpokenIntro, setHasSpokenIntro] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const hasTrackedStartRef = useRef(false);
  const challengeId = `${storyId}_c${challengeNumber}`;

  // Track challenge started on mount
  useEffect(() => {
    if (!hasTrackedStartRef.current) {
      analytics.trackChallengeStarted(challengeId, 'match_pairs', challengeNumber, isRevisit);

      if (isRevisit) {
        analytics.trackChallengeRevisited(challengeId);
      }

      startTimeRef.current = Date.now();
      hasTrackedStartRef.current = true;
    }
  }, [analytics, challengeId, challengeNumber, isRevisit]);

  // Speak challenge question + instruction when opening
  useEffect(() => {
    if (!hasSpokenIntro) {
      const speakChallengeIntro = async () => {
        // Get effective speech language (falls back to Hindi if Telugu voice unavailable)
        const speechLang = getSpeechLanguage(language);

        const questionText = challenge.question[speechLang];
        const instruction = getSpeechMessage('instruction-match-pairs', speechLang);
        const fullMessage = `${questionText}. ${instruction}`;
        await speak(fullMessage, speechLang, 'default');
        setHasSpokenIntro(true);
      };

      speakChallengeIntro();
    }
  }, [challenge, language, hasSpokenIntro]);

  // Initialize cards - separate columns for English and translations
  useEffect(() => {
    const englishCards: CardItem[] = [];
    const translationCards: CardItem[] = [];

    challenge.pairs.forEach((pair, index) => {
      englishCards.push({
        id: `eng-${index}`,
        text: pair.english,
        type: 'english',
        matched: false,
      });
      translationCards.push({
        id: `trans-${index}`,
        text: pair.translation,
        type: 'translation',
        matched: false,
      });
    });

    // Shuffle each column independently
    const shuffledEnglish = englishCards.sort(() => Math.random() - 0.5);
    const shuffledTranslations = translationCards.sort(() => Math.random() - 0.5);

    setCards([...shuffledTranslations, ...shuffledEnglish]);
  }, [challenge]);

  const handleCardClick = (card: CardItem) => {
    if (card.matched || selectedCards.some((c) => c.id === card.id)) {
      return;
    }

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setAttemptCount(attemptCount + 1);
      checkMatch(newSelected[0], newSelected[1]);
    }
  };

  const checkMatch = (card1: CardItem, card2: CardItem) => {
    // Get effective speech language (falls back to Hindi if Telugu voice unavailable)
    const speechLang = getSpeechLanguage(language);

    // Cards must be different types
    if (card1.type === card2.type) {
      const incorrectMessage = getSpeechMessage('challenge-incorrect-first', speechLang);
      speak(incorrectMessage, speechLang, 'challenge-incorrect');
      setWrongAttempts(wrongAttempts + 1);
      setTimeout(() => setSelectedCards([]), 800);
      return;
    }

    // Find matching pair
    const engCard = card1.type === 'english' ? card1 : card2;
    const transCard = card1.type === 'translation' ? card1 : card2;

    const pairIndex = challenge.pairs.findIndex((pair) => pair.english === engCard.text);
    const isMatch = challenge.pairs[pairIndex]?.translation === transCard.text;

    if (isMatch) {
      const matchedMessage = getSpeechMessage('challenge-matched', speechLang);
      speak(matchedMessage, speechLang, 'challenge-correct');
      const newMatched = new Set(matchedPairs);
      newMatched.add(card1.id);
      newMatched.add(card2.id);
      setMatchedPairs(newMatched);

      setCards((prevCards) =>
        prevCards.map((c) =>
          c.id === card1.id || c.id === card2.id ? { ...c, matched: true } : c
        )
      );

      setSelectedCards([]);

      // Check if all matched
      if (newMatched.size === cards.length) {
        const timeSpent = Date.now() - startTimeRef.current;

        // Track challenge submission (final successful attempt)
        analytics.trackChallengeSubmitted(
          challengeId,
          attemptCount + 1,
          'correct',
          timeSpent
        );

        // Track challenge completion
        analytics.trackChallengeCompleted(challengeId, 'correct', wrongAttempts > 0);

        // Track star collection (1 star if reasonable attempts, 0 if too many retries)
        const earnedStar = attemptCount <= challenge.pairs.length * 1.5;
        analytics.trackStarCollected(challengeId, earnedStar ? 1 : 0);

        const correctMessage = getSpeechMessage('challenge-correct-first', speechLang);
        speak(correctMessage, speechLang, 'challenge-correct');
        setIsComplete(true);
      }
    } else {
      const incorrectMessage = getSpeechMessage('challenge-incorrect-first', speechLang);
      speak(incorrectMessage, speechLang, 'challenge-incorrect');
      setWrongAttempts(wrongAttempts + 1);

      // Show wrong feedback after 2 failed attempts
      if (wrongAttempts + 1 >= 2) {
        setShowWrongFeedback(true);
      }

      setTimeout(() => setSelectedCards([]), 800);
    }
  };

  const isCardSelected = (card: CardItem) => {
    return selectedCards.some((c) => c.id === card.id);
  };

  const handleCollectStar = () => {
    // If this is a revisit and they succeeded, clear it from failed challenges
    if (isRevisit) {
      clearFailedChallenge(storyId, challengeNumber - 1);
      console.log(`✅ Challenge ${challengeNumber} cleared from failed list - earned star on revisit!`);
    }
    onComplete(attemptCount <= challenge.pairs.length * 1.5);
  };

  const handleSkip = () => {
    const timeSpent = Date.now() - startTimeRef.current;

    // Track challenge skipped
    analytics.trackChallengeSkipped(challengeId, attemptCount, 'ran_out_of_retries');

    // Track star missed
    analytics.trackStarMissed(challengeId, 'failed_challenge');

    // If user is on wrong-second (ran out of retries) and it's not a revisit,
    // mark this challenge as failed for later revisit
    if (showWrongFeedback && wrongAttempts >= 2 && !isRevisit) {
      markChallengeAsFailed(storyId, challengeNumber - 1);
      console.log(`❌ Challenge ${challengeNumber} marked as failed - will revisit after challenge 5`);
    }
    onComplete(false);
  };

  const handleTryAgain = () => {
    setShowWrongFeedback(false);
  };

  const handleHintSuccess = () => {
    setShowWrongFeedback(false);
    setWrongAttempts(0);
  };

  const renderBottomBar = () => {
    // Show Back button while playing
    if (!isComplete && !showWrongFeedback) {
      return (
        <ChallengeBottomButtons
          onBack={() => window.history.back()}
          onCheckAnswer={() => {}} // No-op, matching happens automatically
          checkAnswerDisabled={true} // Always disabled since auto-checking
          onSkip={isRevisit ? handleSkip : undefined}
        />
      );
    }

    if (isComplete) {
      return (
        <Box
          sx={{
            bgcolor: colors.success.light,
            borderRadius: 3,
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircle sx={{ fontSize: 80, color: colors.success.main }} />
            <Typography variant="h6" sx={{ color: colors.success.main, fontWeight: 600 }}>
              {challengeLabels[language].correct}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Star />}
            onClick={handleCollectStar}
            sx={{
              bgcolor: colors.success.main,
              color: 'white',
              textTransform: 'none',
              '&:hover': { bgcolor: colors.success.dark },
            }}
          >
            {t('collectStar')}
          </Button>
        </Box>
      );
    }

    if (showWrongFeedback) {
      return (
        <Box
          sx={{
            bgcolor: '#FEF3C7',
            borderRadius: 3,
            p: 3,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ color: '#D97706', fontWeight: 600, mb: 0.5 }}>
                {t('tryAgainMessage')}
              </Typography>
              <Typography variant="body2" sx={{ color: '#D97706' }}>
                {t('matchInstruction')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<PanTool />}
                onClick={() => setHintModalOpen(true)}
                sx={{
                  borderColor: '#D97706',
                  color: '#D97706',
                  textTransform: 'none',
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: 3,
                }}
              >
                {t('hint')}
              </Button>
              <Button
                variant="outlined"
                startIcon={<PlayArrow />}
                onClick={handleSkip}
                sx={{
                  borderColor: '#D97706',
                  color: '#D97706',
                  textTransform: 'none',
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: 3,
                }}
              >
                {t('skip')}
              </Button>
              <Button
                variant="contained"
                onClick={handleTryAgain}
                sx={{
                  bgcolor: '#D97706',
                  color: 'white',
                  textTransform: 'none',
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: 3,
                  '&:hover': { bgcolor: '#B45309' },
                }}
              >
                {t('tryAgain')}
              </Button>
            </Box>
          </Box>
        </Box>
      );
    }

    return null;
  };

  return (
    <ChallengeLayout bottomBar={renderBottomBar()}>
      {/* Main Content */}
      <Box sx={{ px: 4, pt: 4, pb: 4, maxWidth: 800, mx: 'auto', flex: 1 }}>
        {isRevisit && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <RetryMistakeBadge />
          </Box>
        )}
        <Typography
          variant="h4"
          sx={{
            fontFamily: typography.displayFont,
            color: colors.primary.dark,
            mb: 1,
            textAlign: 'center',
          }}
        >
          {challenge.question[language]}
        </Typography>
        <Typography
          variant="body2"
          color={colors.neutral[40]}
          sx={{ textAlign: 'center', mb: 6 }}
        >
          {t('matchInstruction')}
        </Typography>

        {/* Progress */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h6" color={colors.primary.main}>
            {matchedPairs.size / 2} / {challenge.pairs.length} {t('matched')}
          </Typography>
        </Box>

        {/* Two Column Layout: Translation | English */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8, // 64px gap
            mb: 4,
          }}
        >
          {/* Translation Column */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              minWidth: 250,
            }}
          >
            {cards
              .filter((card) => card.type === 'translation')
              .map((card) => (
                <Card
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  sx={{
                    p: 3,
                    cursor: card.matched ? 'default' : 'pointer',
                    bgcolor: card.matched
                      ? colors.success.light
                      : isCardSelected(card)
                      ? colors.secondary.light
                      : colors.tertiary.light,
                    borderRadius: 3,
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    border: card.matched
                      ? `3px solid ${colors.success.main}`
                      : isCardSelected(card)
                      ? `3px solid ${colors.secondary.main}`
                      : '3px solid transparent',
                    transform: isCardSelected(card) ? 'scale(1.05)' : 'scale(1)',
                    '&:hover': {
                      transform: card.matched ? 'scale(1)' : 'scale(1.05)',
                    },
                    opacity: card.matched ? 0.7 : 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: card.matched ? colors.success.main : colors.primary.dark,
                    }}
                  >
                    {card.text}
                  </Typography>
                  {card.matched && (
                    <CheckCircle
                      sx={{ fontSize: 24, color: colors.success.main, mt: 1 }}
                    />
                  )}
                </Card>
              ))}
          </Box>

          {/* English Column */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              minWidth: 250,
            }}
          >
            {cards
              .filter((card) => card.type === 'english')
              .map((card) => (
                <Card
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  sx={{
                    p: 3,
                    cursor: card.matched ? 'default' : 'pointer',
                    bgcolor: card.matched
                      ? colors.success.light
                      : isCardSelected(card)
                      ? colors.secondary.light
                      : colors.primary.light,
                    borderRadius: 3,
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    border: card.matched
                      ? `3px solid ${colors.success.main}`
                      : isCardSelected(card)
                      ? `3px solid ${colors.secondary.main}`
                      : '3px solid transparent',
                    transform: isCardSelected(card) ? 'scale(1.05)' : 'scale(1)',
                    '&:hover': {
                      transform: card.matched ? 'scale(1)' : 'scale(1.05)',
                    },
                    opacity: card.matched ? 0.7 : 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: card.matched ? colors.success.main : colors.primary.dark,
                    }}
                  >
                    {card.text}
                  </Typography>
                  {card.matched && (
                    <CheckCircle
                      sx={{ fontSize: 24, color: colors.success.main, mt: 1 }}
                    />
                  )}
                </Card>
              ))}
          </Box>
        </Box>
      </Box>

      {/* Hint Modal */}
      <HintModal
        open={hintModalOpen}
        onClose={() => setHintModalOpen(false)}
        hint={challenge.hint}
        challengeId={`${storyId}_c${challengeNumber}`}
        onSuccess={handleHintSuccess}
      />
    </ChallengeLayout>
  );
};
