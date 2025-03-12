import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Comic } from '../types/comic';

interface FeaturedSliderProps {
  comics: Comic[];
}

export function FeaturedSlider({ comics }: FeaturedSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % comics.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + comics.length) % comics.length);
  };

  const comic = comics[currentSlide];

  if (!comic) {
    return null;
  }

  return (
    <div className="relative h-[500px] group w-[85%] mx-auto rounded-lg overflow-hidden bg-gray-800">
      <div className="absolute inset-0">
        <img
          src={`https://${comic.image}`}
          alt={comic.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&h=500&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-lg" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 text-white rounded-b-lg">
        <h2 className="text-3xl font-bold mb-2">{comic.name}</h2>
        <p>Chapter {comic.last_chapter || '0'}</p>
        <p className="text-gray-200 mb-4 line-clamp-2">{comic.introduction}</p>
        <button className="bg-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors">
          XEM THÔNG TIN
        </button>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {comics.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}