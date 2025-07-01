import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ProfileCard from '../../components/ProfileCard';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserGroupIcon,
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  AcademicCapIcon, // For Mentorship
  SparklesIcon,    // For Clubs/Activities
  ArrowRightIcon, // Added for 'View All' buttons
} from '@heroicons/react/24/outline';

// --- StatCard Component (Re-used and slightly enhanced) ---
const StatCard = ({ title, value, Icon, color, progress, progressText }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-800';
      case 'green':
        return 'bg-green-100 text-green-800';
      case 'purple':
        return 'bg-purple-100 text-purple-800';
      case 'yellow': // Added yellow for new stats
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressBarColor = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      case 'purple':
        return 'bg-purple-500';
      case 'yellow':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 transform transition duration-300 hover:scale-[1.02] hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${getColorClasses(color)}`}>
            <Icon className="h-7 w-7" />
          </div>
        )}
      </div>
      {progress !== undefined && ( // Only show progress if 'progress' prop is provided
        <div className="mt-5">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getProgressBarColor(color)}`}
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{progressText}</p>
        </div>
      )}
    </div>
  );
};

// --- EventCard Component (Re-used with minor styling adjustment) ---
const EventCard = ({ date, title, time, location, tags }) => {
  const [month, day] = date.split(' ');

  return (
    <div className="flex items-start space-x-5 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
      <div className="flex-shrink-0 w-20 h-20 bg-indigo-50 rounded-xl flex flex-col items-center justify-center border border-indigo-100">
        <div className="text-sm font-semibold text-indigo-700 uppercase leading-none">{month}</div>
        <div className="text-3xl font-bold text-indigo-900 leading-none mt-1">{day}</div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <div className="space-y-1 text-gray-600">
          <div className="flex items-center text-sm">
            <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span>{time}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span>{location}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MentorCard Component ---
const MentorCard = ({ name, title, tags }) => (
  <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
    <div className="flex-shrink-0">
      <img
        src="/default-avatar.png" // Consider dynamic mentor photo here if available
        alt={name}
        className="w-14 h-14 rounded-full object-cover border border-gray-200"
      />
    </div>

    <div className="flex-1">
      <h3 className="text-base font-semibold text-gray-900">{name}</h3>
      <p className="text-sm text-gray-500 mt-0.5">{title}</p>
      <div className="flex flex-wrap gap-2 mt-3">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {tag}
          </span>
        ))}
      </div>
      <button className="mt-4 text-sm font-medium text-indigo-600 border border-indigo-300 rounded-full px-4 py-1.5 hover:bg-indigo-50 transition-colors shadow-sm">
        Request Mentorship
      </button>
    </div>
  </div>
);

// --- JobBoard Component (Re-used as is) ---
const JobBoard = () => {
  const jobs = [
    {
      position: "Software Engineer Intern",
      company: "Innovate Solutions",
      location: "Bengaluru, India",
      type: "Internship",
      posted: "2 days ago",
      department: "Software Engineering"
    },
    {
      position: "Product Design Intern",
      company: "Creative Minds Co.",
      location: "Remote",
      type: "Internship",
      posted: "1 week ago",
      department: "Product Design"
    },
    {
      position: "Data Analytics Trainee",
      company: "Analytics Hub",
      location: "Mumbai, India",
      type: "Full-time", // Could be full-time for freshers
      posted: "3 days ago",
      department: "Data Science"
    },
    {
      position: "Junior Marketing Associate",
      company: "Growth Marketing Ltd.",
      location: "Kochi, India",
      type: "Full-time",
      posted: "4 days ago",
      department: "Marketing"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BriefcaseIcon className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">Recent Job & Internship Opportunities</h2>
        </div>
        <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center group">
          View All <ArrowRightIcon className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position & Department
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posted
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{job.position}</div>
                  <div className="text-xs text-gray-500 mt-1">{job.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{job.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{job.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    job.type === 'Full-time'
                      ? 'bg-green-100 text-green-800'
                      : job.type === 'Internship'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800' // For Contract, etc.
                  }`}>
                    {job.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{job.posted}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-800 transition-colors">
                    Apply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <span className="inline-block text-sm text-indigo-700 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-200">
          ** Coming Soon ** More opportunities will be added
        </span>
      </div>
    </div>
  );
};

// --- StudentDashboard Main Component ---
const StudentDashboard = () => {
  const { user } = useAuth();

  const upcomingEvents = [
    {
      date: 'JUL 18',
      title: 'Workshop: Mastering React Hooks',
      time: '1:00 PM - 3:00 PM',
      location: 'Computer Lab 3, Block A',
      tags: ['Technical', 'Hands-on']
    },
    {
      date: 'AUG 02',
      title: 'Career Fair 2025: Internship Focus',
      time: '10:00 AM - 4:00 PM',
      location: 'University Gymnasium',
      tags: ['Internship', 'Networking']
    },
    {
      date: 'AUG 25',
      title: 'Guest Lecture: Blockchain Beyond Crypto',
      time: '11:00 AM - 12:30 PM',
      location: 'Online Webinar',
      tags: ['Virtual', 'Innovation']
    }
  ];

  const mentors = [
    {
      name: 'Dr. Sarah Johnson',
      title: 'Senior Software Engineer at Google',
      tags: ['Software Development', 'Career Guidance', 'AI/ML']
    },
    {
      name: 'Prof. Michael Chen',
      title: 'Research Director at Microsoft',
      tags: ['AI/ML', 'Research', 'Academic Guidance']
    },
    {
      name: 'Priya Sharma',
      title: 'Product Manager at Flipkart (Alumni)',
      tags: ['Product Management', 'Startup Insights', 'E-commerce']
    }
  ];

  const clubsAndActivities = [
    {
      name: 'Code Club',
      members: '150+ members',
      iconColor: 'blue',
      description: 'Weekly coding challenges and hackathons.'
    },
    {
      name: 'Robotics Team',
      members: '40 members',
      iconColor: 'green',
      description: 'Building and competing with autonomous robots.'
    },
    {
      name: 'Entrepreneurship Cell',
      members: '80+ members',
      iconColor: 'purple',
      description: 'Ideation sessions and startup mentorship.'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-roboto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            {/* Left Column - Profile and Navigation */}
            <aside className="lg:col-span-1 space-y-4" aria-label="Sidebar and profile section">
              <ProfileCard />
              <Sidebar />
            </aside>
            {/* Right Column - Main Content */}
            <main className="lg:col-span-3 space-y-5">
              {/* Welcome Section */}
              <div className="mb-3 mt-5 bg-white rounded-xl p-5">
                <h1 className="text-2xl font-semibold text-gray-800 tracking-tight pt-0">
                  Welcome back, <span className="text-indigo-500 font-bold">{user?.fullName || 'Student'}</span>!
                </h1>
                <p className="text-lx text-gray-500">
                  Your personalized dashboard to explore opportunities and connect with the community.
                </p>
              </div>
              {/* Events and Mentorship Section */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Events Section */}
                <section className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center group font-semibold rounded-full px-4 py-2 bg-indigo-50 border border-indigo-200 transition">
                      View All <ArrowRightIcon className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100 -mx-4 -mt-4">
                    {upcomingEvents.map((event, index) => (
                      <EventCard key={index} {...event} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 text-center mt-6 font-semibold">
                    ** Coming Soon ** More events will be added
                  </p>
                </section>
                {/* Mentorship Opportunities Section */}
                <section className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Mentorship Opportunities ({mentors.length})</h2>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center group font-semibold rounded-full px-4 py-2 bg-indigo-50 border border-indigo-200 transition">
                      View All <ArrowRightIcon className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100 -mx-4 -mt-4">
                    {mentors.map((mentor, index) => (
                      <MentorCard key={index} {...mentor} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 text-center mt-6 font-semibold">
                    ** Coming Soon ** More mentors will be added
                  </p>
                </section>
              </section>
              {/* Job Board Section */}
              <JobBoard />
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard; 