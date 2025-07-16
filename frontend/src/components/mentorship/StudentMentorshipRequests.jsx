import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import { AcademicCapIcon, UserIcon, PhoneIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import ConfirmDialog from '../ConfirmDialog';
import { toast } from 'react-toastify';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-gray-200 text-gray-500',
};

const StudentMentorshipRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subTab, setSubTab] = useState('pending');
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [requestToDelete, setRequestToDelete] = React.useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get('/api/support/check_tier/alumni');
        if (res.data.success) {
          setRequests(res.data.requests.map(r => ({ ...r, id: r.requestId })));
        } else {
          setError(res.data.message || 'Failed to fetch requests');
        }
      } catch (err) {
        setError('Network error.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleView = (req) => {
    setSelectedRequest(req);
    setShowModal(true);
    setContactLoading(true);
    setContactError(false);
    setTimeout(() => setContactLoading(false), 1500);
  };

  const handleDelete = async (req) => {
    setRequestToDelete(req);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setConfirmOpen(false);
    setActionLoading(true);
    try {
      await axios.delete(`/api/support/delete/requester/${requestToDelete.id}`);
      setRequests(prev => prev.filter(r => r.id !== requestToDelete.id));
    } catch (err) {
      toast.error('Failed to delete request.');
    } finally {
      setActionLoading(false);
      setRequestToDelete(null);
    }
  };

  const filteredRequests = requests.filter(r => r.status === subTab);

  const getContactSection = () => {
    const req = selectedRequest;
    if (!req) return null;
    if (req.status === 'accepted') {
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
                <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
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
            <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
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
            {req.status === 'pending' 
              ? 'Contact information will be available once your request is accepted'
              : req.status === 'rejected'
              ? 'Contact information is not available for rejected requests'
              : 'Contact information will be available once your request is accepted'
            }
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${subTab === 'pending' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
          onClick={() => setSubTab('pending')}
        >
          Pending
        </button>
        <button
          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${subTab === 'accepted' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
          onClick={() => setSubTab('accepted')}
        >
          Accepted
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="w-full table-fixed divide-y divide-gray-200 text-xs" role="grid" aria-label="Mentorship requests table">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-2 w-40 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-2 py-2 w-20 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-2 py-2 w-32 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={3} className="text-center text-gray-500 py-6">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={3} className="text-center text-red-500 py-6">{error}</td></tr>
            ) : filteredRequests.length === 0 ? (
              <tr><td colSpan={3} className="text-center text-gray-500 py-6">No mentorship requests in this category.</td></tr>
            ) : (
              filteredRequests.map((req, index) => (
                <tr key={req.id || index} className="hover:bg-gray-50 cursor-pointer">
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
                  <td className="px-2 py-2 whitespace-nowrap text-xs font-medium">
                    <span className={`inline-block px-2 py-1 rounded-full font-semibold ${statusColors[req.status]}`}>{req.status}</span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-right flex gap-2 justify-end">
                    <button
                      className="inline-block px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs hover:bg-indigo-200 transition-colors"
                      onClick={() => handleView(req)}
                    >
                      View
                    </button>
                    <button
                      className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold text-xs hover:bg-gray-200 transition-colors"
                      onClick={() => handleDelete(req)}
                      disabled={actionLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide p-3" style={{ scrollbarWidth: 'none' }}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Mentorship Request Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative h-28 sm:h-36 bg-gray-200 rounded-2xl mb-2">
              {selectedRequest.alumni?.photoUrl ? (
                <img 
                  src={selectedRequest.alumni.photoUrl} 
                  alt={selectedRequest.alumni.fullName}
                  className="w-full h-full object-cover rounded-2xl"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl">
                  <AcademicCapIcon className="h-12 w-12 text-indigo-400" />
                </div>
              )}
              <div className="absolute top-2 left-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${selectedRequest.status === 'accepted' ? 'bg-green-100 text-green-800' : selectedRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                  {selectedRequest.status === 'accepted' ? '✓ Accepted' : selectedRequest.status === 'pending' ? '⏳ Pending' : '✗ Rejected'}
                </span>
              </div>
            </div>
            <div className="p-2 sm:p-3">
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-xl sm:text-2xl leading-tight">
                {selectedRequest.alumni?.fullName || 'Alumni'}
              </h3>
              <div className="space-y-1 mb-2">
                {selectedRequest.alumni?.graduationYear && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <AcademicCapIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {selectedRequest.alumni.graduationYear}
                  </div>
                )}
                {selectedRequest.alumni?.currentJobTitle && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {selectedRequest.alumni.currentJobTitle}
                  </div>
                )}
                {selectedRequest.alumni?.companyName && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <span className="h-4 w-4 mr-2 text-gray-400">🏢</span>
                    {selectedRequest.alumni.companyName}
                  </div>
                )}
              </div>
              {selectedRequest.descriptionbyUser && (
                <div className="mb-3">
                  <h4 className="text-base font-semibold text-gray-900 mb-1">Your Request Message</h4>
                  <div className="bg-indigo-50 border-l-4 border-indigo-400 rounded-md p-3 text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {selectedRequest.descriptionbyUser}
                  </div>
                </div>
              )}
              {selectedRequest.status === 'accepted' && selectedRequest.descriptionbyAlumni && (
                <div className="mb-3">
                  <h4 className="text-base font-semibold text-gray-900 mb-1">Alumni's Response</h4>
                  <div className="bg-green-50 border-l-4 border-green-400 rounded-md p-3 text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {selectedRequest.descriptionbyAlumni}
                  </div>
                </div>
              )}
              {getContactSection()}
              <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Request"
        message="Are you sure you want to delete this request?"
        onConfirm={confirmDelete}
        onCancel={() => { setConfirmOpen(false); setRequestToDelete(null); }}
      />
    </div>
  );
};

export default StudentMentorshipRequests; 