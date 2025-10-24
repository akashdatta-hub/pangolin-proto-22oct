# Microsoft Clarity - Dashboard Setup Guide

**Project:** Pangolin Language Learning Game
**Clarity Project ID:** tuj5ywlqbp
**Dashboard URL:** https://clarity.microsoft.com/

---

## Table of Contents

1. [Filters](#filters-7-total)
2. [Segments](#segments-6-total)
3. [Funnels](#funnels-2-total)
4. [Dashboards](#dashboards-3-total)
5. [Heatmaps](#heatmaps-6-urls)
6. [Quick Analysis](#quick-analysis-questions)

---

## Filters (7 Total)

Filters help you quickly find specific types of sessions. Go to **Recordings** → **Filter** to create these.

### Filter 1: Story Completions
**Purpose:** See users who completed the full story

- **Name:** Story Completions
- **Condition:** Event includes `story_completed`
- **Use case:** Analyze successful user journeys

### Filter 2: Challenge Failures
**Purpose:** Find users who failed challenges

- **Name:** Challenge Failures
- **Condition 1:** Event includes `challenge_skipped`
- **Condition 2:** Tag `reason` equals `ran_out_of_retries`
- **Use case:** Identify which challenges are too hard

### Filter 3: Language Switchers
**Purpose:** Users who switched language at least once

- **Name:** Language Switchers
- **Condition:** Tag `lang_switch_count` is greater than or equal to `1`
- **Use case:** Study multilingual behavior

### Filter 4: High Performers
**Purpose:** Users who collected 4+ stars

- **Name:** High Performers
- **Condition:** Tag `stars_collected` is greater than or equal to `4`
- **Use case:** Learn from successful patterns

### Filter 5: Low Performers
**Purpose:** Users who collected 2 or fewer stars

- **Name:** Low Performers
- **Condition:** Tag `stars_collected` is less than or equal to `2`
- **Use case:** Identify struggling users

### Filter 6: JavaScript Errors
**Purpose:** Sessions with errors

- **Name:** JavaScript Errors
- **Condition:** Event includes `js_error`
- **Use case:** Debug production issues

### Filter 7: Full App Completions
**Purpose:** Users who finished everything (story + vocab test)

- **Name:** Full App Completions
- **Condition:** Event includes `app_completed`
- **Use case:** Measure conversion rate

---

## Segments (6 Total)

Segments are saved groups of users. Go to **Settings** → **Segments** to create.

### Segment 1: English Users
- **Name:** English Users
- **Condition:** Tag `lang` equals `en`

### Segment 2: Telugu Users
- **Name:** Telugu Users
- **Condition:** Tag `lang` equals `te`

### Segment 3: Hindi Users
- **Name:** Hindi Users
- **Condition:** Tag `lang` equals `hi`

### Segment 4: Multilingual Users
- **Name:** Multilingual Users
- **Condition:** Tag `lang_switch_count` is greater than or equal to `1`

### Segment 5: MCQ Strugglers
- **Name:** MCQ Challenge Strugglers
- **Condition 1:** Tag `challenge_type` equals `mcq`
- **Condition 2:** Event includes `challenge_skipped`

### Segment 6: Drawing Strugglers
- **Name:** Drawing Challenge Strugglers
- **Condition 1:** Tag `challenge_type` equals `drawing`
- **Condition 2:** Event includes `challenge_skipped`

---

## Funnels (2 Total)

Funnels track user progression through steps. Go to **Funnels** → **Create Funnel**.

### Funnel 1: Complete Story Journey (12 Steps)

**Purpose:** Track drop-off across all challenges

**Name:** Story Journey - Full Completion

**Steps:**
1. **Story Started**
   - Type: Event
   - Event name: `story_started`

2. **Challenge 1 Started**
   - Type: Event
   - Event name: `challenge_started`
   - Filter: Tag `challenge_id` equals `kite-festival_c1`

3. **Challenge 1 Completed**
   - Type: Event
   - Event name: `challenge_completed`
   - Filter: Tag `challenge_id` equals `kite-festival_c1`

4. **Challenge 2 Started**
   - Type: Event
   - Event name: `challenge_started`
   - Filter: Tag `challenge_id` equals `kite-festival_c2`

5. **Challenge 2 Completed**
   - Type: Event
   - Event name: `challenge_completed`
   - Filter: Tag `challenge_id` equals `kite-festival_c2`

6. **Challenge 3 Started**
   - Type: Event
   - Event name: `challenge_started`
   - Filter: Tag `challenge_id` equals `kite-festival_c3`

7. **Challenge 3 Completed**
   - Type: Event
   - Event name: `challenge_completed`
   - Filter: Tag `challenge_id` equals `kite-festival_c3`

8. **Challenge 4 Started**
   - Type: Event
   - Event name: `challenge_started`
   - Filter: Tag `challenge_id` equals `kite-festival_c4`

9. **Challenge 4 Completed**
   - Type: Event
   - Event name: `challenge_completed`
   - Filter: Tag `challenge_id` equals `kite-festival_c4`

10. **Challenge 5 Started**
    - Type: Event
    - Event name: `challenge_started`
    - Filter: Tag `challenge_id` equals `kite-festival_c5`

11. **Challenge 5 Completed**
    - Type: Event
    - Event name: `challenge_completed`
    - Filter: Tag `challenge_id` equals `kite-festival_c5`

12. **Story Completed**
    - Type: Event
    - Event name: `story_completed`

**What to analyze:**
- Which challenge has highest drop-off?
- What % reach the end?
- Average time per step

---

### Funnel 2: Vocabulary Test Completion (4 Steps)

**Purpose:** Track vocab test engagement

**Name:** Vocab Test Journey

**Steps:**
1. **Story Completed**
   - Type: Event
   - Event name: `story_completed`

2. **Vocab Test Started**
   - Type: Event
   - Event name: `vocab_test_started`

3. **Vocab Test Completed**
   - Type: Event
   - Event name: `vocab_test_completed`

4. **App Completed**
   - Type: Event
   - Event name: `app_completed`

**What to analyze:**
- Do users attempt vocab test after story?
- Completion rate of vocab test
- Full app completion rate

---

## Dashboards (3 Total)

Dashboards provide at-a-glance metrics. Go to **Dashboards** → **Create Dashboard**.

### Dashboard 1: Overview

**Purpose:** High-level KPIs

**Name:** Pangolin - Overview

**Cards to add:**

1. **Total Sessions** (Last 7 days)
   - Metric: Session count
   - Time range: Last 7 days

2. **Story Completion Rate**
   - Metric: Event count
   - Event: `story_completed`
   - Divide by total sessions (%)

3. **Average Stars Collected**
   - Metric: Average of tag value
   - Tag: `stars_collected`

4. **Error Rate**
   - Metric: Event count
   - Event: `js_error`
   - Divide by total sessions (%)

5. **Language Distribution**
   - Metric: Tag breakdown (pie chart)
   - Tag: `lang`

6. **Popular Challenges**
   - Metric: Event count by tag
   - Event: `challenge_started`
   - Group by: `challenge_id`

---

### Dashboard 2: Challenge Performance

**Purpose:** Deep dive into challenge difficulty

**Name:** Pangolin - Challenge Analytics

**Cards to add:**

1. **Challenge Completion Rate**
   - Metric: Event count comparison
   - Event 1: `challenge_completed`
   - Event 2: `challenge_started`
   - Group by: `challenge_id`

2. **Challenge Skip Rate**
   - Metric: Event count comparison
   - Event 1: `challenge_skipped`
   - Event 2: `challenge_started`
   - Group by: `challenge_id`

3. **Average Attempts per Challenge**
   - Metric: Average of tag value
   - Tag: `attempts_used`
   - Group by: `challenge_id`

4. **Average Time per Challenge**
   - Metric: Average of tag value
   - Tag: `time_spent_ms`
   - Group by: `challenge_id`

5. **Hint Usage Rate**
   - Metric: Event count
   - Event: `challenge_hint_opened`
   - Group by: `challenge_id`

6. **Revisit Success Rate**
   - Metric: Event count comparison
   - Event 1: `challenge_completed` where tag `is_revisit` = `true`
   - Event 2: `challenge_revisited`

---

### Dashboard 3: Language Behavior

**Purpose:** Understand multilingual users

**Name:** Pangolin - Language Insights

**Cards to add:**

1. **Language Distribution**
   - Metric: Session count by tag
   - Tag: `lang`
   - Chart: Pie chart

2. **Language Switchers**
   - Metric: Session count
   - Filter: Tag `lang_switch_count` >= 1
   - Show percentage of total

3. **Completion Rate by Language**
   - Metric: Event count
   - Event: `story_completed`
   - Group by: Tag `lang`

4. **Challenge Skip Rate by Language**
   - Metric: Event count
   - Event: `challenge_skipped`
   - Group by: Tag `lang`

5. **Average Stars by Language**
   - Metric: Average of tag value
   - Tag: `stars_collected`
   - Group by: Tag `lang`

6. **Language Switch Timeline**
   - Metric: Event timeline
   - Event: `language_switched`
   - Show when users switch

---

## Heatmaps (6 URLs)

Heatmaps show click/scroll behavior. Go to **Heatmaps** → **Add URL**.

### URL 1: Home Screen
```
https://pangolin-proto-22oct.vercel.app/
```
**Purpose:** See where users click to start story

---

### URL 2: Story Page 1
```
https://pangolin-proto-22oct.vercel.app/story/kite-festival/page/1
```
**Purpose:** Track engagement with first story page

---

### URL 3: MCQ Challenge (Challenge 1)
```
https://pangolin-proto-22oct.vercel.app/story/kite-festival/challenge/1
```
**Purpose:** See how users interact with MCQ interface

---

### URL 4: Drawing Challenge (Challenge 2)
```
https://pangolin-proto-22oct.vercel.app/story/kite-festival/challenge/2
```
**Purpose:** Track drawing canvas usage

---

### URL 5: Story Complete
```
https://pangolin-proto-22oct.vercel.app/story/kite-festival/complete
```
**Purpose:** See if users click badges, vocabulary words

---

### URL 6: Vocabulary Test
```
https://pangolin-proto-22oct.vercel.app/story/kite-festival/vocabulary-test
```
**Purpose:** Track answer selection patterns

---

## Quick Analysis Questions

Once dashboards are set up, you can answer:

### User Journey Questions
1. **What % complete the full story?**
   - Check "Story Journey - Full Completion" funnel
   - Look at step 12 completion rate

2. **Which challenge has highest drop-off?**
   - Check "Story Journey" funnel
   - Find biggest gap between steps

3. **Do users complete vocab test after story?**
   - Check "Vocab Test Journey" funnel
   - Compare steps 1→2 conversion

### Performance Questions
4. **Which challenge takes longest?**
   - Check "Challenge Performance" dashboard
   - Look at "Average Time per Challenge" card

5. **Which challenge has highest skip rate?**
   - Check "Challenge Performance" dashboard
   - Look at "Challenge Skip Rate" card

6. **Do hints help users succeed?**
   - Filter: `challenge_hint_opened` event
   - Compare completion rate vs non-hint users

### Language Questions
7. **Do language switchers complete more/less?**
   - Segment: "Multilingual Users"
   - Compare completion rate to others

8. **Which language has highest success rate?**
   - Check "Language Behavior" dashboard
   - Look at "Completion Rate by Language" card

### UX Questions
9. **Are there rage/dead clicks?**
   - Check heatmaps for each page
   - Look for red zones on non-interactive elements

10. **Where do users scroll on story pages?**
    - Check heatmap scroll depth
    - See if users read full text

### Technical Questions
11. **Are there any JS errors?**
    - Filter: "JavaScript Errors"
    - Check recent sessions

12. **Is spaced repetition working?**
    - Check "Challenge Performance" dashboard
    - Look at "Revisit Success Rate" card

---

## Pro Tips

### Combining Filters
You can combine multiple filters to find specific sessions:
- **Example:** Telugu users who skipped challenges
  - Filter 1: Tag `lang` = `te`
  - Filter 2: Event includes `challenge_skipped`

### Watching Recordings
After filtering, click **Watch Recording** to see:
- Actual mouse movement and clicks
- Rage clicks (frustrated repeated clicking)
- Dead clicks (clicking non-interactive elements)
- JavaScript errors in timeline

### Comparing Segments
Use segments to compare:
- English vs Telugu vs Hindi users
- High performers vs low performers
- Language switchers vs single-language users

### Setting Up Alerts
Create alerts for critical events:
- **Error spike:** If `js_error` count > 10 in 1 hour
- **Drop in completions:** If `story_completed` < 5 per day
- **High skip rate:** If `challenge_skipped` > 50% of `challenge_started`

---

## Next Steps

1. ✅ **Complete code implementation** (see IMPLEMENTATION-GUIDE.md)
2. ✅ **Deploy to production**
3. ⏳ **Wait 24 hours** for data to accumulate
4. ✅ **Set up all filters** (use this guide)
5. ✅ **Create all segments**
6. ✅ **Build all funnels**
7. ✅ **Create all dashboards**
8. ✅ **Add all heatmap URLs**
9. ✅ **Analyze data** (answer the questions above)
10. ✅ **Iterate on design** based on insights

---

## Resources

- **Clarity Docs:** https://docs.microsoft.com/en-us/clarity/
- **Clarity Dashboard:** https://clarity.microsoft.com/projects/view/tuj5ywlqbp
- **Project README:** `../README.md`
- **Analytics Plan:** `analytics-implementation-plan.md`
- **Gap Analysis:** `analytics-gap-analysis.md`
- **Implementation Guide:** `IMPLEMENTATION-GUIDE.md`

---

**Happy analyzing!** 📊✨
