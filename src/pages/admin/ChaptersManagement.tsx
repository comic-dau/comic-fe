import { useState, useEffect } from "react";
import { Plus, Edit, Trash, Search } from "lucide-react";
import { API_BASE_URL } from "../../config/env";
import { AddChapterForm } from "../../components/admin/AddChapterForm";
import { Comic } from "../../types/comic";
import { Chapter } from "../../types/chapter";

export function ChaptersManagement() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComic, setSelectedComic] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch comics first
      const comicsResponse = await fetch(`${API_BASE_URL}/comic/`, {
        headers: {
          accept: "application/json",
        },
        credentials: "include",
      });

      if (!comicsResponse.ok) throw new Error("Failed to fetch comics");
      const comicsData = await comicsResponse.json();
      setComics(comicsData);

      // Then fetch chapters
      const chaptersResponse = await fetch(`${API_BASE_URL}/chapter/`, {
        headers: {
          accept: "application/json",
        },
        credentials: "include",
      });

      if (!chaptersResponse.ok) throw new Error("Failed to fetch chapters");
      const chaptersData = await chaptersResponse.json();
      setChapters(chaptersData);

      setError(null);
    } catch (err) {
      setError("Error loading data. Please try again later.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddChapter = (newChapter: Chapter) => {
    // Tải lại dữ liệu từ server thay vì chỉ thêm vào state
    fetchData();
    setShowAddForm(false);

    // Hiển thị thông báo thành công
    alert("Thêm chương thành công!");
  };

  const handleDeleteChapter = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chương này?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/chapter/${id}`, {
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
          alert("Không thể xóa chương. Vui lòng thử lại sau.");
        }
        return;
      }

      // Tải lại dữ liệu từ server thay vì chỉ lọc state
      fetchData();

      // Hiển thị thông báo thành công
      alert("Xóa chương thành công!");
    } catch (err) {
      console.error("Error deleting chapter:", err);
      alert(err instanceof Error ? err.message : "Không thể xóa chương. Vui lòng thử lại sau.");
    }
  };

  const filteredChapters = chapters.filter((chapter) => {
    const matchesSearch =
      chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chapter.comic_info.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesComic = selectedComic
      ? chapter.comic_info.id.toString() === selectedComic
      : true;

    return matchesSearch && matchesComic;
  });

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
        <h2 className="text-2xl font-bold">Quản lý chương truyện</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm chương mới
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8">
          <AddChapterForm
            comics={comics}
            onAddChapter={handleAddChapter}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm chương..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>

        <div className="md:w-1/3">
          <select
            value={selectedComic}
            onChange={(e) => setSelectedComic(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả truyện</option>
            {comics.map((comic) => (
              <option key={comic.id} value={comic.id.toString()}>
                {comic.name}
              </option>
            ))}
          </select>
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
                Chương
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiêu đề
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lượt xem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredChapters.map((chapter) => (
              <tr key={chapter.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {chapter.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {chapter.comic_info.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {chapter.number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{chapter.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {chapter.views}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(chapter.created_at).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteChapter(chapter.id)}
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
