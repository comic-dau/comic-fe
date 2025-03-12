import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Comic, Chapter } from '../types/comic';
import { API_BASE_URL } from '../config/env';
import { Link } from 'react-router-dom'

export function ComicDetail() {
  const { id } = useParams();
  const [comic, setComic] = useState<Comic | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchComicData = async () => {
      try {
        const [comicResponse, chaptersResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/comic/${id}`, {
            signal: abortController.signal
          }),
          fetch(`${API_BASE_URL}/chapter/?comic=${id}`, {
            signal: abortController.signal
          })
        ]);

        if (!comicResponse.ok || !chaptersResponse.ok) {
          throw new Error('Failed to fetch comic data');
        }

        const [comicData, chaptersData] = await Promise.all([
          comicResponse.json(),
          chaptersResponse.json()
        ]);

        if (!abortController.signal.aborted) {
          setComic(comicData);
          setChapters(chaptersData);
          setError(null);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError('Error loading comic. Please try again later.');
        console.error('Error fetching comic:', err);
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchComicData();
    }

    return () => {
      abortController.abort();
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !comic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error || 'Comic not found'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div 
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: `url(https://${encodeURI(comic.background_image || comic.image)})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60">
          <div className="container mx-auto px-4 h-full flex items-end py-8">
            <div className="flex gap-8">
              <img
                src={`https://${comic.image}`}
                alt={comic.name}
                className="w-48 h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{comic.name}</h1>
                <p className="text-gray-300 mb-2">Tác giả: {comic.author_info.name}</p>
                <p className="text-gray-300 mb-4">Thể loại: {comic.genres}</p>
                <div className="flex gap-4">
                  <button className="bg-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors">
                    Đọc từ đầu
                  </button>
                  <button className="bg-gray-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-700 transition-colors">
                    Theo dõi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
          <p className="text-gray-700 leading-relaxed">{comic.introduction}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Danh sách chương</h2>
          <div className="divide-y">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="py-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">
                    Chapter {chapter.number}: {chapter.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(chapter.updated_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <Link to={`/chapter/${chapter.id}`}>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Đọc ngay
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}