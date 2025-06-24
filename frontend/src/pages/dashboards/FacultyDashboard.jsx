import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ProfileCard from '../../components/ProfileCard';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import {
  UserGroupIcon,
  BriefcaseIcon, // Can be repurposed for placements/industry links
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BookOpenIcon, // For courses/research
  ClipboardDocumentListIcon, // For pending tasks/approvals
  AcademicCapIcon, // For student-related stats
  ArrowRightIcon, // For "View All" buttons
} from '@heroicons/react/24/outline';

// --- StatCard Component (Enhanced for Faculty needs) ---
const StatCard = ({ title, value, Icon, color, progress, progressText }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-800';
      case 'green':
        return 'bg-green-100 text-green-800';
      case 'purple':
        return 'bg-purple-100 text-purple-800';
      case 'red': // New color for attention
        return 'bg-red-100 text-red-800';
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
      case 'red':
        return 'bg-red-500';
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
      {progress !== undefined && (
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

// --- EventCard Component (Re-used with adjusted styling for consistency) ---
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

// --- AlumniRegistrationCard Component (Enhanced for clarity and interaction) ---
const AlumniRegistrationCard = ({ name, graduationYear, department, email, onApprove, onReject }) => (
  <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
    <div className="flex-shrink-0">
      <img
        src="/default-avatar.png" // Replace with dynamic avatar if available
        alt={name}
        className="w-14 h-14 rounded-full object-cover border border-gray-200"
      />
    </div>

    <div className="flex-1">
      <h3 className="text-base font-semibold text-gray-900">{name}</h3>
      <div className="mt-1 space-y-1 text-sm text-gray-600">
        <p><span className="font-medium text-gray-700">Graduation:</span> {graduationYear}</p>
        <p><span className="font-medium text-gray-700">Department:</span> {department}</p>
        <p className="flex items-center"><span className="font-medium text-gray-700 mr-1">Email:</span> <a href={`mailto:${email}`} className="text-indigo-600 hover:underline">{email}</a></p>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={onApprove}
          className="flex items-center px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition-colors duration-200 shadow-sm"
        >
          <CheckCircleIcon className="h-4 w-4 mr-2" />
          Approve
        </button>
        <button
          onClick={onReject}
          className="flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 transition-colors duration-200 shadow-sm"
        >
          <XCircleIcon className="h-4 w-4 mr-2" />
          Reject
        </button>
      </div>
    </div>
  </div>
);

// --- CourseProgressCard Component (New for Faculty) ---
const CourseProgressCard = ({ courseName, studentsEnrolled, averageGrade, progressPercentage }) => {
  const getProgressColor = (progress) => {
    if (progress < 40) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{courseName}</h3>
      <p className="text-sm text-gray-600">Enrolled: <span className="font-medium">{studentsEnrolled} students</span></p>
      <p className="text-sm text-gray-600 mt-1">Avg. Grade: <span className="font-medium">{averageGrade}</span></p>
      <div className="mt-4">
        <p className="text-xs font-medium text-gray-500 mb-1">Overall Progress:</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getProgressColor(progressPercentage)}`}
            style={{ width: `${progressPercentage}%` }}
            aria-valuenow={progressPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{progressPercentage}% Course Completion</p>
      </div>
      <button className="mt-5 text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center group">
        View Details <ArrowRightIcon className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
};

// --- FacultyDashboard Main Component ---
const FacultyDashboard = () => {
  const { user } = useAuth();

  const upcomingEvents = [
    {
      date: 'JUL 12', // Updated date
      title: 'Department Meeting: Curriculum Review',
      time: '11:00 AM - 1:00 PM',
      location: 'Faculty Meeting Room 2',
      tags: ['Internal', 'Meeting']
    },
    {
      date: 'JUL 25', // Updated date
      title: 'Guest Lecture: Advanced AI Ethics',
      time: '3:00 PM - 4:30 PM',
      location: 'Main Auditorium',
      tags: ['Public', 'Academic']
    },
    {
        date: 'AUG 05', // New event
        title: 'Thesis Defense Committee Session',
        time: '9:00 AM - 12:00 PM',
        location: 'Research Lab, Block C',
        tags: ['Internal', 'Research']
      }
  ];

  const pendingRegistrations = [
    {
      name: 'Priya Rajan',
      graduationYear: '2024',
      department: 'Electronics & Communication Engg.',
      email: 'priya.rajan@example.com'
    },
    {
      name: 'Ahmed Khan',
      graduationYear: '2023',
      department: 'Mechanical Engineering',
      email: 'ahmed.khan@example.com'
    }
  ];

  const courseData = [
    {
      courseName: 'Data Structures & Algorithms',
      studentsEnrolled: 95,
      averageGrade: 'B+',
      progressPercentage: 85
    },
    {
      courseName: 'Machine Learning Fundamentals',
      studentsEnrolled: 62,
      averageGrade: 'A-',
      progressPercentage: 70
    },
    {
      courseName: 'Compiler Design',
      studentsEnrolled: 40,
      averageGrade: 'C',
      progressPercentage: 55
    }
  ];

  // Placeholder functions for approve/reject actions
  const handleApproveRegistration = (name) => {
    console.log(`Approved alumni registration for ${name}`);
    // In a real application, you'd send an API request here
  };

  const handleRejectRegistration = (name) => {
    console.log(`Rejected alumni registration for ${name}`);
    // In a real application, you'd send an API request here
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-roboto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-4 mt-0">
            <h1 className="text-lg font-semibold text-gray-700 leading-tight">
              Welcome back, <span className="text-purple-500 font-bold">{user?.fullName || 'Professor'}</span>!
            </h1>
            <p className="text-base text-gray-500 mt-1">
              Your comprehensive dashboard for academic oversight and community engagement.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Left Column - Profile and Navigation */}
            <aside className="lg:col-span-1 space-y-8" aria-label="Sidebar and profile section">
              <ProfileCard />
              <Sidebar />
            </aside>
            {/* Right Column - Main Content */}
            <main className="lg:col-span-3 space-y-10">
              {/* Quick Stats */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Your Students"
                  value="156"
                  Icon={AcademicCapIcon}
                  color="blue"
                  progress={75}
                  progressText="75% average attendance"
                />
                <StatCard
                  title="Research Projects"
                  value="8"
                  Icon={BookOpenIcon}
                  color="green"
                  progress={60}
                  progressText="60% projects in progress"
                />
                <StatCard
                  title="Pending Approvals"
                  value={pendingRegistrations.length}
                  Icon={ClipboardDocumentListIcon}
                  color="red"
                  progress={100}
                  progressText="Alumni registrations awaiting review"
                />
              </section>
              {/* Main Content Rows */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Events Section */}
                <section className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                    <button className="text-sm text-purple-600 hover:text-purple-800 flex items-center group font-semibold rounded-full px-4 py-2 bg-purple-50 border border-purple-200 transition">
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
                {/* Pending Alumni Registrations Section */}
                <section className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Pending Alumni Registrations ({pendingRegistrations.length})</h2>
                    <button className="text-sm text-purple-600 hover:text-purple-800 flex items-center group font-semibold rounded-full px-4 py-2 bg-purple-50 border border-purple-200 transition">
                      View All <ArrowRightIcon className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100 -mx-4 -mt-4">
                    {pendingRegistrations.map((registration, index) => (
                      <AlumniRegistrationCard
                        key={index}
                        {...registration}
                        onApprove={() => handleApproveRegistration(registration.name)}
                        onReject={() => handleRejectRegistration(registration.name)}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 text-center mt-6 font-semibold">
                    ** Coming Soon ** More registrations will be added
                  </p>
                </section>
              </section>
              {/* Your Courses Overview Section */}
              <section className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Your Courses Overview</h2>
                  <button className="text-sm text-purple-600 hover:text-purple-800 flex items-center group font-semibold rounded-full px-4 py-2 bg-purple-50 border border-purple-200 transition">
                    View All <ArrowRightIcon className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courseData.map((course, index) => (
                    <CourseProgressCard key={index} {...course} />
                  ))}
                </div>
                <p className="text-sm text-gray-500 text-center mt-6 font-semibold">
                  ** Coming Soon ** Detailed course analytics
                </p>
              </section>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default FacultyDashboard; 