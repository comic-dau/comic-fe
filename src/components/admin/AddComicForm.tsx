import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Comic, Author } from "../../types/comic";
import { API_BASE_URL } from "../../config/env";

interface AddComicFormProps {
  onAddComic: (comic: Comic) => void;
  onCancel: () => void;
}

export function AddComicForm({ onAddComic, onCancel }: AddComicFormProps) {
  const [name, setName] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [genres, setGenres] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/author/`, {
          headers: {
            accept: "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch authors");

        const data = await response.json();
        setAuthors(data);
      } catch (err) {
        console.error("Error fetching authors:", err);
        setError("Không thể tải danh sách tác giả. Vui lòng thử lại sau.");
      }
    };

    fetchAuthors();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'background') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (type === 'main') {
        setImage(file);
      } else if (type === 'background') {
        setBackgroundImage(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !authorId || !genres || !introduction || !image) {
      setError("Vui lòng điền đầy đủ thông tin và tải lên ảnh bìa.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("author", authorId);
      formData.append("genres", genres);
      formData.append("introduction", introduction);
      formData.append("image_upload", image);

      if (backgroundImage) {
        formData.append("background_image_upload", backgroundImage);
      }

      const response = await fetch(`${API_BASE_URL}/comic/`, {
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
          setError("Không thể thêm truyện. Vui lòng thử lại sau.");
        }
        return;
      }

      onAddComic(responseData);

      // Reset form
      setName("");
      setAuthorId("");
      setGenres("");
      setIntroduction("");
      setImage(null);
      setBackgroundImage(null);

    } catch (err) {
      console.error("Error adding comic:", err);
      setError(err instanceof Error ? err.message : "Không thể thêm truyện. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Thêm truyện mới</h3>
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
              Tên truyện <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tác giả <span className="text-red-500">*</span>
            </label>
            <select
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Chọn tác giả</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id.toString()}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thể loại <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Hành động, Phiêu lưu, v.v."
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả <span className="text-red-500">*</span>
          </label>
          <textarea
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh bìa <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'main')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh nền
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'background')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
            {loading ? "Đang xử lý..." : "Thêm truyện"}
          </button>
        </div>
      </form>
    </div>
  );
}
