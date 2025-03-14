import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../config/env';

interface Chapter {
  id: number;
  number: number;
  title: string;
  views: number;
  src_image: string[];
  comic_info: {
    id: number;
    name: string;
  };
}

export function ChapterDetail() {
  const { name, id, number, chapterId } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [chapterList, setChapterList] = useState<Chapter[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chapterId) return;

    const abortController = new AbortController();

    const fetchChapterData = async () => {
      try {
        const [chapterResponse, viewResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/chapter/${chapterId}`, {
            signal: abortController.signal
          }),
          fetch(`${API_BASE_URL}/chapter/${chapterId}/view/`, {
            method: 'PUT',
            headers: {
              'accept': 'application/json'
            },
            signal: abortController.signal
          })
        ]);

        if (!chapterResponse.ok) {
          throw new Error('Failed to fetch chapter data');
        }

        const data = await chapterResponse.json();
        const parsedData = {
          ...data,
          src_image: JSON.parse(data.src_image.replace(/'/g, '"'))
        };
        setChapter(parsedData);

        const viewData = await viewResponse.json();
        console.log('View response:', viewData);

        // Fetch chapter list
        const chaptersResponse = await fetch(`${API_BASE_URL}/chapter/?comic=${id}`, {
          signal: abortController.signal
        });
        if (!chaptersResponse.ok) {
          throw new Error('Failed to fetch chapter list');
        }
        const chaptersData = await chaptersResponse.json();
        setChapterList(chaptersData);
        
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError('Error loading chapter. Please try again later.');
        console.error('Error fetching chapter:', err);
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchChapterData();

    return () => {
      abortController.abort();
    };
  }, [chapterId, id]);

  const navigateToChapter = (targetNumber: number) => {
    const targetChapter = chapterList.find(ch => ch.number === targetNumber);
    if (targetChapter) {
      const urlName = encodeURIComponent(targetChapter.comic_info.name.toLowerCase().replace(/\s+/g, '-'));
      navigate(`/comic/${urlName}/${id}/chapter/${targetChapter.number}/${targetChapter.id}`);
    }
  };

  const handlePrevChapter = () => {
    if (!chapter) return;
    const currentNumber = chapter.number;
    const prevChapter = chapterList.find(ch => ch.number === currentNumber - 1);
    if (prevChapter) {
      navigateToChapter(prevChapter.number);
    }
  };

  const handleNextChapter = () => {
    if (!chapter) return;
    const currentNumber = chapter.number;
    const nextChapter = chapterList.find(ch => ch.number === currentNumber + 1);
    if (nextChapter) {
      navigateToChapter(nextChapter.number);
    }
  };

  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      header.style.display = 'none';
    }

    return () => {
      if (header) {
        header.style.display = '';
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!chapter) return;

      switch (e.key) {
        case 'ArrowLeft':
          setCurrentImageIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'ArrowRight':
          setCurrentImageIndex(prev => 
            prev < chapter.src_image.length - 1 ? prev + 1 : prev
          );
          break;
        case 'Home':
          setCurrentImageIndex(0);
          break;
        case 'End':
          setCurrentImageIndex(chapter.src_image.length - 1);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [chapter]);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (!chapter) return;
      
      e.preventDefault();
      if (e.deltaY > 0) {
        // Scroll down - next image
        setCurrentImageIndex(prev => {
          if (prev === -1) return 0;
          return prev < chapter.src_image.length - 1 ? prev + 1 : prev;
        });
      } else {
        // Scroll up - previous image
        setCurrentImageIndex(prev => prev > -1 ? prev - 1 : prev);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleScroll, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleScroll);
      }
    };
  }, [chapter]);

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => prev > 0 ? prev - 1 : prev);
  };

  const handleNextImage = () => {
    if (!chapter) return;
    setCurrentImageIndex(prev => {
      if (prev === -1) return 0;
      return prev < chapter.src_image.length - 1 ? prev + 1 : prev;
    });
  };

  const startReading = () => {
    console.log(`Start reading ${name} - Chapter ${number}`);
    setCurrentImageIndex(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error || 'Chapter not found'}</p>
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

  const urlName = encodeURIComponent(chapter.comic_info.name.toLowerCase().replace(/\s+/g, '-'));
  const hasPrevChapter = chapterList.some(ch => ch.number === chapter.number - 1);
  const hasNextChapter = chapterList.some(ch => ch.number === chapter.number + 1);

  if (currentImageIndex === -1) {
    return (
      <div className="min-h-screen bg-gray-900 text-white" ref={containerRef}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Link 
              to={`/comic/${urlName}/${chapter.comic_info.id}`}
              state={{ comicId: chapter.comic_info.id }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <ChevronLeft size={20} />
              Quay lại
            </Link>
          </div>
          
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-2">{chapter.comic_info.name}</h1>
            <h2 className="text-xl mb-8">Chapter {chapter.number}: {chapter.title}</h2>
            
            <div className="space-y-4">
              <button 
                onClick={startReading}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
              >
                Bắt đầu đọc
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handlePrevChapter}
                  className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={!hasPrevChapter}
                >
                  <ChevronLeft size={20} />
                  Chương trước
                </button>
                <button 
                  onClick={handleNextChapter}
                  className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={!hasNextChapter}
                >
                  Chương sau
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white" ref={containerRef}>
      <div className="fixed top-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm p-2 z-10 transition-all duration-300 hover:p-4">
        <div className="container mx-auto flex items-center justify-between">
          <button 
            onClick={() => setCurrentImageIndex(-1)}
            className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          >
            <ChevronLeft size={16} />
            Quay lại
          </button>
          <div className="text-center">
            <h1 className="text-sm font-bold">{chapter.comic_info.name}</h1>
            <p className="text-xs">Chapter {chapter.number}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs">
              {currentImageIndex + 1}/{chapter.src_image.length}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrevChapter}
                disabled={!hasPrevChapter}
                className="p-1 bg-blue-500 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextChapter}
                disabled={!hasNextChapter}
                className="p-1 bg-blue-500 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-12 pb-12">
        <div className="container mx-auto px-4 flex justify-center items-center min-h-[calc(100vh-6rem)]">
          <img
            src={`https://${chapter.src_image[currentImageIndex]}`}
            alt={`Page ${currentImageIndex + 1}`}
            className="max-w-full max-h-[calc(100vh-6rem)] object-contain"
            loading="lazy"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm p-2 transition-all duration-300 hover:p-4">
        <div className="container mx-auto flex justify-center items-center gap-4">
          <button
            onClick={handlePrevImage}
            disabled={currentImageIndex === 0}
            className="p-2 bg-blue-500 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            title="Previous page"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-sm font-medium">
            {currentImageIndex + 1}/{chapter.src_image.length}
          </div>
          <button
            onClick={handleNextImage}
            disabled={currentImageIndex === chapter.src_image.length - 1}
            className="p-2 bg-blue-500 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            title="Next page"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}