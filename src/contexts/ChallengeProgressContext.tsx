import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface ChallengeResult {
  challengeIndex: number;
  correct: boolean;
  timestamp: number;
}

interface ChallengeProgressContextType {
  // Track results for current story session
  results: Record<string, ChallengeResult[]>; // storyId -> array of results
  recordResult: (storyId: string, challengeIndex: number, correct: boolean) => void;
  getStoryResults: (storyId: string) => ChallengeResult[];
  clearStoryResults: (storyId: string) => void;
  clearAllResults: () => void;
  // Badge tracking
  hasCompletedFirstStory: boolean;
  hasEarnedStrongStart: boolean;
  markFirstStoryComplete: () => void;
  markStrongStartEarned: () => void;
}

const ChallengeProgressContext = createContext<ChallengeProgressContextType | undefined>(undefined);

export const ChallengeProgressProvider = ({ children }: { children: ReactNode }) => {
  const [results, setResults] = useState<Record<string, ChallengeResult[]>>({});
  const [hasCompletedFirstStory, setHasCompletedFirstStory] = useState(false);
  const [hasEarnedStrongStart, setHasEarnedStrongStart] = useState(false);

  const recordResult = (storyId: string, challengeIndex: number, correct: boolean) => {
    setResults((prev) => {
      const storyResults = prev[storyId] || [];
      // Update or add result for this challenge
      const existingIndex = storyResults.findIndex((r) => r.challengeIndex === challengeIndex);

      const newResult: ChallengeResult = {
        challengeIndex,
        correct,
        timestamp: Date.now(),
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

  const markFirstStoryComplete = () => {
    setHasCompletedFirstStory(true);
  };

  const markStrongStartEarned = () => {
    setHasEarnedStrongStart(true);
  };

  return (
    <ChallengeProgressContext.Provider
      value={{
        results,
        recordResult,
        getStoryResults,
        clearStoryResults,
        clearAllResults,
        hasCompletedFirstStory,
        hasEarnedStrongStart,
        markFirstStoryComplete,
        markStrongStartEarned,
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
