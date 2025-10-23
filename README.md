# 🦔 Pangolin - Interactive Language Learning Game

An engaging, story-based language learning application designed to improve English vocabulary to Telugu-speaking students through interactive challenges, beautiful illustrations, and native language support. It is a supplementary tool to existing teaching practices in government schools of Telangana, India.

## 🌟 Overview

Pangolin is a progressive web application that combines storytelling with gamified language learning. Children progress through illustrated story pages, engage with interactive challenges, and earn stars and badges as they master new vocabulary and language concepts.

### Key Features

- **📖 Story-Based Learning**: Narrative-driven content keeps children engaged while learning
- **🎯 Interactive Challenges**: 5 challenge types that test different language skills
- **🌐 Multilingual Support**: Full support for English, Telugu (తెలుగు), and Hindi (हिन्दी)
- **🗣️ Text-to-Speech**: Context-aware speech synthesis for proper pronunciation
- **⭐ Progress Tracking**: Visual progress bars with stars for completed challenges
- **🏆 Badge System**: Collectible badges reward learning milestones
- **📱 Responsive Design**: Works seamlessly across desktop and mobile devices
- **♿ Accessibility**: Keyboard navigation, screen reader support, and ARIA labels

## 🎮 How It Works

### Learning Flow

1. **Home Screen**: Select a story to begin learning
2. **Story Pages**: Read illustrated story pages with clickable words for pronunciation
3. **Challenge Pages**: Complete interactive challenges after each story page
4. **Story Completion**: Review learned vocabulary and earn badges
5. **Vocabulary Test**: Optional reinforcement test with retry challenges
6. **Thank You Page**: Final celebration with confetti and progress summary

### Challenge Types

1. **Multiple Choice (MCQ)**: Select the correct translation from 4 options
2. **Fill in the Blanks**: Complete sentences with missing words
3. **Match Pairs**: Drag and drop to match words with translations
4. **Sentence Building**: Arrange word tiles to construct correct sentences
5. **Drawing Challenge**: Trace letters or words for writing practice

## 🛠️ Tech Stack

### Core Technologies

- **React 19** - UI framework with latest features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **Material-UI (MUI)** - Comprehensive component library

### Key Libraries

- **React Router DOM** - Client-side routing
- **@dnd-kit** - Drag-and-drop interactions for match pairs
- **Emotion** - CSS-in-JS styling
- **react-confetti** - Celebration animations
- **react-use** - Utility hooks collection

### Development Tools

- **ESLint** - Code quality and consistency
- **TypeScript ESLint** - TypeScript-specific linting
- **Vite Plugin React** - Fast refresh and optimized builds

## 📁 Project Structure

```
pangolin-proto/
├── public/                      # Static assets
│   └── assets/                 # Images, icons, badges, SVGs
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── ChallengeBottomButtons.tsx
│   │   ├── ChallengeFeedback.tsx
│   │   ├── ChallengeLayout.tsx
│   │   ├── ConfettiEffect.tsx
│   │   ├── DrawingChallenge.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── FillBlanksChallenge.tsx
│   │   ├── HintModal.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── MatchPairsChallenge.tsx
│   │   ├── MCQChallenge.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── RetryMistakeBadge.tsx
│   │   └── SentenceBuildingChallenge.tsx
│   ├── config/                 # Configuration files
│   │   ├── speechMessages.ts   # TTS feedback messages
│   │   └── voiceRules.ts       # Voice selection rules
│   ├── contexts/               # React contexts
│   │   ├── ChallengeProgressContext.tsx
│   │   └── LanguageContext.tsx
│   ├── data/                   # Content and data
│   │   ├── challenges.ts       # Challenge configurations
│   │   ├── stories.ts          # Story content and UI labels
│   │   └── wordTranslations.ts # Vocabulary translations
│   ├── pages/                  # Main application pages
│   │   ├── ChallengePage.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── StoryCompletePage.tsx
│   │   ├── StoryPage.tsx
│   │   ├── ThankYouPage.tsx
│   │   └── VocabularyTestPage.tsx
│   ├── theme/                  # Design system
│   │   └── theme.ts            # Colors, typography, spacing
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/                  # Utility functions
│   │   └── speech.ts           # Text-to-speech utility
│   ├── App.tsx                 # Root component with routing
│   └── main.tsx                # Application entry point
├── docs/                        # Documentation
│   ├── analytics-implementation-plan.md
│   ├── project-overview.md
│   ├── SOLUTION_TTS_RELIABILITY.md
│   └── translation-rules.md
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pangolin-proto

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

## 🌍 Language Support

### Default Language

The application defaults to **Telugu (te)** with automatic fallbacks:

- **Text Content**: Telugu → English → Key name
- **Text-to-Speech**: Telugu voice → Hindi voice → English voice

### Supported Languages

| Language | Code | Native Name | Status |
|----------|------|-------------|--------|
| English  | `en` | English     | ✅ Complete |
| Telugu   | `te` | తెలుగు      | ✅ Complete |
| Hindi    | `hi` | हिन्दी       | ✅ Complete |

### Adding New Languages

1. Add language code to `src/types/index.ts`
2. Add translations in `src/data/stories.ts` and `src/data/challenges.ts`
3. Configure TTS voice preferences in `src/config/voiceRules.ts`

## 🎨 Design System

### Color Palette

- **Primary Purple**: `#743799` - Main brand color
- **Secondary Orange**: `#FEBA7B` - Accent and energy
- **Tertiary Pink**: `#E16BBA` - Highlights and celebrations
- **Neutral Grays**: 10 shades from `#1A1A1A` to `#F5F5F5`

### Typography

- **Display Font**: Fredoka (headers, titles)
- **Body Font**: Roboto (content, UI elements)

### Component Styling

Material-UI components are customized through the theme system in `src/theme/theme.ts`.

## 🔊 Text-to-Speech (TTS)

### Features

- Context-aware speech rate and pitch
- Automatic voice selection by language
- Fallback mechanisms for voice availability
- Resume on tab focus
- Error handling and retry logic

### Speech Contexts

Different contexts use optimized TTS settings:

- **Story Words**: Slower rate (0.8x) for learning
- **Story Sentences**: Natural pace (0.9x)
- **Challenge Feedback**: Normal speed with pitch variation
- **Hints**: Slower for clarity (0.85x)
- **Completion**: Energetic for celebration

### Voice Selection Priority

- **English**: Indian English male voices → British male → US male
- **Telugu**: Telugu female voices (Google, Microsoft)
- **Hindi**: Hindi female voices (Google, Microsoft, macOS Lekha)

## 🏗️ Architecture

### State Management

- **React Context API**: Global state for language and progress
- **Local State**: Component-specific state with hooks
- **Session Storage**: Challenge results and progress persistence

### Routing

Client-side routing with React Router v7:

- `/` - Home screen
- `/story/:storyId/page/:pageNumber` - Story pages
- `/story/:storyId/challenge/:challengeId` - Challenge pages
- `/story/:storyId/complete` - Story completion
- `/story/:storyId/vocabulary-test` - Vocabulary test
- `/story/:storyId/thank-you` - Final celebration

### Error Handling

- **Error Boundary**: Catches and displays React errors gracefully
- **404 Handling**: Redirects unknown routes to home
- **Speech Errors**: Silent fallback with console logging

## 🎯 Progress Tracking

### Challenge Results

- Stored in `ChallengeProgressContext`
- Per-challenge pass/fail tracking
- Retry attempts counted
- Badge eligibility calculated

### Visual Feedback

- **Progress Bar**: Wavy animation for current position, stars for completed challenges
- **Stars**: Filled stars for passed challenges, outline for upcoming
- **Badges**: Awarded based on performance criteria

### Badge System

Badges are earned based on story completion and performance:

- **Word Explorer**: Complete first story
- **Star Collector**: Earn all 5 stars in a story
- **Perfect Run**: No mistakes on any challenge
- **Quick Learner**: Complete story in under X minutes (future)

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 600px
- **Tablet**: 600px - 960px
- **Desktop**: > 960px

### Mobile Optimizations

- Touch-friendly tap targets (min 48x48px)
- Simplified layouts for small screens
- Optimized image loading
- Reduced animations for performance

## 🧪 Testing Recommendations

### Manual Testing Checklist

- [ ] All story pages load correctly
- [ ] Each challenge type functions properly
- [ ] TTS works in all languages
- [ ] Progress persists across page refreshes
- [ ] Badges appear on completion
- [ ] Language switching works
- [ ] Mobile responsive layout
- [ ] Keyboard navigation
- [ ] Error boundary catches errors

### Browser Testing

Test on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 🚀 Deployment

### Vercel Deployment

This project is optimized for Vercel deployment:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

### Environment Configuration

No environment variables required for basic deployment. For future analytics integration:

```env
VITE_ANALYTICS_ID=your-analytics-id
```

### Build Output

- Output directory: `dist/`
- Single-page application (SPA) with client-side routing
- Assets optimized and minified
- Bundle size: ~667KB (206KB gzipped)

## 🔮 Future Enhancements

See `docs/analytics-implementation-plan.md` for planned features:

- 📊 Analytics integration (Plausible/Matomo)
- 🎤 Pre-recorded audio for critical phrases
- 🌐 Additional language support
- 🎨 More stories and challenges
- 👥 User accounts and progress sync
- 🎮 Leaderboards and social features

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is a prototype project. For questions or collaboration:

1. Review existing documentation in `docs/`
2. Follow code style guidelines (ESLint configuration)
3. Test thoroughly before submitting changes
4. Ensure TypeScript types are accurate

## 📞 Support

For technical questions or issues, please refer to:

- `docs/project-overview.md` - Complete feature documentation
- `docs/translation-rules.md` - Content guidelines
- `docs/SOLUTION_TTS_RELIABILITY.md` - TTS implementation details

---

**Built with ❤️ for young language learners**
