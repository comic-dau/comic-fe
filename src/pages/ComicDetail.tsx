import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Comic, Chapter } from "../types/comic";
import { API_BASE_URL } from "../config/env";
import EyeIcon from "../asset/eye-v1.png";

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

export function ComicDetail() {
  const { id } = useParams<{ id: string }>();
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
            headers: {
              accept: "application/json",
            },
            signal: abortController.signal,
          }),
          fetch(`${API_BASE_URL}/chapter/?comic=${id}`, {
            headers: {
              accept: "application/json",
            },
            signal: abortController.signal,
          }),
        ]);

        if (!comicResponse.ok || !chaptersResponse.ok) {
          throw new Error("Failed to fetch comic data");
        }

        const [comicData, chaptersData] = await Promise.all([
          comicResponse.json(),
          chaptersResponse.json(),
        ]);

        if (!abortController.signal.aborted) {
          setComic(comicData);
          setChapters(chaptersData);
          setError(null);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError("Error loading comic. Please try again later.");
        console.error("Error fetching comic:", err);
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

  const handleFavoriteClick = async () => {
    const abortController = new AbortController();

    try {
      // Tạo một đối tượng FormData trống
      const formData = new FormData();
      formData.append("comic", comic?.id?.toString() || ""); // ID của comic
      formData.append("is_favorite", "true");
  
      const response = await fetch(`${API_BASE_URL}/user_comic/`, {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: formData, // Sử dụng FormData đã tạo
        credentials: "include",
        signal: abortController.signal,
      });

      if (!response.ok) {
        if (response.status === 400) {
          alert("Bạn cần đăng nhập để thực hiện chức năng này.");
        } else {
          throw new Error("Failed to add to favorites");
        }
      } else {
        alert("Đã thêm vào danh sách yêu thích!");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Request aborted");
      } else {
        console.error("Lỗi khi thêm vào danh sách yêu thích:", err);
        alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    }
  };

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
          <p className="text-xl font-semibold">{error || "Comic not found"}</p>
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
          backgroundImage: `url(https://${encodeURI(
            comic.background_image || comic.image
          )})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60">
          <div className="container mx-auto px-4 h-full flex items-end py-8">
            <div className="flex gap-8">
              <img
                src={`https://${comic.preview_image || comic.image}`}
                alt={comic.name}
                className="w-48 h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{comic.name}</h1>
                <p className="text-gray-300 mb-2">
                  Tác giả: {comic.author_info.name}
                </p>
                <p className="text-gray-300 mb-4">Thể loại: {comic.genres}</p>
                <div className="flex gap-4">
                  <Link
                    to={`/comic/${encodeURIComponent(
                      comic.name.toLowerCase().replace(/\s+/g, "-")
                    )}/${comic.id}/chapter/${
                      chapters[chapters.length - 1].number
                    }/${chapters[chapters.length - 1].id}`}
                  >
                    <button className="bg-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors">
                      Đọc từ đầu
                    </button>
                  </Link>
                  <button className="bg-gray-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-700 transition-colors">
                    Theo dõi
                  </button>
                  {/* Nút yêu thích */}
                  <button
                    className="px-6 py-2 rounded-full font-semibold text-white transition-colors flex items-center gap-2 bg-pink-600 hover:bg-pink-700"
                    onClick={handleFavoriteClick}
                  >
                    <span>❤️</span>
                    <span>Yêu thích</span>
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
            {chapters.map((chapter) => {
              const urlName = encodeURIComponent(
                comic.name.toLowerCase().replace(/\s+/g, "-")
              );
              return (
                <div
                  key={chapter.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold">
                      Chapter {chapter.number}: {chapter.title}
                    </h3>
                    <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1">
                      <p className="mr-2">
                        {new Date(chapter.updated_at).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                      <div className="flex items-center gap-1">
                        <span>{chapter.views}</span>
                        <img src={EyeIcon} width={14} height={14} alt="" />
                      </div>
                      <span className="mx-2">•</span>
                      <span>{timeAgo(chapter.updated_at)}</span>
                    </div>
                  </div>
                  <Link
                    to={`/comic/${urlName}/${comic.id}/chapter/${chapter.number}/${chapter.id}`}
                  >
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      Đọc ngay
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}