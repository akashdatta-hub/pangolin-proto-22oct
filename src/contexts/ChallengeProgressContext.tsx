import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface ChallengeResult {
  challengeIndex: number;
  correct: boolean;
  timestamp: number;
  attempts?: number; // Track number of attempts
}

interface ChallengeProgressContextType {
  // Track results for current story session
  results: Record<string, ChallengeResult[]>; // storyId -> array of results
  recordResult: (storyId: string, challengeIndex: number, correct: boolean, attempts?: number) => void;
  getStoryResults: (storyId: string) => ChallengeResult[];
  clearStoryResults: (storyId: string) => void;
  clearAllResults: () => void;
  // Badge tracking
  hasCompletedFirstStory: boolean;
  hasEarnedStrongStart: boolean;
  markFirstStoryComplete: () => void;
  markStrongStartEarned: () => void;
  resetAllProgress: () => void; // Reset everything including badges
  // Streak tracking (for "3 in a row" celebration)
  currentStreak: number;
  checkAndCelebrateStreak: () => boolean; // Returns true if just hit streak of 3
  // Failed challenges tracking (for spaced repetition)
  failedChallenges: Record<string, number[]>; // storyId -> array of challenge indices that failed
  markChallengeAsFailed: (storyId: string, challengeIndex: number) => void;
  getFailedChallenges: (storyId: string) => number[];
  clearFailedChallenge: (storyId: string, challengeIndex: number) => void;
}

const ChallengeProgressContext = createContext<ChallengeProgressContextType | undefined>(undefined);

export const ChallengeProgressProvider = ({ children }: { children: ReactNode }) => {
  const [results, setResults] = useState<Record<string, ChallengeResult[]>>({});
  const [hasCompletedFirstStory, setHasCompletedFirstStory] = useState(false);
  const [hasEarnedStrongStart, setHasEarnedStrongStart] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [failedChallenges, setFailedChallenges] = useState<Record<string, number[]>>({});

  const recordResult = (storyId: string, challengeIndex: number, correct: boolean, attempts?: number) => {
    // Update streak tracking
    if (correct) {
      setCurrentStreak((prev) => prev + 1);
    } else {
      setCurrentStreak(0); // Reset streak on incorrect answer
    }

    setResults((prev) => {
      const storyResults = prev[storyId] || [];
      // Update or add result for this challenge
      const existingIndex = storyResults.findIndex((r) => r.challengeIndex === challengeIndex);

      const newResult: ChallengeResult = {
        challengeIndex,
        correct,
        timestamp: Date.now(),
        attempts,
      };

      if (existingIndex >= 0) {
        // Update existing result
        const updated = [...storyResults];
        updated[existingIndex] = newResult;
        return { ...prev, [storyId]: updated };
      } else {
        // Add new result
        return { ...prev, [storyId]: [...storyResults, newResult] };
      }
    });
  };

  const getStoryResults = (storyId: string): ChallengeResult[] => {
    return results[storyId] || [];
  };

  const clearStoryResults = (storyId: string) => {
    setResults((prev) => {
      const updated = { ...prev };
      delete updated[storyId];
      return updated;
    });
  };

  const clearAllResults = () => {
    setResults({});
  };

  const markChallengeAsFailed = (storyId: string, challengeIndex: number) => {
    setFailedChallenges((prev) => {
      const storyFailed = prev[storyId] || [];
      // Only add if not already in the list
      if (!storyFailed.includes(challengeIndex)) {
        return { ...prev, [storyId]: [...storyFailed, challengeIndex] };
      }
      return prev;
    });
  };

  const getFailedChallenges = (storyId: string): number[] => {
    return failedChallenges[storyId] || [];
  };

  const clearFailedChallenge = (storyId: string, challengeIndex: number) => {
    setFailedChallenges((prev) => {
      const storyFailed = prev[storyId] || [];
      const filtered = storyFailed.filter((idx) => idx !== challengeIndex);
      if (filtered.length === 0) {
        const updated = { ...prev };
        delete updated[storyId];
        return updated;
      }
      return { ...prev, [storyId]: filtered };
    });
  };

  const resetAllProgress = () => {
    setResults({});
    setHasCompletedFirstStory(false);
    setHasEarnedStrongStart(false);
    setCurrentStreak(0);
    setFailedChallenges({});
    console.log('🔄 All progress reset: results, badges, flags, streak, and failed challenges cleared');
  };

  const markFirstStoryComplete = () => {
    setHasCompletedFirstStory(true);
  };

  const markStrongStartEarned = () => {
    setHasEarnedStrongStart(true);
  };

  const checkAndCelebrateStreak = (): boolean => {
    // Returns true if the user just reached exactly 3 correct in a row
    const justReachedStreak = currentStreak === 3;
    if (justReachedStreak) {
      console.log('🎉 Streak of 3 reached! Time to celebrate!');
    }
    return justReachedStreak;
  };

  return (
    <ChallengeProgressContext.Provider
      value={{
        results,
        recordResult,
        getStoryResults,
        clearStoryResults,
        clearAllResults,
        resetAllProgress,
        hasCompletedFirstStory,
        hasEarnedStrongStart,
        markFirstStoryComplete,
        markStrongStartEarned,
        currentStreak,
        checkAndCelebrateStreak,
        failedChallenges,
        markChallengeAsFailed,
        getFailedChallenges,
        clearFailedChallenge,
      }}
    >
      {children}
    </ChallengeProgressContext.Provider>
  );
};

export const useChallengeProgress = () => {
  const context = useContext(ChallengeProgressContext);
  if (!context) {
    throw new Error('useChallengeProgress must be used within a ChallengeProgressProvider');
  }
  return context;
};
