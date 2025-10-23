# Translation Rules for Pangolin App

This document defines which UI elements should be translated when users select Telugu or Hindi as their interface language.

## General Principles

- **Target Language Content**: Words and sentences that students are learning (in Telugu/Hindi) should NOT be translated - they remain in the target language
- **Interface Text**: All UI elements, instructions, buttons, and navigation should be translated to the selected language
- **Brand Elements**: The Pangolin logo should never be translated
- **Language Selector**: Always visible and never translated

## Screen-by-Screen Translation Rules

### 1. Home Screen

**Translate:**
- Featured story title (from story data)
- Featured story description (from story data)
- "Start Story" button
- Badge title: "Little Explorer"
- Badge description: "Complete the first story to earn this badge."
- "Story {number}" labels (e.g., "Story 2", "Story 3", "Story 4")
- "Learning Outcome:" label
- Story titles for upcoming stories (from story data)
- Story descriptions for upcoming stories (from story data)
- "Coming soon" text

**Do NOT translate:**
- Pangolin logo

---

### 2. Story Page (e.g., Story 1 Page 1)

**Translate:**
- All story narrative text
- Button text (e.g., "Next", "Continue")

**Do NOT translate:**
- Words in word bubbles (these remain in the target language being learned)

---

### 3. Mini Challenge: Drawing

**Translate:**
- All instructional text (e.g., "Draw the following words")
- Button text (e.g., "Submit", "Try Again", "Continue")
- Feedback messages (e.g., "Correct!", "Try again", etc.)
- Any labels or hints shown

**Do NOT translate:**
- The target words being drawn (remain in the language being learned)

**Special Requirements:**
- Language selector should remain visible in the top right header (same position as the close button)

---

### 4. Mini Challenge: Fill in the Blanks

**Translate:**
- All instructional text
- Button text (e.g., "Submit", "Try Again", "Continue")
- Feedback messages (e.g., "Correct!", "Try again", etc.)
- "Suggested words" label/heading
- Any other labels or hints shown

**Do NOT translate:**
- The main sentence with the blank (remains in target language being learned)
- The actual suggested word options (remain in target language being learned)

---

### 5. Mini Challenge: Match the Words

**Translate:**
- All instructional text (e.g., "Match the following words")
- Button text (e.g., "Submit", "Try Again", "Continue")
- Feedback messages (e.g., "Correct!", "Try again", etc.)
- Any labels or hints shown

**Do NOT translate:**
- The English words that need to be matched (remain in English)
- The target language words being matched (remain in target language)

---

### 6. Mini Challenge: Build a Sentence

**Translate:**
- Instructional text: **"Click on the words below to build the correct sentence"**
- Button text (e.g., "Submit", "Try Again", "Continue")
- Feedback messages (e.g., "Correct!", "Try again", etc.)
- Any labels or hints shown

**Do NOT translate:**
- The actual word tiles/buttons used to build the sentence (remain in target language being learned)

**Special Note:**
- The instruction was changed from "Drag the words..." to "Click on the words below..." to better reflect the interaction model

---

### 7. Mini Challenge: MCQ (Multiple Choice)

**Translate:**
- The question text
- All instructional text
- Button text (e.g., "Submit", "Try Again", "Continue")
- Feedback messages (e.g., "Correct!", "Try again", etc.)
- Any labels or hints shown

**Do NOT translate:**
- The answer options (remain in target language being learned)

---

### 8. Story Complete Screen

**Translate:**
- "Story Complete!" heading (or similar congratulations text)
- "{X} stars collected" text
- "{X} / {Y} words learned" text and label
- Any other instructional or informational text

**Do NOT translate:**
- None - all text elements should be translated

---

### 9. Vocabulary Test (3 Questions After Story)

**Question Format:**
The vocabulary test uses a reverse translation approach where students must recognize English words based on Telugu/Hindi prompts.

**Question Template:**
"Which of the words below is '[target-language-word]' in English?"

**Example in English:**
"Which of the words below is 'friends' in English?"

**Example in Telugu:**
"క్రింది పదాలలో 'స్నేహితులు' ఇంగ్లీష్‌లో ఏది?"

Where:
- "క్రింది పదాలలో" = "Which of the words below is"
- "స్నేహితులు" = the Telugu word (stays in Telugu)
- "ఇంగ్లీష్‌లో ఏది?" = "in English?"

**Translate:**
- The question template: "Which of the words below is" and "in English?"
- All instructional text
- Button text (e.g., "Next", "Submit", "Continue")
- Feedback messages
- Any labels, hints, or progress indicators

**Do NOT translate:**
- The target word being tested (the Telugu/Hindi word shown in the question)
- The answer options (remain in English - so students recognize English words)

**Answer Options Example (always in English):**
- A) friends ✓
- B) water
- C) happy
- D) tree

---

## Implementation Notes

### Language Context
All translations are managed through the `LanguageContext` (`/src/contexts/LanguageContext.tsx`).

### Translation Keys
Use the `t()` function from the language context to access translations:
```typescript
const { t, language } = useLanguage();
<Button>{t('startStory')}</Button>
```

### Story Content
Story titles, descriptions, and narrative content should be stored in the stories data structure with translations for each supported language.

### Challenge Labels
Each challenge type should have a consistent set of translatable labels:
- Instructions
- Button labels ("Submit", "Try Again", "Continue")
- Feedback messages ("Correct!", "Try again", "Great job!", etc.)

---

## Summary

**Golden Rule:** If it's part of the user interface (instructions, navigation, feedback), translate it. If it's part of the learning content (words being taught, tested, or practiced), keep it in the target language or English as appropriate for the exercise type.
