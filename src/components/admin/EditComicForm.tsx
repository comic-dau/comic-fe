import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { Comic, Author } from "../../types/comic";
import { API_BASE_URL } from "../../config/env";

interface EditComicFormProps {
  comic: Comic;
  onUpdateComic: (updatedComic: Comic) => void;
  onCancel: () => void;
}

export function EditComicForm({ comic, onUpdateComic, onCancel }: EditComicFormProps) {
  const [name, setName] = useState(comic.name);
  const [authorId, setAuthorId] = useState(comic.author_info.id.toString());
  const [genres, setGenres] = useState(comic.genres);
  const [introduction, setIntroduction] = useState(comic.introduction);
  const [image, setImage] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backgroundImagePreview, setBackgroundImagePreview] = useState<string | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Theo dõi các trường đã thay đổi
  const [changedFields, setChangedFields] = useState<Record<string, boolean>>({});

  // Tải danh sách tác giả
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

  // Thiết lập ảnh xem trước ban đầu
  useEffect(() => {
    if (comic.image) {
      setImagePreview(`https://${comic.image}`);
    }
    if (comic.background_image) {
      setBackgroundImagePreview(`https://${comic.background_image}`);
    }
  }, [comic]);

  const handleFieldChange = (field: string, value: any, originalValue: any) => {
    // Đánh dấu trường đã thay đổi nếu giá trị mới khác giá trị ban đầu
    if (value !== originalValue) {
      setChangedFields({ ...changedFields, [field]: true });
    } else {
      const newChangedFields = { ...changedFields };
      delete newChangedFields[field];
      setChangedFields(newChangedFields);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'background') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (type === 'main') {
        setImage(file);
        setChangedFields({ ...changedFields, image_upload: true });
        
        // Tạo preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (type === 'background') {
        setBackgroundImage(file);
        setChangedFields({ ...changedFields, background_image_upload: true });
        
        // Tạo preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setBackgroundImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra xem có trường nào được thay đổi không
    if (Object.keys(changedFields).length === 0) {
      setError("Không có thông tin nào được thay đổi.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      // Chỉ gửi các trường đã thay đổi
      if (changedFields.name) {
        formData.append("name", name);
      }
      
      if (changedFields.author) {
        formData.append("author", authorId);
      }
      
      if (changedFields.genres) {
        formData.append("genres", genres);
      }
      
      if (changedFields.introduction) {
        formData.append("introduction", introduction);
      }
      
      if (changedFields.image_upload && image) {
        formData.append("image_upload", image);
      }
      
      if (changedFields.background_image_upload && backgroundImage) {
        formData.append("background_image_upload", backgroundImage);
      }

      const response = await fetch(`${API_BASE_URL}/comic/${comic.id}`, {
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
          setError("Không thể cập nhật truyện. Vui lòng thử lại sau.");
        }
        return;
      }
      
      onUpdateComic(responseData);
      
    } catch (err) {
      console.error("Error updating comic:", err);
      setError(err instanceof Error ? err.message : "Không thể cập nhật truyện. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (type: 'main' | 'background') => {
    if (type === 'main') {
      setImage(null);
      setImagePreview(null);
      setChangedFields({ ...changedFields, image_upload: true });
    } else {
      setBackgroundImage(null);
      setBackgroundImagePreview(null);
      setChangedFields({ ...changedFields, background_image_upload: true });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Cập nhật truyện</h3>
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
              Tên truyện
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                handleFieldChange('name', e.target.value, comic.name);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tác giả
            </label>
            <select
              value={authorId}
              onChange={(e) => {
                setAuthorId(e.target.value);
                handleFieldChange('author', e.target.value, comic.author_info.id.toString());
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            Thể loại
          </label>
          <input
            type="text"
            value={genres}
            onChange={(e) => {
              setGenres(e.target.value);
              handleFieldChange('genres', e.target.value, comic.genres);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Hành động, Phiêu lưu, v.v."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            value={introduction}
            onChange={(e) => {
              setIntroduction(e.target.value);
              handleFieldChange('introduction', e.target.value, comic.introduction);
            }}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh bìa
            </label>
            <div className="flex flex-col space-y-2">
              {imagePreview && (
                <div className="relative w-32 h-32">
                  <img
                    src={imagePreview}
                    alt="Comic cover"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage('main')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer w-fit">
                <Upload size={18} />
                <span>{imagePreview ? "Thay đổi ảnh bìa" : "Tải lên ảnh bìa"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'main')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh nền
            </label>
            <div className="flex flex-col space-y-2">
              {backgroundImagePreview && (
                <div className="relative w-32 h-32">
                  <img
                    src={backgroundImagePreview}
                    alt="Comic background"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage('background')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer w-fit">
                <Upload size={18} />
                <span>{backgroundImagePreview ? "Thay đổi ảnh nền" : "Tải lên ảnh nền"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'background')}
                  className="hidden"
                />
              </label>
            </div>
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
            disabled={loading || Object.keys(changedFields).length === 0}
          >
            {loading ? "Đang xử lý..." : "Cập nhật"}
          </button>
        </div>
      </form>
    </div>
  );
}
