import { useState } from "react";
import { X, Plus, Trash } from "lucide-react";
import { Comic } from "../../types/comic";
import { Chapter } from "../../types/chapter";
import { API_BASE_URL } from "../../config/env";

interface AddChapterFormProps {
  comics: Comic[];
  onAddChapter: (chapter: Chapter) => void;
  onCancel: () => void;
}

export function AddChapterForm({ comics, onAddChapter, onCancel }: AddChapterFormProps) {
  const [comicId, setComicId] = useState("");
  const [title, setTitle] = useState("");
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/zip" || file.name.endsWith(".zip")) {
        setZipFile(file);
      } else {
        setError("Vui lòng tải lên file ZIP chứa các ảnh của chương.");
        e.target.value = "";
      }
    }
  };

  const handleComicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setComicId(id);

    if (id) {
      const comic = comics.find(c => c.id.toString() === id);
      setSelectedComic(comic || null);
    } else {
      setSelectedComic(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comicId || !zipFile) {
      setError("Vui lòng chọn truyện và tải lên file ZIP chứa các ảnh của chương.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("comic", comicId);

      // Title là trường không bắt buộc
      if (title.trim()) {
        formData.append("title", title);
      }

      // Tải lên file ZIP chứa các ảnh của chương
      if (zipFile) {
        formData.append("file_image", zipFile);
      }

      const response = await fetch(`${API_BASE_URL}/chapter/`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Xử lý riêng cho lỗi 400 (Bad Request)
        if (response.status === 400) {
          // Nếu có thông báo lỗi từ API, hiển thị nó
          if (responseData && responseData.message) {
            setError(responseData.message);
          } else {
            setError("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
          }
        } else {
          // Lỗi 500 hoặc các lỗi khác
          setError("Không thể thêm chương. Vui lòng thử lại sau.");
        }
        return;
      }

      onAddChapter(responseData);

      // Reset form
      setComicId("");
      setSelectedComic(null);
      setTitle("");
      setZipFile(null);

    } catch (err) {
      console.error("Error adding chapter:", err);
      setError(err instanceof Error ? err.message : "Không thể thêm chương. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Thêm chương mới</h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Truyện <span className="text-red-500">*</span>
            </label>
            <select
              value={comicId}
              onChange={handleComicChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Chọn truyện</option>
              {comics.map((comic) => (
                <option key={comic.id} value={comic.id.toString()}>
                  {comic.name}
                </option>
              ))}
            </select>
            {selectedComic && (
              <p className="mt-1 text-sm text-gray-500">
                Số chương mới sẽ là: <span className="font-semibold">{selectedComic.total_chapter + 1}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Không bắt buộc"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            File ZIP chứa ảnh chương <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center mb-2">
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
              <Plus size={18} />
              <span>Chọn file ZIP</span>
              <input
                type="file"
                accept=".zip,application/zip"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {zipFile && (
              <span className="ml-4 text-sm text-gray-500">
                Đã chọn: {zipFile.name}
              </span>
            )}
          </div>

          {zipFile && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {zipFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(zipFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setZipFile(null)}
                    className="p-1 text-gray-400 hover:text-gray-500"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          <p className="mt-2 text-sm text-gray-500">
            Tải lên file ZIP chứa các ảnh của chương. Các ảnh sẽ được sắp xếp theo tên file.
          </p>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Thêm chương"}
          </button>
        </div>
      </form>
    </div>
  );
}
