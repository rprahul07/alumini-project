import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ProfileCard from '../../components/ProfileCard';
import Sidebar from '../../components/Sidebar';
import {
  UserGroupIcon,
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  XCircleIcon,
  ArrowRightIcon,
  AcademicCapIcon,
  UserIcon,
  XMarkIcon,
  CheckIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PhoneIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import useAlert from '../../hooks/useAlert';
import axios from '../../config/axios';
import MentorshipRequestModal from '../../components/MentorshipRequestModal';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MentorshipRequests from '../../components/mentorship/MentorshipRequests';
import MyActivityCard from '../../components/MyActivityCard';
import Opportunities from '../../components/opportunities/Opportunities';
import Events from '../../components/events/Events';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TIERS = [
  {
    value: 1,
    name: 'Basic',
    description: 'Share your professional email address with the mentee.'
  },
  {
    value: 2,
    name: 'Advanced',
    description: 'Share your professional email and LinkedIn profile.'
  },
  {
    value: 3,
    name: 'Premium',
    description: 'Share your professional email, LinkedIn, and WhatsApp contact.'
  }
];

const roleColors = {
  student: 'bg-blue-100 text-blue-700',
  alumni: 'bg-green-100 text-green-700',
  faculty: 'bg-purple-100 text-purple-700',
  admin: 'bg-gray-200 text-gray-700',
};
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-gray-200 text-gray-500',
};
const tierLabels = ['', 'Basic', 'Advanced', 'Premium'];

// --- EventCard Component ---
const EventCard = ({ date, title, time, location, tags }) => {
  const [month, day] = date.split(' ');

  return (
    <article className="flex items-start space-x-5 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
      <div
        className="flex-shrink-0 w-20 h-20 bg-indigo-50 rounded-xl flex flex-col items-center justify-center border border-indigo-100"
        aria-label={`Event date: ${month} ${day}`}
      >
        <div className="text-sm font-semibold text-indigo-700 uppercase leading-none">{month}</div>
        <div className="text-3xl font-bold text-indigo-900 leading-none mt-1">{day}</div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <div className="space-y-1 text-gray-600">
          <div className="flex items-center text-sm" aria-label={`Time: ${time}`}>
            <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
            <time>{time}</time>
          </div>
          <div className="flex items-center text-sm" aria-label={`Location: ${location}`}>
            <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span>{location}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

// --- MentorshipRequestCard Component ---
const MentorshipRequestCard = ({ studentName, department, semester, message, onAccept, onReject }) => (
  <article className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
    <div className="flex-shrink-0">
      <img
        src="/default-avatar.png"
        alt={`Photo of student ${studentName}`}
        className="w-14 h-14 rounded-full object-cover border border-gray-200"
      />
    </div>

    <div className="flex-1">
      <h3 className="text-base font-semibold text-gray-900">{studentName}</h3>
      <p className="text-sm text-gray-500 mt-0.5">{department} • Semester {semester}</p>
      <p className="text-sm text-gray-700 mt-2 leading-relaxed">{message}</p>
      <div className="flex gap-3 mt-4">
        <button
          onClick={onAccept}
          className="flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition-colors duration-200 shadow-sm"
          aria-label={`Accept mentorship request from ${studentName}`}
        >
          <CheckCircleIcon className="h-4 w-4 mr-2" />
          Accept
        </button>
        <button
          onClick={onReject}
          className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 transition-colors duration-200 shadow-sm"
          aria-label={`Reject mentorship request from ${studentName}`}
        >
          <XCircleIcon className="h-4 w-4 mr-2" />
          Reject
        </button>
      </div>
    </div>
  </article>
);

// --- TabbedBoard Component ---
// const TabbedBoard = ({ jobs, showAlert }) => {
//   ...
// };

// --- AlumniDashboard Main Component ---
const AlumniDashboard = () => {
  const { user } = useAuth();
  const { showAlert, AlertComponent } = useAlert();
  const navigate = useNavigate();
  
  // Mobile tab state
  const [mainTab, setMainTab] = useState('opportunities');
  
  // ✅ State for dynamic stats
  const [stats, setStats] = useState([
    {
      title: 'Mentorships Given',
      value: 0,
      Icon: AcademicCapIcon,
      iconBg: 'bg-gradient-to-br from-primary-200 to-secondary-200',
      iconColor: 'text-primary-600',
    },
    {
      title: 'Events Created',
      value: 0,
      Icon: CalendarIcon,
      iconBg: 'bg-gradient-to-br from-accent-100 to-primary-100',
      iconColor: 'text-accent-500',
    },
    {
      title: 'Jobs Posted',
      value: 0,
      Icon: BriefcaseIcon,
      iconBg: 'bg-gradient-to-br from-secondary-100 to-primary-100',
      iconColor: 'text-secondary-600',
    },
    {
      title: 'Student Connections',
      value: 0,
      Icon: UserGroupIcon,
      iconBg: 'bg-gradient-to-br from-primary-100 to-accent-100',
      iconColor: 'text-primary-600',
    },
  ]);
  const [statsLoading, setStatsLoading] = useState(true);

  // ✅ Fetch profile data with stats when component mounts
  useEffect(() => {
    const fetchProfileWithStats = async () => {
      setStatsLoading(true);
      try {
        // Use existing profile API that now includes stats
        const response = await axios.get('/api/alumni/profile/get');
        if (response.data.success && response.data.data.dashboardStats) {
          const { dashboardStats } = response.data.data;
          
          // Update stats with real data
          setStats(prevStats => [
            { ...prevStats[0], value: dashboardStats.mentorshipRequests },
            { ...prevStats[1], value: dashboardStats.eventsCreated },
            { ...prevStats[2], value: dashboardStats.jobsPosted },
            { ...prevStats[3], value: dashboardStats.bookmarksReceived },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch profile with stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchProfileWithStats();
  }, []);


  return (
    <>
      <Navbar />
      <div className="min-h-screen font-roboto bg-gray-50 pt-16 relative overflow-hidden">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
        
        {/* Mobile-First Layout */}
        <div className="relative z-10">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            <div className="px-3 py-4 space-y-4">
              {/* Mobile Header with Beautiful Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-white/20 relative overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-2xl"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary-400/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-bold text-white mb-1">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">{user?.fullName || 'Alumni'}</span>
                      </h1>
                      <p className="text-sm text-white/70">Manage your activities and connections</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center border-2 border-white/30">
                      <UserIcon className="w-6 h-6 text-primary-400" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Mobile Stats - Enhanced Design */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-white/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white/90 tracking-wider uppercase">Quick Stats</h3>
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 animate-pulse"></div>
                </div>
                
                {statsLoading ? (
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="bg-white/10 rounded-xl p-3 animate-pulse">
                        <div className="w-6 h-6 bg-white/20 rounded-lg mb-2"></div>
                        <div className="h-4 bg-white/20 rounded mb-1"></div>
                        <div className="h-3 bg-white/20 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {stats.map((stat, i) => (
                      <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-200 group cursor-pointer"
                      >
                        <div className={`w-6 h-6 flex items-center justify-center rounded-lg ${stat.iconBg} mb-2 group-hover:scale-105 transition-transform duration-150`}>
                          <stat.Icon className={`w-3 h-3 ${stat.iconColor}`} />
                        </div>
                        <div className="text-lg font-bold text-white mb-1 tracking-tight">{stat.value}</div>
                        <div className="text-xs font-medium text-gray-300 leading-tight">{stat.title}</div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Mobile Profile Card - Beautiful Design */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-white/20 relative overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-primary-500/10 rounded-2xl"></div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent-400/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {user?.photoUrl ? (
                          <img
                            src={user.photoUrl}
                            alt={user.fullName || 'User'}
                            className="w-14 h-14 rounded-full object-cover border-2 border-white/30 shadow-lg"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center border-2 border-white/30 shadow-lg">
                            <UserIcon className="w-7 h-7 text-primary-400" />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-white truncate">{user?.fullName || 'User'}</h2>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${
                            user?.role?.toLowerCase() === 'alumni'
                              ? 'bg-green-500/20 text-green-300 border-green-500/30'
                              : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                          }`}>
                            {user?.role || 'User'}
                          </span>
                          <span className="text-xs text-white/60">•</span>
                          <span className="text-xs text-white/60">Active</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Edit Profile Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center space-x-1"
                      onClick={() => navigate('/profile/edit')}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </motion.button>
                  </div>
                  
                  {/* Profile Details */}
                  <div className="grid grid-cols-2 gap-3">
                    {user?.alumni?.currentJobTitle && (
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-xs text-white/60 mb-1">Current Role</div>
                        <div className="text-sm font-medium text-white truncate">{user.alumni.currentJobTitle}</div>
                      </div>
                    )}
                    {user?.alumni?.companyName && (
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-xs text-white/60 mb-1">Company</div>
                        <div className="text-sm font-medium text-white truncate">{user.alumni.companyName}</div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Mobile Activity Tabs - Enhanced Design */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-4"
              >
                {/* Tab Navigation */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
                  <div className="flex gap-1">
                    {[
                      { key: 'opportunities', label: 'Opportunities', icon: BriefcaseIcon },
                      { key: 'events', label: 'Events', icon: CalendarIcon },
                      { key: 'mentorships', label: 'Mentorships', icon: AcademicCapIcon },
                    ].map((feature) => (
                      <motion.button
                        key={feature.key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 flex items-center justify-center space-x-2 px-3 py-3 rounded-xl text-xs font-medium transition-all duration-200 ${
                          mainTab === feature.key 
                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg' 
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                        onClick={() => setMainTab(feature.key)}
                      >
                        <feature.icon className="w-4 h-4" />
                        <span>{feature.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 min-h-[400px] overflow-hidden">
                  <div className="p-4 h-full overflow-y-auto scrollbar-hide">
                    {mainTab === 'opportunities' && <Opportunities />}
                    {mainTab === 'events' && <Events />}
                    {mainTab === 'mentorships' && <MentorshipRequests />}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6 min-h-[600px] items-start">
            {/* Sidebar: Profile + Stats */}
            <div className="flex flex-col w-full lg:w-80 min-w-0">
                  {/* Enhanced Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                    className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20 relative overflow-hidden mb-4"
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-500/10 to-primary-500/10 rounded-2xl"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent-400/20 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            {user?.photoUrl ? (
                              <img
                                src={user.photoUrl}
                                alt={user.fullName || 'User'}
                                className="w-16 h-16 rounded-full object-cover border-2 border-white/30 shadow-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center border-2 border-white/30 shadow-lg">
                                <UserIcon className="w-8 h-8 text-primary-400" />
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-bold text-white truncate">{user?.fullName || 'User'}</h2>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${
                                user?.role?.toLowerCase() === 'alumni'
                                  ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                  : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                              }`}>
                                {user?.role || 'User'}
                              </span>
                              <span className="text-xs text-white/60">•</span>
                              <span className="text-xs text-white/60">Active</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Edit Profile Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center space-x-1"
                          onClick={() => navigate('/profile/edit')}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </motion.button>
                      </div>
                      
                      {/* Profile Details */}
                      <div className="grid grid-cols-2 gap-3">
                        {user?.alumni?.currentJobTitle && (
                          <div className="bg-white/10 rounded-lg p-3">
                            <div className="text-xs text-white/60 mb-1">Current Role</div>
                            <div className="text-sm font-medium text-white truncate">{user.alumni.currentJobTitle}</div>
                          </div>
                        )}
                        {user?.alumni?.companyName && (
                          <div className="bg-white/10 rounded-lg p-3">
                            <div className="text-xs text-white/60 mb-1">Company</div>
                            <div className="text-sm font-medium text-white truncate">{user.alumni.companyName}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Enhanced Stats Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-5 border border-white/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-white/90 tracking-wider uppercase">Quick Stats</h3>
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 animate-pulse"></div>
                    </div>
                    
                    {statsLoading ? (
                      <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="bg-white/10 rounded-xl p-3 animate-pulse">
                            <div className="w-6 h-6 bg-white/20 rounded-lg mb-2"></div>
                            <div className="h-4 bg-white/20 rounded mb-1"></div>
                            <div className="h-3 bg-white/20 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                      <div className="grid grid-cols-2 gap-3">
                    {stats.map((stat, i) => (
                      <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-200 group cursor-pointer"
                      >
                            <div className={`w-6 h-6 flex items-center justify-center rounded-lg ${stat.iconBg} mb-2 group-hover:scale-105 transition-transform duration-150`}>
                          <stat.Icon className={`w-3 h-3 ${stat.iconColor}`} />
                        </div>
                            <div className="text-lg font-bold text-white mb-1 tracking-tight">{stat.value}</div>
                        <div className="text-xs font-medium text-gray-300 leading-tight">{stat.title}</div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
            
            {/* Main Content: Welcome + Activity */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
                  {/* Enhanced Welcome Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20 relative overflow-hidden"
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-2xl"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary-400/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
                    
                    <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">{user?.fullName || 'Alumni'}</span>
                  </h1>
                        <p className="text-sm text-white/70 mb-4">Manage your activities and connections</p>
                  <div className="w-full max-w-sm">
                    <div className="w-full h-2 bg-white/20 rounded-full">
                      <div className="h-2 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 transition-all duration-300" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center border-2 border-white/30 shadow-lg">
                          <UserIcon className="w-8 h-8 text-primary-400" />
                        </div>
                  </div>
                </div>
              </motion.div>
              
                  {/* Enhanced Activity Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 flex-1 p-5 flex flex-col overflow-hidden"
              >
                <MyActivityCard
                  features={[
                    { key: 'opportunities', label: 'Opportunities', component: <Opportunities /> },
                    { key: 'events', label: 'Events', component: <Events /> },
                    { key: 'mentorships', label: 'Mentorships', component: <MentorshipRequests /> },
                  ]}
                  defaultTab="opportunities"
                />
              </motion.div>
                </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AlumniDashboard; 