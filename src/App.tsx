import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { ComicDetail } from './pages/ComicDetail';
import { ChapterDetail } from './pages/ChapterDetail';
import { LoginCallback } from './pages/LoginCallback';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/comic/:name/:id" element={<ComicDetail />} />
          <Route path="/comic/:name/:id/chapter/:number/:chapterId" element={<ChapterDetail />} />
          <Route path="/login-callback" element={<LoginCallback />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;