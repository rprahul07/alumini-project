import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from '../../config/axios';
import { AcademicCapIcon, UserIcon, PhoneIcon, GlobeAltIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ConfirmDialog from '../ConfirmDialog';
import { motion } from 'framer-motion';

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
    <div className="space-y-3 h-full">
      {/* Mobile-First Navigation for Received Requests */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide">
        {[
          { key: 'pending', label: 'Pending', color: 'yellow' },
          { key: 'accepted', label: 'Accepted', color: 'green' },
          { key: 'rejected', label: 'Rejected', color: 'red' }
        ].map(({ key, label, color }) => {
          return (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-shrink-0 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                receivedSubTab === key 
                  ? `bg-gradient-to-r from-${color}-500 to-${color}-600 text-white border-${color}-500` 
                  : `bg-white/10 text-${color}-300 border-${color}-500/30 hover:bg-${color}-500/20`
              }`}
              onClick={() => setReceivedSubTab(key)}
            >
              {label}
            </motion.button>
          );
        })}
      </div>
      
      {/* Requests Content */}
      <div className="h-full">
        {loading ? (
          <div className="text-center text-gray-300 py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-8">{error}</div>
        ) : getFilteredRequests().length === 0 ? (
          <div className="text-center text-gray-300 py-8">No {receivedSubTab} mentorship requests.</div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-3">
              {getFilteredRequests().map((req, index) => {
                const u = req.requester;
                return (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 hover:bg-white/20 transition-colors duration-200"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <img src={u.photoUrl} alt={u.fullName} className="w-8 h-8 rounded-full object-cover border border-white/30 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white text-sm truncate">{u.fullName}</h4>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${
                              u.role === 'student' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                              u.role === 'alumni' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                              u.role === 'faculty' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                              'bg-gray-500/20 text-gray-300 border-gray-500/30'
                            }`}>
                              {u.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {req.status === 'pending' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 px-2 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-xs hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg"
                            onClick={e => { e.stopPropagation(); handleAccept(req); }}
                          >
                            Accept
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 px-2 py-1.5 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold text-xs hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg"
                          onClick={e => { e.stopPropagation(); handleViewProfile(req); }}
                        >
                          View Profile
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block overflow-x-auto rounded-xl shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20 h-full"
            >
          <table className="w-full table-fixed divide-y divide-white/20 text-xs h-full" role="grid" aria-label="Mentorship requests table">
            <thead className="bg-white/10">
              <tr>
                <th className="px-2 py-2 w-48 text-left font-medium text-white/90 uppercase tracking-wider">Name</th>
                <th className="px-2 py-2 w-24 text-left font-medium text-white/90 uppercase tracking-wider">Role</th>
                <th className="px-2 py-2 w-40 text-right font-medium text-white/90 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/5 divide-y divide-white/20">
              {loading ? (
                <tr><td colSpan={3} className="text-center text-gray-300 py-6">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={3} className="text-center text-red-400 py-6">{error}</td></tr>
              ) : getFilteredRequests().length === 0 ? (
                <tr><td colSpan={3} className="text-center text-gray-300 py-6">No {receivedSubTab} mentorship requests.</td></tr>
              ) : (
                getFilteredRequests().map((req, index) => {
                  const u = req.requester;
                  return (
                    <motion.tr
                      key={req.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="hover:bg-white/10 cursor-pointer transition-colors duration-200"
                    >
                      <td className="px-2 py-2 whitespace-nowrap font-semibold">
                        <div className="flex items-center gap-2">
                          <img src={u.photoUrl} alt={u.fullName} className="w-7 h-7 rounded-full object-cover border border-white/30" />
                          <span className="truncate max-w-[120px] block text-white">{u.fullName}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold border ${
                          u.role === 'student' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                          u.role === 'alumni' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                          u.role === 'faculty' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                          'bg-gray-500/20 text-gray-300 border-gray-500/30'
                        }`}>{u.role}</span>
                      </td>
                      <td className="px-2 py-2 whitespace-nowrap text-right relative flex gap-2 justify-end">
                        {req.status === 'pending' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block px-2 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-xs hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg"
                            onClick={e => { e.stopPropagation(); handleAccept(req); }}
                          >
                            Accept
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-block px-2 py-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold text-xs hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg"
                          onClick={e => { e.stopPropagation(); handleViewProfile(req); }}
                        >
                          View Profile
                        </motion.button>
                        <div className="relative inline-block">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block px-2 py-1 rounded-full bg-white/10 text-white font-semibold text-xs hover:bg-white/20 transition-all duration-200 border border-white/30"
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
                          </motion.button>
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
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
            </motion.div>
          </>
        )}
      </div>
      {/* View Profile Modal */}
      {showProfileModal && selectedRequest && ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-2xl rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide p-3 relative border border-white/20 shadow-2xl" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base sm:text-lg font-bold text-white">Profile Details</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowProfileModal(false)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
            <div className="relative h-28 sm:h-36 bg-white/10 rounded-2xl mb-2 flex items-center justify-center overflow-hidden border border-white/20">
              {selectedRequest.requester?.photoUrl ? (
                <img
                  src={selectedRequest.requester.photoUrl}
                  alt={selectedRequest.requester.fullName}
                  className="w-full h-full object-cover rounded-2xl"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-12 w-12 text-primary-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118A7.5 7.5 0 0112 15.75a7.5 7.5 0 017.5 4.368" />
                  </svg>
                </div>
              )}
              <div className="absolute top-2 left-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                  selectedRequest.requester?.role === 'student' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                  selectedRequest.requester?.role === 'alumni' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                  selectedRequest.requester?.role === 'faculty' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                  'bg-gray-500/20 text-gray-300 border-gray-500/30'
                }`}>{selectedRequest.requester?.role}</span>
              </div>
            </div>
            <div className="p-2 sm:p-3 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <h3 className="font-bold text-white mb-2 text-xl sm:text-2xl leading-tight">{selectedRequest.requester?.fullName}</h3>
              <div className="space-y-2 mb-3">
                {selectedRequest.requester?.department && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <AcademicCapIcon className="h-4 w-4 text-primary-400" />
                    <span>{selectedRequest.requester.department}</span>
                  </div>
                )}
                {selectedRequest.requester?.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <UserIcon className="h-4 w-4 text-primary-400" />
                    <span>{selectedRequest.requester.email}</span>
                  </div>
                )}
                {selectedRequest.requester?.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <PhoneIcon className="h-4 w-4 text-primary-400" />
                    <span>{selectedRequest.requester.phoneNumber}</span>
                  </div>
                )}
                {selectedRequest.requester?.linkedinUrl && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <GlobeAltIcon className="h-4 w-4 text-primary-400" />
                    <a href={selectedRequest.requester.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 hover:underline">LinkedIn</a>
                  </div>
                )}
                {/* Add more fields as needed */}
              </div>
              {selectedRequest.descriptionbyUser && (
                <div className="mb-3">
                  <div className="text-xs text-gray-400 font-semibold mb-1">Request Message</div>
                  <div className="bg-primary-500/10 border-l-4 border-primary-400 rounded-md p-3 text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {selectedRequest.descriptionbyUser}
                  </div>
                </div>
              )}
              {selectedRequest.requester?.bio && (
                <div className="mb-3">
                  <h4 className="text-base font-semibold text-white mb-1">Bio</h4>
                  <div className="bg-white/10 rounded-lg p-3 text-gray-300 text-sm leading-relaxed whitespace-pre-line break-words">
                    {selectedRequest.requester.bio}
                  </div>
                </div>
              )}
              {selectedRequest.status === 'accepted' && selectedRequest.tier && (
                <div className="mb-4">
                  <span className={`inline-block px-2 py-1 rounded-full font-semibold border ${
                    selectedRequest.status === 'accepted' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    selectedRequest.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                    'bg-gray-500/20 text-gray-300 border-gray-500/30'
                  }`}>{selectedRequest.status}</span>
                  <span className="ml-2 text-xs text-primary-400 font-semibold">({tierLabels[selectedRequest.tier]})</span>
                </div>
              )}
              <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProfileModal(false)}
                  className="rounded-full px-4 py-1.5 font-semibold border border-white/30 text-white hover:bg-white/10 transition-all duration-200 w-full sm:w-auto"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>, document.body)}
      {/* Accept Modal */}
      {showAccept && selectedRequest && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[80vh] overflow-y-auto scrollbar-hide border border-white/20" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white/10 backdrop-blur-sm border-b border-white/20 px-4 sm:px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Accept Mentorship Request</h3>
                  <p className="text-xs text-white/70 mt-1">Accept the mentorship request and choose contact tier</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAccept(false)}
                  className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.button>
              </div>
            </div>
            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              {/* Message from Student as Label and Box */}
              {selectedRequest?.descriptionbyUser && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white mb-2">Message from Student</h4>
                  <div className="bg-white/10 border-l-4 border-primary-500 rounded-lg p-3 text-white/80 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {selectedRequest.descriptionbyUser}
                  </div>
                </div>
              )}
              {/* Tier Selection */}
              <div>
                <label className="block font-semibold text-white mb-3 text-sm">Choose Contact Tier:</label>
                <div className="space-y-2">
                  {TIERS.map(tier => (
                    <motion.label
                      key={tier.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center rounded-xl border px-3 py-3 cursor-pointer transition-all duration-200 ${
                        acceptTier === tier.value 
                          ? 'border-green-500/50 bg-green-500/20 shadow-lg' 
                          : 'border-white/30 bg-white/10 hover:border-white/50 hover:bg-white/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name="acceptTier"
                        value={tier.value}
                        checked={acceptTier === tier.value}
                        onChange={() => setAcceptTier(tier.value)}
                        className="form-radio text-green-400 mr-3 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white text-xs">{tier.name}</span>
                          {acceptTier === tier.value && (
                            <span className="inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-medium bg-green-500/30 text-green-300 border border-green-500/50">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-white/70 mt-1">{tier.description}</p>
                      </div>
                    </motion.label>
                  ))}
                </div>
              </div>
              {/* Message Input */}
              <div>
                <label className="block font-semibold text-white mb-2 text-sm">Message to Student:</label>
                <div className="relative">
                  <textarea
                    value={acceptMsg}
                    onChange={(e) => setAcceptMsg(e.target.value)}
                    rows={3}
                    maxLength={200}
                    placeholder="Write a message to the student..."
                    className="w-full bg-white/10 border border-white/30 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 resize-none text-xs text-white placeholder-white/50 transition-all duration-200 backdrop-blur-sm"
                    disabled={actionLoading}
                  />
                  {/* Character count */}
                  <div className="absolute bottom-2 right-3">
                    <span className="text-[10px] text-white/60">{acceptMsg.length}/200</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Action Buttons - Sticky Bottom */}
            <div className="sticky bottom-0 bg-white/10 backdrop-blur-sm border-t border-white/20 px-4 sm:px-6 py-4 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAccept(false)}
                  disabled={actionLoading}
                  className="w-full sm:flex-1 px-4 py-2 border border-white/30 text-white/80 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200 disabled:opacity-50 font-semibold text-sm"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={submitAccept}
                  disabled={actionLoading || !acceptMsg.trim()}
                  className="w-full sm:flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white border border-green-500/50 hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm rounded-xl shadow-lg"
                >
                  {actionLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Accepting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <CheckIcon className="h-3 w-3" />
                      <span>Accept Request</span>
                    </div>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>, document.body)}
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