import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import {
  Delete,
  Check,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { useChallengeProgress } from '../contexts/ChallengeProgressContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { speak, getSpeechLanguage } from '../utils/speech';
import { colors, typography } from '../theme/theme';
import type { DrawingChallenge as DrawingChallengeType } from '../data/challenges';
import { challengeLabels } from '../data/challenges';
import { ChallengeLayout } from './ChallengeLayout';
import { ChallengeFeedback } from './ChallengeFeedback';
import { ChallengeBottomButtons } from './ChallengeBottomButtons';
import { HintModal } from './HintModal';
import { RetryMistakeBadge } from './RetryMistakeBadge';
import { getSpeechMessage } from '../config/speechMessages';

interface DrawingChallengeProps {
  challenge: DrawingChallengeType;
  storyId: string;
  challengeNumber: number;
  totalChallenges: number;
  onComplete: (success: boolean) => void;
  isRevisit?: boolean;
}

type AttemptState = 'initial' | 'correct' | 'wrong-first' | 'wrong-second';
type CanvasState = 'empty' | 'correct' | 'wrong';

export const DrawingChallenge = ({
  challenge,
  storyId,
  challengeNumber,
  totalChallenges,
  onComplete,
  isRevisit = false,
}: DrawingChallengeProps) => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const analytics = useAnalytics();
  const { markChallengeAsFailed, clearFailedChallenge } = useChallengeProgress();
  const canvasRefs = [
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
  ];
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentCanvas, setCurrentCanvas] = useState<number | null>(null);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [attemptState, setAttemptState] = useState<AttemptState>('initial');
  const [attemptCount, setAttemptCount] = useState(0);

  const startTimeRef = useRef<number>(Date.now());
  const hasTrackedStartRef = useRef(false);
  const challengeId = `${storyId}_c${challengeNumber}`;

  // Track challenge started on mount
  useEffect(() => {
    if (!hasTrackedStartRef.current) {
      analytics.trackChallengeStarted(challengeId, 'drawing', challengeNumber, isRevisit);

      if (isRevisit) {
        analytics.trackChallengeRevisited(challengeId);
      }

      startTimeRef.current = Date.now();
      hasTrackedStartRef.current = true;
    }
  }, [analytics, challengeId, challengeNumber, isRevisit]);

  // Speak challenge question when opening (no instruction for drawing)
  useEffect(() => {
    const speakChallengeIntro = async () => {
      // Get effective speech language (falls back to Hindi if Telugu voice unavailable)
      const speechLang = getSpeechLanguage(language);
      const questionText = challenge.question[speechLang];
      await speak(questionText, speechLang, 'default');
    };

    speakChallengeIntro();
  }, [challenge, language]);
  const [hintModalOpen, setHintModalOpen] = useState(false);
  const [canvasStates, setCanvasStates] = useState<CanvasState[]>(['empty', 'empty', 'empty']);
  const [canvasLabels, setCanvasLabels] = useState<string[]>(['', '', '']);
  const [hasDrawing, setHasDrawing] = useState<boolean[]>([false, false, false]);

  const colorsPalette = [
    { color: '#000000' },
    { color: '#10B981' },
    { color: '#3B82F6' },
    { color: '#EF4444' },
    { color: '#F59E0B' },
  ];


  // Canvas drawing setup
  useEffect(() => {
    canvasRefs.forEach((canvasRef) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 380;
      canvas.height = 450;

      ctx.fillStyle = '#F3F4F6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>, canvasIndex: number) => {
    setIsDrawing(true);
    setCurrentCanvas(canvasIndex);
    const canvas = canvasRefs[canvasIndex].current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>, canvasIndex: number) => {
    if (!isDrawing || currentCanvas !== canvasIndex) return;

    const canvas = canvasRefs[canvasIndex].current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();

    // Mark this canvas as having a drawing
    if (!hasDrawing[canvasIndex]) {
      const newHasDrawing = [...hasDrawing];
      newHasDrawing[canvasIndex] = true;
      setHasDrawing(newHasDrawing);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setCurrentCanvas(null);
  };

  const clearCanvas = (canvasIndex: number) => {
    const canvas = canvasRefs[canvasIndex].current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#F3F4F6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Reset hasDrawing state for this canvas
    const newHasDrawing = [...hasDrawing];
    newHasDrawing[canvasIndex] = false;
    setHasDrawing(newHasDrawing);
  };

  const clearAllCanvases = () => {
    canvasRefs.forEach((_, i) => clearCanvas(i));
    setCanvasStates(['empty', 'empty', 'empty']);
    setCanvasLabels(['', '', '']);
  };

  const handleSubmit = () => {
    // Check if all canvases have drawings
    const allHaveDrawings = hasDrawing.every(drawn => drawn);
    const timeSpent = Date.now() - startTimeRef.current;
    const currentAttempt = attemptCount + 1;

    // Track submission
    analytics.trackChallengeSubmitted(
      challengeId,
      currentAttempt,
      allHaveDrawings ? 'correct' : 'incorrect',
      timeSpent
    );

    if (!allHaveDrawings) {
      // Mark canvases without drawings as wrong
      const newStates: CanvasState[] = hasDrawing.map(drawn => drawn ? 'correct' : 'wrong');
      const newLabels = hasDrawing.map((drawn, i) =>
        drawn ? challenge.correctAnswers[i].charAt(0).toUpperCase() + challenge.correctAnswers[i].slice(1) : ''
      );

      setCanvasStates(newStates);
      setCanvasLabels(newLabels);

      // Get effective speech language (falls back to Hindi if Telugu voice unavailable)
      const speechLang = getSpeechLanguage(language);

      // Handle attempts
      setAttemptCount(attemptCount + 1);
      if (attemptCount === 0) {
        setAttemptState('wrong-first');
        const incorrectMessage = getSpeechMessage('challenge-incorrect-first', speechLang);
        speak(incorrectMessage, speechLang, 'challenge-incorrect');
      } else {
        setAttemptState('wrong-second');
        const incorrectSecondMessage = getSpeechMessage('challenge-incorrect-second', speechLang);
        speak(incorrectSecondMessage, speechLang, 'challenge-incorrect');

        // Track challenge skipped (ran out of retries)
        analytics.trackChallengeSkipped(challengeId, currentAttempt, 'ran_out_of_retries');
        analytics.trackStarMissed(challengeId, 'failed_challenge');
      }
    } else {
      // Get effective speech language (falls back to Hindi if Telugu voice unavailable)
      const speechLang = getSpeechLanguage(language);

      // All canvases have drawings - mark as correct
      const newStates: CanvasState[] = ['correct', 'correct', 'correct'];
      const newLabels = challenge.correctAnswers.map((answer, i) =>
        answer.charAt(0).toUpperCase() + answer.slice(1)
      );

      setCanvasStates(newStates);
      setCanvasLabels(newLabels);

      setAttemptState('correct');

      // Track challenge completed
      analytics.trackChallengeCompleted(
        challengeId,
        'correct',
        attemptCount > 0 // is retry
      );

      // Track star collected (1 star for first attempt, 0 for retries)
      analytics.trackStarCollected(challengeId, attemptCount === 0 ? 1 : 0);

      const correctMessage = getSpeechMessage('challenge-correct-first', speechLang);
      speak(correctMessage, speechLang, 'challenge-correct');
    }
  };

  const handleRetry = () => {
    // Clear only wrong canvases
    canvasStates.forEach((state, i) => {
      if (state === 'wrong') {
        clearCanvas(i);
      }
    });
    setAttemptState('initial');
  };

  const handleSkip = () => {
    // If user is on wrong-second (ran out of retries) and it's not a revisit,
    // mark this challenge as failed for later revisit
    if (attemptState === 'wrong-second' && !isRevisit) {
      markChallengeAsFailed(storyId, challengeNumber - 1); // challengeNumber is 1-indexed
      console.log(`❌ Challenge ${challengeNumber} marked as failed - will revisit after challenge 5`);
    }
    onComplete(false);
  };

  const handleCollectStar = () => {
    // If this is a revisit and they succeeded, clear it from failed challenges
    if (isRevisit) {
      clearFailedChallenge(storyId, challengeNumber - 1);
      console.log(`✅ Challenge ${challengeNumber} cleared from failed list - earned star on revisit!`);
    }
    onComplete(true);
  };

  const handleHintSuccess = () => {
    setAttemptState('initial');
    clearAllCanvases();
  };


  const getCanvasBorderColor = (index: number) => {
    if (canvasStates[index] === 'correct') return colors.success.main;
    if (canvasStates[index] === 'wrong') return '#F59E0B'; // Orange
    return 'transparent';
  };

  // Bottom bar content based on attempt state
  const renderBottomBar = () => {
    if (attemptState === 'initial') {
      return (
        <ChallengeBottomButtons
          onBack={() => window.history.back()}
          onCheckAnswer={handleSubmit}
          onSkip={isRevisit ? handleSkip : undefined}
        />
      );
    }

    if (attemptState === 'correct') {
      return (
        <ChallengeFeedback
          feedbackType="correct"
          onCollectStar={handleCollectStar}
        />
      );
    }

    if (attemptState === 'wrong-first' || attemptState === 'wrong-second') {
      return (
        <ChallengeFeedback
          feedbackType={attemptState}
          onTryAgain={attemptState === 'wrong-first' ? handleRetry : undefined}
          onHint={attemptState === 'wrong-first' ? () => setHintModalOpen(true) : undefined}
          onSkip={handleSkip}
        />
      );
    }

    return null;
  };

  return (
    <ChallengeLayout bottomBar={renderBottomBar()}>
      {/* Question */}
      <Box sx={{ px: 4, pt: 4, pb: 2 }}>
        {isRevisit && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <RetryMistakeBadge />
          </Box>
        )}
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            fontFamily: typography.displayFont,
            color: colors.primary.dark,
            mb: 4,
          }}
        >
          {challenge.question[language]}
        </Typography>
      </Box>

        {/* Drawing Canvases + Color Palette */}
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mb: 4 }}>
          {/* 3 Drawing Canvases */}
          {canvasRefs.map((canvasRef, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                borderRadius: 3,
                overflow: 'hidden',
                border: `4px solid ${getCanvasBorderColor(index)}`,
                boxShadow: 2,
              }}
            >
              <canvas
                ref={canvasRef}
                onMouseDown={(e) => startDrawing(e, index)}
                onMouseMove={(e) => draw(e, index)}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{
                  cursor: 'url(/assets/draw-cursor-24.png) 12 12, crosshair',
                  display: 'block',
                }}
              />
              {/* Label at bottom */}
              {canvasLabels[index] && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 50,
                    bgcolor:
                      canvasStates[index] === 'correct'
                        ? colors.success.light
                        : canvasStates[index] === 'wrong'
                        ? '#FEF3C7'
                        : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color:
                        canvasStates[index] === 'correct'
                          ? colors.success.main
                          : canvasStates[index] === 'wrong'
                          ? '#D97706'
                          : colors.neutral[40],
                      fontWeight: 600,
                    }}
                  >
                    {canvasLabels[index]}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}

          {/* Color Palette */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {colorsPalette.map(({ color }, index) => (
              <Box
                key={index}
                onClick={() => setCurrentColor(color)}
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: color,
                  borderRadius: index === 0 ? 2 : '50%',
                  cursor: 'pointer',
                  border:
                    currentColor === color
                      ? `4px solid ${colors.primary.main}`
                      : '2px solid white',
                  boxShadow: 2,
                  transition: 'transform 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': { transform: 'scale(1.1)' },
                }}
              >
                {currentColor === color && <Typography sx={{ fontSize: 24 }}>✏️</Typography>}
              </Box>
            ))}
            <IconButton
              onClick={clearAllCanvases}
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'white',
                border: '2px solid',
                borderColor: colors.neutral[80],
                boxShadow: 2,
                '&:hover': { bgcolor: colors.neutral[95] },
              }}
            >
              <Delete />
            </IconButton>
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
