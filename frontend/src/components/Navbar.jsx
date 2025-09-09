import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import OptimizedImage from './OptimizedImage';
// FontAwesome removed for performance optimization

const navLinks = [
  { title: 'Home', path: '/' },
  { title: 'Events', path: '/events' },
  { title: 'Jobs', path: '/jobs', auth: true },
  { title: 'About Us', path: '/about' },
  { title: 'Alumni', path: '/alumni', auth: true },
  { title: 'Students', path: '/students', auth: true, hideForStudent: true },
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

// Helper to get user display name (prioritize name over email)
const getUserDisplayName = (user) => {
  // Check for both 'name' and 'fullName' fields
  const userName = user?.name || user?.fullName;
  if (userName && userName.trim() !== '') {
    return getFirstName(userName);
  }
  return 'User'; // Default fallback instead of showing email
};

// Helper to get user initials
const getUserInitials = (user) => {
  // Check for both 'name' and 'fullName' fields
  const userName = user?.name || user?.fullName;
  if (userName && userName.trim() !== '') {
    const names = userName.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return names[0].charAt(0).toUpperCase();
  }
  return 'U'; // Default fallback
};

// Helper to get profile image URL
const getProfileImageUrl = (user) => {
  // Primary field used throughout the application
  let imagePath = user?.photoUrl;
  
  // Fallback to other possible fields if photoUrl is not available
  if (!imagePath) {
    imagePath = user?.profileImage || user?.profile_image || user?.avatar || user?.photo || user?.image;
  }
  
  if (imagePath) {
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a relative path, construct the backend URL using environment variable
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'; // ✅ BEST PRACTICE
    let fullUrl;
    
    if (imagePath.startsWith('/')) {
      // Path starts with slash
      fullUrl = `${backendUrl}${imagePath}`;
    } else {
      // Path doesn't start with slash
      fullUrl = `${backendUrl}/${imagePath}`;
    }
    
    return fullUrl;
  }
  
  return null;
};

// Profile Image Component
const ProfileImage = ({ user, size = "w-9 h-9", textSize = "text-sm" }) => {
  const profileImageUrl = getProfileImageUrl(user);
  
  // Always render the container with fixed dimensions to prevent layout shift
  if (!profileImageUrl) {
    // Fallback to initials
    return (
      <div className={`${size} rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center shadow-md flex-shrink-0`}>
        <span className={`text-white font-semibold ${textSize}`}>
          {getUserInitials(user)}
        </span>
      </div>
    );
  }

  return (
    <div className={`${size} rounded-full overflow-hidden shadow-md relative bg-gradient-to-r from-green-500 to-blue-500 flex-shrink-0`}>
      <OptimizedImage
        src={profileImageUrl}
        alt={`${getUserDisplayName(user)}'s profile`}
        wrapperClassName="w-full h-full"
        className="w-full h-full object-cover"
        sizes="36px"
        loading="lazy"
        fallbackSrc={null}
      />
    </div>
  );
};

const Navbar = memo(({ isHome = false }) => {
  const { user, role, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const avatarRef = useRef(null);
  const location = useLocation();

  // Auto-detect if on home page
  const isHomePage = isHome || location.pathname === '/';
  
  // Detect if on a page with dark background (events, jobs, etc.)
  const isDarkBackgroundPage = ['/events', '/jobs', '/alumni', '/students'].includes(location.pathname);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDashboard = dashboardRoutes.includes(location.pathname);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setDropdownOpen(false);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDashboardRedirect = () => {
    const dashboardMap = {
      student: '/student/dashboard',
      faculty: '/faculty/dashboard',
      alumni: '/alumni/dashboard',
      admin: '/admin/dashboard',
    };
    navigate(dashboardMap[role] || '/');
  };

  // Profile Dropdown Component
  const ProfileDropdown = () => (
    <div className="absolute right-0 mt-3 w-64 max-w-[calc(100vw-2rem)] sm:max-w-xs rounded-2xl shadow-2xl border border-white/20 py-2 z-50 bg-white/95 backdrop-blur-xl animate-in fade-in duration-200 overflow-hidden dropdown-menu">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <ProfileImage user={user} size="w-10 h-10" textSize="text-sm" />
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-gray-900 truncate">
              {getUserDisplayName(user)}
            </p>
            <div className="flex items-center mt-1">
              <p className="text-xs text-gray-500 capitalize truncate">
                {role} 
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {!isDashboard && (
        <button
          onClick={() => { setDropdownOpen(false); handleDashboardRedirect(); }}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-green-700 transition-all duration-200"
        >
                           <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                 </svg>
          <span className="truncate">Dashboard</span>
        </button>
      )}
      
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-200"
      >
                 <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
         </svg>
        <span className="truncate">Logout</span>
      </button>
    </div>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHomePage || isDarkBackgroundPage
          ? 'bg-black/20 backdrop-blur-lg border-b border-white/10 shadow-lg' 
          : 'bg-transparent'
      }`}
      style={{ height: '64px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group hover:scale-105 transition-transform duration-300"
          >
            {/* Enhanced Brand Typography */}
            <div className="hidden sm:block">
              <div className="flex flex-col">
                <span className="text-xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 group-hover:from-primary-700 group-hover:to-secondary-700 transition-all duration-300">
                  Alumni Connect
                </span>
                <div className="flex items-center space-x-1 -mt-1">
                  <span className="text-xs font-medium font-body text-gray-500 group-hover:text-primary-600 transition-colors duration-300">
                    CUCEK Network
                  </span>
                  <div className="w-1 h-1 bg-primary-600 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>
            
            {/* Mobile Logo with Modern Touch */}
            <div className="block sm:hidden">
              <span className="text-lg font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                Alumni
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navLinks
              .filter(link => (!link.auth || user) && !(link.hideForStudent && user?.role === 'student'))
              .map((link) => {
                const isDashboardRoute = dashboardRoutes.includes(location.pathname);
                return (
                  <NavLink
                    key={link.title}
                    to={link.path}
                    className={({ isActive }) =>
                      `relative px-4 py-2 rounded-full text-sm font-semibold font-body transition-all duration-300 transform hover:scale-105 overflow-hidden ${
                        isActive && !isDashboardRoute
                          ? isDarkBackgroundPage
                            ? 'bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg text-white font-bold'
                            : 'bg-white/90 backdrop-blur-sm border border-primary-300/30 shadow-lg text-primary-700 font-bold'
                          : isDarkBackgroundPage
                            ? 'text-white/90 hover:bg-white/20 hover:shadow-md hover:text-white'
                            : 'text-gray-700 hover:bg-white/60 hover:shadow-md hover:text-primary-600'
                      }`
                    }
                    end={link.path === '/'}
                  >
                    {link.title}
                  </NavLink>
                );
              })}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative dropdown-container" ref={avatarRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center space-x-3 p-2 rounded-2xl backdrop-blur-xl border transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl ${
                    isDarkBackgroundPage
                      ? 'bg-white/20 border-white/30 hover:bg-white/30'
                      : 'bg-white/70 border-white/30 hover:bg-white/90'
                  }`}
                >
                  <ProfileImage user={user} size="w-8 h-8" textSize="text-xs" />
                  <span className={`hidden sm:block text-sm font-semibold font-body ${
                    isDarkBackgroundPage ? 'text-white' : 'text-gray-700'
                  }`}>
                    Hi, {getUserDisplayName(user)}
                  </span>
                  <svg className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''} ${
                    isDarkBackgroundPage ? 'text-white/70' : 'text-gray-500'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                </button>
                {dropdownOpen && <ProfileDropdown />}
              </div>
            ) : (
              <button
                onClick={() => navigate('/role-selection')}
                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-full text-sm font-semibold font-body hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Get Started
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-xl backdrop-blur-xl border transition-all duration-300 shadow-xl ${
                isDarkBackgroundPage
                  ? 'bg-white/20 border-white/30 hover:bg-white/30'
                  : 'bg-white/70 border-white/30 hover:bg-white/90'
              }`}
            >
                             {isMenuOpen ? (
                 <svg className={`w-5 h-5 ${isDarkBackgroundPage ? 'text-white' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               ) : (
                 <svg className={`w-5 h-5 ${isDarkBackgroundPage ? 'text-white' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                 </svg>
               )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`lg:hidden backdrop-blur-2xl mx-4 mt-2 rounded-3xl shadow-2xl border animate-in slide-in-from-top duration-300 ${
          isDarkBackgroundPage
            ? 'bg-white/10 border-white/20'
            : 'bg-white/95 border-white/40'
        }`}>
          <div className="py-4">
            {navLinks
              .filter(link => (!link.auth || user) && !(link.hideForStudent && user?.role === 'student'))
              .map((link) => {
                const isDashboardRoute = dashboardRoutes.includes(location.pathname);
                return (
                  <NavLink
                    key={link.title}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center px-6 py-3 text-sm font-semibold font-body transition-all duration-200 ${
                        isActive && !isDashboardRoute
                          ? isDarkBackgroundPage
                            ? 'bg-white/20 text-white mx-4 rounded-xl shadow-md border border-white/30'
                            : 'bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 mx-4 rounded-xl shadow-md border border-primary-200'
                          : isDarkBackgroundPage
                            ? 'text-white/90 hover:bg-white/20 hover:text-white mx-4 rounded-xl'
                            : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-primary-700 mx-4 rounded-xl'
                      }`
                    }
                    end={link.path === '/'}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.title}
                  </NavLink>
                );
              })}
          </div>

          {user && (
            <div className="border-t border-gray-200 pt-4 pb-4">
              {!isDashboard && (
                <button
                  onClick={() => { setIsMenuOpen(false); handleDashboardRedirect(); }}
                  className="w-full flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-green-700 mx-4 rounded-xl transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
               </svg>
                  Dashboard
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 mx-4 rounded-xl transition-all duration-200"
              >
                                 <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                 </svg>
                Logout
              </button>
            </div>
          )}

          {!user && (
            <div className="border-t border-gray-200 pt-4 pb-4 px-4">
                <button
                  onClick={() => { setIsMenuOpen(false); navigate('/role-selection'); }}
                  className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-6 rounded-xl text-sm font-semibold font-body hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 shadow-xl"
                >
                  Get Started
                </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
});

export default Navbar;