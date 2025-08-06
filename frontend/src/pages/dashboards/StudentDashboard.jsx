import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ProfileCard from '../../components/ProfileCard';
import { AcademicCapIcon, CalendarIcon, BriefcaseIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import StudentMentorshipRequests from '../../components/mentorship/StudentMentorshipRequests';
import AppliedJobs from '../../components/opportunities/AppliedJobs';
import Events from '../../components/events/Events';
import MyActivityCard from '../../components/MyActivityCard';
import axios from '../../config/axios';

const StudentDashboard = () => {
  const { user } = useAuth();
  
  // ✅ State for dynamic stats
  const [stats, setStats] = useState([
    {
      title: 'Events Attended',
      value: 0,
      Icon: CalendarIcon,
      iconBg: 'bg-gradient-to-br from-pink-100 to-purple-100',
      iconColor: 'text-pink-500',
    },
    {
      title: 'Jobs Applied',
      value: 0,
      Icon: BriefcaseIcon,
      iconBg: 'bg-gradient-to-br from-blue-100 to-indigo-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Mentorship Requests',
      value: 0,
      Icon: AcademicCapIcon,
      iconBg: 'bg-gradient-to-br from-indigo-200 to-purple-200',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Alumni Connected',
      value: 0,
      Icon: UserGroupIcon,
      iconBg: 'bg-gradient-to-br from-green-100 to-emerald-100',
      iconColor: 'text-green-600',
    },
  ]);
  const [statsLoading, setStatsLoading] = useState(true);

  // ✅ Fetch profile data with stats when component mounts
  useEffect(() => {
    const fetchProfileWithStats = async () => {
      setStatsLoading(true);
      try {
        // Use existing profile API that now includes stats
        const response = await axios.get('/api/student/profile/get');
        if (response.data.success && response.data.data.dashboardStats) {
          const { dashboardStats } = response.data.data;
          
          // Update stats with real data
          setStats(prevStats => [
            { ...prevStats[0], value: dashboardStats.eventsRegistered },
            { ...prevStats[1], value: dashboardStats.jobsApplied },
            { ...prevStats[2], value: dashboardStats.mentorshipRequestsSent },
            { ...prevStats[3], value: dashboardStats.alumniBookmarked },
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

  const mentorshipsCompleted = stats[2]?.value || 0;
  const mentorshipsGoal = 20;
  const mentorshipProgress = Math.min(100, Math.round((mentorshipsCompleted / mentorshipsGoal) * 100));

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-roboto bg-gradient-to-br from-purple-50 to-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6 min-h-[600px] items-start">
            {/* Sidebar: Profile + Stats */}
            <div className="flex flex-col w-full lg:w-80 min-w-0">
              <ProfileCard />
              {/* Stats Section - Compact Design */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 mt-4 border border-gray-200/50">
                <h3 className="text-xs font-bold text-gray-700 mb-3 tracking-wider uppercase">Quick Stats</h3>
                {statsLoading ? (
                  // Loading skeleton
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 animate-pulse">
                        <div className="w-5 h-5 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-1 w-8"></div>
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {stats.map((stat, i) => (
                      <div
                        key={stat.title}
                        className="bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-gray-100/70 hover:bg-white hover:shadow-md transition-all duration-200 group cursor-pointer"
                      >
                        <div className={`w-5 h-5 flex items-center justify-center rounded ${stat.iconBg} mb-2 group-hover:scale-105 transition-transform duration-150`}>
                          <stat.Icon className={`w-3 h-3 ${stat.iconColor}`} />
                        </div>
                        <div className="text-lg font-bold text-gray-900 mb-0.5 tracking-tight">{stat.value}</div>
                        <div className="text-xs font-medium text-gray-600 leading-tight">{stat.title}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Main Content: Welcome + Activity */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              {/* Welcome Card - Standardized */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">{user?.fullName || 'Student'}</span>
                  </h1>
                  <div className="w-full max-w-sm">
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-300" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex flex-shrink-0">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full p-4 flex items-center justify-center">
                    <span className="text-3xl">🎓</span>
                  </div>
                </div>
              </div>
              
              {/* Activity Section - Standardized */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 flex-1 p-5 flex flex-col overflow-hidden">
                <MyActivityCard
                  features={[
                    { key: 'mentorship', label: 'Mentorship', component: <StudentMentorshipRequests /> },
                    { key: 'opportunities', label: 'Opportunities', component: <AppliedJobs /> },
                    { key: 'events', label: 'Events', component: <Events /> },
                  ]}
                  defaultTab="mentorship"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard; 