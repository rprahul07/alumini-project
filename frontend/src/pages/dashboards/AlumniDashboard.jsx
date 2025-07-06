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
  CheckCircleIcon,
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
const TabbedBoard = ({ jobs, showAlert }) => {
  const { user } = useAuth();
  console.log('Logged-in user:', user);
  const [tab, setTab] = useState('mentorship');
  const [innerMentorTab, setInnerMentorTab] = useState('received');
  const [receivedSubTab, setReceivedSubTab] = useState('pending');
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [acceptMsg, setAcceptMsg] = useState('');
  const [acceptTier, setAcceptTier] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [sentLoading, setSentLoading] = useState(false);
  const [sentError, setSentError] = useState(null);
  const [sentProfile, setSentProfile] = useState(null);
  const [showSentProfileModal, setShowSentProfileModal] = useState(false);
  const [sentProfileLoading, setSentProfileLoading] = useState(false);
  const [selectedSentRequest, setSelectedSentRequest] = useState(null);

  
  // State for sent request modal
  const [showSentRequestModal, setShowSentRequestModal] = useState(false);
  const [selectedSentRequestForModal, setSelectedSentRequestForModal] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState(false);
  // Add state for open dropdown menu per row
  const [openDropdownId, setOpenDropdownId] = useState(null);
  // Add state for dropdown position
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // Fetch mentorship requests on mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/support/self/received');
        if (response.data.success) {
          setReceivedRequests(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch requests');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Fetch sent requests when tab is 'sent'
  useEffect(() => {
    if (innerMentorTab !== 'sent') return;
    setSentLoading(true);
    setSentError(null);
    axios.get('/api/support/check_tier/alumni')
      .then(res => {
        if (res.data.success) {
          // Beginner-friendly: always set id = requestId for each request
          setSentRequests(res.data.requests.map(r => ({ ...r, id: r.requestId })));
        } else setSentError(res.data.message || 'Failed to fetch sent requests');
      })
      .catch(() => setSentError('Network error.'))
      .finally(() => setSentLoading(false));
  }, [innerMentorTab]);

  // Open profile modal and fetch full profile
  const handleViewProfile = async (req) => {
    setSelectedRequest(req);
    setProfile(null);
    setShowProfileModal(true);
    setShowAccept(false);
    setAcceptMsg('');
    setAcceptTier(1);
    setProfileLoading(true);
    try {
      const u = req.requester;
      let res;
      if (u.role === 'alumni') {
        res = await axios.get(`/api/alumni/${u.id}`);
      } else if (u.role === 'student') {
        res = await axios.get(`/api/student/${u.id}`);
      }
      if (res && res.data && res.data.success) {
        setProfile(res.data.data);
      } else {
        setProfile(null);
      }
    } catch {
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  // View profile for sent requests
  const handleViewSentProfile = async (req) => {
    setSelectedSentRequest(req);
    setSentProfile(null);
    setShowSentProfileModal(true);
    setSentProfileLoading(true);
    try {
      if (req.alumniId) {
        const res = await axios.get(`/api/alumni/${req.alumniId}`);
        if (res.data && res.data.success) setSentProfile(res.data.data);
        else setSentProfile(null);
      } else {
        setSentProfile(null);
      }
    } catch {
      setSentProfile(null);
    } finally {
      setSentProfileLoading(false);
    }
  };

  // Handler for sent request modal
  const handleViewSentRequest = (req) => {
    setSelectedSentRequestForModal(req);
    setShowSentRequestModal(true);
    setContactLoading(true);
    setContactError(false);
    
    // Simulate loading animation for contact info
    setTimeout(() => {
      setContactLoading(false);
    }, 1500);
  };

  // Contact section function for sent request modal
  const getSentRequestContactSection = () => {
    const req = selectedSentRequestForModal;
    
    if (req?.status === 'accepted') {
      if (contactLoading) {
        return (
          <div className="mb-3">
            <h4 className="text-base font-semibold text-gray-900 mb-1">Contact Information</h4>
            <div className="space-y-2">
              <div className="animate-pulse flex items-center space-x-3">
                <div className="h-4 w-4 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-spin"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="animate-pulse flex items-center space-x-3">
                <div className="h-4 w-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-spin"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="animate-pulse flex items-center space-x-3">
                <div className="h-4 w-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-spin"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
          </div>
        );
      }

      if (contactError) {
        return (
          <div className="mb-3">
            <h4 className="text-base font-semibold text-gray-900 mb-1">Contact Information</h4>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600 text-sm">Unable to load contact information</p>
              <button 
                onClick={() => {
                  setContactLoading(true);
                  setContactError(false);
                  setTimeout(() => setContactLoading(false), 1500);
                }}
                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
              >
                Try again
              </button>
            </div>
          </div>
        );
      }

      const alumni = req.alumni;
      return (
        <div className="mb-3">
          <h4 className="text-base font-semibold text-gray-900 mb-1">Contact Information</h4>
          <div className="space-y-1">
            {alumni.email && (
              <div className="flex items-center text-xs sm:text-sm text-gray-500">
                <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                <a 
                  href={`mailto:${alumni.email}`}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  {alumni.email}
                </a>
              </div>
            )}
            {alumni.linkedinUrl && (
              <div className="flex items-center text-xs sm:text-sm text-gray-500">
                <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-400" />
                <a 
                  href={alumni.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
            {alumni.phoneNumber && (
              <div className="flex items-center text-xs sm:text-sm text-gray-500">
                <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                <a 
                  href={`tel:${alumni.phoneNumber}`}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  {alumni.phoneNumber}
                </a>
              </div>
            )}
            {!alumni.email && !alumni.linkedinUrl && !alumni.phoneNumber && (
              <p className="text-gray-500 text-xs sm:text-sm">No contact information available</p>
            )}
          </div>
        </div>
      );
    }

    // Show blurred contact section for pending or rejected
    return (
      <div className="mb-3">
        <h4 className="text-base font-semibold text-gray-900 mb-1">Contact Information</h4>
        <div className="space-y-1 filter blur-sm pointer-events-none">
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-gray-400">••••••••@••••••••.com</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-gray-400">LinkedIn Profile</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-gray-400">+•• ••• ••• ••••</span>
          </div>
        </div>
        <div className="text-center pt-2">
          <p className="text-xs sm:text-sm text-gray-500 mb-3">
            {req?.status === 'pending' 
              ? 'Contact information will be available once your request is accepted'
              : req?.status === 'rejected'
              ? 'Contact information is not available for rejected requests'
              : 'Contact information will be available once your request is accepted'
            }
          </p>
        </div>
      </div>
    );
  };

  // Accept flow
  const handleAccept = () => {
    setShowAccept(true);
    setAcceptMsg('');
    setAcceptTier(1);
  };

  // Helper to filter contact info by tier




  // Helper functions for filtering and counting requests
  const getFilteredRequests = () => {
    return receivedRequests.filter(req => req.status === receivedSubTab);
  };

  const getRequestCounts = () => {
    const counts = {
      pending: receivedRequests.filter(req => req.status === 'pending').length,
      accepted: receivedRequests.filter(req => req.status === 'accepted').length,
      rejected: receivedRequests.filter(req => req.status === 'rejected').length,
    };
    return counts;
  };



  // Update submitAccept to show Connect popup after accept
  const submitAccept = async () => {
    if (!acceptMsg.trim()) {
      showAlert('Please enter a message.', 'error');
      return;
    }
    setActionLoading(true);
    try {
      const res = await axios.post(`/api/support/accept/${selectedRequest.id}`, { alumniMsg: acceptMsg, tier: acceptTier });
      setReceivedRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'accepted', tier: acceptTier } : r));
      setShowAccept(false);
      setShowProfileModal(false);
      showAlert('Request accepted successfully!', 'success');
    } catch (err) {
      showAlert('Failed to accept request.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Add handlers at the top-level of the component
  const handleRejectRequest = async (req) => {
    if (!window.confirm('Are you sure you want to reject this request?')) return;
    setActionLoading(true);
    try {
      await axios.put(`/api/support/reject/${req.id}`);
      setReceivedRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'rejected' } : r));
      showAlert('Request rejected successfully!', 'success');
    } catch (err) {
      showAlert('Failed to reject request.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRequest = async (req) => {
    if (!window.confirm('Are you sure you want to permanently delete this request? This cannot be undone.')) return;
    setActionLoading(true);
    try {
      await axios.delete(`/api/support/delete/alumni/${req.id}`);
      setReceivedRequests(prev => prev.filter(r => r.id !== req.id));
      showAlert('Request deleted successfully!', 'success');
    } catch (err) {
      showAlert('Failed to delete request.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSentRequest = async (req) => {
    if (!window.confirm('Are you sure you want to permanently delete this request? This cannot be undone.')) return;
    setActionLoading(true);
    try {
      await axios.delete(`/api/support/delete/requester/${req.id}`);
      setSentRequests(prev => prev.filter(r => r.id !== req.id));
      showAlert('Request deleted successfully!', 'success');
    } catch (err) {
      showAlert('Failed to delete request.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const events = [
    { name: 'Annual Alumni Meetup', date: '2024-07-28', location: 'Kochi', role: 'Speaker', description: 'Gave a talk on career growth.' },
    { name: 'Tech Talk: The Future of AI', date: '2024-08-15', location: 'Virtual', role: 'Attendee', description: 'Participated in Q&A.' },
    { name: 'Startup Pitch Fest', date: '2024-06-10', location: 'Bangalore', role: 'Judge', description: 'Judged student startup pitches.' },
  ];

  return (
    <>
      <section className="bg-white rounded-xl shadow-md p-3 sm:p-4 flex flex-col min-h-[320px] md:min-h-[420px] overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div className="flex items-center space-x-2">
            <BriefcaseIcon className="h-6 w-6 text-indigo-600" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">My Activity</h2>
        </div>
          <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
            <button
              className={`px-3 py-1 sm:px-3 sm:py-1 rounded-full text-sm font-semibold border transition-colors ${tab === 'mentorship' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
              onClick={() => setTab('mentorship')}
            >
              Mentorship Requests
            </button>
            <button
              className={`px-3 py-1 sm:px-3 sm:py-1 rounded-full text-sm font-semibold border transition-colors ${tab === 'jobs' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
              onClick={() => setTab('jobs')}
            >
              Applied Jobs/Internships
            </button>
            <button
              className={`px-3 py-1 sm:px-3 sm:py-1 rounded-full text-sm font-semibold border transition-colors ${tab === 'events' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
              onClick={() => setTab('events')}
            >
              Participated Events
        </button>
      </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {tab === 'mentorship' ? (
            <div className="flex flex-col h-full">
              <div className="flex gap-2 mb-2">
                <button
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${innerMentorTab === 'received' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
                  onClick={() => setInnerMentorTab('received')}
                >
                  Received Requests
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${innerMentorTab === 'sent' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
                  onClick={() => setInnerMentorTab('sent')}
                >
                  Sent Requests
                </button>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-10">{error}</div>
              ) : innerMentorTab === 'received' ? (
                <div className="space-y-4">
                  {/* Nested Navigation for Received Requests */}
                  <div className="flex flex-wrap gap-1 overflow-x-auto">
                    {[
                      { key: 'pending', label: 'Pending', color: 'yellow' },
                      { key: 'accepted', label: 'Accepted', color: 'green' },
                      { key: 'rejected', label: 'Rejected', color: 'red' }
                    ].map(({ key, label, color }) => {
                      const counts = getRequestCounts();
                      const count = counts[key];
                      return (
                        <button
                          key={key}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 flex items-center space-x-1 ${
                            receivedSubTab === key 
                              ? `bg-${color}-600 text-white border-${color}-600` 
                              : `bg-white text-${color}-600 border-${color}-200 hover:bg-${color}-50`
                          }`}
                          onClick={() => setReceivedSubTab(key)}
                        >
                          <span>{label}</span>
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                            receivedSubTab === key 
                              ? 'bg-white text-gray-900' 
                              : `bg-${color}-100 text-${color}-700`
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
      </div>

                  {/* Requests Table */}
                  <div className="overflow-x-auto rounded-xl shadow bg-white">
                    <table className="w-full table-fixed divide-y divide-gray-200 text-xs" role="grid" aria-label="Mentorship requests table">
          <thead className="bg-gray-50">
            <tr>
                        <th className="px-2 py-2 w-48 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-2 py-2 w-24 text-left font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-2 py-2 w-40 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
                      {getFilteredRequests().length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-center text-gray-500 py-6">
                            {`No ${receivedSubTab} mentorship requests.`}
                </td>
                        </tr>
                      ) : (
                        getFilteredRequests().map(req => {
                        const u = req.requester;
                        return (
                          <tr key={req.id} className="hover:bg-gray-50 cursor-pointer">
                            <td className="px-2 py-2 whitespace-nowrap font-semibold">
                              <div className="flex items-center gap-2">
                                <img src={u.photoUrl} alt={u.fullName} className="w-7 h-7 rounded-full object-cover border border-gray-200" />
                                <span className="truncate max-w-[120px] block">{u.fullName}</span>
                              </div>
                </td>
                            <td className="px-2 py-2 whitespace-nowrap">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${roleColors[u.role] || 'bg-gray-100 text-gray-700'}`}>{u.role}</span>
                </td>
                            <td className="px-2 py-2 whitespace-nowrap text-right relative flex gap-2 justify-end">
                              {req.status === 'pending' && (
                                <button
                                  className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs hover:bg-green-200 transition-colors"
                                  onClick={e => { e.stopPropagation(); setSelectedRequest(req); setShowAccept(true); setAcceptMsg(''); setAcceptTier(1); }}
                                >
                                  Accept
                                </button>
                              )}
                              <button
                                className="inline-block px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs hover:bg-indigo-200 transition-colors"
                                onClick={e => { e.stopPropagation(); handleViewProfile(req); }}
                              >
                                View Profile
                              </button>
                              <div className="relative inline-block">
                                <button
                                  className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors"
                                  onClick={e => {
                                    e.stopPropagation();
                                    if (openDropdownId === req.id) {
                                      setOpenDropdownId(null);
                                    } else {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setDropdownPosition({
                                        top: rect.bottom + window.scrollY,
                                        left: rect.right + window.scrollX - 128, // 128px = dropdown width
                                        width: rect.width
                                      });
                                      setOpenDropdownId(req.id);
                                    }
                                  }}
                                >
                                  ⋮
                                </button>
                                {openDropdownId === req.id && ReactDOM.createPortal(
                                  <div style={{ position: 'absolute', top: dropdownPosition.top, left: dropdownPosition.left, width: 128, zIndex: 9999 }} className="bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <ul className="py-1 text-sm">
                                      {req.status === 'pending' && (
                                        <li>
                                          <button
                                            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-700"
                                            onClick={e => { e.stopPropagation(); setOpenDropdownId(null); handleRejectRequest(req); }}
                                          >
                                            ✗ Reject
                                          </button>
                                        </li>
                                      )}
                                      <li>
                                        <button
                                          className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-700"
                                          onClick={e => { e.stopPropagation(); setOpenDropdownId(null); handleDeleteRequest(req); }}
                                        >
                                          🗑️ Delete
                                        </button>
                                      </li>
                                    </ul>
                                  </div>,
                                  document.body
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            ) : (
              <div className="overflow-x-auto rounded-xl shadow bg-white">
                <table className="w-full table-fixed divide-y divide-gray-200 text-xs" role="grid" aria-label="Sent mentorship requests table">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-2 w-40 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-2 py-2 w-20 text-left font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-2 py-2 w-20 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-2 py-2 w-32 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                                {sentLoading ? (
              <tr key="sent-loading"><td colSpan={4} className="text-center text-gray-500 py-6">Loading...</td></tr>
            ) : sentError ? (
              <tr key="sent-error"><td colSpan={4} className="text-center text-red-500 py-6">{sentError}</td></tr>
            ) : sentRequests.length === 0 ? (
              <tr key="sent-empty"><td colSpan={4} className="text-center text-gray-500 py-6">No mentorship requests sent yet.</td></tr>
                    ) : (
                                              sentRequests.map((req, index) => {
                          console.log('Request:', req);
                          return (
                            <tr key={`sent-request-${req.id || req.requestId || req.alumni?.id || index}`} className="hover:bg-gray-50 cursor-pointer">
                            <td className="px-2 py-2 whitespace-nowrap font-semibold">
                              <div className="flex items-center gap-2">
                                <img 
                                  src={req.alumni?.photoUrl} 
                                  alt={req.alumni?.fullName || 'Alumni'} 
                                  className="w-7 h-7 rounded-full object-cover border border-gray-200" 
                                />
                                <span className="truncate max-w-[120px] block">
                                  {req.alumni?.fullName || 'Alumni'}
                                </span>
                              </div>
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap">
                              <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">alumni</span>
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap text-xs font-medium">
                              <span className={`inline-block px-2 py-1 rounded-full font-semibold ${statusColors[req.status]}`}>{req.status}</span>
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap text-right relative flex gap-2 justify-end">
                              <button
                                className="inline-block px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs hover:bg-indigo-200 transition-colors"
                                onClick={e => { e.stopPropagation(); handleViewSentRequest(req); }}
                              >
                                View
                              </button>
                              <div className="relative inline-block">
                                <button
                                  className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors"
                                  onClick={e => {
                                    e.stopPropagation();
                                    if (openDropdownId === req.id) {
                                      setOpenDropdownId(null);
                                    } else {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setDropdownPosition({
                                        top: rect.bottom + window.scrollY,
                                        left: rect.right + window.scrollX - 128, // 128px = dropdown width
                                        width: rect.width
                                      });
                                      setOpenDropdownId(req.id);
                                    }
                                  }}
                                >
                                  ⋮
                                </button>
                                {openDropdownId === req.id && ReactDOM.createPortal(
                                  <div style={{ position: 'absolute', top: dropdownPosition.top, left: dropdownPosition.left, width: 128, zIndex: 9999 }} className="bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <ul className="py-1 text-sm">
                                      <li>
                                        <button
                                          className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-700"
                                          onClick={e => { e.stopPropagation(); setOpenDropdownId(null); handleDeleteSentRequest(req); }}
                                        >
                                          🗑️ Delete
                                        </button>
                                      </li>
                                    </ul>
                                  </div>,
                                  document.body
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {showProfileModal && selectedRequest && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
                <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide p-3 relative" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">Profile Details</h2>
                    <button
                      onClick={() => setShowProfileModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="relative h-28 sm:h-36 bg-gray-200 rounded-2xl mb-2 flex items-center justify-center overflow-hidden">
                    {selectedRequest.requester?.photoUrl ? (
                      <img
                        src={selectedRequest.requester.photoUrl}
                        alt={selectedRequest.requester.fullName}
                        className="w-full h-full object-cover rounded-2xl"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-12 w-12 text-indigo-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118A7.5 7.5 0 0112 15.75a7.5 7.5 0 017.5 4.368" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${roleColors[selectedRequest.requester?.role] || 'bg-gray-100 text-gray-700'}`}>{selectedRequest.requester?.role}</span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <h3 className="font-bold text-gray-900 mb-2 text-xl sm:text-2xl leading-tight">{selectedRequest.requester?.fullName}</h3>
                    <div className="space-y-2 mb-3">
                      {selectedRequest.requester?.department && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <AcademicCapIcon className="h-4 w-4 text-indigo-400" />
                          <span>{selectedRequest.requester.department}</span>
                        </div>
                      )}
                      {selectedRequest.requester?.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <UserIcon className="h-4 w-4 text-indigo-400" />
                          <span>{selectedRequest.requester.email}</span>
                        </div>
                      )}
                      {selectedRequest.requester?.phoneNumber && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <PhoneIcon className="h-4 w-4 text-indigo-400" />
                          <span>{selectedRequest.requester.phoneNumber}</span>
                        </div>
                      )}
                      {selectedRequest.requester?.linkedinUrl && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <GlobeAltIcon className="h-4 w-4 text-indigo-400" />
                          <a href={selectedRequest.requester.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">LinkedIn</a>
                        </div>
                      )}
                      {selectedRequest.requester?.githubUrl && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="h-4 w-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.396.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.577.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
                          <a href={selectedRequest.requester.githubUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">GitHub</a>
                        </div>
                      )}
                      {selectedRequest.requester?.twitterUrl && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="h-4 w-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.09 9.09 0 01-2.88 1.1A4.52 4.52 0 0016.11 0c-2.5 0-4.52 2.02-4.52 4.51 0 .35.04.7.11 1.03C7.69 5.4 4.07 3.7 1.64 1.15c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.95 3.65A4.48 4.48 0 01.96 6v.06c0 2.13 1.52 3.91 3.55 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.56 1.74 2.18 3.01 4.1 3.05A9.05 9.05 0 010 19.54a12.8 12.8 0 006.95 2.04c8.36 0 12.94-6.93 12.94-12.94 0-.2 0-.39-.01-.58A9.22 9.22 0 0023 3z"/></svg>
                          <a href={selectedRequest.requester.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Twitter</a>
                        </div>
                      )}
                      {selectedRequest.requester?.workExperience && Array.isArray(selectedRequest.requester.workExperience) && selectedRequest.requester.workExperience.length > 0 && (
                        <div className="mb-2">
                          <h4 className="text-xs font-semibold text-gray-900 mb-1">Work Experience</h4>
                          <ul className="list-disc list-inside text-xs text-gray-700">
                            {selectedRequest.requester.workExperience.map((exp, idx) => (
                              <li key={idx}>{typeof exp === 'string' ? exp : JSON.stringify(exp)}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    {selectedRequest.descriptionbyUser && (
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 font-semibold mb-1">Request Message</div>
                        <div className="bg-gray-50 border-l-4 border-indigo-400 rounded-md p-3 text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                          {selectedRequest.descriptionbyUser}
                        </div>
                      </div>
                    )}
                    {selectedRequest.requester?.bio && (
                      <div className="mb-3">
                        <h4 className="text-base font-semibold text-gray-900 mb-1">Bio</h4>
                        <div className="bg-gray-50 rounded-lg p-3 text-gray-700 text-sm leading-relaxed whitespace-pre-line break-words">
                          {selectedRequest.requester.bio}
                        </div>
                      </div>
                    )}
                    {selectedRequest.status === 'accepted' && selectedRequest.tier && (
                      <div className="mb-4">
                        <span className={`inline-block px-2 py-1 rounded-full font-semibold ${statusColors[selectedRequest.status]}`}>{selectedRequest.status}</span>
                        <span className="ml-2 text-xs text-indigo-600 font-semibold">({tierLabels[selectedRequest.tier]})</span>
                      </div>
                    )}
                    <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                      <button
                        onClick={() => setShowProfileModal(false)}
                        className="rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showSentProfileModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
                <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide p-3 relative" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">Alumni Profile</h2>
                    <button
                      onClick={() => setShowSentProfileModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="relative h-28 sm:h-36 bg-gray-200 rounded-2xl mb-2 flex items-center justify-center overflow-hidden">
                    {sentProfile?.photoUrl ? (
                      <img
                        src={sentProfile.photoUrl}
                        alt={sentProfile.fullName}
                        className="w-full h-full object-cover rounded-2xl"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-12 w-12 text-indigo-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118A7.5 7.5 0 0112 15.75a7.5 7.5 0 017.5 4.368" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">alumni</span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <h3 className="font-bold text-gray-900 mb-2 text-xl sm:text-2xl leading-tight">{sentProfile?.fullName || `Alumni #${selectedSentRequest?.alumniId}`}</h3>
                    {selectedSentRequest?.descriptionbyUser && (
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 font-semibold mb-1">Request Message</div>
                        <div className="bg-gray-50 border-l-4 border-indigo-400 rounded-md p-3 text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                          {selectedSentRequest.descriptionbyUser}
                        </div>
                      </div>
                    )}
                    <div className="space-y-2 mb-3">
                      {sentProfile?.department && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <AcademicCapIcon className="h-4 w-4 text-indigo-400" />
                          <span>{sentProfile.department}</span>
                        </div>
                      )}
                      {sentProfile?.alumni && sentProfile.alumni.currentJobTitle && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <BriefcaseIcon className="h-4 w-4 text-indigo-400" />
                          <span>{sentProfile.alumni.currentJobTitle} at {sentProfile.alumni.companyName}</span>
                        </div>
                      )}
                      {sentProfile?.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <UserIcon className="h-4 w-4 text-indigo-400" />
                          <span>{sentProfile.email}</span>
                        </div>
                      )}
                    </div>
                    {sentProfile?.bio && (
                      <div className="mb-3">
                        <h4 className="text-base font-semibold text-gray-900 mb-1">Bio</h4>
                        <div className="bg-gray-50 rounded-lg p-3 text-gray-700 text-sm leading-relaxed whitespace-pre-line break-words">
                          {sentProfile.bio}
                        </div>
                      </div>
                    )}
                    {selectedSentRequest?.status === 'accepted' && selectedSentRequest?.tier && (
                      <div className="mb-4">
                        <span className={`inline-block px-2 py-1 rounded-full font-semibold ${statusColors[selectedSentRequest?.status]}`}>{selectedSentRequest?.status}</span>
                        <span className="ml-2 text-xs text-indigo-600 font-semibold">({tierLabels[selectedSentRequest.tier]})</span>
                      </div>
                    )}
                    <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                      <button
                        onClick={() => setShowSentProfileModal(false)}
                        className="rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showAccept && selectedRequest && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[80vh] overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {/* Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-100 px-3 sm:px-4 py-3 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">Accept Mentorship Request</h3>
                        <p className="text-xs text-gray-500 mt-1">Accept the mentorship request and choose contact tier</p>
                      </div>
                      <button
                        onClick={() => setShowAccept(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                      >
                        <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    {/* Student Info with Message */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 border border-indigo-100">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{selectedRequest?.requester?.fullName}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{selectedRequest?.requester?.role}</p>
                        {selectedRequest?.descriptionbyUser && (
                          <div className="bg-white rounded-lg p-2 text-gray-700 text-xs leading-relaxed">
                            {selectedRequest.descriptionbyUser}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tier Selection */}
                    <div>
                      <label className="block font-semibold text-gray-900 mb-2 text-sm">Choose Contact Tier:</label>
                      <div className="space-y-1">
                        {TIERS.map(tier => (
                          <label
                            key={tier.value}
                            className={`flex items-center rounded-lg border px-2 py-2 cursor-pointer transition-colors ${
                              acceptTier === tier.value 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="acceptTier"
                              value={tier.value}
                              checked={acceptTier === tier.value}
                              onChange={() => setAcceptTier(tier.value)}
                              className="form-radio text-green-600 mr-2 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-900 text-xs">{tier.name}</span>
                                                        {acceptTier === tier.value && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-green-100 text-green-800">
                            Selected
                          </span>
                        )}
                              </div>
                              <p className="text-[10px] text-gray-600 mt-0.5">{tier.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Message Input */}
                    <div>
                      <label className="block font-semibold text-gray-900 mb-2 text-sm">Message to Student:</label>
                      <div className="relative">
                        <textarea
                          value={acceptMsg}
                          onChange={(e) => setAcceptMsg(e.target.value)}
                          rows={3}
                          maxLength={200}
                          placeholder="Write a message to the student..."
                          className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-green-400 focus:border-green-400 resize-none text-xs transition-colors"
                          disabled={actionLoading}
                        />
                        <div className="absolute bottom-1 right-1">
                          <span className={`text-[10px] px-2 py-1 rounded-full ${
                            acceptMsg.length > 180 
                              ? 'bg-red-100 text-red-600' 
                              : acceptMsg.length > 150 
                              ? 'bg-yellow-100 text-yellow-600' 
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {acceptMsg.length}/200
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Alert Message */}
                    {alert && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
                        <p className="text-red-600 text-xs">{alert}</p>
                      </div>
                    )}
      </div>

                  {/* Action Buttons - Sticky Bottom */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 sm:px-6 py-4 rounded-b-2xl">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={() => setShowAccept(false)}
                        disabled={actionLoading}
                        className="w-full sm:flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 font-semibold text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={submitAccept}
                        disabled={actionLoading || !acceptMsg.trim()}
                        className="w-full sm:flex-1 px-4 py-2 bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm rounded-full"
                      >
                        {actionLoading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                            <span>Accepting...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <CheckIcon className="h-3 w-3" />
                            <span>Accept Request</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            
            {/* New Sent Request Modal */}
            {showSentRequestModal && selectedSentRequestForModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
                <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide p-3" style={{ scrollbarWidth: 'none' }}>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">Mentorship Request Details</h2>
                    <button
                      onClick={() => setShowSentRequestModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Alumni Image */}
                  <div className="relative h-28 sm:h-36 bg-gray-200 rounded-2xl mb-2">
                    {selectedSentRequestForModal.alumni?.photoUrl ? (
                      <img 
                        src={selectedSentRequestForModal.alumni.photoUrl} 
                        alt={selectedSentRequestForModal.alumni.fullName}
                        className="w-full h-full object-cover rounded-2xl"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl">
                        <AcademicCapIcon className="h-12 w-12 text-indigo-400" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        selectedSentRequestForModal.status === 'accepted' 
                          ? 'bg-green-100 text-green-800'
                          : selectedSentRequestForModal.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedSentRequestForModal.status === 'accepted' ? '✓ Accepted' :
                         selectedSentRequestForModal.status === 'pending' ? '⏳ Pending' : '✗ Rejected'}
                      </span>
                    </div>

                    {/* Tier Badge */}
                    {selectedSentRequestForModal.status === 'accepted' && selectedSentRequestForModal.tier && (
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-800">
                          <UserIcon className="h-3 w-3 mr-1" />
                          Tier {selectedSentRequestForModal.tier}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-2 sm:p-3">
                    {/* Alumni Name */}
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-xl sm:text-2xl leading-tight">
                      {selectedSentRequestForModal.alumni?.fullName || 'Alumni'}
                    </h3>

                    {/* Alumni Details */}
                    <div className="space-y-1 mb-2">
                      {selectedSentRequestForModal.alumni?.graduationYear && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <AcademicCapIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {selectedSentRequestForModal.alumni.graduationYear}
                        </div>
                      )}
                      {selectedSentRequestForModal.alumni?.course && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <svg className="h-4 w-4 mr-2 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3a1 1 0 01-1-1V5a1 1 0 011-1h9" /></svg>
                          {selectedSentRequestForModal.alumni.course}
                        </div>
                      )}
                      {selectedSentRequestForModal.alumni?.currentJobTitle && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {selectedSentRequestForModal.alumni.currentJobTitle}
                        </div>
                      )}
                      {selectedSentRequestForModal.alumni?.companyName && (
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {selectedSentRequestForModal.alumni.companyName}
                        </div>
                      )}
                    </div>

                    {/* Your Request Message */}
                    {selectedSentRequestForModal.descriptionbyUser && (
                      <div className="mb-3">
                        <h4 className="text-base font-semibold text-gray-900 mb-1">Your Request Message</h4>
                        <div className="bg-indigo-50 border-l-4 border-indigo-400 rounded-md p-3 text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                          {selectedSentRequestForModal.descriptionbyUser}
                        </div>
                      </div>
                    )}

                    {/* Alumni's Response Message */}
                    {selectedSentRequestForModal.status === 'accepted' && selectedSentRequestForModal.descriptionbyAlumni && (
                      <div className="mb-3">
                        <h4 className="text-base font-semibold text-gray-900 mb-1">Alumni's Response</h4>
                        <div className="bg-green-50 border-l-4 border-green-400 rounded-md p-3 text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                          {selectedSentRequestForModal.descriptionbyAlumni}
                        </div>
                      </div>
                    )}

                    {/* Contact Information */}
                    {getSentRequestContactSection()}

                    {/* Close Button */}
                    <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                      <button
                        onClick={() => setShowSentRequestModal(false)}
                        className="rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : tab === 'events' ? (
          <div className="overflow-y-auto no-scrollbar flex-1">
            <table className="w-full table-fixed divide-y divide-gray-200 text-xs" role="grid" aria-label="Participated events table">
          <thead className="bg-gray-50">
            <tr>
                  <th scope="col" className="px-2 py-2 w-32 text-left font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                  <th scope="col" className="px-2 py-2 w-20 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-2 py-2 w-24 text-left font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-2 py-2 w-40 text-left font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-500 py-6">No participated events.</td>
                  </tr>
                ) : (
                  events.map((event, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-2 py-2 whitespace-nowrap font-semibold truncate max-w-[120px]">{event.name}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700">{event.date}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 truncate max-w-[80px]">{event.location}</td>
                      <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 truncate max-w-[160px]" title={event.description}>
                        {event.description.length > 40 ? event.description.slice(0, 40) + '…' : event.description}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-y-auto no-scrollbar flex-1">
            <table className="w-full table-fixed divide-y divide-gray-200 text-xs" role="grid" aria-label="Applied jobs/internships table">
          <thead className="bg-gray-50">
            <tr>
                  <th scope="col" className="px-2 py-2 w-40 text-left font-medium text-gray-500 uppercase tracking-wider">Position & Dept</th>
                  <th scope="col" className="px-2 py-2 w-24 text-left font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th scope="col" className="px-2 py-2 w-20 text-left font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-2 py-2 w-16 text-left font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-2 py-2 w-20 text-left font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                  <th scope="col" className="px-2 py-2 w-16 text-right font-medium text-gray-500 uppercase tracking-wider">&nbsp;</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job, index) => (
              <tr key={index} className="hover:bg-gray-50">
                    <td className="px-2 py-2 whitespace-nowrap">
                      <div className="text-xs font-semibold text-gray-900 truncate max-w-[120px]">{job.position}</div>
                      <div className="text-[10px] text-gray-500 truncate max-w-[80px]">{job.department}</div>
                </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 truncate max-w-[80px]">{job.company}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 truncate max-w-[60px]">{job.location}</td>
                    <td className="px-2 py-2 whitespace-nowrap">
                  <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      job.type === 'Full-time'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {job.type}
                  </span>
                </td>
                    <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700">{job.appliedOn}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-right text-xs font-medium">
                      <span className="inline-block px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold">Applied</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        )}
      </div>
    </section>
          <div className="mb-12" />
  </>);
};

// --- AlumniDashboard Main Component ---
const AlumniDashboard = () => {
  const { user } = useAuth();
  const { showAlert, AlertComponent } = useAlert();

  // Static data
  const stats = [
    { title: "Connections", value: 450, Icon: UserGroupIcon, color: "blue", progress: 75, progressText: "25 to next milestone" },
    { title: "Events Attended", value: 25, Icon: CalendarIcon, color: "green", progress: 60, progressText: "5 events this year" },
    { title: "Mentorships", value: 12, Icon: BriefcaseIcon, color: "purple", progress: 90, progressText: "3 new mentees" },
  ];
  const jobs = [
    {
      position: "Software Engineer (Full-stack)",
      company: "Innovate Solutions",
      location: "Bengaluru, India",
      type: "Full-time",
      appliedOn: "2024-07-01",
      department: "Software Engineering",
      status: "Under Review"
    },
    {
      position: "Senior UX Designer",
      company: "Creative Minds Co.",
      location: "Remote",
      type: "Contract",
      appliedOn: "2024-06-25",
      department: "Product Design",
      status: "Interview Scheduled"
    },
    {
      position: "Data Scientist",
      company: "Analytics Hub",
      location: "Mumbai, India",
      type: "Full-time",
      appliedOn: "2024-06-20",
      department: "Data Science",
      status: "Rejected"
    },
    {
      position: "Marketing Specialist",
      company: "Growth Marketing Ltd.",
      location: "Kochi, India",
      type: "Full-time",
      appliedOn: "2024-06-15",
      department: "Marketing",
      status: "Accepted"
    }
  ];
  const mentorshipRequests = [
    { studentName: "Anjali Menon", department: "Computer Science", semester: 6, message: "Looking for guidance on full-stack development and career opportunities...", role: 'alumni' },
    { studentName: "Rohan Kumar", department: "Mechanical", semester: 4, message: "Interested in learning about the automotive industry and higher studies options.", role: 'student' },
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 items-start">
            {/* Left Column - Profile and Navigation */}
            <aside className="lg:col-span-1 flex flex-col gap-2 items-stretch justify-start min-h-0" aria-label="Sidebar and profile section">
              <div className="flex-shrink-0">
                <ProfileCard compact />
              </div>
              <div className="flex-shrink-0">
                <Sidebar compact />
              </div>
            </aside>
            {/* Welcome Card - aligned horizontally with ProfileCard */}
            <div className="lg:col-span-3">
              <div className="mb-3 mt-5 bg-white rounded-xl p-5 flex items-center min-h-[96px]">
                <div>
                <h1 className="text-2xl font-semibold text-gray-800 tracking-tight pt-0">
                    Welcome back, <span className="text-indigo-500 font-bold">{user?.fullName || 'Alumni'}</span>!
                </h1>
                  <p className="text-lx text-gray-500">
                    Your personalized dashboard to explore opportunities and connect with the community.
                  </p>
                    </div>
                  </div>
              <main className="space-y-5">
                {/* Statistics Cards Section - Redesigned to match project UI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {/* Students */}
                  <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-indigo-500 transition-transform transform hover:scale-105">
                    <div className="flex-shrink-0 mr-4">
                      <div className="bg-indigo-100 p-3 rounded-full">
                        <UserGroupIcon className="text-indigo-600 text-2xl" />
                  </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">900</div>
                      <div className="text-gray-500 text-sm">Students</div>
                  </div>
                  </div>
                  {/* Mentorships Given */}
                  <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-purple-500 transition-transform transform hover:scale-105">
                    <div className="flex-shrink-0 mr-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <AcademicCapIcon className="text-purple-600 text-2xl" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">42</div>
                      <div className="text-gray-500 text-sm">Mentorships Given</div>
                    </div>
                  </div>
                  {/* Jobs/Internships Posted */}
                  <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-green-500 transition-transform transform hover:scale-105">
                    <div className="flex-shrink-0 mr-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <BriefcaseIcon className="text-green-600 text-2xl" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">58</div>
                      <div className="text-gray-500 text-sm">Jobs/Internships</div>
                    </div>
                  </div>
                  {/* Events Hosted */}
                  <div className="flex items-center bg-white shadow-md rounded-xl p-4 border-t-8 border-yellow-500 transition-transform transform hover:scale-105">
                    <div className="flex-shrink-0 mr-4">
                      <div className="bg-yellow-100 p-3 rounded-full">
                        <CalendarIcon className="text-yellow-600 text-2xl" />
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">21</div>
                      <div className="text-gray-500 text-sm">Events Hosted</div>
                    </div>
                  </div>
              </div>

                {/* Tabbed Board Section */}
                <TabbedBoard
                  jobs={jobs}
                  showAlert={showAlert}
                />
            </main>
          </div>
        </div>
      </div>
      </div>
      <AlertComponent />
    </>
  );
};

export default AlumniDashboard; 