import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from '../../config/axios';
import { AcademicCapIcon, UserIcon, PhoneIcon, GlobeAltIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ConfirmDialog from '../ConfirmDialog';

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
const TIERS = [
  { value: 1, name: 'Basic', description: 'Share your professional email address with the mentee.' },
  { value: 2, name: 'Advanced', description: 'Share your professional email and LinkedIn profile.' },
  { value: 3, name: 'Premium', description: 'Share your professional email, LinkedIn, and WhatsApp contact.' }
];

const ReceivedRequests = ({ requests, loading, error, setRequests, showAlert }) => {
  const [receivedSubTab, setReceivedSubTab] = useState('pending');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [acceptMsg, setAcceptMsg] = useState('');
  const [acceptTier, setAcceptTier] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState(null);
  const [confirmMessage, setConfirmMessage] = React.useState('');

  // Helper functions
  const getFilteredRequests = () => {
    return requests.filter(req => req.status === receivedSubTab);
  };
  const getRequestCounts = () => {
    const counts = {
      pending: requests.filter(req => req.status === 'pending').length,
      accepted: requests.filter(req => req.status === 'accepted').length,
      rejected: requests.filter(req => req.status === 'rejected').length,
    };
    return counts;
  };

  // View Profile handler
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

  // Accept, reject, delete handlers
  const handleAccept = (req) => {
    setSelectedRequest(req);
    setShowAccept(true);
    setAcceptMsg('');
    setAcceptTier(1);
  };

  const submitAccept = async () => {
    if (!acceptMsg.trim()) {
      showAlert('Please enter a message.', 'error');
      return;
    }
    setActionLoading(true);
    try {
      await axios.post(`/api/support/accept/${selectedRequest.id}`, { alumniMsg: acceptMsg, tier: acceptTier });
      setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, status: 'accepted', tier: acceptTier } : r));
      setShowAccept(false);
      setShowProfileModal(false);
      showAlert('Request accepted successfully!', 'success');
    } catch (err) {
      showAlert('Failed to accept request.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async (req) => {
    setConfirmMessage('Are you sure you want to reject this request?');
    setConfirmAction(() => () => {
      setActionLoading(true);
      axios.put(`/api/support/reject/${req.id}`).then(() => {
        setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'rejected' } : r));
        toast.success('Request rejected successfully!');
      }).catch(() => {
        toast.error('Failed to reject request.');
      }).finally(() => {
        setActionLoading(false);
      });
    });
    setConfirmOpen(true);
  };

  const handleDeleteRequest = async (req) => {
    setConfirmMessage('Are you sure you want to permanently delete this request? This cannot be undone.');
    setConfirmAction(() => () => {
      setActionLoading(true);
      axios.delete(`/api/support/delete/alumni/${req.id}`).then(() => {
        setRequests(prev => prev.filter(r => r.id !== req.id));
        toast.success('Request deleted successfully!');
      }).catch(() => {
        toast.error('Failed to delete request.');
      }).finally(() => {
        setActionLoading(false);
      });
    });
    setConfirmOpen(true);
  };

  return (
    <div className="space-y-4 h-full">
      {/* Nested Navigation for Received Requests */}
      <div className="flex flex-wrap gap-1 overflow-x-auto">
        {[
          { key: 'pending', label: 'Pending', color: 'yellow' },
          { key: 'accepted', label: 'Accepted', color: 'green' },
          { key: 'rejected', label: 'Rejected', color: 'red' }
        ].map(({ key, label, color }) => {
          return (
            <button
              key={key}
              className={`px-2 py-1 rounded-full text-[10px] font-semibold border transition-all duration-200 flex items-center space-x-1 ${
                receivedSubTab === key 
                  ? `bg-${color}-600 text-white border-${color}-600` 
                  : `bg-white text-${color}-600 border-${color}-200 hover:bg-${color}-50`
              }`}
              onClick={() => setReceivedSubTab(key)}
            >
              <span>{label}</span>
            </button>
          );
        })}
      </div>
      {/* Requests Table */}
      <div className="h-full">
        <div className="overflow-x-auto rounded-xl shadow bg-white h-full">
          <table className="w-full table-fixed divide-y divide-gray-200 text-xs h-full" role="grid" aria-label="Mentorship requests table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 w-48 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-2 py-2 w-24 text-left font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-2 py-2 w-40 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={3} className="text-center text-gray-500 py-6">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={3} className="text-center text-red-500 py-6">{error}</td></tr>
              ) : getFilteredRequests().length === 0 ? (
                <tr><td colSpan={3} className="text-center text-gray-500 py-6">No {receivedSubTab} mentorship requests.</td></tr>
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
                            onClick={e => { e.stopPropagation(); handleAccept(req); }}
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
                                  left: rect.right + window.scrollX - 128,
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
      {/* View Profile Modal */}
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
                {/* Add more fields as needed */}
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
      {/* Accept Modal */}
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
              {/* Message from Student as Label and Box */}
              {selectedRequest?.descriptionbyUser && (
                <div className="mb-2">
                  <h4 className="text-base font-semibold text-gray-900 mb-1">Message from Student</h4>
                  <div className="bg-indigo-50 border-l-4 border-indigo-400 rounded-md p-3 text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {selectedRequest.descriptionbyUser}
                  </div>
                </div>
              )}
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
                  {/* Simple gray character count, no colored badge */}
                  <div className="absolute bottom-1 right-2">
                    <span className="text-[10px] text-gray-500">{acceptMsg.length}/200</span>
                  </div>
                </div>
              </div>
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
      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Action"
        message={confirmMessage}
        onConfirm={() => { setConfirmOpen(false); if (confirmAction) confirmAction(); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default ReceivedRequests; 