import { useState, useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { BookOpen, Users, FileText, Home, Menu, X } from "lucide-react";
import { User as UserType } from "../../types/user";
import { API_BASE_URL } from "../../config/env";

export function AdminLayout() {
  const [userInfo, setUserInfo] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
          const parsedInfo = JSON.parse(storedUserInfo);
          setUserInfo(parsedInfo);
          if (!parsedInfo.is_superuser) {
            navigate("/");
          }
        }

        const response = await fetch(`${API_BASE_URL}/auth/me/`, {
          headers: {
            accept: "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUserInfo(userData);
          if (!userData.is_superuser) {
            navigate("/");
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed z-20 bottom-4 right-4 p-2 rounded-full bg-blue-600 text-white lg:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 z-10 w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
          <nav className="space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-700 transition-colors"
            >
              <Home size={20} />
              <span>Về trang chủ</span>
            </Link>
            <Link
              to="/admin/authors"
              className={`flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-700 transition-colors ${
                isActive("/admin/authors") ? "bg-blue-600" : ""
              }`}
            >
              <Users size={20} />
              <span>Quản lý tác giả</span>
            </Link>
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-700 transition-colors ${
                isActive("/admin") ? "bg-blue-600" : ""
              }`}
            >
              <BookOpen size={20} />
              <span>Quản lý truyện</span>
            </Link>
            <Link
              to="/admin/chapters"
              className={`flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-700 transition-colors ${
                isActive("/admin/chapters") ? "bg-blue-600" : ""
              }`}
            >
              <FileText size={20} />
              <span>Quản lý chương</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Trang quản trị
              </h1>
              {userInfo && (
                <div className="flex items-center gap-2">
                  <img
                    src={userInfo.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-700">{userInfo.username}</span>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
