import { useEffect, useState } from "react";
import { Comic } from "../../types/comic";
import { ComicCard } from "../../components/ComicCard";
import { FeaturedSlider } from "../../components/FeaturedSlider";
import { API_BASE_URL } from "../../config/env";

export function AdminHome() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/comic/`, {
          headers: {
            accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch comics");

        const data = await response.json();
        setComics(data);
        setError(null);
      } catch (err) {
        setError("Error loading comics. Please try again later.");
        console.error("Error fetching comics:", err);
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

  if (error) return <div>Error: {error}</div>;

  return (
    <main>
      {comics.length > 0 && <FeaturedSlider comics={comics.slice(0, 5)} />}

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">MỚI CẬP NHẬT</h2>
        <button className="mb-4 px-4 py-2 bg-green-500 text-white rounded">Add Comic</button>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {comics.map((comic) => (
            <div key={comic.id} className="relative">
              <ComicCard comic={comic} />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button className="px-2 py-1 bg-blue-500 text-white rounded">Edit</button>
                <button className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
