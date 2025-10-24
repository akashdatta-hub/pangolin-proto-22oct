import { createContext, useContext, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { initializeClarity, trackEvent, setTag, upgradeSession } from '../utils/clarity';
import type { Language } from '../types';

/**
 * Analytics Context API
 */
interface AnalyticsContextType {
  // Core tracking methods
  trackEvent: (eventName: string, data?: Record<string, string | number | boolean>) => void;
  setTag: (key: string, value: string | number | boolean) => void;

  // Story tracking
  trackStoryStarted: (storyId: string) => void;
  trackStoryCompleted: (storyId: string, starsEarned: number) => void;
  trackAppCompleted: (totalStars: number, vocabScore: number) => void;

  // Language tracking
  trackLanguageSet: (initialLang: Language) => void;
  trackLanguageSwitch: (newLang: Language, switchCount: number) => void;

  // Challenge lifecycle
  trackChallengeView: (storyId: string, challengeId: string) => void;
  trackChallengeStarted: (challengeId: string, challengeType: string, challengeNumber: number, isRevisit: boolean) => void;
  trackChallengeSubmitted: (challengeId: string, attemptNumber: number, result: 'correct' | 'incorrect', timeSpentMs: number) => void;
  trackChallengeCompleted: (challengeId: string, result: 'correct' | 'incorrect', retryAttempt?: boolean) => void;
  trackChallengeSkipped: (challengeId: string, attemptsUsed: number, reason: string) => void;
  trackChallengeRevisited: (challengeId: string) => void;

  // Hints
  trackHintOpened: (challengeId: string) => void;
  trackHintCompleted: (challengeId: string) => void;

  // Stars
  trackStarAwarded: (starsTotal: number) => void;
  trackStarCollected: (challengeId: string, starNumber: number) => void;
  trackStarMissed: (challengeId: string, reason: string) => void;

  // Vocabulary test
  trackVocabTestStarted: (storyId: string) => void;
  trackVocabQuestionAnswered: (questionNumber: number, result: 'correct' | 'incorrect') => void;
  trackVocabTestCompleted: (score: number, totalQuestions: number) => void;

  // Badges
  trackBadgeEarned: (badgeType: 'word_explorer' | 'strong_start') => void;

  // Other
  trackTTSUsed: (context: string, language: Language) => void;
  trackError: (errorName: string, errorMessage: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

/**
 * Hook to access analytics
 */
export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
};

/**
 * Environment and build information
 */
const BUILD_SHA = (import.meta.env.VITE_BUILD_SHA as string) ?? 'local';
const APP_ENV = import.meta.env.MODE === 'production' ? 'prod' : 'dev';

/**
 * Analytics Provider Component
 * Automatically tracks page views and provides analytics API
 */
export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const location = useLocation();

  // Initialize Clarity on mount
  useEffect(() => {
    const CLARITY_PROJECT_ID = 'tuj5ywlqbp';

    // Initialize Clarity with project ID
    initializeClarity(CLARITY_PROJECT_ID);

    // Set global tags
    const buildTimestamp = new Date().toISOString();
    setTag('app_env', APP_ENV);
    setTag('build_sha', BUILD_SHA.slice(0, 7));
    setTag('build_timestamp', buildTimestamp);
    setTag('story_id', 'kite-festival'); // Default story

    console.log('🎯 Analytics initialized:', { APP_ENV, BUILD_SHA: BUILD_SHA.slice(0, 7), buildTimestamp });
  }, []);

  // Track page views based on route changes
  useEffect(() => {
    const path = location.pathname;

    // Home screen
    if (path === '/') {
      setTag('screen', 'home');
      trackEvent('screen_view', { screen_name: 'home' });
      return;
    }

    // Story page: /story/:storyId/page/:pageNumber
    const storyPageMatch = path.match(/^\/story\/([^/]+)\/page\/(\d+)$/);
    if (storyPageMatch) {
      const [, storyId, pageNum] = storyPageMatch;
      setTag('story_id', storyId);
      setTag('screen', `page_${pageNum}`);
      trackEvent('screen_view', {
        screen_name: 'story_page',
        story_id: storyId,
        page_number: pageNum,
      });
      return;
    }

    // Challenge page: /story/:storyId/challenge/:challengeId
    const challengeMatch = path.match(/^\/story\/([^/]+)\/challenge\/(\d+)$/);
    if (challengeMatch) {
      const [, storyId, chNum] = challengeMatch;
      setTag('story_id', storyId);
      setTag('challenge_id', `c${chNum}`);
      trackEvent('challenge_view', {
        story_id: storyId,
        challenge_id: `c${chNum}`,
      });
      return;
    }

    // Story complete page: /story/:storyId/complete
    const completeMatch = path.match(/^\/story\/([^/]+)\/complete$/);
    if (completeMatch) {
      const [, storyId] = completeMatch;
      setTag('story_id', storyId);
      setTag('screen', 'complete');
      trackEvent('screen_view', {
        screen_name: 'story_complete',
        story_id: storyId,
      });
      return;
    }

    // Vocabulary test: /story/:storyId/vocabulary-test
    const vocabMatch = path.match(/^\/story\/([^/]+)\/vocabulary-test$/);
    if (vocabMatch) {
      const [, storyId] = vocabMatch;
      setTag('story_id', storyId);
      setTag('screen', 'vocabulary_test');
      trackEvent('screen_view', {
        screen_name: 'vocabulary_test',
        story_id: storyId,
      });
      return;
    }

    // Thank you page: /story/:storyId/thank-you or /thank-you
    if (path.includes('thank-you')) {
      const thankYouMatch = path.match(/^\/story\/([^/]+)\/thank-you$/);
      const storyId = thankYouMatch ? thankYouMatch[1] : 'unknown';
      if (storyId !== 'unknown') {
        setTag('story_id', storyId);
      }
      setTag('screen', 'thank_you');
      trackEvent('screen_view', {
        screen_name: 'thank_you',
        story_id: storyId,
      });
      return;
    }

    // Fallback for unknown routes
    setTag('screen', 'unknown');
    console.warn('📊 Analytics: Unknown route', path);
  }, [location.pathname]);

  // Create analytics API
  const api = useMemo<AnalyticsContextType>(
    () => ({
      trackEvent,
      setTag,

      // Story tracking
      trackStoryStarted: (storyId: string) => {
        trackEvent('story_started', { story_id: storyId });
      },

      trackStoryCompleted: (storyId: string, starsEarned: number) => {
        trackEvent('story_completed', {
          story_id: storyId,
          stars_earned: starsEarned,
        });
      },

      trackAppCompleted: (totalStars: number, vocabScore: number) => {
        setTag('stars_collected', totalStars);
        setTag('vocab_score', vocabScore);
        trackEvent('app_completed', {
          total_stars: totalStars,
          vocab_score: vocabScore,
        });
      },

      // Language tracking
      trackLanguageSet: (initialLang: Language) => {
        setTag('lang', initialLang);
        trackEvent('language_set', { lang: initialLang });
      },

      trackLanguageSwitch: (newLang: Language, switchCount: number) => {
        setTag('lang', newLang);
        setTag('lang_switch_count', switchCount);
        trackEvent('language_switched', {
          lang: newLang,
          switch_count: switchCount,
        });
      },

      // Challenge lifecycle
      trackChallengeView: (storyId: string, challengeId: string) => {
        trackEvent('challenge_view', {
          story_id: storyId,
          challenge_id: challengeId,
        });
      },

      trackChallengeStarted: (challengeId: string, challengeType: string, challengeNumber: number, isRevisit: boolean) => {
        setTag('current_challenge', challengeId);
        setTag('challenge_type', challengeType);
        setTag('challenge_number', challengeNumber);
        setTag('is_revisit', isRevisit);

        trackEvent('challenge_started', {
          challenge_id: challengeId,
          challenge_type: challengeType,
          challenge_number: challengeNumber,
          is_revisit: isRevisit,
        });
      },

      trackChallengeSubmitted: (challengeId: string, attemptNumber: number, result: 'correct' | 'incorrect', timeSpentMs: number) => {
        setTag('attempts_used', attemptNumber);
        setTag('time_spent_ms', timeSpentMs);

        trackEvent('challenge_submitted', {
          challenge_id: challengeId,
          attempt_number: attemptNumber,
          result,
          time_spent_ms: timeSpentMs,
        });
      },

      trackChallengeCompleted: (challengeId: string, result: 'correct' | 'incorrect', retryAttempt = false) => {
        trackEvent('challenge_completed', {
          challenge_id: challengeId,
          result,
          is_retry: retryAttempt,
        });
      },

      trackChallengeSkipped: (challengeId: string, attemptsUsed: number, reason: string) => {
        trackEvent('challenge_skipped', {
          challenge_id: challengeId,
          attempts_used: attemptsUsed,
          reason,
        });
      },

      trackChallengeRevisited: (challengeId: string) => {
        trackEvent('challenge_revisited', {
          challenge_id: challengeId,
        });
      },

      // Hints
      trackHintOpened: (challengeId: string) => {
        trackEvent('challenge_hint_opened', {
          challenge_id: challengeId,
        });
      },

      trackHintCompleted: (challengeId: string) => {
        trackEvent('challenge_hint_completed', {
          challenge_id: challengeId,
        });
      },

      // Stars
      trackStarAwarded: (starsTotal: number) => {
        trackEvent('star_awarded', {
          stars_total: starsTotal,
        });
      },

      trackStarCollected: (challengeId: string, starNumber: number) => {
        trackEvent('star_collected', {
          challenge_id: challengeId,
          star_number: starNumber,
        });
      },

      trackStarMissed: (challengeId: string, reason: string) => {
        trackEvent('star_missed', {
          challenge_id: challengeId,
          reason,
        });
      },

      // Vocabulary test
      trackVocabTestStarted: (storyId: string) => {
        trackEvent('vocab_test_started', {
          story_id: storyId,
        });
      },

      trackVocabQuestionAnswered: (questionNumber: number, result: 'correct' | 'incorrect') => {
        trackEvent('vocab_question_answered', {
          question_number: questionNumber,
          result,
        });
      },

      trackVocabTestCompleted: (score: number, totalQuestions: number) => {
        setTag('vocab_score', score);
        trackEvent('vocab_test_completed', {
          score,
          total_questions: totalQuestions,
        });
      },

      // Badges
      trackBadgeEarned: (badgeType: 'word_explorer' | 'strong_start') => {
        trackEvent('badge_earned', {
          badge_type: badgeType,
        });
      },

      // Other
      trackTTSUsed: (context: string, language: Language) => {
        trackEvent('tts_used', {
          tts_context: context,
          lang: language,
        });
      },

      trackError: (errorName: string, errorMessage: string) => {
        setTag('error_name', errorName);
        setTag('error_msg', errorMessage.slice(0, 120));
        trackEvent('js_error');
        upgradeSession('js_error'); // Prioritize error sessions
      },
    }),
    []
  );

  return (
    <AnalyticsContext.Provider value={api}>
      {children}
    </AnalyticsContext.Provider>
  );
}
