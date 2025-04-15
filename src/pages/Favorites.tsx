import { useEffect, useState } from "react";
import { Comic } from "../types/comic";
import { ComicCard } from "../components/ComicCard";
import { API_BASE_URL } from "../config/env";
import { User as UserType } from "../types/user";

export function Favorites({ userInfo: initialUserInfo }: { userInfo: UserType | null }) {
  const [favorites, setFavorites] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(initialUserInfo);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me/`, {
          headers: {
            accept: "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        return;
      }

      try {
        const abortController = new AbortController();
        // const response = await fetch(`${API_BASE_URL}/comic?is_favorite=True`,
        const response = await fetch(`${API_BASE_URL}/comic?name=co`, {
          headers: {
            accept: "application/json",
          },
          credentials: "include",
          signal: abortController.signal,
        });

        if (!response.ok) {
          if (response.status === 401) {
            setIsAuthenticated(false);
            throw new Error("Bạn cần đăng nhập để xem danh sách truyện yêu thích");
          }
          throw new Error("Failed to fetch favorite comics");
        }

        const data = await response.json();
        setFavorites(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error loading favorite comics. Please try again later.");
        }
        console.error("Error fetching favorite comics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">TRUYỆN YÊU THÍCH</h2>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p>Bạn cần đăng nhập để xem danh sách truyện yêu thích.</p>
          <button
            onClick={() => window.location.href = `${API_BASE_URL}/auth/google/`}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Đăng nhập với Google
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">TRUYỆN YÊU THÍCH</h2>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">TRUYỆN YÊU THÍCH</h2>

      {favorites.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600 mb-4">Bạn chưa có truyện yêu thích nào.</p>
          <p className="text-gray-500">Hãy thêm truyện vào danh sách yêu thích để xem ở đây.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favorites.map((comic) => (
            <ComicCard key={comic.id} comic={comic} />
          ))}
        </div>
      )}
    </div>
  );
}
