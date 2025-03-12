import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { ComicDetail } from './pages/ComicDetail';
import { ChapterDetail } from './pages/ChapterDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/comic/:id" element={<ComicDetail />} />
          <Route path="/chapter/:id" element={<ChapterDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;