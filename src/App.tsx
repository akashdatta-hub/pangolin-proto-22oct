import { Routes, Route } from 'react-router-dom';
import { HomeScreen } from './pages/HomeScreen';
import { StoryPage } from './pages/StoryPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/story/:storyId/page/:pageNumber" element={<StoryPage />} />
      {/* More routes will be added as we build more screens */}
    </Routes>
  );
}

export default App;
