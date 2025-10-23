import { createContext, useContext, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent, setTag, upgradeSession } from '../utils/clarity';
import type { Language } from '../types';

/**
 * Analytics Context API
 */
interface AnalyticsContextType {
  // Core tracking methods
  trackEvent: (eventName: string, data?: Record<string, string | number | boolean>) => void;
  setTag: (key: string, value: string | number | boolean) => void;

  // Specific event trackers
  trackLanguageSwitch: (newLang: Language, switchCount: number) => void;
  trackChallengeView: (storyId: string, challengeId: string) => void;
  trackChallengeCompleted: (challengeId: string, result: 'correct' | 'incorrect', retryAttempt?: boolean) => void;
  trackStarAwarded: (starsTotal: number) => void;
  trackBadgeEarned: (badgeType: 'word_explorer' | 'strong_start') => void;
  trackHintOpened: (challengeId: string) => void;
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

  // Initialize global tags on mount
  useEffect(() => {
    setTag('app_env', APP_ENV);
    setTag('build_sha', BUILD_SHA.slice(0, 7));
    setTag('story_id', 'kite-festival'); // Default story

    console.log('🎯 Analytics initialized:', { APP_ENV, BUILD_SHA: BUILD_SHA.slice(0, 7) });
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

      trackLanguageSwitch: (newLang: Language, switchCount: number) => {
        trackEvent('language_switch', {
          lang: newLang,
          lang_switch_count: switchCount,
        });
      },

      trackChallengeView: (storyId: string, challengeId: string) => {
        trackEvent('challenge_view', {
          story_id: storyId,
          challenge_id: challengeId,
        });
      },

      trackChallengeCompleted: (challengeId: string, result: 'correct' | 'incorrect', retryAttempt = false) => {
        trackEvent('challenge_completed', {
          challenge_id: challengeId,
          result,
          is_retry: retryAttempt,
        });
      },

      trackStarAwarded: (starsTotal: number) => {
        trackEvent('star_awarded', {
          stars_total: starsTotal,
        });
      },

      trackBadgeEarned: (badgeType: 'word_explorer' | 'strong_start') => {
        trackEvent('badge_earned', {
          badge_type: badgeType,
        });
      },

      trackHintOpened: (challengeId: string) => {
        trackEvent('hint_opened', {
          challenge_id: challengeId,
        });
      },

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
