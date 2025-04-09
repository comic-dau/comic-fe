import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { ComicDetail } from './pages/ComicDetail';
import { ChapterDetail } from './pages/ChapterDetail';
import { ChapterClassicView } from './pages/ChapterClassicView';
import { AdminHome } from './pages/admin/Home';
import { API_BASE_URL } from './config/env';
import { User as UserType } from './types/user';

function App() {
  const [userInfo, setUserInfo] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }

      const response_me = await fetch(`${API_BASE_URL}/auth/me/`, {
        headers: {
          accept: "application/json",
        },
        credentials: "include",
      });

      if (response_me.ok) {
        const userData = await response_me.json();
        setUserInfo(userData);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header userInfo={userInfo} />
        <Routes>
          <Route path="/" element={<Home userInfo={userInfo} />} />
          <Route path="/comic/:name/:id" element={<ComicDetail />} />
          <Route path="/comic/:name/:id/chapter/:number/:chapterId" element={<ChapterDetail />} />
          <Route path="/comic/:name/:id/chapter/:number/:chapterId/classic" element={<ChapterClassicView />} />
          <Route path="/admin" element={<AdminHome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;