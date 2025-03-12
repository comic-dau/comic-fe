import { Link } from 'react-router-dom';
import type { Comic } from '../types/comic';

interface ComicCardProps {
  comic: Comic;
}

export function ComicCard({ comic }: ComicCardProps) {
  return (
    <Link to={`/comic/${comic.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={`https://${comic.image}`}
          alt={comic.name}
          className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&h=800&fit=crop';
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-white font-semibold truncate">{comic.name}</h3>
          <div className="flex items-center text-sm text-gray-300 mt-1">
            <span>Chapter {comic.last_chapter || '0'}</span>
            <span className="mx-2">•</span>
            <span>{comic.views} views</span>
          </div>
        </div>
      </div>
    </Link>
  );
}