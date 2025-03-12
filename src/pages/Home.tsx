import { useEffect, useState } from 'react';
import { Comic } from '../types/comic';
import { ComicCard } from '../components/ComicCard';
import { FeaturedSlider } from '../components/FeaturedSlider';
import { API_BASE_URL } from '../config/env';

const API_URL = `${API_BASE_URL}/comic/`;

export function Home() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            'accept': 'application/json'          
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch comics');
        }

        const data = await response.json();
        setComics(data);
        setError(null);
      } catch (err) {
        setError('Error loading comics. Please try again later.');
        console.error('Error fetching comics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
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
    <main>
      {comics.length > 0 && <FeaturedSlider comics={comics.slice(0, 5)} />}
      
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">MỚI CẬP NHẬT</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {comics.map(comic => (
            <ComicCard key={comic.id} comic={comic} />
          ))}
        </div>
      </div>
    </main>
  );
}
