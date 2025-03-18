import { Search, User } from "lucide-react";
import { Link } from "react-router-dom";
import { SRC_GITHUB_PUBLIC_URL, API_BASE_URL } from "../config/env";
import { useState, useEffect } from "react";
import { User as UserType } from "../types/user";

export function Header() {
  const [userInfo, setUserInfo] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }

      const response_me = await fetch(`${API_BASE_URL}/auth/me/`, {
        headers: {
          accept: "application/json",
        },
        credentials: "include",
      });

      if (response_me.ok) {
        const userData = await response_me.json();
        setUserInfo(userData);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google/`;
  };

  const handleLogout = async () => {
    window.location.href = `${API_BASE_URL}/auth/logout/`;
    setUserInfo(null);
    localStorage.removeItem("userInfo");
  };

  console.log(`User data:`, userInfo);

  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-xl font-bold">
              COMIC DH
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link to="/" className="hover:text-gray-300">
                THỂ LOẠI
              </Link>
              <Link to="/" className="hover:text-gray-300">
                ĐĂNG TRUYỆN
              </Link>
              <Link to="/" className="hover:text-gray-300">
                TIN TỨC
              </Link>
              <Link to={SRC_GITHUB_PUBLIC_URL} className="hover:text-gray-300">
                <img src="src/asset/github-copilot-logo.png" width={30} />
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="COMIC DH"
                className="bg-gray-800 text-white px-4 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            {userInfo ? (
              <div className="flex items-center space-x-2">
                <img
                  src={userInfo.avatar}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                  onClick={handleLogout}
                />
                <span>{userInfo.username}</span>
              </div>
            ) : (
              <button
                className="p-2 hover:bg-gray-800 rounded-full"
                onClick={handleLogin}
              >
                <User className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
