import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
} from '@mui/material';
import { CheckCircle, Star, PanTool, PlayArrow } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { colors, typography } from '../theme/theme';
import { ChallengeLayout } from './ChallengeLayout';
import { ChallengeBottomButtons } from './ChallengeBottomButtons';
import { HintModal } from './HintModal';
import type { MatchPairsChallenge as MatchPairsChallengeType } from '../data/challenges';
import { challengeLabels } from '../data/challenges';

interface MatchPairsChallengeProps {
  challenge: MatchPairsChallengeType;
  challengeNumber: number;
  totalChallenges: number;
  onComplete: (success: boolean) => void;
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
  challengeNumber,
  totalChallenges,
  onComplete,
}: MatchPairsChallengeProps) => {
  const { language, t } = useLanguage();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardItem[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [attemptCount, setAttemptCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showWrongFeedback, setShowWrongFeedback] = useState(false);
  const [hintModalOpen, setHintModalOpen] = useState(false);

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
    // Cards must be different types
    if (card1.type === card2.type) {
      speak(challengeLabels[language].incorrect);
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
      speak(challengeLabels[language].matched);
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
        speak(challengeLabels[language].correct);
        setIsComplete(true);
      }
    } else {
      speak(challengeLabels[language].incorrect);
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
    onComplete(attemptCount <= challenge.pairs.length * 1.5);
  };

  const handleSkip = () => {
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
        onSuccess={handleHintSuccess}
      />
    </ChallengeLayout>
  );
};
