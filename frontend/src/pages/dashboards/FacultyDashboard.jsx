import React from 'react';
import Navbar from '../../components/Navbar';
import ProfileCard from '../../components/ProfileCard';
import { AcademicCapIcon, CalendarIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import MentorshipRequests from '../../components/mentorship/MentorshipRequests';
import Opportunities from '../../components/opportunities/Opportunities';
import Events from '../../components/events/Events';
import MyActivityCard from '../../components/MyActivityCard';

const FacultyDashboard = () => {
  const { user } = useAuth();
  // Example dynamic stats (replace with real data if available)
  const stats = [
    {
      title: 'Mentorships Given',
      value: 28,
      Icon: AcademicCapIcon,
      iconBg: 'bg-gradient-to-br from-indigo-200 to-purple-200',
      iconColor: 'text-indigo-600',
    },
    {
      title: 'Events Hosted',
      value: 12,
      Icon: CalendarIcon,
      iconBg: 'bg-gradient-to-br from-pink-100 to-purple-100',
      iconColor: 'text-pink-500',
    },
    {
      title: 'Courses Taught',
      value: 7,
      Icon: BookOpenIcon,
      iconBg: 'bg-gradient-to-br from-blue-100 to-indigo-100',
      iconColor: 'text-blue-600',
    },
  ];
  const mentorshipsCompleted = 28;
  const mentorshipsGoal = 40;
  const mentorshipProgress = Math.min(100, Math.round((mentorshipsCompleted / mentorshipsGoal) * 100));

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-roboto bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-8 min-h-[600px] items-stretch">
            {/* Sidebar: Profile + Stats */}
            <div className="flex flex-col h-full w-full lg:w-1/3 max-w-xs mx-auto lg:mx-0 items-stretch min-w-0">
              <ProfileCard />
              {/* Stats Section - Modern Glassmorphism Card */}
              <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mt-4 w-full max-w-xs border border-gray-100">
                <div className="flex flex-col gap-2 w-full">
                  {stats.map((stat, i) => (
                    <div
                      key={stat.title}
                      className={`flex flex-row items-center gap-4 py-3 px-2 rounded-xl group transition relative z-10`}
                    >
                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${stat.iconBg} shadow group-hover:scale-110 transition`}>
                        <stat.Icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                      <div className="flex flex-col justify-center text-left">
                        <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 tracking-tight mb-0.5">{stat.value}</div>
                        <div className="text-sm font-semibold text-gray-700 tracking-wide capitalize">{stat.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Main Content: Hero + Activity */}
            <div className="flex-1 min-w-0 flex flex-col gap-6 h-full">
              {/* Minimal Welcome Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-6 w-full border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">{user?.fullName || 'Faculty'}</span>
                  </h1>
                  <div className="w-full max-w-xs mt-2">
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block flex-shrink-0">
                  <div className="bg-indigo-50 rounded-full p-3 flex items-center justify-center">
                    <span className="text-3xl">🎓</span>
                  </div>
                </div>
              </div>
              {/* Activity Section - White Card */}
              <div className="bg-white rounded-2xl shadow-lg flex-1 min-h-0 p-4 flex flex-col overflow-y-auto scrollbar-hide min-w-0 w-full h-[600px] min-h-[500px] max-h-[700px]">
                <MyActivityCard
                  features={[
                    { key: 'mentorship', label: 'Mentorship', component: <MentorshipRequests /> },
                    { key: 'opportunities', label: 'Opportunities', component: <Opportunities /> },
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

export default FacultyDashboard; 