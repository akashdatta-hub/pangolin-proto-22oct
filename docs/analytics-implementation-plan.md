# Microsoft Clarity Analytics - Implementation Plan
**Project:** Pangolin Language Learning Game (Vite + React + TypeScript)
**Status:** Ready for Implementation
**Deploy Before Execution:** Yes - Deploy current build first, then implement analytics

---

## Quick Summary

**Tech Stack:** Vite + React Router + TypeScript on Vercel
**Analytics:** Microsoft Clarity (Production only)
**Scope:** Track all game interactions, language switching, challenge performance, errors

---

## Tracked Metrics

### Events (20 total)
- Navigation: `page_view`, `story_started`, `story_completed`, `app_completed`
- Language: `language_set`, `language_switched`
- Challenges: `challenge_started`, `challenge_submitted`, `challenge_completed`, `challenge_skipped`, `challenge_revisited`, `challenge_hint_opened`, `challenge_hint_completed`
- Progress: `star_collected`, `star_missed`, `badge_earned`
- Vocab: `vocab_test_started`, `vocab_question_answered`, `vocab_test_completed`
- Errors: `js_error`, `navigation_error`

### Tags (25+ dynamic)
- Session: `app_env`, `build_version`, `build_timestamp`, `story_id`
- User Journey: `language`, `language_switch_count`, `current_page`, `current_story_page`, `current_challenge`, `stars_collected`
- Challenge: `challenge_id`, `challenge_type`, `challenge_number`, `result`, `attempts_used`, `time_spent_ms`, `is_revisit`
- More: `failed_challenges`, `error_name`, `error_message`, `vocab_score`

---

## File Structure

```
src/
├── lib/clarity.ts                    # NEW - Clarity wrapper
├── providers/
│   ├── AnalyticsProvider.tsx         # NEW - Bootstrap analytics
│   └── ErrorBoundary.tsx             # NEW - Error tracking
├── hooks/
│   ├── useRouteTracking.ts           # NEW - Auto page tracking
│   └── useGameAnalytics.ts           # NEW - Game event API
├── contexts/
│   ├── LanguageContext.tsx           # MODIFY - Add analytics
│   └── ChallengeProgressContext.tsx  # MODIFY - Add analytics
├── components/                        # MODIFY - Add event tracking
│   ├── DrawingChallenge.tsx
│   ├── MCQChallenge.tsx
│   ├── FillBlanksChallenge.tsx
│   ├── MatchPairsChallenge.tsx
│   └── SentenceBuildingChallenge.tsx
├── pages/                             # MODIFY - Add event tracking
│   ├── StoryPage.tsx
│   ├── StoryCompletePage.tsx
│   ├── VocabularyTestPage.tsx
│   └── ThankYouPage.tsx
├── main.tsx                           # MODIFY - Add providers
└── App.tsx                            # MODIFY - Add route tracking
```

---

## Implementation Steps

### Phase 1: Setup (5 min)
1. Get Clarity Project ID from Microsoft Clarity dashboard
2. Add to Vercel: `VITE_CLARITY_PROJECT_ID` = `your_id` (Production only)
3. Create `.env.production` locally with same variable

### Phase 2: Core Files (30 min)
1. Create `src/lib/clarity.ts` - Safe wrapper with production-only loading
2. Create `src/providers/AnalyticsProvider.tsx` - Bootstrap with session tags
3. Create `src/providers/ErrorBoundary.tsx` - Catch React errors
4. Create `src/hooks/useRouteTracking.ts` - Auto track route changes
5. Create `src/hooks/useGameAnalytics.ts` - Game event API (20+ methods)

### Phase 3: Integrate Contexts (20 min)
1. Update `LanguageContext.tsx` - Track language switches
2. Update `ChallengeProgressContext.tsx` - Track stars/failures

### Phase 4: Integrate Components (60 min)
1. Update all 5 challenge components with:
   - `trackChallengeStarted` on mount
   - `trackChallengeSubmitted` on each attempt
   - `trackChallengeCompleted` on success/skip
   - `trackChallengeSkipped` with reason
   - `trackHintOpened` / `trackHintCompleted`
2. Update `StoryCompletePage` - Track completion + badge
3. Update `VocabularyTestPage` - Track test flow
4. Update `ThankYouPage` - Track final completion

### Phase 5: Wire App (10 min)
1. Update `main.tsx` - Wrap with providers + error handlers
2. Update `App.tsx` - Add `useRouteTracking()`

### Phase 6: Test & Deploy (30 min)
1. Test locally (console logs verify events)
2. Git commit + push to Vercel
3. Play through production build
4. Verify in Clarity dashboard

**Total Time:** ~3 hours

---

## Key Code Snippets

### Clarity Wrapper
```typescript
// src/lib/clarity.ts
export const initializeClarity = (projectId: string): void => {
  const isProduction = import.meta.env.MODE === 'production' &&
    !window.location.hostname.includes('localhost');
  if (!isProduction) return;
  // Inject Clarity script...
};
export const trackEvent = (name: string) => window.clarity?.('event', name);
export const setTag = (key: string, value: string) => window.clarity?.('set', key, value);
export const upgradeSession = (reason: string) => window.clarity?.('upgrade', reason);
```

### Hook Usage in Components
```typescript
// In any challenge component
const analytics = useGameAnalytics();

useEffect(() => {
  analytics.trackChallengeStarted({
    challengeId: `${storyId}_c${challengeNumber}`,
    challengeType: 'mcq',
    challengeNumber,
  });
}, []);

const handleSubmit = () => {
  analytics.trackChallengeSubmitted(challengeId, attemptCount, result);
};

const handleSkip = () => {
  analytics.trackChallengeSkipped(challengeId, attemptCount, 'ran_out_of_retries');
};
```

---

## Clarity Dashboard Setup

### Filters to Create
1. "Story Completions" - Event: `story_completed`
2. "Language Switchers" - Tag: `language_switch_count >= 1`
3. "Challenge Failures" - Event: `challenge_skipped` + Tag: `reason = ran_out_of_retries`
4. "Errors" - Event: `js_error`
5. "Full Completions" - Event: `app_completed`

### Segments to Create
1. English Users - Tag: `language = en`
2. Telugu Users - Tag: `language = te`
3. Hindi Users - Tag: `language = hi`
4. Multilingual - Tag: `language_switch_count >= 1`
5. High Performers - Tag: `stars_collected >= 4`

### Funnel to Create
**"Complete Story Journey"** (12 steps):
1. `story_started`
2. `challenge_started` (c1)
3. `challenge_completed` (c1)
4. ...repeat for c2-c5...
12. `story_completed`

---

## Verification Checklist

### After Deploy
- [ ] Visit production URL
- [ ] Play through complete story
- [ ] Switch language 2x
- [ ] Skip 1 challenge
- [ ] Complete vocab test
- [ ] Check Clarity dashboard (wait 2-5 min)
- [ ] See recording with events in timeline
- [ ] See tags in session details

### Weekly Analysis Questions
1. What % complete the full story?
2. Which challenge has highest skip rate?
3. Do language switchers complete more/less?
4. Where are rage/dead clicks?
5. Any JS errors?
6. Is spaced repetition working? (revisit success rate)

---

## Privacy Notes
- ✅ No PII collected
- ✅ Clarity auto-masks inputs
- ✅ Anonymous session IDs only
- ✅ Screen recordings for UX improvement
- ✅ 30-day retention (Clarity default)

---

## Quick Reference

### Environment Variable
```bash
# Vercel: Project Settings → Environment Variables
VITE_CLARITY_PROJECT_ID=your_clarity_project_id
Environment: Production only
```

### Test in Console
```javascript
// Check if loaded
console.log('Clarity:', !!window.clarity);

// Test event
window.clarity?.('event', 'test_event');

// Test tag
window.clarity?.('set', 'test_tag', 'test_value');
```

### Troubleshooting
- **No recordings?** Check env var in Vercel, verify production mode
- **No events?** Check console for `[Clarity]` logs, wait 2-5 min
- **Wrong tags?** Ensure values are strings: `String(value)`
- **Duplicates?** Use `useRef` guards in components

---

## Resources
- Clarity Dashboard: https://clarity.microsoft.com/
- Docs: https://docs.microsoft.com/en-us/clarity/
- GitHub: https://github.com/akashdatta-hub/pangolin-proto-22oct
- This Plan: `docs/analytics-implementation-plan.md`

---

**Next Action:** Deploy current build → Get Clarity ID → Implement → Test → Verify
