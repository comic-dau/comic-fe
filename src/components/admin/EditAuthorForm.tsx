import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { Author } from "../../types/comic";
import { API_BASE_URL } from "../../config/env";

interface EditAuthorFormProps {
  author: Author;
  onUpdateAuthor: (updatedAuthor: Author) => void;
  onCancel: () => void;
}

export function EditAuthorForm({ author, onUpdateAuthor, onCancel }: EditAuthorFormProps) {
  const [name, setName] = useState(author.name);
  const [description, setDescription] = useState(author.des || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set initial avatar preview if author has an image
  useEffect(() => {
    if (author.image_avatar) {
      setAvatarPreview(`https://${author.image_avatar}`);
    }
  }, [author]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      setError("Vui lòng nhập tên tác giả.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("des", description);

      if (avatar) {
        formData.append("image_avatar", avatar);
      }

      const response = await fetch(`${API_BASE_URL}/author/${author.id}`, {
        method: "PUT",
        headers: {
          accept: "application/json",
        },
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
          setError("Không thể cập nhật tác giả. Vui lòng thử lại sau.");
        }
        return;
      }

      onUpdateAuthor(responseData);

    } catch (err) {
      console.error("Error updating author:", err);
      setError(err instanceof Error ? err.message : "Không thể cập nhật tác giả. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Cập nhật tác giả</h3>
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên tác giả <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ảnh đại diện
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer">
              <Upload size={18} />
              <span>Chọn ảnh mới</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
            {avatarPreview && (
              <div className="relative">
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-16 h-16 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setAvatar(null);
                    setAvatarPreview(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            )}
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
            {loading ? "Đang xử lý..." : "Cập nhật"}
          </button>
        </div>
      </form>
    </div>
  );
}
