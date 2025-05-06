import { useState, useEffect } from "react";
import { X, Clock, Book, BookOpen, Info, Trash2 } from "lucide-react";
import { API_BASE_URL } from "../config/env";
import { HistoryItem } from "../types/history";
import { Link } from "react-router-dom";
import { User } from "../types/user";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: User | null;
}

export function HistoryModal({ isOpen, onClose, userInfo }: HistoryModalProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/history/`, {
        headers: {
          accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Bạn cần đăng nhập để xem lịch sử đọc truyện");
        }
        throw new Error("Không thể tải lịch sử đọc truyện");
      }

      const data = await response.json();
      setHistory(data);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi khi tải lịch sử đọc truyện");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (id: number) => {

    setDeletingId(id);
    try {
      const response = await fetch(`${API_BASE_URL}/history/${id}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Bạn cần đăng nhập để xóa lịch sử đọc truyện");
        }
        throw new Error("Không thể xóa lịch sử đọc truyện");
      }

      // Remove the deleted item from the history state
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Đã xảy ra lỗi khi xóa lịch sử đọc truyện");
      }
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (!isOpen || !userInfo) return;
    fetchHistory();
  }, [isOpen, userInfo]);

  if (!isOpen) return null;

  if (!userInfo) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Lịch sử đọc truyện</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            <p>Bạn cần đăng nhập để xem lịch sử đọc truyện.</p>
          </div>
          <button
            onClick={() => window.location.href = `${API_BASE_URL}/auth/google/`}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đăng nhập với Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Lịch sử đọc truyện
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-gray-100 p-4 rounded text-center">
            <p>Bạn chưa có lịch sử đọc truyện nào.</p>
          </div>
        ) : (
          <div className="overflow-y-auto flex-grow">
            <ul className="divide-y divide-gray-200">
              {history.map((item) => (
                <li key={item.id} className="py-3 px-2 hover:bg-gray-50 rounded transition-colors">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <Book className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <p className="font-medium">{item.comic_info.name}</p>
                        <button
                          onClick={() => handleDeleteHistory(item.id)}
                          disabled={deletingId === item.id}
                          className="p-1 hover:bg-red-100 rounded-full text-red-500 transition-colors"
                          title="Xóa khỏi lịch sử"
                        >
                          {deletingId === item.id ? (
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Chapter {item.chapter_info.number}: {item.chapter_info.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.created_at).toLocaleString('vi-VN')}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Link
                          to={`/comic/${encodeURIComponent(item.comic_info.name.toLowerCase().replace(/\s+/g, "-"))}/${item.comic_info.id}/chapter/${item.chapter_info.number}/${item.chapter_info.id}`}
                          onClick={onClose}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                        >
                          <BookOpen className="w-4 h-4" />
                          Đọc tiếp
                        </Link>
                        <Link
                          to={`/comic/${encodeURIComponent(item.comic_info.name.toLowerCase().replace(/\s+/g, "-"))}/${item.comic_info.id}`}
                          onClick={onClose}
                          className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                        >
                          <Info className="w-4 h-4" />
                          Chi tiết Truyện
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
