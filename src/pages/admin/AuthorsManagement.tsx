import { useState, useEffect } from "react";
import { Plus, Edit, Trash, Search } from "lucide-react";
import { API_BASE_URL } from "../../config/env";
import { AddAuthorForm } from "../../components/admin/AddAuthorForm";
import { EditAuthorForm } from "../../components/admin/EditAuthorForm";
import { Author } from "../../types/comic";

export function AuthorsManagement() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState<Author | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAuthors = async () => {
    setLoading(true);
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
      setError(null);
    } catch (err) {
      setError("Error loading authors. Please try again later.");
      console.error("Error fetching authors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleAddAuthor = (newAuthor: Author) => {
    // Tải lại dữ liệu từ server thay vì chỉ thêm vào state
    fetchAuthors();
    setShowAddForm(false);

    // Hiển thị thông báo thành công
    alert("Thêm tác giả thành công!");
  };

  const handleEditAuthor = (author: Author) => {
    setCurrentAuthor(author);
    setShowEditForm(true);
  };

  const handleUpdateAuthor = (updatedAuthor: Author) => {
    // Tải lại dữ liệu từ server
    fetchAuthors();
    setShowEditForm(false);
    setCurrentAuthor(null);

    // Hiển thị thông báo thành công
    alert("Cập nhật tác giả thành công!");
  };

  const handleDeleteAuthor = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tác giả này?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/author/${id}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        // Xử lý riêng cho lỗi 400 (Bad Request)
        if (response.status === 400) {
          try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
              alert(errorData.message);
            } else {
              alert("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
            }
          } catch (e) {
            alert("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
          }
        } else {
          // Lỗi 500 hoặc các lỗi khác
          alert("Không thể xóa tác giả. Vui lòng thử lại sau.");
        }
        return;
      }

      // Tải lại dữ liệu từ server thay vì chỉ lọc state
      fetchAuthors();

      // Hiển thị thông báo thành công
      alert("Xóa tác giả thành công!");
    } catch (err) {
      console.error("Error deleting author:", err);
      alert(err instanceof Error ? err.message : "Không thể xóa tác giả. Vui lòng thử lại sau.");
    }
  };

  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý tác giả</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm tác giả mới
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8">
          <AddAuthorForm onAddAuthor={handleAddAuthor} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      {showEditForm && currentAuthor && (
        <div className="mb-8">
          <EditAuthorForm
            author={currentAuthor}
            onUpdateAuthor={handleUpdateAuthor}
            onCancel={() => {
              setShowEditForm(false);
              setCurrentAuthor(null);
            }}
          />
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm tác giả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ảnh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên tác giả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mô tả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAuthors.map((author) => (
              <tr key={author.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {author.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {author.image_avatar ? (
                    <img
                      src={`https://${author.image_avatar}`}
                      alt={author.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {author.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {author.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {author.des || ""}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditAuthor(author)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteAuthor(author.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
