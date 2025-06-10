// ✅ Cleaned & Optimized - Placeholder-safe
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiBell, FiUser } from 'react-icons/fi';

const navLinks = [
  { title: 'Home', path: '/' },
  { title: 'Events', path: '/events' },
  { title: 'About Us', path: '/about' },
  { title: 'Alumni', path: '/alumni' },
  { title: 'Contact', path: '/contact' }
];

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600">
                Alumni Portal
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {user && (
              <>
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <FiBell className="h-6 w-6" />
                </button>
                <div className="relative">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                    <FiUser className="h-6 w-6" />
                    <span>{user.fullName}</span>
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {user && (
              <>
                <div className="px-4 py-2 text-sm text-gray-700">
                  Welcome, {user.fullName}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 