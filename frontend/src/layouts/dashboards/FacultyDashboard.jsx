import React, { useState, useEffect } from 'react';
import ProfileCard from '../../components/dashboard/ProfileCard';
import Sidebar from '../../components/dashboard/Sidebar';
import {
  UserGroupIcon,
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  TagIcon,
  CheckCircleIcon,
  XCircleIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, Icon, color, progress, progressText }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-800';
      case 'green':
        return 'bg-green-100 text-green-800';
      case 'purple':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${getColorClasses(color)}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${getColorClasses(color)}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{progressText}</p>
      </div>
    </div>
  );
};

const EventCard = ({ date, title, time, location, tags }) => {
  const [month, day] = date.split(' ');

  return (
    <div className="flex items-start space-x-4 p-4 border-b border-gray-100 last:border-b-0">
      <div className="flex-shrink-0 w-16 bg-gray-100 rounded-lg p-2 text-center">
        <div className="text-xs font-medium text-gray-500 uppercase">{month}</div>
        <div className="text-2xl font-bold text-gray-900">{day}</div>
      </div>

      <div className="flex-1">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <div className="mt-1 space-y-1">
          <div className="flex items-center text-sm text-gray-500">
            <ClockIcon className="h-4 w-4 mr-1.5" />
            {time}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPinIcon className="h-4 w-4 mr-1.5" />
            {location}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const AlumniRegistrationCard = ({ name, graduationYear, department, email, onApprove, onReject }) => (
  <div className="flex items-start space-x-4 p-4 border-b border-gray-100 last:border-b-0">
    <div className="flex-shrink-0">
      <img
        src="/default-avatar.png"
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />
    </div>

    <div className="flex-1">
      <h3 className="text-base font-semibold text-gray-900">{name}</h3>
      <div className="mt-1 space-y-1">
        <p className="text-sm text-gray-500">
          <span className="font-medium">Graduation Year:</span> {graduationYear}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Department:</span> {department}
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-medium">Email:</span> {email}
        </p>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={onApprove}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
        >
          <CheckCircleIcon className="h-4 w-4 mr-1.5" />
          Approve
        </button>
        <button
          onClick={onReject}
          className="flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
        >
          <XCircleIcon className="h-4 w-4 mr-1.5" />
          Reject
        </button>
      </div>
    </div>
  </div>
);

const FacultyDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const upcomingEvents = [
    {
      date: 'MAY 15',
      title: 'Faculty Development Workshop',
      time: '10:00 AM - 12:00 PM',
      location: 'Conference Room A',
      tags: ['In-Person', 'Workshop']
    },
    {
      date: 'MAY 20',
      title: 'Research Symposium',
      time: '9:00 AM - 5:00 PM',
      location: 'Main Auditorium',
      tags: ['In-Person', 'Academic']
    }
  ];

  const pendingRegistrations = [
    {
      name: 'John Smith',
      graduationYear: '2023',
      department: 'Computer Science',
      email: 'john.smith@example.com'
    },
    {
      name: 'Emma Wilson',
      graduationYear: '2022',
      department: 'Information Technology',
      email: 'emma.wilson@example.com'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-lg font-medium text-gray-900">
            Welcome back, {user?.fullName || 'Professor'}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here's what's happening in your faculty dashboard today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Profile and Navigation */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard />
            <Sidebar />
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Students"
                value="156"
                Icon={UserGroupIcon}
                color="blue"
                progress={75}
                progressText="75% attendance rate"
              />
              <StatCard
                title="Research Projects"
                value="8"
                Icon={BookOpenIcon}
                color="green"
                progress={60}
                progressText="60% completion rate"
              />
              <StatCard
                title="Upcoming Events"
                value="4"
                Icon={CalendarIcon}
                color="purple"
                progress={40}
                progressText="40% participation rate"
              />
            </div>

            {/* Events and Alumni Registration Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upcoming Events Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
                <div className="divide-y divide-gray-100">
                  {upcomingEvents.map((event, index) => (
                    <EventCard key={index} {...event} />
                  ))}
                </div>
                <p className="text-sm text-gray-500 text-center mt-6">** Coming Soon ** More events will be added</p>
              </div>

              {/* Alumni Registration Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Pending Alumni Registrations</h2>
                <div className="divide-y divide-gray-100">
                  {pendingRegistrations.map((registration, index) => (
                    <AlumniRegistrationCard
                      key={index}
                      {...registration}
                      onApprove={() => console.log('Approve registration:', registration.name)}
                      onReject={() => console.log('Reject registration:', registration.name)}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 text-center mt-6">** Coming Soon ** More registrations will be added</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
