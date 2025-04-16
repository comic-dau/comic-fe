import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { ComicDetail } from './pages/ComicDetail';
import { ChapterDetail } from './pages/ChapterDetail';
import { ChapterClassicView } from './pages/ChapterClassicView';
import { ChapterRouter } from './pages/ChapterRouter';
import { Favorites } from './pages/Favorites';
import { AdminLayout } from './pages/admin/AdminLayout';
import { ComicsManagement } from './pages/admin/ComicsManagement';
import { AuthorsManagement } from './pages/admin/AuthorsManagement';
import { ChaptersManagement } from './pages/admin/ChaptersManagement';
import { API_BASE_URL } from './config/env';
import { User as UserType } from './types/user';
import { ModalProvider } from './contexts/ModalContext';
import { HistoryModalContainer } from './components/HistoryModalContainer';
import { LoginModalContainer } from './components/LoginModalContainer';

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
      <ModalProvider>
        <div className="min-h-screen bg-gray-100">
          <Header userInfo={userInfo} />
          <HistoryModalContainer userInfo={userInfo} />
          <LoginModalContainer />
          <Routes>
            <Route path="/" element={<Home userInfo={userInfo} />} />
            <Route path="/favorites" element={<Favorites userInfo={userInfo} />} />
            <Route path="/comic/:name/:id" element={<ComicDetail />} />
            <Route path="/comic/:name/:id/chapter/:number/:chapterId" element={<ChapterRouter />} />
            <Route path="/comic/:name/:id/chapter/:number/:chapterId/view" element={<ChapterDetail />} />
            <Route path="/comic/:name/:id/chapter/:number/:chapterId/classic" element={<ChapterClassicView />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<ComicsManagement />} />
              <Route path="authors" element={<AuthorsManagement />} />
              <Route path="chapters" element={<ChaptersManagement />} />
            </Route>
          </Routes>
        </div>
      </ModalProvider>
    </Router>
  );
}

export default App;