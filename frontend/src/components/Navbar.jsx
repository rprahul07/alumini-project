// ✅ Cleaned & Optimized - Placeholder-safe
import React, { useState, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import { GiGraduateCap } from 'react-icons/gi';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { title: 'Home', path: '/' },
  { title: 'Events', path: '/events' },
  { title: 'About Us', path: '/about' },
  { title: 'Alumni', path: '/alumni' },
  { title: 'Contact', path: '/contact' },
];

const dashboardRoutes = [
  '/student/dashboard',
  '/faculty/dashboard',
  '/alumni/dashboard',
  '/admin/dashboard',
];

// Helper to get first name
const getFirstName = (fullName) => {
  if (!fullName) return '';
  return fullName.split(' ')[0];
};

const Navbar = ({ isHome = false }) => {
  const { user, role, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const avatarRef = useRef(null);

  // Use window.location.pathname for dashboard detection (since useLocation is removed)
  const isDashboard = dashboardRoutes.includes(window.location.pathname);
  const navBg = isHome ? 'bg-white' : 'bg-indigo-600';
  const textColor = isHome ? 'text-indigo-600' : 'text-white';
  const buttonBg = isHome ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600';
  const activeLink = isHome ? 'font-semibold underline text-indigo-600' : 'font-semibold underline text-white';
  const inactiveLink = isHome ? 'text-indigo-600 hover:underline' : 'text-white hover:underline';

  const handleDashboardRedirect = () => {
    if (user && user.role) {
      const role = user.role.toLowerCase();
      if (role === 'student') navigate('/student/dashboard');
      else if (role === 'faculty') navigate('/faculty/dashboard');
      else if (role === 'alumni') navigate('/alumni/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else navigate('/dashboard');
    } else {
      navigate('/role-selection');
    }
  };

  // Logout and redirect to home
  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  // Avatar rendering
  const renderAvatar = () => {
    if (user?.photoUrl) {
      return (
        <img
          src={user.photoUrl}
          alt={user.fullName || 'User'}
          className="h-9 w-9 rounded-full object-cover border-2 border-indigo-200 shadow cursor-pointer"
        />
      );
    }
    // Fallback: show initial
    const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : '?';
    return (
      <span className="h-9 w-9 flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-lg cursor-pointer select-none">
        {initial}
      </span>
    );
  };

  // Dropdown for logout and greeting
  const renderDropdown = () => (
    <div className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transition duration-200 py-2">
      {/* Greeting at the top of dropdown */}
      <div className="px-4 py-2 border-b border-gray-100 text-xs text-gray-500 font-medium text-left select-none">
        Hi, {getFirstName(user.fullName)}
      </div>
      {/* Optionally add Profile/Settings here */}
      {/* <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition">Profile</button> */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition"
      >
        <FiLogOut className="h-4 w-4" /> Logout
      </button>
    </div>
  );

  // Handle avatar click for dropdown
  const handleAvatarClick = () => setDropdownOpen((open) => !open);
  const handleDropdownBlur = (e) => {
    // Close dropdown if focus leaves the dropdown or avatar
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropdownOpen(false);
    }
  };

  return (
    <nav className={`${navBg} shadow-sm sticky top-0 z-50 transition-colors duration-300`} aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12 items-center">
          <Link to="/" className={`flex items-center gap-2 text-lg font-bold ${textColor} transition-colors duration-300`}>
            <GiGraduateCap className="h-6 w-6" color={isHome ? '#4f46e5' : '#fff'} />
            Alumni Connect
          </Link>
          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.title}
                to={link.path}
                className={({ isActive }) =>
                  `${isActive ? activeLink : inactiveLink} inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-300`
                }
                end={link.path === '/'}
              >
                {link.title}
              </NavLink>
            ))}
          </div>
          {/* Desktop User Actions */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4 relative">
            {user ? (
              <>
                {!isDashboard && (
                  <button
                    onClick={handleDashboardRedirect}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium shadow transition-colors ${buttonBg}`}
                  >
                    Dashboard
                  </button>
                )}
                <div className="relative flex items-center" tabIndex={0} onBlur={handleDropdownBlur}>
                  <button
                    ref={avatarRef}
                    onClick={handleAvatarClick}
                    className="focus:outline-none"
                    aria-label="User menu"
                  >
                    {renderAvatar()}
                  </button>
                  {dropdownOpen && renderDropdown()}
                </div>
              </>
            ) : (
              <button
                onClick={() => navigate('/role-selection')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium shadow transition-colors ${buttonBg}`}
              >
                Get Started
              </button>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-1 rounded-md ${textColor} hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-300`}
              aria-label="Open main menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className={`bg-white sm:hidden border-t border-indigo-100 shadow-lg rounded-b-xl`}>
          <div className="py-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.title}
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-1 text-base font-medium rounded-full transition-colors duration-150 mb-1 ${isActive ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm' : 'hover:bg-indigo-50 text-gray-700'}`
                }
                end={link.path === '/'}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.title}
              </NavLink>
            ))}
          </div>
          <div className="border-t border-indigo-100 my-1" />
          <div className="px-4 pb-2 flex flex-col gap-2">
            {user ? (
              <>
                {!isDashboard && (
                  <button
                    onClick={() => { setIsMenuOpen(false); handleDashboardRedirect(); }}
                    className="w-full px-3 py-1.5 rounded-full text-sm font-medium shadow-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    Dashboard
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 shadow-sm transition-colors"
                >
                  <FiLogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => { setIsMenuOpen(false); navigate('/role-selection'); }}
                className="w-full px-3 py-1.5 rounded-full text-sm font-medium shadow-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 