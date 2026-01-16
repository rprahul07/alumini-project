import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import {
  AcademicCapIcon,
  CalendarIcon,
  BriefcaseIcon,
  UserGroupIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import StudentMentorshipRequests from '../../components/mentorship/StudentMentorshipRequests';
import AppliedJobs from '../../components/opportunities/AppliedJobs';
import Events from '../../components/events/Events';
import MyActivityCard from '../../components/MyActivityCard';
import axios from '../../config/axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInteractionTracking, useAnalytics } from '../../hooks/useAnalytics';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Analytics tracking
  const { trackClick, trackHover } = useInteractionTracking('student_dashboard');
  const { trackEngagement } = useAnalytics();

  // Mobile tab state
  const [mainTab, setMainTab] = useState('mentorship');

  // Analytics tracking functions
  const handleTabChange = (tabName) => {
    trackClick(null, `dashboard_tab_${tabName}`);
    trackEngagement('dashboard_tab_change', {
      tab_name: tabName,
      user_role: 'student',
      dashboard_type: 'student_dashboard'
    });
    setMainTab(tabName);
  };

  const handleStatCardClick = (statTitle) => {
    trackClick(null, `stat_card_${statTitle.toLowerCase().replace(' ', '_')}`);
    trackEngagement('dashboard_stat_interaction', {
      stat_title: statTitle,
      user_role: 'student',
      dashboard_type: 'student_dashboard'
    });
  };

  // State for dynamic stats
  const [stats, setStats] = useState([
    {
      title: 'Events Attended',
      value: 0,
      Icon: CalendarIcon,
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-700',
    },
    {
      title: 'Jobs Applied',
      value: 0,
      Icon: BriefcaseIcon,
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-700',
    },
    {
      title: 'Mentorship Requests',
      value: 0,
      Icon: AcademicCapIcon,
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-700',
    },
    {
      title: 'Alumni Connected',
      value: 0,
      Icon: UserGroupIcon,
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-700',
    },
  ]);
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch profile data with stats when component mounts
  useEffect(() => {
    const fetchProfileWithStats = async () => {
      setStatsLoading(true);
      try {
        const response = await axios.get('/api/student/profile/get');
        if (response.data.success && response.data.data.dashboardStats) {
          const { dashboardStats } = response.data.data;

          setStats(prevStats => [
            { ...prevStats[0], value: dashboardStats.eventsRegistered },
            { ...prevStats[1], value: dashboardStats.jobsApplied },
            { ...prevStats[2], value: dashboardStats.mentorshipRequestsSent },
            { ...prevStats[3], value: dashboardStats.alumniBookmarked },
          ]);
        }
      } catch (error) {
        console.error('Error fetching student stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchProfileWithStats();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-roboto bg-slate-50 pt-16 relative overflow-hidden">
        {/* Light gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50"></div>
        {/* Animated background elements - Toned down */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-blue-100/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] bg-slate-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Mobile-First Layout */}
        <div className="relative z-10">
          {/* Mobile Layout */}
          <div className="lg:hidden">
            <div className="px-2 py-3 space-y-3">
              {/* Mobile Header with Beautiful Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm p-4 border border-slate-200 relative overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white rounded-2xl"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-base font-bold text-slate-900 mb-1 font-sans">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">{user?.fullName || 'Student'}</span>
                      </h1>
                      <p className="text-xs text-slate-900/70 font-sans">Manage your studies and connections</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center border-2 border-slate-300">
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
                className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm p-3 border border-slate-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-900/90 tracking-wider uppercase font-sans">Quick Stats</h3>
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></div>
                </div>

                {statsLoading ? (
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="bg-slate-100 rounded-lg p-2 animate-pulse">
                        <div className="w-6 h-6 bg-slate-200 rounded-lg mb-2"></div>
                        <div className="h-4 bg-slate-200 rounded mb-1"></div>
                        <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {stats.map((stat, i) => (
                      <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        onClick={() => handleStatCardClick(stat.title)}
                        onMouseEnter={() => trackHover(null, `stat_card_${stat.title.toLowerCase().replace(' ', '_')}`)}
                        className="bg-white backdrop-blur-sm rounded-lg p-2 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 group cursor-pointer shadow-sm"
                      >
                        <div className={`w-6 h-6 flex items-center justify-center rounded-lg ${stat.iconBg} mb-2 group-hover:scale-105 transition-transform duration-150`}>
                          <stat.Icon className={`w-2.5 h-2.5 ${stat.iconColor}`} />
                        </div>
                        <div className="text-base font-bold text-slate-900 mb-1 tracking-tight font-sans">{stat.value}</div>
                        <div className="text-xs font-medium text-slate-600 leading-tight">{stat.title}</div>
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
                className="bg-white/80 backdrop-blur-xl rounded-xl shadow-sm p-4 border border-slate-200 relative overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white rounded-2xl"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {user?.photoUrl ? (
                          <img
                            src={user.photoUrl}
                            alt={user.fullName || 'User'}
                            className="w-14 h-14 rounded-full object-cover border-2 border-slate-300 shadow-lg"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center border-2 border-slate-300 shadow-lg">
                            <UserIcon className="w-7 h-7 text-primary-400" />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-base font-bold text-slate-900 truncate font-sans">{user?.fullName || 'User'}</h2>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${user?.role?.toLowerCase() === 'student'
                            ? 'bg-blue-50 text-blue-600 border-blue-200'
                            : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                            }`}>
                            {user?.role || 'User'}
                          </span>
                          <span className="text-xs text-slate-900/60">•</span>
                          <span className="text-xs text-slate-900/60">Active</span>
                        </div>
                      </div>
                    </div>

                    {/* Edit Profile Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 text-slate-900 px-4 py-2 rounded-lg text-xs font-semibold shadow-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center space-x-1"
                      onClick={() => navigate('/profile/edit')}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </motion.button>
                  </div>

                  {/* Profile Details */}
                  <div className="grid grid-cols-2 gap-2">
                    {user?.student?.currentSemester && (
                      <div className="bg-slate-100 rounded-lg p-3">
                        <div className="text-xs text-slate-900/60 mb-1">Current Semester</div>
                        <div className="text-xs font-medium text-slate-900 truncate font-sans">Semester {user.student.currentSemester}</div>
                      </div>
                    )}
                    {user?.department && (
                      <div className="bg-slate-100 rounded-lg p-3">
                        <div className="text-xs text-slate-900/60 mb-1">Department</div>
                        <div className="text-xs font-medium text-slate-900 truncate font-sans">{user.department}</div>
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
                className="space-y-3"
              >
                {/* Tab Navigation */}
                <div className="bg-slate-100 backdrop-blur-xl rounded-2xl p-2 border border-slate-200">
                  <div className="flex gap-1">
                    {[
                      { key: 'mentorship', label: 'Mentorship', icon: AcademicCapIcon },
                      { key: 'opportunities', label: 'Jobs', icon: BriefcaseIcon },
                      { key: 'events', label: 'Events', icon: CalendarIcon },
                    ].map((feature) => (
                      <motion.button
                        key={feature.key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 flex items-center justify-center space-x-2 px-3 py-3 rounded-lg text-xs font-medium transition-all duration-200 ${mainTab === feature.key
                          ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-slate-900 shadow-lg'
                          : 'text-slate-900/70 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        onClick={() => handleTabChange(feature.key)}
                      >
                        <feature.icon className="w-4 h-4" />
                        <span>{feature.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200 min-h-[400px] overflow-hidden">
                  <div className="p-4 h-full overflow-y-auto scrollbar-hide">
                    {mainTab === 'mentorship' && <StudentMentorshipRequests />}
                    {mainTab === 'opportunities' && <AppliedJobs />}
                    {mainTab === 'events' && <Events />}
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
                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-6 border border-slate-200 relative overflow-hidden mb-4"
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white rounded-2xl"></div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            {user?.photoUrl ? (
                              <img
                                src={user.photoUrl}
                                alt={user.fullName || 'User'}
                                className="w-16 h-16 rounded-full object-cover border-2 border-slate-300 shadow-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center border-2 border-slate-300 shadow-lg">
                                <UserIcon className="w-8 h-8 text-primary-400" />
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h2 className="text-base font-bold text-slate-900 truncate font-sans">{user?.fullName || 'User'}</h2>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${user?.role?.toLowerCase() === 'student'
                                ? 'bg-blue-50 text-blue-600 border-blue-200'
                                : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                                }`}>
                                {user?.role || 'User'}
                              </span>
                              <span className="text-xs text-slate-900/60">•</span>
                              <span className="text-xs text-slate-900/60">Active</span>
                            </div>
                          </div>
                        </div>

                        {/* Edit Profile Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 text-slate-900 px-3 py-2 rounded-lg text-xs font-semibold shadow-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 flex items-center space-x-1"
                          onClick={() => navigate('/profile/edit')}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </motion.button>
                      </div>

                      {/* Profile Details */}
                      <div className="grid grid-cols-2 gap-2">
                        {user?.student?.currentSemester && (
                          <div className="bg-slate-100 rounded-lg p-3">
                            <div className="text-xs text-slate-900/60 mb-1">Current Semester</div>
                            <div className="text-xs font-medium text-slate-900 truncate font-sans">Semester {user.student.currentSemester}</div>
                          </div>
                        )}
                        {user?.department && (
                          <div className="bg-slate-100 rounded-lg p-3">
                            <div className="text-xs text-slate-900/60 mb-1">Department</div>
                            <div className="text-xs font-medium text-slate-900 truncate font-sans">{user.department}</div>
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
                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-5 border border-slate-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold text-slate-900/90 tracking-wider uppercase font-sans">Quick Stats</h3>
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></div>
                    </div>

                    {statsLoading ? (
                      <div className="grid grid-cols-2 gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="bg-slate-100 rounded-lg p-2 animate-pulse">
                            <div className="w-6 h-6 bg-slate-200 rounded-lg mb-2"></div>
                            <div className="h-4 bg-slate-200 rounded mb-1"></div>
                            <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {stats.map((stat, i) => (
                          <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                            onClick={() => handleStatCardClick(stat.title)}
                            onMouseEnter={() => trackHover(null, `stat_card_${stat.title.toLowerCase().replace(' ', '_')}`)}
                            className="bg-white backdrop-blur-sm rounded-lg p-3 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 group cursor-pointer shadow-sm"
                          >
                            <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${stat.iconBg} mb-3 group-hover:scale-110 transition-transform duration-150`}>
                              <stat.Icon className={`w-4 h-4 ${stat.iconColor}`} />
                            </div>
                            <div className="text-2xl font-bold text-slate-900 mb-1 tracking-tight font-sans">{stat.value}</div>
                            <div className="text-xs font-medium text-slate-600 leading-tight">{stat.title}</div>
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
                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm p-6 border border-slate-200 relative overflow-hidden"
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white rounded-2xl"></div>

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h1 className="text-lg font-bold text-slate-900 mb-2 font-sans">
                          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">{user?.fullName || 'Student'}</span>
                        </h1>

                      </div>
                      <div className="hidden md:flex flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center border-2 border-slate-300 shadow-lg">
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
                    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200 flex-1 p-5 flex flex-col overflow-hidden"
                  >
                    <MyActivityCard
                      features={[
                        { key: 'mentorship', label: 'Mentorship', component: <StudentMentorshipRequests /> },
                        { key: 'opportunities', label: 'Jobs', component: <AppliedJobs /> },
                        { key: 'events', label: 'Events', component: <Events /> },
                      ]}
                      defaultTab="mentorship"
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

export default StudentDashboard;