import { useState, useEffect } from "react";
import { Plus, Edit, Trash, Search } from "lucide-react";
import { Comic } from "../../types/comic";
import { API_BASE_URL } from "../../config/env";
import { AddComicForm } from "../../components/admin/AddComicForm";
import { EditComicForm } from "../../components/admin/EditComicForm";
import { formatImageUrl } from "../../utils/imageUtils";

export function ComicsManagement() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentComic, setCurrentComic] = useState<Comic | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchComics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/comic/`, {
        headers: {
          accept: "application/json",
        },
        credentials: "include",
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

  useEffect(() => {
    fetchComics();
  }, []);

  const handleAddComic = () => {
    // Tải lại dữ liệu từ server thay vì chỉ thêm vào state
    fetchComics();
    setShowAddForm(false);

    // Hiển thị thông báo thành công
    alert("Thêm truyện thành công!");
  };

  const handleEditComic = (comic: Comic) => {
    setCurrentComic(comic);
    setShowEditForm(true);
  };

  const handleUpdateComic = () => {
    // Tải lại dữ liệu từ server
    fetchComics();
    setShowEditForm(false);
    setCurrentComic(null);

    // Hiển thị thông báo thành công
    alert("Cập nhật truyện thành công!");
  };

  const handleDeleteComic = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa truyện này?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/comic/${id}`, {
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
            console.error("Error deleting author:", e);
            alert("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
          }
        } else {
          // Lỗi 500 hoặc các lỗi khác
          alert("Không thể xóa truyện. Vui lòng thử lại sau.");
        }
        return;
      }

      // Tải lại dữ liệu từ server thay vì chỉ lọc state
      fetchComics();

      // Hiển thị thông báo thành công
      alert("Xóa truyện thành công!");
    } catch (err) {
      console.error("Error deleting comic:", err);
      alert(err instanceof Error ? err.message : "Không thể xóa truyện. Vui lòng thử lại sau.");
    }
  };

  const filteredComics = comics.filter((comic) =>
    comic.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h2 className="text-2xl font-bold">Quản lý truyện</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm truyện mới
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8">
          <AddComicForm onAddComic={handleAddComic} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      {showEditForm && currentComic && (
        <div className="mb-8">
          <EditComicForm
            comic={currentComic}
            onUpdateComic={handleUpdateComic}
            onCancel={() => {
              setShowEditForm(false);
              setCurrentComic(null);
            }}
          />
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm truyện..."
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
                Truyện
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tác giả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thể loại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số chương
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lượt xem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredComics.map((comic) => (
              <tr key={comic.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {comic.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-md object-cover"
                        src={formatImageUrl(comic.image)}
                        alt={comic.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {comic.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {comic.author_info.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{comic.genres}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {comic.total_chapter}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {comic.views}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditComic(comic)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteComic(comic.id)}
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
