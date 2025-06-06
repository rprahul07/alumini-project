// ✅ Cleaned & Optimized - Placeholder-safe
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  BellIcon,
  UserCircleIcon,
  AcademicCapIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const navLinks = [
  { title: 'Home', path: '/' },
  { title: 'Events', path: '/events' },
  { title: 'About Us', path: '/about' },
  { title: 'Alumni', path: '/alumni' },
  { title: 'Contact', path: '/contact' }
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const closeDropdown = () => setIsDropdownOpen(false);

  return (
    <nav className="bg-indigo-600 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <Link to="/" className="text-xl font-semibold text-white flex items-center">
            <AcademicCapIcon className="h-8 w-8 mr-2" />
            CUCEK Alumni Connect
          </Link>
          
          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ title, path }) => (
              <Link
                key={path}
                to={path}
                className="text-white hover:text-indigo-100 transition-colors"
              >
                {title}
              </Link>
            ))}
          </div>
          
          {/* Right Side - Notifications and Profile Dropdown */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-white hover:text-indigo-100 hover:bg-indigo-500 rounded-xl transition-colors">
              <BellIcon className="h-6 w-6" />
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-white hover:text-indigo-100 transition-colors"
              >
                <UserCircleIcon className="h-8 w-8" />
                <span>{user?.fullName || 'Guest'}</span>
                <ChevronDownIcon className={`h-5 w-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        onClick={closeDropdown}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        onClick={closeDropdown}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        onClick={closeDropdown}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        onClick={closeDropdown}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 