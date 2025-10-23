# Pangolin Project Overview

## Project Goal

Pangolin is an interactive language learning application designed to help students (primarily children) learn English through Telugu and Hindi as bridge languages. The app uses storytelling, interactive challenges, and gamification to make language learning engaging and effective.

### Core Learning Philosophy
- **Story-Based Learning**: Students learn vocabulary through narrative contexts
- **Progressive Difficulty**: Content builds from simple to complex
- **Immediate Feedback**: Instant validation and correction to reinforce learning
- **Gamification**: Stars, badges, and progress tracking to motivate continued learning
- **Multi-Modal Learning**: Combining reading, listening (text-to-speech), drawing, matching, and sentence building

---

## Tech Stack

### Frontend Framework
- **React 18** with **TypeScript**
- **Vite** as the build tool and dev server
- **React Router** for navigation

### UI Framework
- **Material-UI (MUI)** v5 for component library
- Custom theme with design tokens defined in `/src/theme/theme.ts`
- Responsive design optimized for tablets and mobile devices

### State Management
- React Context API for language selection (`LanguageContext`)
- React hooks (useState, useEffect) for component-level state
- URL search params for passing data between routes (e.g., stars earned)

### Browser APIs
- **Canvas API**: Used for drawing challenges
- **Web Speech Synthesis API**: Text-to-speech for pronunciation and feedback
- **Local Storage**: (Future) For persisting user progress

### Languages
- **Primary Development Language**: TypeScript
- **Styling**: Material-UI `sx` prop system (CSS-in-JS)
- **Supported Interface Languages**: English, Telugu, Hindi
- **Target Learning Language**: English (taught via Telugu/Hindi)

---

## Project Structure

```
pangolin-proto/
├── .claude/                      # AI assistant context and rules
│   └── translation-rules.md      # Translation guidelines
├── docs/                         # Project documentation
│   ├── translation-rules.md      # Translation rules (human-readable)
│   └── project-overview.md       # This file
├── public/                       # Static assets served directly
│   └── test.html                 # Test files
├── assets/                       # Image and SVG assets
│   ├── logo-pangolin.svg         # App logo
│   ├── star-filled.svg           # Achievement stars
│   ├── star-outline.svg          # Empty stars
│   ├── badge-*.png               # Badge visuals
│   ├── story*-cover.png          # Story cover images
│   └── draw-cursor-24.png        # Custom cursor for drawing
├── src/
│   ├── components/               # Reusable React components
│   │   ├── DrawingChallenge.tsx
│   │   ├── FillBlanksChallenge.tsx
│   │   ├── MatchPairsChallenge.tsx
│   │   ├── SentenceBuildingChallenge.tsx
│   │   ├── MCQChallenge.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── ProgressBar.tsx
│   │   └── ErrorBoundary.tsx
│   ├── contexts/                 # React Context providers
│   │   └── LanguageContext.tsx   # Multi-language support
│   ├── data/                     # Static data and content
│   │   ├── stories.ts            # Story content and metadata
│   │   └── challenges.ts         # Challenge definitions
│   ├── pages/                    # Route-level components
│   │   ├── HomeScreen.tsx        # Landing page with story selection
│   │   ├── StoryPage.tsx         # Story reading interface
│   │   ├── ChallengePage.tsx     # Challenge router
│   │   ├── StoryCompletePage.tsx # Completion and results
│   │   ├── VocabularyTestPage.tsx # Post-story assessment
│   │   └── ThankYouPage.tsx      # Final screen
│   ├── theme/
│   │   └── theme.ts              # Design system tokens
│   ├── types/                    # TypeScript type definitions
│   ├── App.tsx                   # Main app component with routes
│   └── main.tsx                  # App entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Design System

### Typography
- **Display Font**: "Chewy" - Used for headings, story titles, and prominent UI elements
- **Body Font**: "Quicksand" - Used for body text, descriptions, and general content
- Loaded via Google Fonts

### Color Palette
Defined in `/src/theme/theme.ts`:

**Primary Colors** (Main brand color - teal/blue):
- `primary.light`: #E0F2F1
- `primary.main`: #00897B
- `primary.dark`: #004D40

**Secondary Colors** (Accent - amber/orange):
- `secondary.light`: #FFF3E0
- `secondary.main`: #FF6F00
- `secondary.dark`: #E65100

**Success Colors** (Green for correct answers):
- `success.light`: #E8F5E9
- `success.main`: #4CAF50
- `success.dark`: #2E7D32

**Error Colors** (Red/orange for incorrect answers):
- `error.light`: #FFEBEE
- `error.main`: #F44336
- `error.dark`: #C62828

**Tertiary Colors** (Purple for badges/special elements):
- `tertiary.light`: #F3E5F5
- `tertiary.main`: #9C27B0
- `tertiary.dark`: #6A1B9A

**Neutral Colors** (Grays for text and backgrounds):
- `neutral[95]`: #F5F5F5 (lightest)
- `neutral[90]`: #E0E0E0
- `neutral[50]`: #9E9E9E
- `neutral[40]`: #757575
- `neutral[30]`: #616161
- `neutral[10]`: #212121 (darkest)

**Background**:
- `background.default`: #FAFAFA

### Spacing
Material-UI spacing units (1 unit = 8px):
- Small gaps: `1` (8px), `2` (16px)
- Medium gaps: `3` (24px), `4` (32px)
- Large gaps: `6` (48px), `8` (64px)

### Border Radius
- Cards and containers: `borderRadius: 3` (24px)
- Buttons: `borderRadius: 3` (24px)
- Circular elements: `borderRadius: '50%'`

---

## Key Features & User Flow

### 1. Home Screen (`/`)
- **Logo and Language Selector**: Top header with Pangolin logo (left) and language selector (right)
- **Featured Story**: Large card with cover image, title, description, and "Start Story" button
- **Badge Display**: Shows "Little Explorer" badge with progress towards earning it
- **Story List**: 3 upcoming stories (Story 2-4) with cover images, marked as "Coming soon"

### 2. Story Reading (`/story/:storyId/page/:pageNumber`)
- **Story Text**: Narrative displayed with highlighted words
- **Word Bubbles**: Interactive word chips that can be clicked for pronunciation
- **Progress Bar**: Visual indicator of progress through the story
- **Navigation**: Previous/Next buttons, Close button to exit
- **Text-to-Speech**: Auto-play story text when page loads

### 3. Mini Challenges (`/story/:storyId/challenge/:challengeNumber`)
Five challenge types to reinforce learning:

#### a) **Drawing Challenge**
- Students draw 3 target words using a canvas
- Color palette with 5 colors (black, green, blue, red, orange)
- Custom cursor (draw-cursor-24.png) when hovering over canvas
- Pencil icon dynamically appears on selected color
- Clear button for each canvas
- Validates that all canvases have drawings before accepting submission
- Mock recognition (always marks as correct if drawings exist)

#### b) **Fill in the Blanks**
- Sentence with a blank space
- Suggested words below (3-4 options)
- Click to select word, click again to deselect
- Submit validates if correct word was selected

#### c) **Match the Pairs**
- English words on left, Telugu/Hindi translations on right
- Click to select pairs
- Visual feedback for matches (green for correct, orange for wrong)
- Submit validates all matches

#### d) **Sentence Building**
- Word tiles displayed below
- **Click** (not drag) on words to build sentence in order
- Click on word in sentence to remove it back to word bank
- Submit validates correct word order

#### e) **MCQ (Multiple Choice Question)**
- Question displayed at top
- 4 answer options
- Single selection
- Submit validates answer

**Challenge Feedback System**:
- **2 Attempts**: Students get two tries per challenge
- **First Attempt Wrong**: Orange feedback, encouraging message, "Try Again" button
- **Second Attempt Wrong**: Shows correct answer, moves to next challenge
- **Correct**: Green feedback, celebration, "Continue" button
- **Audio Feedback**: Text-to-speech announces results

### 4. Story Complete Screen (`/story/:storyId/complete?stars=X`)
- **Celebration**: Animation and congratulations message
- **Stars Display**: Visual representation of 1-5 stars earned
- **Words Learned**: Progress indicator (e.g., "12 / 15 words learned")
- **Badges Earned**:
  - "Word Explorer" badge (earned at 3+ stars) - uses `badge-word-explorer-visual.png`
  - "Strong Start" badge (earned at 5 stars) - uses `badge-all-correct.png`
- **Actions**:
  - "Revise Challenges" button (if < 5 stars)
  - "Back to Home" button
  - "Take Vocabulary Test" button

### 5. Vocabulary Test (`/vocabulary-test`)
- **3 Questions**: Random selection from words learned
- **Question Format**: "Which of the words below is '[Telugu/Hindi word]' in English?"
- **4 English Answer Options**: Students must recognize English word
- **No Retry Logic**: Single attempt per question
- **Immediate Feedback**: Shows correct/wrong after each answer
- **Final Score**: Shows results at the end

### 6. Thank You Page (`/thank-you`)
- Final screen after completing vocabulary test
- Summary of learning journey
- Options to return home or continue to next story

---

## Data Structure

### Stories (`/src/data/stories.ts`)
```typescript
interface Story {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  pages: StoryPage[];
  challenges: Challenge[];
  vocabulary: VocabularyWord[];
}

interface StoryPage {
  pageNumber: number;
  text: string;
  words: string[]; // Highlighted words with bubbles
}
```

### Challenges (`/src/data/challenges.ts`)
```typescript
interface Challenge {
  id: string;
  type: 'drawing' | 'fillBlanks' | 'matchPairs' | 'sentenceBuilding' | 'mcq';
  question?: string;
  correctAnswer: string | string[];
  options?: string[];
  // ... type-specific fields
}
```

### Language Context (`/src/contexts/LanguageContext.tsx`)
```typescript
interface LanguageContextType {
  language: 'en' | 'te' | 'hi';
  setLanguage: (lang: 'en' | 'te' | 'hi') => void;
  t: (key: string) => string; // Translation function
}
```

---

## Key Design Decisions

### 1. Canvas-Based Drawing (Not Image Upload)
- **Decision**: Use HTML5 Canvas for drawing challenges
- **Rationale**:
  - More interactive and engaging for students
  - No file upload complexity
  - Works on touch devices (tablets)
  - Can implement visual feedback (colored pencils)
- **Implementation**: MouseEvent handlers for desktop, can be extended for touch events

### 2. Mock Recognition for Drawings
- **Decision**: Always mark drawings as "correct" if canvas has strokes
- **Rationale**:
  - Real handwriting/drawing recognition requires complex ML models
  - Focus is on engagement and vocabulary practice, not drawing accuracy
  - Students feel accomplished and motivated
- **Implementation**: Track `hasDrawing` state per canvas, validate before submission

### 3. Click-Based Sentence Building (Not Drag-and-Drop)
- **Decision**: Changed from drag-and-drop to click-based interaction
- **Rationale**:
  - Better touch device support
  - Simpler interaction model for young learners
  - Fewer accessibility issues
  - More reliable across browsers
- **Implementation**: Click adds word to sentence, click in sentence removes word

### 4. Two-Attempt Challenge System
- **Decision**: Allow students 2 attempts per challenge before showing answer
- **Rationale**:
  - Balances learning and frustration
  - First failure provides hint/encouragement
  - Second failure shows correct answer (learning moment)
  - Prevents infinite retry loops
- **Implementation**: `attemptCount` state, `attemptState` tracks stage

### 5. Text-to-Speech Integration
- **Decision**: Use browser Web Speech Synthesis API (not external TTS service)
- **Rationale**:
  - No API costs
  - Works offline
  - Immediate feedback
  - Supports Telugu, Hindi, and English
- **Trade-off**: Voice quality varies by browser/OS
- **Implementation**: `speak()` function with language mapping

### 6. Star-Based Grading (Not Percentage)
- **Decision**: Award 1-5 stars based on challenge performance
- **Rationale**:
  - More motivating for children than percentages
  - Visual and game-like
  - Clear tier system (3 stars = good, 5 stars = perfect)
- **Implementation**:
  - 1 star per challenge (5 challenges = 5 stars max)
  - Badges unlock at specific star thresholds

### 7. Vocabulary Test After Story
- **Decision**: 3-question test with reverse translation (Telugu/Hindi question → English answer)
- **Rationale**:
  - Validates actual learning (not just challenge completion)
  - Tests recognition, not just recall
  - Quick assessment (3 questions = ~1 minute)
  - Reverse direction tests practical usage
- **Implementation**: Random selection from story vocabulary

### 8. Single Language Direction (Telugu/Hindi → English)
- **Decision**: App teaches English using Telugu/Hindi as bridge languages
- **Rationale**:
  - Target audience: Telugu/Hindi speakers learning English
  - Focused learning path (not bidirectional)
  - Clearer content creation and testing
- **Future**: Could expand to other directions

### 9. Custom Cursor for Drawing
- **Decision**: Use custom cursor (draw-cursor-24.png) on canvas
- **Rationale**:
  - Visual feedback that drawing mode is active
  - Enhances tactile feel of interaction
  - Matches pencil icon in color palette
- **Implementation**: Resized to 24x24px for browser compatibility, hotspot at center (12,12)

### 10. Progress Persistence Strategy
- **Current**: No persistence (session-based)
- **Future Decision**: Local Storage for MVP, database for production
- **Rationale**:
  - MVP can work without backend
  - Local Storage sufficient for single-device testing
  - Will need user accounts + backend for multi-device sync

---

## Figma Integration (MCP)

### Setup
- **Tool**: Figma Desktop App with Claude MCP integration
- **Configuration**: MCP server configured in Claude Code settings
- **Usage**: Can access selected Figma components/frames for reference

### How to Use with AI
1. Open Figma Desktop App
2. Open the "Pangolin" design file
3. Select a component or frame you want to reference
4. In chat, mention "refer to the selected Figma component"
5. AI can read design properties: colors, typography, spacing, dimensions

### Design File Structure
- **File Name**: "Pangolin"
- **Components**: Individual UI elements (buttons, cards, badges)
- **Frames**: Full screen layouts (Home Screen, Story Page, Challenge screens)
- **Note**: Can select components individually instead of full pages for specific details

### When to Use Figma Reference
- Implementing new UI components
- Verifying design specifications (colors, spacing, fonts)
- Understanding intended visual hierarchy
- Extracting asset requirements

---

## Translation Strategy

### Current Implementation
- **Interface Language**: Controlled by LanguageSelector component
- **Translation Function**: `t(key)` from LanguageContext
- **Storage**: Translation keys in LanguageContext state

### Future Implementation Needs
1. **Externalize Translations**: Move to JSON files (`/src/locales/en.json`, `/src/locales/te.json`, `/src/locales/hi.json`)
2. **Story Content**: Multi-language story data structure
3. **Challenge Content**: Translated questions and instructions
4. **Dynamic Content**: Badge names, descriptions, feedback messages

### Translation Rules
See [Translation Rules Documentation](./translation-rules.md) for complete guidelines.

**Quick Summary**:
- **Translate**: All UI text, instructions, buttons, feedback
- **Don't Translate**: Learning content (word bubbles, answers), Pangolin logo, language selector

---

## Audio Strategy

### Text-to-Speech (TTS)
- **API**: Web Speech Synthesis (browser built-in)
- **Languages Supported**: English (en-US), Telugu (te-IN), Hindi (hi-IN)
- **Rate**: 0.9 (slightly slower for clarity)
- **Usage**:
  - Story text auto-plays on page load
  - Word bubbles read aloud on click
  - Challenge feedback (correct/incorrect messages)
  - Congratulations messages

### Implementation Pattern
```typescript
const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<string, string> = {
      en: 'en-US',
      te: 'te-IN',
      hi: 'hi-IN'
    };
    utterance.lang = langMap[language] || 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};
```

### Future Audio Enhancements
- Pre-recorded native speaker audio for key words
- Background music for story reading
- Sound effects for correct/incorrect answers
- Volume controls

---

## Performance Considerations

### Current Optimizations
- **Vite**: Fast dev server with HMR (Hot Module Replacement)
- **React**: Efficient component re-rendering
- **Canvas**: Lightweight drawing (no heavy libraries)
- **Assets**: SVG icons for scalability, optimized PNGs for images

### Future Optimizations
- Code splitting by route (React.lazy + Suspense)
- Image lazy loading for story covers
- Service worker for offline capability
- Memoization for expensive components (React.memo)

---

## Testing Strategy

### Current Testing
- **Manual Testing**: Browser-based testing during development
- **Device Testing**: Desktop and tablet form factors

### Future Testing Needs
1. **Unit Tests**: Jest + React Testing Library for components
2. **Integration Tests**: Testing user flows (story → challenges → completion)
3. **E2E Tests**: Playwright or Cypress for full user journeys
4. **Accessibility Testing**: WCAG compliance, screen reader testing
5. **Cross-Browser Testing**: Chrome, Safari, Firefox, Edge
6. **Device Testing**: iPad, Android tablets, various screen sizes
7. **Language Testing**: Verify all translations render correctly

---

## Known Issues & Limitations

### Current Limitations
1. **No User Authentication**: Progress not saved across sessions
2. **No Progress Persistence**: Closing browser loses all progress
3. **Single Story**: Only Story 1 is fully implemented
4. **Mock Drawing Recognition**: Always marks drawings as correct
5. **Limited Error Handling**: No comprehensive error boundaries
6. **No Offline Support**: Requires internet for initial load
7. **TTS Voice Quality**: Varies by browser/OS, especially for Telugu/Hindi

### Technical Debt
1. **Translation System**: Needs to be externalized to JSON files
2. **Type Definitions**: Some `any` types need proper typing
3. **Component Refactoring**: Some components are large and could be split
4. **Accessibility**: ARIA labels and keyboard navigation need improvement
5. **Responsive Design**: Needs more mobile phone optimization

---

## Future Roadmap Ideas

### Phase 1: MVP Completion
- [ ] Complete all 4 stories with full content
- [ ] Implement Local Storage for progress persistence
- [ ] Add more vocabulary words per story (target: 20-25)
- [ ] Polish all UI interactions and animations

### Phase 2: User Accounts & Backend
- [ ] User registration and authentication
- [ ] Cloud-based progress sync
- [ ] Leaderboards and social features
- [ ] Parent/teacher dashboard

### Phase 3: Content Expansion
- [ ] Additional stories (target: 20+ stories)
- [ ] More challenge types (spelling, pronunciation)
- [ ] Adaptive difficulty based on performance
- [ ] Personalized learning paths

### Phase 4: Platform Expansion
- [ ] Native mobile apps (React Native or Flutter)
- [ ] Web app offline mode (PWA)
- [ ] Desktop apps (Electron)
- [ ] Smart TV apps

### Phase 5: Advanced Features
- [ ] AI-powered pronunciation feedback
- [ ] Real handwriting recognition
- [ ] Video lessons and animations
- [ ] Multiplayer challenges
- [ ] Parent/teacher content creation tools

---

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit

# Lint code (if configured)
npm run lint
```

---

## Contributing Guidelines

### Code Style
- Use TypeScript for all new files
- Follow Material-UI patterns for styling (`sx` prop)
- Use functional components with hooks (no class components)
- Keep components focused and single-purpose
- Add comments for complex logic

### Component Structure
```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
  onComplete: () => void;
}

// 3. Component
export const MyComponent: React.FC<MyComponentProps> = ({ title, onComplete }) => {
  // 4. State
  const [count, setCount] = useState(0);

  // 5. Effects
  useEffect(() => {
    // ...
  }, []);

  // 6. Handlers
  const handleClick = () => {
    // ...
  };

  // 7. Render
  return (
    <Box>
      {/* JSX */}
    </Box>
  );
};
```

### Git Workflow
- Commit messages should be descriptive
- Reference issue numbers in commits when applicable
- Keep commits focused on single changes

---

## Contact & Resources

### Documentation
- [Translation Rules](./translation-rules.md)
- [Figma Design File](https://figma.com) - "Pangolin" project

### External Resources
- [Material-UI Documentation](https://mui.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)

---

## Changelog

### Session 1 (Phase 1 & 2.1)
- Initial project setup with React + TypeScript + Vite
- Design system implementation (colors, typography)
- Home Screen and Story Pages complete

### Session 2 (Current)
- Implemented all 5 challenge types
- Added drawing challenge with custom cursor
- Added progress bar and star system
- Implemented badge system (Little Explorer, Strong Start)
- Created Story Complete screen
- Added Vocabulary Test (3 questions)
- Established translation rules
- Created project documentation

---

**Last Updated**: 2025-10-23
**Version**: Prototype v0.2
**Status**: Active Development
