import { useEffect, useState } from 'react';
import { Comic } from '../types/comic';
import { ComicCard } from '../components/ComicCard';
import { FeaturedSlider } from '../components/FeaturedSlider';

const MOCK_COMICS: Comic[] = [
  {
    "id": 6,
    "last_chapter": null,
    "author_info": {
      "id": 2,
      "name": "Khanh Le"
    },
    "name": "OnePunch-Man2",
    "genres": "Action",
    "introduction": "123",
    "image": "minio.daihiep.click/comic/comic/OnePunch-Man2/anh-hung-onepunch-5218.jpg",
    "views": 0,
    "total_chapter": 0,
    "like": 0,
    "rating": 0,
    "created_at": "2025-03-11T08:36:26.180328Z",
    "updated_at": "2025-03-11T08:36:26.180401Z"
  },
  {
    "id": 5,
    "last_chapter": 3,
    "author_info": {
      "id": 2,
      "name": "Khanh Le"
    },
    "name": "OnePunch-Man",
    "genres": "Action",
    "introduction": "123",
    "image": "minio.daihiep.click/comic/comic/OnePunch-Man/anh-hung-onepunch-5218.jpg",
    "views": 0,
    "total_chapter": 0,
    "like": 0,
    "rating": 0,
    "created_at": "2025-03-11T08:15:51.576458Z",
    "updated_at": "2025-03-11T08:15:51.576524Z"
  },
  {
    "id": 4,
    "last_chapter": 1,
    "author_info": {
      "id": 2,
      "name": "Khanh Le"
    },
    "name": "Cuộc đời Khanh Le",
    "genres": "Adventure,Action",
    "introduction": "Cuộc đời Khanh Le",
    "image": "minio.daihiep.click/comic/comic/Cuộc đời Khanh Le/OIP.jpeg",
    "views": 0,
    "total_chapter": 0,
    "like": 0,
    "rating": 0,
    "created_at": "2025-03-10T08:32:33.111954Z",
    "updated_at": "2025-03-10T08:45:13.751004Z"
  }
];

export function Home() {
  const [comics, setComics] = useState<Comic[]>(MOCK_COMICS);
  const [loading, setLoading] = useState(false);

  // Uncomment and update this when your API is ready
  /*
  useEffect(() => {
    setLoading(true);
    fetch('YOUR_API_ENDPOINT')
      .then(res => res.json())
      .then(data => {
        setComics(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching comics:', error);
        setLoading(false);
      });
  }, []);
  */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main>
      <FeaturedSlider comics={comics.slice(0, 5)} />
      
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