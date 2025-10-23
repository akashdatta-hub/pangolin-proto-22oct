import { Routes, Route } from 'react-router-dom';
import { HomeScreen } from './pages/HomeScreen';
import { StoryPage } from './pages/StoryPage';
import { ChallengePage } from './pages/ChallengePage';
import { StoryCompletePage } from './pages/StoryCompletePage';
import { VocabularyTestPage } from './pages/VocabularyTestPage';
import { ThankYouPage } from './pages/ThankYouPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/story/:storyId/page/:pageNumber" element={<StoryPage />} />
      <Route path="/story/:storyId/challenge/:challengeNumber" element={<ChallengePage />} />
      <Route path="/story/:storyId/complete" element={<StoryCompletePage />} />
      <Route path="/vocabulary-test" element={<VocabularyTestPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
    </Routes>
  );
}

export default App;
