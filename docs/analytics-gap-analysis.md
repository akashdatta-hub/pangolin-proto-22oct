# Analytics Implementation - Gap Analysis

**Date:** 2025-10-24
**Status:** Clarity is working, but missing 60% of planned events

---

## ✅ What's Working

### Infrastructure
- ✅ Microsoft Clarity installed via npm package
- ✅ Call queueing system prevents timing issues
- ✅ AnalyticsContext provides hooks throughout app
- ✅ Recordings are being saved
- ✅ Dashboards and Heatmaps are accessible

### Events Implemented (7 of 20)
1. ✅ `screen_view` - Auto-tracked on all page navigations
2. ✅ `challenge_view` - Auto-tracked when challenge loads
3. ✅ `language_switch` - Tracked in LanguageContext
4. ✅ `badge_earned` - Tracked on StoryCompletePage
5. ✅ `star_awarded` - Tracked on StoryCompletePage
6. ✅ `hint_opened` - Method exists but not hooked up to components
7. ✅ `js_error` - Tracked in ErrorBoundary

### Tags Implemented (10 of 25+)
1. ✅ `app_env` (prod/dev)
2. ✅ `build_sha` (git commit hash)
3. ✅ `story_id` (kite-festival)
4. ✅ `screen` (home, page_1, complete, etc.)
5. ✅ `challenge_id` (c1, c2, c3, c4, c5)
6. ✅ `lang` (en/te/hi)
7. ✅ `lang_switch_count` (number of times switched)
8. ✅ `badge_type` (word_explorer, strong_start)
9. ✅ `stars_total` (1-5)
10. ✅ `error_name`, `error_msg` (on JS errors)

---

## ❌ What's Missing

### Missing Events (13 of 20)
1. ❌ `story_started` - When user clicks "Start Story" from home
2. ❌ `story_completed` - When user reaches story complete page
3. ❌ `app_completed` - When user finishes vocab test + thank you
4. ❌ `language_set` - Initial language selection (first time only)
5. ❌ `challenge_started` - When challenge component mounts
6. ❌ `challenge_submitted` - Each time user submits an answer
7. ❌ `challenge_completed` - Currently exists but not hooked up to components
8. ❌ `challenge_skipped` - When user runs out of retries or clicks skip
9. ❌ `challenge_revisited` - When user returns to a previously failed challenge
10. ❌ `challenge_hint_completed` - When user closes hint modal
11. ❌ `star_collected` - Individual star earned (vs total)
12. ❌ `star_missed` - When user doesn't get perfect score
13. ❌ `vocab_test_started` - When vocabulary test begins
14. ❌ `vocab_question_answered` - Each vocab question submission
15. ❌ `vocab_test_completed` - When vocab test finishes

### Missing Tags (15+ of 25+)
1. ❌ `build_timestamp` - When build was created
2. ❌ `current_page` - Current story page number (1-5)
3. ❌ `current_story_page` - Duplicate? Or different from above?
4. ❌ `current_challenge` - Current challenge being played
5. ❌ `stars_collected` - Running total across stories
6. ❌ `challenge_type` - mcq, fill_blanks, drawing, match_pairs, sentence_building
7. ❌ `challenge_number` - 1-5 within story
8. ❌ `result` - correct/incorrect on submission
9. ❌ `attempts_used` - How many retries before success/skip
10. ❌ `time_spent_ms` - Time on challenge
11. ❌ `is_revisit` - Boolean if returning to failed challenge
12. ❌ `failed_challenges` - List of challenge IDs user failed
13. ❌ `vocab_score` - Score on vocabulary test
14. ❌ `reason` - Why challenge was skipped (ran_out_of_retries, etc.)

---

## 🔧 What Needs to Be Done

### Phase 1: Expand AnalyticsContext API (10 min)
**File:** `src/contexts/AnalyticsContext.tsx`

Add missing methods to `AnalyticsContextType`:
```typescript
interface AnalyticsContextType {
  // Existing methods...

  // NEW: Story tracking
  trackStoryStarted: (storyId: string) => void;
  trackStoryCompleted: (storyId: string, starsEarned: number) => void;
  trackAppCompleted: (totalStars: number, vocabScore: number) => void;

  // NEW: Challenge lifecycle
  trackChallengeStarted: (challengeId: string, challengeType: string, challengeNumber: number, isRevisit: boolean) => void;
  trackChallengeSubmitted: (challengeId: string, attemptNumber: number, result: 'correct' | 'incorrect', timeSpentMs: number) => void;
  trackChallengeSkipped: (challengeId: string, attemptsUsed: number, reason: string) => void;
  trackChallengeRevisited: (challengeId: string) => void;
  trackHintCompleted: (challengeId: string) => void;

  // NEW: Stars
  trackStarCollected: (challengeId: string, starNumber: number) => void;
  trackStarMissed: (challengeId: string, reason: string) => void;

  // NEW: Vocabulary test
  trackVocabTestStarted: (storyId: string) => void;
  trackVocabQuestionAnswered: (questionNumber: number, result: 'correct' | 'incorrect') => void;
  trackVocabTestCompleted: (score: number, totalQuestions: number) => void;

  // NEW: Language
  trackLanguageSet: (initialLang: Language) => void;
}
```

### Phase 2: Update Components (60 min)

#### 2a. HomeScreen.tsx
**Add:**
```typescript
const handleStartStory = () => {
  analytics.trackStoryStarted('kite-festival');
  navigate('/story/kite-festival/page/1');
};
```

#### 2b. All Challenge Components (5 files)
**Add to each:** DrawingChallenge, MCQChallenge, FillBlanksChallenge, MatchPairsChallenge, SentenceBuildingChallenge

```typescript
// On mount
useEffect(() => {
  const isRevisit = failedChallenges.includes(challengeId);
  analytics.trackChallengeStarted(challengeId, 'mcq', challengeNumber, isRevisit);

  if (isRevisit) {
    analytics.trackChallengeRevisited(challengeId);
  }

  const startTime = Date.now();
  return () => {
    const timeSpent = Date.now() - startTime;
    analytics.setTag('time_spent_ms', timeSpent);
  };
}, []);

// On each submission
const handleSubmit = () => {
  const timeSpent = Date.now() - startTime;
  const result = isCorrect ? 'correct' : 'incorrect';

  analytics.trackChallengeSubmitted(
    challengeId,
    attemptCount,
    result,
    timeSpent
  );

  if (isCorrect) {
    analytics.trackStarCollected(challengeId, attemptCount === 1 ? 1 : 0);
  }
};

// On skip
const handleSkip = () => {
  analytics.trackChallengeSkipped(
    challengeId,
    attemptCount,
    'ran_out_of_retries'
  );
  analytics.trackStarMissed(challengeId, 'failed_challenge');
};
```

#### 2c. HintModal.tsx
**Add:**
```typescript
// On open
useEffect(() => {
  analytics.trackHintOpened(challengeId);
}, []);

// On close
const handleClose = () => {
  analytics.trackHintCompleted(challengeId);
  onClose();
};
```

#### 2d. StoryCompletePage.tsx
**Add:**
```typescript
useEffect(() => {
  analytics.trackStoryCompleted('kite-festival', starsEarned);

  if (starsEarned < 5) {
    analytics.trackStarMissed('story_complete', `only_${starsEarned}_stars`);
  }
}, []);
```

#### 2e. VocabularyTestPage.tsx
**Add:**
```typescript
useEffect(() => {
  analytics.trackVocabTestStarted('kite-festival');
}, []);

const handleAnswer = (questionIndex: number, isCorrect: boolean) => {
  analytics.trackVocabQuestionAnswered(
    questionIndex + 1,
    isCorrect ? 'correct' : 'incorrect'
  );
};

const handleComplete = () => {
  const score = correctAnswers;
  analytics.trackVocabTestCompleted(score, totalQuestions);
  analytics.setTag('vocab_score', score);
};
```

#### 2f. ThankYouPage.tsx
**Add:**
```typescript
useEffect(() => {
  const totalStars = getTotalStarsFromStorage();
  const vocabScore = getVocabScoreFromStorage();

  analytics.trackAppCompleted(totalStars, vocabScore);
  analytics.setTag('stars_collected', totalStars);
}, []);
```

#### 2g. LanguageContext.tsx
**Add:**
```typescript
// Track initial language on first mount
useEffect(() => {
  if (analytics) {
    analytics.trackLanguageSet(language);
  }
}, []); // Empty deps = runs once
```

### Phase 3: Add Missing Tags (20 min)

**Update AnalyticsContext initialization:**
```typescript
useEffect(() => {
  initializeClarity(CLARITY_PROJECT_ID);

  setTag('app_env', APP_ENV);
  setTag('build_sha', BUILD_SHA.slice(0, 7));
  setTag('build_timestamp', new Date().toISOString());
  setTag('story_id', 'kite-festival');
  setTag('stars_collected', getTotalStars());
  setTag('failed_challenges', getFailedChallenges().join(','));
}, []);
```

**Add dynamic tags on challenge start:**
```typescript
trackChallengeStarted: (challengeId, challengeType, challengeNumber, isRevisit) => {
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
```

---

## 📊 Clarity Dashboard Setup Guide

Once all events are tracked, here's how to set up your Clarity dashboard:

### Filters to Create

1. **Story Completions**
   - Event: `story_completed`
   - Use to: See who finishes stories

2. **Challenge Failures**
   - Event: `challenge_skipped`
   - Tag: `reason = ran_out_of_retries`
   - Use to: Identify hard challenges

3. **Language Switchers**
   - Tag: `lang_switch_count >= 1`
   - Use to: See multilingual user behavior

4. **High Performers**
   - Tag: `stars_collected >= 4`
   - Use to: Study successful users

5. **Low Performers**
   - Tag: `stars_collected <= 2`
   - Use to: Identify struggling users

6. **Errors**
   - Event: `js_error`
   - Use to: Find bugs

7. **Full App Completions**
   - Event: `app_completed`
   - Use to: Measure conversion rate

### Segments to Create

1. **English Users** - `language = en`
2. **Telugu Users** - `language = te`
3. **Hindi Users** - `language = hi`
4. **Multilingual Users** - `lang_switch_count >= 1`
5. **MCQ Strugglers** - Filter recordings with `challenge_type = mcq` AND `challenge_skipped`
6. **Drawing Strugglers** - Filter with `challenge_type = drawing` AND `challenge_skipped`

### Funnel: Complete Story Journey (12 steps)

Create a funnel called **"Story Journey - Full"**:

1. Event: `story_started`
2. Event: `challenge_started` (where `challenge_id = kite-festival_c1`)
3. Event: `challenge_completed` (where `challenge_id = kite-festival_c1`)
4. Event: `challenge_started` (where `challenge_id = kite-festival_c2`)
5. Event: `challenge_completed` (where `challenge_id = kite-festival_c2`)
6. Event: `challenge_started` (where `challenge_id = kite-festival_c3`)
7. Event: `challenge_completed` (where `challenge_id = kite-festival_c3`)
8. Event: `challenge_started` (where `challenge_id = kite-festival_c4`)
9. Event: `challenge_completed` (where `challenge_id = kite-festival_c4`)
10. Event: `challenge_started` (where `challenge_id = kite-festival_c5`)
11. Event: `challenge_completed` (where `challenge_id = kite-festival_c5`)
12. Event: `story_completed`

**Analysis:**
- Drop-off rates per challenge
- Which challenge loses most users?
- Time spent on each challenge

### Funnel: Vocabulary Test

Create funnel called **"Vocab Test Completion"**:

1. Event: `story_completed`
2. Event: `vocab_test_started`
3. Event: `vocab_test_completed`
4. Event: `app_completed`

**Analysis:**
- Do users complete vocab test after story?
- Conversion rate to full completion

### Dashboards to Create

#### Dashboard 1: Overview
- Card: Total Sessions (last 7 days)
- Card: Story Completions (`story_completed` event count)
- Card: Average Stars Collected (avg of `stars_collected` tag)
- Card: Error Rate (`js_error` event count / total sessions)
- Card: Popular Challenges (heatmap of `challenge_id` tag)

#### Dashboard 2: Challenge Performance
- Card: Challenge Completion Rate (per challenge_id)
- Card: Challenge Skip Rate (per challenge_id)
- Card: Average Attempts per Challenge
- Card: Time Spent per Challenge Type (avg `time_spent_ms`)
- Card: Revisit Success Rate (`challenge_revisited` → `challenge_completed`)

#### Dashboard 3: Language Behavior
- Card: Language Distribution (`lang` tag pie chart)
- Card: Language Switchers (% with `lang_switch_count > 0`)
- Card: Completion Rate by Language
- Card: Challenge Skip Rate by Language

### Heatmaps to Create

Add these URLs to Heatmap tracking:

1. **Home Screen**: `https://pangolin-proto-22oct.vercel.app/`
2. **Story Page 1**: `https://pangolin-proto-22oct.vercel.app/story/kite-festival/page/1`
3. **MCQ Challenge**: `https://pangolin-proto-22oct.vercel.app/story/kite-festival/challenge/1`
4. **Drawing Challenge**: `https://pangolin-proto-22oct.vercel.app/story/kite-festival/challenge/2`
5. **Story Complete**: `https://pangolin-proto-22oct.vercel.app/story/kite-festival/complete`
6. **Vocab Test**: `https://pangolin-proto-22oct.vercel.app/story/kite-festival/vocabulary-test`

**Use heatmaps to:**
- See where users click/tap
- Identify dead clicks (non-interactive elements users try to click)
- Find rage clicks (frustrated rapid clicking)
- Track scroll depth

---

## 📋 Implementation Checklist

### Code Changes
- [ ] Expand AnalyticsContext API (13 new methods)
- [ ] Update HomeScreen.tsx (story_started)
- [ ] Update all 5 challenge components (started, submitted, skipped)
- [ ] Update HintModal.tsx (hint_opened, hint_completed)
- [ ] Update StoryCompletePage.tsx (story_completed)
- [ ] Update VocabularyTestPage.tsx (vocab tracking)
- [ ] Update ThankYouPage.tsx (app_completed)
- [ ] Update LanguageContext.tsx (language_set)
- [ ] Add build_timestamp tag
- [ ] Add dynamic challenge tags

### Clarity Dashboard Setup
- [ ] Create 7 filters (story completions, failures, switchers, etc.)
- [ ] Create 6 segments (English/Telugu/Hindi users, etc.)
- [ ] Create "Story Journey - Full" funnel (12 steps)
- [ ] Create "Vocab Test Completion" funnel (4 steps)
- [ ] Create 3 dashboards (Overview, Challenge Performance, Language)
- [ ] Add 6 URLs to Heatmap tracking

### Testing
- [ ] Play through full story in production
- [ ] Switch language 2x during gameplay
- [ ] Skip 1 challenge intentionally
- [ ] Complete vocabulary test
- [ ] Check Clarity recordings show all events
- [ ] Verify all tags appear in session details
- [ ] Test all filters work correctly
- [ ] Verify funnels populate with data

---

## ⏱️ Time Estimate

- **Code Implementation:** 2 hours
- **Testing:** 30 minutes
- **Clarity Setup:** 1 hour
- **Total:** 3.5 hours

---

## 🎯 Success Metrics

After implementation, you should be able to answer:

1. **What % of users complete the full story?**
   - Use funnel: story_started → story_completed

2. **Which challenge has the highest skip rate?**
   - Compare `challenge_skipped` events per challenge_id

3. **Do language switchers complete more or less?**
   - Segment: `lang_switch_count >= 1` vs completion rate

4. **Which challenge takes the longest?**
   - Compare avg `time_spent_ms` per challenge_id

5. **Do users who open hints succeed more?**
   - Filter: `hint_opened` → check completion rate

6. **What's the vocab test completion rate?**
   - Funnel: story_completed → vocab_test_completed

7. **Are there any dead/rage clicks?**
   - Check heatmaps for frustration signals

8. **Any JavaScript errors?**
   - Filter by `js_error` event

---

## 🚀 Next Steps

**Option A: Full Implementation (Recommended)**
- Implement all missing events and tags
- Full visibility into user behavior
- Requires 2-3 hours of coding

**Option B: Prioritized Implementation**
- Phase 1: Challenge tracking only (most valuable)
- Phase 2: Vocab test tracking
- Phase 3: Everything else
- Allows incremental improvements

**Option C: Current State**
- Keep current implementation
- Limited visibility (only 35% of planned metrics)
- Can still use: page views, language switches, completions, errors

Which approach would you like to take?
