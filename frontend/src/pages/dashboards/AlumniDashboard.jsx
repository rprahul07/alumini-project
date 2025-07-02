import React from 'react';
import Navbar from '../../components/Navbar';
import ProfileCard from '../../components/ProfileCard';
import Sidebar from '../../components/Sidebar';
import {
  UserGroupIcon,
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

// --- StatCard Component ---
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

  const getProgressBarColor = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      case 'purple':
        return 'bg-purple-500';
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
              role="progressbar"
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

// --- JobBoard Component ---
const JobBoard = () => {
  const jobs = [
    {
      position: "Software Engineer (Full-stack)",
      company: "Innovate Solutions",
      location: "Bengaluru, India",
      type: "Full-time",
      posted: "2 days ago",
      department: "Software Engineering"
    },
    {
      position: "Senior UX Designer",
      company: "Creative Minds Co.",
      location: "Remote",
      type: "Contract",
      posted: "1 week ago",
      department: "Product Design"
    },
    {
      position: "Data Scientist",
      company: "Analytics Hub",
      location: "Mumbai, India",
      type: "Full-time",
      posted: "3 days ago",
      department: "Data Science"
    },
    {
      position: "Marketing Specialist",
      company: "Growth Marketing Ltd.",
      location: "Kochi, India",
      type: "Full-time",
      posted: "4 days ago",
      department: "Marketing"
    }
  ];

  return (
    <section className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BriefcaseIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
          <h2 className="text-xl font-bold text-gray-900">Recent Job Opportunities</h2>
        </div>
        <button className="rounded-full px-4 py-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center group" aria-label="View all job opportunities">
          View All <ArrowRightIcon className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" role="grid" aria-label="Job opportunities table">
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
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.type === 'Full-time'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {job.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{job.posted}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="rounded-full px-4 py-1.5 text-indigo-600 hover:text-indigo-900 font-semibold">Apply</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

// --- AlumniDashboard Main Component ---
const AlumniDashboard = () => {
  const { user } = useAuth();
  // Dummy data
  const stats = [
    { title: "Connections", value: 450, Icon: UserGroupIcon, color: "blue", progress: 75, progressText: "25 to next milestone" },
    { title: "Events Attended", value: 25, Icon: CalendarIcon, color: "green", progress: 60, progressText: "5 events this year" },
    { title: "Mentorships", value: 12, Icon: BriefcaseIcon, color: "purple", progress: 90, progressText: "3 new mentees" },
  ];
  
  const upcomingEvents = [
    { date: 'JUL 28', title: 'Annual Alumni Meetup 2024', time: '6:00 PM', location: 'Grand Ballroom, Kochi', tags: ['Networking', 'Social'] },
    { date: 'AUG 15', title: 'Tech Talk: The Future of AI', time: '11:00 AM', location: 'Virtual Event', tags: ['Tech', 'Webinar'] },
  ];

  const mentorshipRequests = [
    { studentName: "Anjali Menon", department: "Computer Science", semester: 6, message: "Looking for guidance on full-stack development and career opportunities..." },
    { studentName: "Rohan Kumar", department: "Mechanical", semester: 4, message: "Interested in learning about the automotive industry and higher studies options." },
  ];
  
  const handleAcceptMentorship = (studentName) => {
    // Handle accept logic
    console.log(`Accepted mentorship for ${studentName}`);
  };

  const handleRejectMentorship = (studentName) => {
    // Handle reject logic
    console.log(`Rejected mentorship for ${studentName}`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-roboto bg-gray-50">
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
              <header className="mb-3 mt-5 bg-white rounded-xl p-5" aria-label="Welcome message">
                <h1 className="text-2xl font-semibold text-gray-800 tracking-tight pt-0">
                  Welcome back, <span className="text-green-500 font-bold">{user?.fullName || 'Alumni'}</span>!
                </h1>
                <p className="text-base text-gray-500">
                  Your personalized dashboard to connect, contribute, and stay updated.
                </p>
              </header>
              {/* Stats Section */}
              {/* <section className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-labelledby="stats-heading">
                <h2 id="stats-heading" className="sr-only">Your Statistics</h2>
                {stats.map(stat => <StatCard key={stat.title} {...stat} />)}
              </section> */}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Upcoming Events Section */}
                <section aria-labelledby="events-heading">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                      <h2 id="events-heading" className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                    </div>
                    <button className="rounded-full px-4 py-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center group" aria-label="View all events">
                      View All <ArrowRightIcon className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-4 space-y-2">
                    {upcomingEvents.map((event, index) => <EventCard key={index} {...event} />)}
                  </div>
                </section>

                {/* Mentorship Requests Section */}
                <section aria-labelledby="mentorship-heading">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center space-x-3">
                      <UserGroupIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                      <h2 id="mentorship-heading" className="text-xl font-bold text-gray-900">Mentorship Requests</h2>
                    </div>
                    <button className="rounded-full px-4 py-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center group" aria-label="View all mentorship requests">
                      View All <ArrowRightIcon className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-4 space-y-2">
                    {mentorshipRequests.map((request, index) => (
                      <MentorshipRequestCard
                        key={index}
                        {...request}
                        onAccept={() => handleAcceptMentorship(request.studentName)}
                        onReject={() => handleRejectMentorship(request.studentName)}
                      />
                    ))}
                  </div>
                </section>
              </div>

              {/* Job Board Section */}
              <JobBoard />

            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlumniDashboard; 