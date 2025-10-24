# Analytics Implementation Guide - Remaining Work

**Status:** Partial implementation complete (3/8 files updated)
**Estimated Time:** 1.5-2 hours remaining

---

## ✅ Already Completed

1. ✅ **AnalyticsContext** - All 20+ methods implemented
2. ✅ **HomeScreen** - `trackStoryStarted()` added
3. ✅ **LanguageContext** - `trackLanguageSet()` added
4. ✅ **StoryCompletePage** - `trackStoryCompleted()` and `trackStarMissed()` added

---

## 📋 Remaining Work

### 1. Update VocabularyTestPage (15 min)

**File:** `src/pages/VocabularyTestPage.tsx`

**Changes needed:**
```typescript
// At the top, add import
import { useAnalytics } from '../contexts/AnalyticsContext';

// Inside component, add hook
const analytics = useAnalytics();

// In the useEffect on mount, add:
useEffect(() => {
  analytics.trackVocabTestStarted(storyId || 'unknown');
  // ... existing code
}, []);

// In handleAnswer function (when user submits an answer):
const handleAnswer = (selectedAnswer: string) => {
  const question = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === question.correctAnswer;

  // ADD THIS:
  analytics.trackVocabQuestionAnswered(
    currentQuestionIndex + 1,
    isCorrect ? 'correct' : 'incorrect'
  );

  // ... rest of existing code
};

// When completing the test (likely in handleNext when currentQuestionIndex reaches end):
const handleNext = () => {
  if (currentQuestionIndex === questions.length - 1) {
    // Calculate score
    const correctCount = answers.filter((a, i) =>
      a === questions[i].correctAnswer
    ).length;

    // ADD THIS:
    analytics.trackVocabTestCompleted(correctCount, questions.length);

    // Navigate to thank you
    navigate(`/story/${storyId}/thank-you`);
  } else {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }
};
```

---

### 2. Update ThankYouPage (10 min)

**File:** `src/pages/ThankYouPage.tsx`

**Changes needed:**
```typescript
// At the top, add import
import { useAnalytics } from '../contexts/AnalyticsContext';
import { useChallengeProgress } from '../contexts/ChallengeProgressContext';

// Inside component, add hooks
const analytics = useAnalytics();
const { getStoryResults } = useChallengeProgress();

// In the useEffect on mount, add:
useEffect(() => {
  // Get vocabulary test results from localStorage or context
  // You'll need to add a way to store/retrieve vocab score
  const vocabScore = localStorage.getItem('vocab_score') || 0;

  // Calculate total stars from story results
  const storyId = 'kite-festival'; // or get from params
  const results = getStoryResults(storyId);
  const totalStars = results.filter(r => r.correct).length;

  // ADD THIS:
  analytics.trackAppCompleted(totalStars, Number(vocabScore));

  // ... existing TTS code
}, []);
```

**Note:** You may need to update VocabularyTestPage to store the score:
```typescript
// In VocabularyTestPage, before navigating away:
const handleComplete = () => {
  const correctCount = answers.filter((a, i) =>
    a === questions[i].correctAnswer
  ).length;

  localStorage.setItem('vocab_score', String(correctCount));
  analytics.trackVocabTestCompleted(correctCount, questions.length);
  navigate(`/story/${storyId}/thank-you`);
};
```

---

### 3. Update HintModal (10 min)

**File:** `src/components/HintModal.tsx`

**Changes needed:**
```typescript
// At the top, add import
import { useAnalytics } from '../contexts/AnalyticsContext';

// Update component props to accept challengeId
interface HintModalProps {
  open: boolean;
  onClose: () => void;
  hintText: string;
  challengeId: string; // ADD THIS
}

export const HintModal = ({ open, onClose, hintText, challengeId }: HintModalProps) => {
  const analytics = useAnalytics();

  // Track when hint is opened
  useEffect(() => {
    if (open) {
      analytics.trackHintOpened(challengeId);
    }
  }, [open, challengeId, analytics]);

  // Track when hint is completed (closed)
  const handleClose = () => {
    analytics.trackHintCompleted(challengeId);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      {/* ... existing modal content ... */}
      <Button onClick={handleClose}>Close</Button>
    </Modal>
  );
};
```

---

### 4. Update All 5 Challenge Components (60 min total, ~12 min each)

You need to update:
1. `src/components/MCQChallenge.tsx`
2. `src/components/DrawingChallenge.tsx`
3. `src/components/FillBlanksChallenge.tsx`
4. `src/components/MatchPairsChallenge.tsx`
5. `src/components/SentenceBuildingChallenge.tsx`

**Pattern to follow for ALL challenge components:**

```typescript
// At the top, add imports
import { useAnalytics } from '../contexts/AnalyticsContext';
import { useChallengeProgress } from '../contexts/ChallengeProgressContext';
import { useParams } from 'react-router-dom';

// Inside component
const analytics = useAnalytics();
const { failedChallenges } = useChallengeProgress();
const { storyId } = useParams<{ storyId: string }>();

// Track start time
const startTimeRef = useRef<number>(Date.now());
const hasTrackedStartRef = useRef(false);

// On component mount - track challenge started
useEffect(() => {
  if (!hasTrackedStartRef.current) {
    const challengeId = `${storyId}_c${challengeNumber}`;
    const isRevisit = failedChallenges.includes(challengeId);

    analytics.trackChallengeStarted(
      challengeId,
      'mcq', // Change this per component: 'drawing', 'fill_blanks', 'match_pairs', 'sentence_building'
      challengeNumber,
      isRevisit
    );

    if (isRevisit) {
      analytics.trackChallengeRevisited(challengeId);
    }

    startTimeRef.current = Date.now();
    hasTrackedStartRef.current = true;
  }
}, []);

// On each submission attempt
const handleSubmit = () => {
  const challengeId = `${storyId}_c${challengeNumber}`;
  const timeSpent = Date.now() - startTimeRef.current;
  const isCorrect = /* your existing logic */;

  // Track the submission
  analytics.trackChallengeSubmitted(
    challengeId,
    attemptCount, // Your current attempt counter
    isCorrect ? 'correct' : 'incorrect',
    timeSpent
  );

  if (isCorrect) {
    // Track star collected (1 star for first attempt, 0 for retries)
    analytics.trackStarCollected(challengeId, attemptCount === 1 ? 1 : 0);

    // Track challenge completed
    analytics.trackChallengeCompleted(
      challengeId,
      'correct',
      attemptCount > 1 // is retry
    );

    // ... existing navigation code
  } else {
    // If ran out of attempts, track skip
    if (attemptCount >= maxAttempts) {
      analytics.trackChallengeSkipped(
        challengeId,
        attemptCount,
        'ran_out_of_retries'
      );

      analytics.trackStarMissed(challengeId, 'failed_challenge');

      // ... existing skip/fail logic
    }
  }
};

// If there's a manual skip button
const handleSkip = () => {
  const challengeId = `${storyId}_c${challengeNumber}`;

  analytics.trackChallengeSkipped(
    challengeId,
    attemptCount,
    'user_skipped'
  );

  analytics.trackStarMissed(challengeId, 'user_skipped');

  // ... existing skip logic
};

// Update HintModal usage to pass challengeId
<HintModal
  open={hintOpen}
  onClose={() => setHintOpen(false)}
  hintText={challenge.hint}
  challengeId={`${storyId}_c${challengeNumber}`} // ADD THIS
/>
```

---

## Challenge Component Specifics

### MCQChallenge.tsx
- `challengeType`: `'mcq'`
- Already has attempt tracking - just add analytics calls

### DrawingChallenge.tsx
- `challengeType`: `'drawing'`
- Track submission when user clicks "Submit Drawing"
- May not have retries - track as single attempt

### FillBlanksChallenge.tsx
- `challengeType`: `'fill_blanks'`
- Track each word/blank submission
- Or track entire sentence submission

### MatchPairsChallenge.tsx
- `challengeType`: `'match_pairs'`
- Track when all pairs are matched correctly
- Count mismatches as attempts

### SentenceBuildingChallenge.tsx
- `challengeType`: `'sentence_building'`
- Track each sentence submission attempt
- Has retry logic - track accordingly

---

## Testing Checklist

After making all changes:

### 1. Build Test
```bash
npm run build
```
- ✅ Should compile without errors

### 2. Local Test
```bash
npm run dev
```

**Test flow:**
1. ✅ Open home page - check console for `trackLanguageSet`
2. ✅ Click Start Story - check for `trackStoryStarted`
3. ✅ Complete Challenge 1 - check for:
   - `trackChallengeStarted`
   - `trackChallengeSubmitted`
   - `trackChallengeCompleted`
   - `trackStarCollected`
4. ✅ Open a hint - check for `trackHintOpened`
5. ✅ Close hint - check for `trackHintCompleted`
6. ✅ Skip a challenge - check for `trackChallengeSkipped`
7. ✅ Complete story - check for `trackStoryCompleted`
8. ✅ Start vocab test - check for `trackVocabTestStarted`
9. ✅ Answer questions - check for `trackVocabQuestionAnswered`
10. ✅ Finish vocab test - check for `trackVocabTestCompleted`
11. ✅ Reach thank you - check for `trackAppCompleted`

### 3. Production Test

After deploying:
1. Play through entire story
2. Wait 5-10 minutes
3. Check Clarity dashboard:
   - Recordings should have all events in timeline
   - Session tags should include all custom tags
   - No errors in browser console

---

## Commit Message

Once all changes are complete:

```bash
git add -A
git commit -m "Implement complete analytics tracking system

- Add all 20 tracking events across the app
- Track challenge lifecycle: started, submitted, completed, skipped
- Track vocabulary test: started, question answered, completed
- Track story and app completion milestones
- Track hints: opened and completed
- Track stars: collected and missed
- Add timing metrics (time_spent_ms) for challenges
- Add revisit tracking for failed challenges

This completes the analytics implementation plan with full
visibility into user behavior, performance, and engagement.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main
```

---

## Quick Reference: All Available Analytics Methods

```typescript
// Story tracking
analytics.trackStoryStarted(storyId);
analytics.trackStoryCompleted(storyId, starsEarned);
analytics.trackAppCompleted(totalStars, vocabScore);

// Language tracking
analytics.trackLanguageSet(initialLang);
analytics.trackLanguageSwitch(newLang, switchCount);

// Challenge lifecycle
analytics.trackChallengeStarted(challengeId, challengeType, challengeNumber, isRevisit);
analytics.trackChallengeSubmitted(challengeId, attemptNumber, result, timeSpentMs);
analytics.trackChallengeCompleted(challengeId, result, isRetry);
analytics.trackChallengeSkipped(challengeId, attemptsUsed, reason);
analytics.trackChallengeRevisited(challengeId);

// Hints
analytics.trackHintOpened(challengeId);
analytics.trackHintCompleted(challengeId);

// Stars
analytics.trackStarCollected(challengeId, starNumber);
analytics.trackStarMissed(challengeId, reason);
analytics.trackStarAwarded(starsTotal);

// Vocabulary test
analytics.trackVocabTestStarted(storyId);
analytics.trackVocabQuestionAnswered(questionNumber, result);
analytics.trackVocabTestCompleted(score, totalQuestions);

// Badges
analytics.trackBadgeEarned(badgeType);

// Other
analytics.trackTTSUsed(context, language);
analytics.trackError(errorName, errorMessage);

// Generic
analytics.trackEvent(eventName, data);
analytics.setTag(key, value);
```

---

## Next: Clarity Dashboard Setup

After code implementation is complete, refer to:
- `docs/analytics-gap-analysis.md` - Section "Clarity Dashboard Setup Guide"

This includes step-by-step instructions for:
- Creating 7 filters
- Setting up 6 segments
- Building 2 funnels
- Creating 3 dashboards
- Adding 6 heatmap URLs

---

## Questions?

If you encounter issues:

1. **TypeScript errors** - Make sure all imports are correct
2. **Missing context** - Verify AnalyticsProvider wraps the app in main.tsx
3. **Events not firing** - Check browser console for analytics logs
4. **Clarity not receiving** - Wait 5-10 minutes, check network tab for clarity.ms requests

Good luck with the implementation!
