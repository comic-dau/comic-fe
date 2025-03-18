import { Link } from "react-router-dom";
import type { Comic } from "../types/comic";

interface ComicCardProps {
  comic: Comic;
}

function timeAgo(date: string) {
  const now = new Date();
  const updatedDate = new Date(date);
  const seconds = Math.floor((now.getTime() - updatedDate.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} năm trước`;

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} tháng trước`;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} ngày trước`;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} giờ trước`;

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} phút trước`;

  return `${seconds} giây trước`;
}

export function ComicCard({ comic }: ComicCardProps) {
  const urlName = encodeURIComponent(
    comic.name.toLowerCase().replace(/\s+/g, "-")
  );

  return (
    <Link to={`/comic/${urlName}/${comic.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={`https://${comic.image}`}
          alt={comic.name}
          className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&h=800&fit=crop";
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-4">
          <h3 className="text-white font-semibold truncate">{comic.name}</h3>
          <div className="flex flex-wrap items-center text-sm text-gray-300 mt-1">
            <span>Chapter {comic.last_chapter || "0"}</span>
            <span className="mx-2">•</span>
            <span>{comic.views} views</span>
            <span className="mx-2">•</span>
            <span>{timeAgo(comic.updated_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
