import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import "@fortawesome/fontawesome-free/css/all.min.css";

// Navbar Animation Styles
const navbarAnimationStyles = `
  @keyframes slideDown {
    0% { transform: translateY(-100%); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes fadeIn {
    0% { opacity: 0; transform: scale(0.95); }
    100% { opacity: 1; transform: scale(1); }
  }

  @keyframes logoFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-2px); }
  }

  .nav-slide-down {
    animation: slideDown 0.3s ease-out;
  }

  .dropdown-fade-in {
    animation: fadeIn 0.2s ease-out;
  }

  .logo-float:hover {
    animation: logoFloat 0.6s ease-in-out;
  }

  .nav-link-hover {
    position: relative;
    overflow: hidden;
  }

  .nav-link-hover::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  .nav-link-hover:hover::before {
    left: 100%;
  }

  .nav-link-active {
    position: relative;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(99, 102, 241, 0.3);
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.2);
  }

  .nav-link-active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 3px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    border-radius: 2px;
    animation: activeIndicator 0.3s ease-out;
  }

  @keyframes activeIndicator {
    0% { width: 0; opacity: 0; }
    100% { width: 20px; opacity: 1; }
  }

  .glassmorphism-nav {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1);
  }

  .mobile-menu-glassmorphism {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .profile-dropdown-glassmorphism {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 20px 40px rgba(99, 102, 241, 0.15);
  }
`;

// Inject navbar styles
if (typeof document !== 'undefined') {
  const existingNavbarStyles = document.querySelector('#navbar-styles');
  if (!existingNavbarStyles) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "navbar-styles";
    styleSheet.innerText = navbarAnimationStyles;
    document.head.appendChild(styleSheet);
  }
}

const navLinks = [
  { title: 'Home', path: '/', icon: 'fas fa-home' },
  { title: 'Events', path: '/events', icon: 'fas fa-calendar-alt' },
  { title: 'Jobs', path: '/jobs', auth: true, icon: 'fas fa-briefcase' },
  { title: 'About Us', path: '/about', icon: 'fas fa-info-circle' },
  { title: 'Alumni', path: '/alumni', auth: true, icon: 'fas fa-graduation-cap' },
  { title: 'Students', path: '/students', auth: true, hideForStudent: true, icon: 'fas fa-user-graduate' },
  { title: 'Contact', path: '/contact', icon: 'fas fa-envelope' },
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
    
    // If it's a relative path, construct the backend URL
    const backendUrl = 'http://localhost:5000'; // Adjust this to your backend URL
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
  const [imageError, setImageError] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(false);
  const [currentImageUrl, setCurrentImageUrl] = React.useState(null);
  const profileImageUrl = getProfileImageUrl(user);
  
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Only reset states when the actual image URL changes (not on every re-render)
  React.useEffect(() => {
    if (profileImageUrl !== currentImageUrl) {
      setCurrentImageUrl(profileImageUrl);
      if (profileImageUrl) {
        setImageError(false);
        setImageLoading(true);
      } else {
        setImageError(true);
        setImageLoading(false);
      }
    }
  }, [profileImageUrl, currentImageUrl]);

  if (!profileImageUrl || imageError) {
    // Fallback to initials
    return (
      <div className={`${size} rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-md`}>
        <span className={`text-white font-semibold ${textSize}`}>
          {getUserInitials(user)}
        </span>
      </div>
    );
  }

  return (
    <div className={`${size} rounded-full overflow-hidden shadow-md relative bg-gradient-to-r from-indigo-500 to-purple-500`}>
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500">
          <span className={`text-white font-semibold ${textSize}`}>
            {getUserInitials(user)}
          </span>
        </div>
      )}
      <img
        src={profileImageUrl}
        alt={`${getUserDisplayName(user)}'s profile`}
        className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
      />
    </div>
  );
};

const Navbar = ({ isHome = false }) => {
  const { user, role, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const avatarRef = useRef(null);
  const location = useLocation();

  // Handle body padding based on current route
  useEffect(() => {
    const isHomePage = location.pathname === '/';
    if (isHomePage) {
      document.body.style.paddingTop = '0';
    } else {
      document.body.style.paddingTop = '64px';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.paddingTop = '0';
    };
  }, [location.pathname]);

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
    <div className="profile-dropdown-glassmorphism absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl border border-white/20 py-2 z-50 dropdown-fade-in">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <ProfileImage user={user} size="w-10 h-10" textSize="text-sm" />
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-gray-900 truncate">
              {getUserDisplayName(user)}
            </p>
            <div className="flex items-center mt-1">
              <p className="text-xs text-gray-500 capitalize">
                {role} 
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {!isDashboard && (
        <button
          onClick={() => { setDropdownOpen(false); handleDashboardRedirect(); }}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 rounded-xl mx-2 transition-all duration-200"
        >
          <i className="fas fa-tachometer-alt text-indigo-500"></i>
          Dashboard
        </button>
      )}
      
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 rounded-xl mx-2 transition-all duration-200"
      >
        <i className="fas fa-sign-out-alt text-red-500"></i>
        Logout
      </button>
    </div>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome 
          ? 'glassmorphism-nav shadow-xl' 
          : 'bg-transparent'
      }`}
      style={{ height: '64px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 logo-float group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <i className="fas fa-graduation-cap text-white text-lg"></i>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                CUCEK
              </span>
              <div className="text-sm text-gray-600 -mt-1">Alumni Connect</div>
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
                      `nav-link-hover relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                        isActive && !isDashboardRoute
                          ? 'nav-link-active text-indigo-700 font-semibold'
                          : 'text-gray-700 hover:bg-white/60 hover:shadow-md hover:text-indigo-600'
                      }`
                    }
                    end={link.path === '/'}
                  >
                    <i className={`${link.icon} mr-2`}></i>
                    {link.title}
                  </NavLink>
                );
              })}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={avatarRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <ProfileImage user={user} size="w-8 h-8" textSize="text-xs" />
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    Hi, {getUserDisplayName(user)}
                  </span>
                  <i className={`fas fa-chevron-down text-xs text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}></i>
                </button>
                {dropdownOpen && <ProfileDropdown />}
              </div>
            ) : (
              <button
                onClick={() => navigate('/role-selection')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <i className="fas fa-rocket mr-2"></i>
                Get Started
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all duration-300 shadow-lg"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-gray-700`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mobile-menu-glassmorphism mx-4 mt-2 rounded-2xl shadow-2xl border border-white/30 nav-slide-down">
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
                      `flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive && !isDashboardRoute
                          ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 mx-4 rounded-xl shadow-md border border-indigo-200'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 mx-4 rounded-xl'
                      }`
                    }
                    end={link.path === '/'}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className={`${link.icon} mr-3 w-4`}></i>
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
                  className="w-full flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 mx-4 rounded-xl transition-all duration-200"
                >
                  <i className="fas fa-tachometer-alt mr-3 text-indigo-500"></i>
                  Dashboard
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 mx-4 rounded-xl transition-all duration-200"
              >
                <i className="fas fa-sign-out-alt mr-3 text-red-500"></i>
                Logout
              </button>
            </div>
          )}

          {!user && (
            <div className="border-t border-gray-200 pt-4 pb-4 px-4">
              <button
                onClick={() => { setIsMenuOpen(false); navigate('/role-selection'); }}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                <i className="fas fa-rocket mr-2"></i>
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;