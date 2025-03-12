import { Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-xl font-bold">COMIC DH</Link>
            <nav className="hidden md:flex space-x-4">
              <Link to="/" className="hover:text-gray-300">THỂ LOẠI</Link>
              <Link to="/" className="hover:text-gray-300">ĐĂNG TRUYỆN</Link>
              <Link to="/" className="hover:text-gray-300">TIN TỨC</Link>
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
            <button className="p-2 hover:bg-gray-800 rounded-full">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}