import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from '../../config/axios';
import { AcademicCapIcon, UserIcon, PhoneIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import ConfirmDialog from '../ConfirmDialog';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  accepted: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-gray-100 text-gray-600 border-gray-200',
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
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Contact Information</h4>
            <div className="space-y-2">
              <div className="animate-pulse flex items-center space-x-3">
                <div className="h-4 w-4 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-full animate-spin"></div>
                <div className="h-4 bg-white/20 rounded w-48"></div>
              </div>
              <div className="animate-pulse flex items-center space-x-3">
                <div className="h-4 w-4 bg-gradient-to-r from-blue-400 to-primary-500 rounded-full animate-spin"></div>
                <div className="h-4 bg-white/20 rounded w-32"></div>
              </div>
              <div className="animate-pulse flex items-center space-x-3">
                <div className="h-4 w-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-spin"></div>
                <div className="h-4 bg-white/20 rounded w-40"></div>
              </div>
            </div>
          </div>
        );
      }
      if (contactError) {
        return (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Contact Information</h4>
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
              <p className="text-red-300 text-sm">Unable to load contact information</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setContactLoading(true);
                  setContactError(false);
                  setTimeout(() => setContactLoading(false), 1500);
                }}
                className="mt-2 text-red-300 hover:text-red-200 text-sm underline transition-colors"
              >
                Try again
              </motion.button>
            </div>
          </div>
        );
      }
      const alumni = req.alumni;
      return (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-900 mb-2">Contact Information</h4>
          <div className="space-y-2">
            {alumni.email && (
              <div className="flex items-center text-xs sm:text-sm text-slate-900/70">
                <UserIcon className="h-4 w-4 mr-2 text-slate-900/60" />
                <a 
                  href={`mailto:${alumni.email}`}
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  {alumni.email}
                </a>
              </div>
            )}
            {alumni.linkedinUrl && (
              <div className="flex items-center text-xs sm:text-sm text-slate-900/70">
                <GlobeAltIcon className="h-4 w-4 mr-2 text-slate-900/60" />
                <a 
                  href={alumni.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
            {alumni.phoneNumber && (
              <div className="flex items-center text-xs sm:text-sm text-slate-900/70">
                <PhoneIcon className="h-4 w-4 mr-2 text-slate-900/60" />
                <a 
                  href={`tel:${alumni.phoneNumber}`}
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  {alumni.phoneNumber}
                </a>
              </div>
            )}
            {!alumni.email && !alumni.linkedinUrl && !alumni.phoneNumber && (
              <p className="text-slate-900/60 text-xs sm:text-sm">No contact information available</p>
            )}
          </div>
        </div>
      );
    }
    // Show blurred contact section for pending or rejected
    return (
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-900 mb-2">Contact Information</h4>
        <div className="space-y-2 filter blur-sm pointer-events-none">
          <div className="flex items-center text-xs sm:text-sm text-slate-900/50">
            <UserIcon className="h-4 w-4 mr-2 text-slate-900/40" />
            <span className="text-slate-900/40">••••••••@••••••••.com</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-slate-900/50">
            <GlobeAltIcon className="h-4 w-4 mr-2 text-slate-900/40" />
            <span className="text-slate-900/40">LinkedIn Profile</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-slate-900/50">
            <PhoneIcon className="h-4 w-4 mr-2 text-slate-900/40" />
            <span className="text-slate-900/40">+•• ••• ••• ••••</span>
          </div>
        </div>
        <div className="text-center pt-2">
          <p className="text-xs sm:text-sm text-slate-900/60 mb-3">
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
      {/* Mobile-First Tab Navigation */}
      <div className="flex gap-0.5 mb-3 overflow-x-auto scrollbar-hide">
        {[
          { key: 'pending', label: 'Pending', color: 'yellow' },
          { key: 'accepted', label: 'Accepted', color: 'green' }
        ].map(({ key, label, color }) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-shrink-0 px-1.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-200 font-sans ${
              subTab === key 
                ? `bg-gradient-to-r from-${color}-500 to-${color}-600 text-slate-900 border-${color}-500 shadow-lg` 
                : `bg-white/10 text-${color}-300 border-${color}-500/30 hover:bg-${color}-500/20`
            }`}
            onClick={() => setSubTab(key)}
          >
            {label}
          </motion.button>
        ))}
      </div>
      
      {/* Content Container */}
      <div className="flex-1 overflow-hidden">
        {/* Mobile Card View */}
        <div className="lg:hidden space-y-2 h-full overflow-y-auto scrollbar-hide">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-slate-100 backdrop-blur-xl rounded-lg p-3 border border-slate-200 animate-pulse">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-slate-200 rounded mb-1 w-3/4"></div>
                      <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-6 bg-slate-200 rounded-lg flex-1"></div>
                    <div className="h-6 bg-slate-200 rounded-lg flex-1"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-200 rounded-lg p-3 text-center">
              <p className="text-red-600 text-xs font-sans">{error}</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-slate-100 backdrop-blur-xl rounded-lg p-6 text-center border border-slate-200">
              <AcademicCapIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600 text-xs font-sans">No mentorship requests in this category.</p>
            </div>
          ) : (
            filteredRequests.map((req, index) => (
              <motion.div
                key={req.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-slate-100 backdrop-blur-xl rounded-lg p-3 border border-slate-200 hover:bg-slate-200 transition-all duration-200"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="relative">
                    <img 
                      src={req.alumni?.photoUrl || '/default-avatar.png'} 
                      alt={req.alumni?.fullName || 'Alumni'} 
                      className="w-8 h-8 rounded-full object-cover border-2 border-slate-300 shadow-lg" 
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-slate-900 truncate font-sans">{req.alumni?.fullName || 'Alumni'}</h3>
                    <p className="text-xs text-slate-600 truncate font-sans">{req.alumni?.department || 'Department'}</p>
                  </div>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold font-sans ${statusColors[req.status]}`}>
                    {req.status}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-1.5 py-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold text-xs hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg font-sans"
                    onClick={() => handleView(req)}
                  >
                    View Details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-1.5 py-1 rounded-full bg-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-300 transition-all duration-200 border border-slate-300 font-sans"
                    onClick={() => handleDelete(req)}
                    disabled={actionLoading}
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto rounded-xl shadow-2xl bg-slate-50 backdrop-blur-xl border border-slate-200 h-full">
          <table className="w-full table-fixed divide-y divide-slate-200 text-xs h-full" role="grid" aria-label="Mentorship requests table">
            <thead className="bg-slate-100 backdrop-blur-sm">
              <tr>
                <th className="px-4 py-3 w-40 text-left font-semibold text-slate-700 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 w-20 text-left font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 w-32 text-right font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={3} className="text-center text-slate-600 py-8">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={3} className="text-center text-red-600 py-8">{error}</td></tr>
              ) : filteredRequests.length === 0 ? (
                <tr><td colSpan={3} className="text-center text-slate-600 py-8">No mentorship requests in this category.</td></tr>
              ) : (
                filteredRequests.map((req, index) => (
                  <motion.tr 
                    key={req.id || index} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-slate-50 transition-all duration-200"
                  >
                    <td className="px-4 py-3 whitespace-nowrap font-semibold">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={req.alumni?.photoUrl || '/default-avatar.png'} 
                            alt={req.alumni?.fullName || 'Alumni'} 
                            className="w-8 h-8 rounded-full object-cover border-2 border-slate-300 shadow-lg" 
                          />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                        </div>
                        <span className="truncate max-w-[120px] block text-slate-900">
                          {req.alumni?.fullName || 'Alumni'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs font-medium">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full font-semibold ${statusColors[req.status]}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex gap-2 justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-2 py-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold text-xs hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg"
                          onClick={() => handleView(req)}
                        >
                          View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-2 py-1 rounded-full bg-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-300 transition-all duration-200 border border-slate-300"
                          onClick={() => handleDelete(req)}
                          disabled={actionLoading}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && selectedRequest && ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide p-4 border border-white/20 shadow-2xl" 
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Mentorship Request Details</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowModal(false)}
                className="text-slate-900/60 hover:text-slate-900 transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
            <div className="relative h-28 sm:h-36 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl mb-4 border border-white/20 overflow-hidden">
              {selectedRequest.alumni?.photoUrl ? (
                <img 
                  src={selectedRequest.alumni.photoUrl} 
                  alt={selectedRequest.alumni.fullName}
                  className="w-full h-full object-cover rounded-2xl"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-2xl">
                  <AcademicCapIcon className="h-12 w-12 text-primary-400" />
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${statusColors[selectedRequest.status]}`}>
                  {selectedRequest.status === 'accepted' ? '✓ Accepted' : selectedRequest.status === 'pending' ? '⏳ Pending' : '✗ Rejected'}
                </span>
              </div>
            </div>
            <div className="p-2 sm:p-3">
              <h3 className="font-bold text-slate-900 mb-3 line-clamp-2 text-xl sm:text-2xl leading-tight">
                {selectedRequest.alumni?.fullName || 'Alumni'}
              </h3>
              <div className="space-y-2 mb-3">
                {selectedRequest.alumni?.graduationYear && (
                  <div className="flex items-center text-xs sm:text-sm text-slate-900/70">
                    <AcademicCapIcon className="h-4 w-4 mr-2 text-slate-900/60" />
                    {selectedRequest.alumni.graduationYear}
                  </div>
                )}
                {selectedRequest.alumni?.currentJobTitle && (
                  <div className="flex items-center text-xs sm:text-sm text-slate-900/70">
                    <UserIcon className="h-4 w-4 mr-2 text-slate-900/60" />
                    {selectedRequest.alumni.currentJobTitle}
                  </div>
                )}
                {selectedRequest.alumni?.companyName && (
                  <div className="flex items-center text-xs sm:text-sm text-slate-900/70">
                    <span className="h-4 w-4 mr-2 text-slate-900/60">🏢</span>
                    {selectedRequest.alumni.companyName}
                  </div>
                )}
              </div>
              {selectedRequest.descriptionbyUser && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Your Request Message</h4>
                  <div className="bg-white/10 border-l-4 border-primary-500 rounded-lg p-3 text-slate-900/80 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {selectedRequest.descriptionbyUser}
                  </div>
                </div>
              )}
              {selectedRequest.status === 'accepted' && selectedRequest.descriptionbyAlumni && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Alumni's Response</h4>
                  <div className="bg-green-500/20 border-l-4 border-green-500 rounded-lg p-3 text-slate-900/80 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {selectedRequest.descriptionbyAlumni}
                  </div>
                </div>
              )}
              {getContactSection()}
              <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="rounded-xl px-4 py-2 font-semibold border border-white/30 text-slate-900/80 hover:bg-white/10 hover:text-slate-900 transition-all duration-200 w-full sm:w-auto"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>, document.body)}
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