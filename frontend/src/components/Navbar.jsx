import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import OptimizedImage from './OptimizedImage';
import { useInteractionTracking } from '../hooks/useAnalytics';
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
        const backendUrl = import.meta.env.VITE_API_BASE_URL || 'https://alumini-project.onrender.com'; // ✅ BEST PRACTICE
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
    const { trackClick, trackHover } = useInteractionTracking('navigation');

    // Auto-detect if on home page
    const isHomePage = isHome || location.pathname === '/';

    // Detect if on a page with dark background (events, jobs, home, etc.)
    const isDarkBackgroundPage = ['/', '/events', '/jobs', '/alumni', '/students'].includes(location.pathname);

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
            trackClick(null, 'logout_button');
            await logout();
            navigate('/');
            setDropdownOpen(false);
            setIsMenuOpen(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Handle navigation clicks
    const handleNavClick = (linkTitle, linkPath) => {
        trackClick(null, `nav_${linkTitle.toLowerCase().replace(' ', '_')}`);
        navigate(linkPath);
    };

    // Handle get started button
    const handleGetStarted = () => {
        trackClick(null, 'get_started_button');
        navigate('/role-selection');
    };

    // Handle mobile menu toggle
    const handleMobileMenuToggle = () => {
        trackClick(null, 'mobile_menu_toggle');
        setIsMenuOpen(!isMenuOpen);
    };

    // Handle user dropdown toggle
    const handleUserDropdownToggle = () => {
        trackClick(null, 'user_dropdown_toggle');
        setDropdownOpen(!dropdownOpen);
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
        <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] sm:max-w-xs rounded-2xl shadow-2xl border border-white/20 py-1.5 z-[60] bg-white/95 backdrop-blur-xl animate-in fade-in duration-200 overflow-hidden dropdown-menu">
            <div className="px-3 py-2 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                    <ProfileImage user={user} size="w-8 h-8" textSize="text-xs" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-black truncate font-sans">
                            {getUserDisplayName(user)}
                        </p>
                        <div className="flex items-center mt-0.5">
                            <p className="text-xs text-black capitalize truncate font-sans">
                                {role}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {!isDashboard && (
                <button
                    onClick={() => { setDropdownOpen(false); handleDashboardRedirect(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-black hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-green-700 transition-all duration-200 font-sans"
                >
                    <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="truncate">Dashboard</span>
                </button>
            )}

            <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-black hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-200 font-sans"
            >
                <svg className="w-3.5 h-3.5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="truncate">Logout</span>
            </button>
        </div>
    );

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-14 ${scrolled || !isHomePage || isDarkBackgroundPage
                ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    {/* Logo Section */}
                    <Link
                        to="/"
                        className="flex items-center space-x-2 group hover:scale-105 transition-transform duration-300"
                    >
                        {/* Enhanced Brand Typography */}
                        <div className="hidden sm:block">
                            <div className="flex flex-col">
                                <span className="text-lg font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 group-hover:from-primary-700 group-hover:to-secondary-700 transition-all duration-300">
                                    Alumni Connect
                                </span>
                                <div className="flex items-center space-x-1 -mt-0.5">
                                    <span className="text-xs font-medium font-sans text-black group-hover:text-primary-600 transition-colors duration-300">
                                        CUCEK Network
                                    </span>
                                    <div className="w-1 h-1 bg-primary-600 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Logo with Modern Touch */}
                        <div className="block sm:hidden">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                                    Alumni Connect
                                </span>
                                <div className="flex items-center space-x-1 -mt-0.5">
                                    <span className="text-xs font-medium font-sans text-black">
                                        Alumni Network
                                    </span>
                                </div>
                            </div>
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
                                        onClick={() => trackClick(null, `nav_${link.title.toLowerCase().replace(' ', '_')}`)}
                                        className={({ isActive }) =>
                                            `relative px-4 py-2 rounded-full text-sm font-semibold font-sans transition-all duration-300 transform hover:scale-105 overflow-hidden ${isActive && !isDashboardRoute
                                                ? isDarkBackgroundPage
                                                    ? 'bg-primary-100 backdrop-blur-sm border border-primary-200 shadow-lg text-primary-700 font-bold'
                                                    : 'bg-primary-50 backdrop-blur-sm border border-primary-200 shadow-lg text-primary-700 font-bold'
                                                : isDarkBackgroundPage
                                                    ? 'text-black hover:bg-primary-50 hover:shadow-md hover:text-primary-600'
                                                    : 'text-black hover:bg-slate-50 hover:shadow-md hover:text-primary-600'
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
                    <div className="flex items-center space-x-3">
                        {user ? (
                            <div className="relative dropdown-container" ref={avatarRef}>
                                <button
                                    onClick={handleUserDropdownToggle}
                                    className={`flex items-center space-x-2 p-1.5 rounded-full backdrop-blur-xl border transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl ${isDarkBackgroundPage
                                        ? 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                        }`}
                                >
                                    <ProfileImage user={user} size="w-7 h-7" textSize="text-xs" />
                                    <span className={`hidden sm:block text-xs font-semibold font-sans ${isDarkBackgroundPage ? 'text-black' : 'text-black'
                                        }`}>
                                        Hi, {getUserDisplayName(user)}
                                    </span>
                                    <svg className={`w-2.5 h-2.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''} ${isDarkBackgroundPage ? 'text-black' : 'text-black'
                                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {dropdownOpen && <ProfileDropdown />}
                            </div>
                        ) : (
                            <button
                                onClick={handleGetStarted}
                                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold font-sans hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                            >
                                Get Started
                            </button>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={handleMobileMenuToggle}
                            className={`lg:hidden p-1.5 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-xl ${isDarkBackgroundPage
                                ? 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                }`}
                        >
                            {isMenuOpen ? (
                                <svg className={`w-4 h-4 ${isDarkBackgroundPage ? 'text-black' : 'text-black'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className={`w-4 h-4 ${isDarkBackgroundPage ? 'text-black' : 'text-black'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className={`lg:hidden backdrop-blur-2xl mx-3 mt-1.5 rounded-2xl shadow-2xl border animate-in slide-in-from-top duration-300 z-[60] ${isDarkBackgroundPage
                    ? 'bg-white/95 border-slate-200'
                    : 'bg-white/95 border-slate-200'
                    }`}>
                    <div className="py-3">
                        {navLinks
                            .filter(link => (!link.auth || user) && !(link.hideForStudent && user?.role === 'student'))
                            .map((link) => {
                                const isDashboardRoute = dashboardRoutes.includes(location.pathname);
                                return (
                                    <NavLink
                                        key={link.title}
                                        to={link.path}
                                        onClick={() => {
                                            trackClick(null, `mobile_nav_${link.title.toLowerCase().replace(' ', '_')}`);
                                            setIsMenuOpen(false);
                                        }}
                                        className={({ isActive }) =>
                                            `flex items-center px-4 py-2 text-xs font-semibold font-sans transition-all duration-200 ${isActive && !isDashboardRoute
                                                ? 'bg-primary-50 text-primary-700 mx-3 rounded-lg shadow-md border border-primary-200'
                                                : 'text-black hover:bg-slate-50 hover:text-primary-600 mx-3 rounded-lg'
                                            }`
                                        }
                                        end={link.path === '/'}
                                    >
                                        {link.title}
                                    </NavLink>
                                );
                            })}
                    </div>

                    {user && (
                        <div className="border-t border-slate-200 pt-3 pb-3">
                            {!isDashboard && (
                                <button
                                    onClick={() => { setIsMenuOpen(false); handleDashboardRedirect(); }}
                                    className="w-full flex items-center px-4 py-2 text-xs font-medium text-black hover:bg-slate-50 hover:text-primary-600 mx-3 rounded-lg transition-all duration-200"
                                >
                                    <svg className="w-3.5 h-3.5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Dashboard
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-2 text-xs font-medium text-black hover:bg-slate-50 hover:text-accent-600 mx-3 rounded-lg transition-all duration-200"
                            >
                                <svg className="w-3.5 h-3.5 mr-2 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    )}

                    {!user && (
                        <div className="border-t border-slate-200 pt-3 pb-3 px-3">
                            <button
                                onClick={() => { setIsMenuOpen(false); navigate('/role-selection'); }}
                                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-2 px-4 rounded-full text-xs font-semibold font-sans hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 shadow-xl"
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
