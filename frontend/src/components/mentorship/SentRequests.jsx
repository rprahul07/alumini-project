import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from '../../config/axios';
import { AcademicCapIcon, UserIcon, PhoneIcon, GlobeAltIcon, XMarkIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import ConfirmDialog from '../ConfirmDialog';
import { motion } from 'framer-motion';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-gray-200 text-gray-500',
};
const tierLabels = ['', 'Basic', 'Advanced', 'Premium'];

const SentRequests = ({ requests, loading, error, setRequests, showAlert }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [showSentRequestModal, setShowSentRequestModal] = useState(false);
  const [selectedSentRequestForModal, setSelectedSentRequestForModal] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState(null);
  const [confirmMessage, setConfirmMessage] = React.useState('');

  // Delete handler (restored async logic)
  const handleDeleteSentRequest = async (req) => {
    if (!req.id) {
      showAlert('Request ID is missing. Cannot delete.', 'error');
      return;
    }
    setConfirmMessage('Are you sure you want to permanently delete this request? This cannot be undone.'); setConfirmAction(() => handleDeleteSentRequest); setConfirmOpen(true);
  };

  // View handler
  const handleViewSentRequest = (req) => {
    setSelectedSentRequestForModal(req);
    setShowSentRequestModal(true);
    setContactLoading(true);
    setContactError(false);
    setTimeout(() => {
      setContactLoading(false);
    }, 1500);
  };

  // Contact section logic
  const getSentRequestContactSection = () => {
    const req = selectedSentRequestForModal;
    if (!req) return null;
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

  return (
    <div className="flex flex-col h-full">
      {loading ? (
        <div className="text-center text-gray-300 py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-400 py-8">{error}</div>
      ) : requests.length === 0 ? (
        <div className="text-center text-gray-300 py-8">No mentorship requests sent yet.</div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-3">
            {requests.map((req, index) => (
              <motion.div
                key={`sent-request-${req.id || req.requestId || req.alumni?.id || index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 hover:bg-white/20 transition-colors duration-200"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <img 
                        src={req.alumni?.photoUrl} 
                        alt={req.alumni?.fullName || 'Alumni'} 
                        className="w-8 h-8 rounded-full object-cover border border-white/30 flex-shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm truncate">
                          {req.alumni?.fullName || 'Alumni'}
                        </h4>
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/30">
                          alumni
                        </span>
                      </div>
                    </div>
                    <span className={`inline-block px-2 py-1 rounded-full font-semibold border text-xs ${
                      req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                      req.status === 'accepted' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                      'bg-gray-500/20 text-gray-300 border-gray-500/30'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-2 py-1.5 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold text-xs hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg"
                      onClick={e => { e.stopPropagation(); handleViewSentRequest(req); }}
                    >
                      View
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-2 py-1.5 rounded-lg bg-red-500/20 text-red-300 font-semibold text-xs hover:bg-red-500/30 transition-all duration-200 border border-red-500/30"
                      onClick={e => { e.stopPropagation(); handleDeleteSentRequest(req); }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop Table View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block overflow-x-auto rounded-xl shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20"
          >
      <table className="w-full table-fixed divide-y divide-white/20 text-xs" role="grid" aria-label="Sent mentorship requests table">
        <thead className="bg-white/10">
          <tr>
            <th className="px-2 py-2 w-40 text-left font-medium text-white/90 uppercase tracking-wider">Name</th>
            <th className="px-2 py-2 w-20 text-left font-medium text-white/90 uppercase tracking-wider">Role</th>
            <th className="px-2 py-2 w-20 text-left font-medium text-white/90 uppercase tracking-wider">Status</th>
            <th className="px-2 py-2 w-32 text-right font-medium text-white/90 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white/5 divide-y divide-white/20">
          {loading ? (
            <tr key="sent-loading"><td colSpan={4} className="text-center text-gray-300 py-6">Loading...</td></tr>
          ) : error ? (
            <tr key="sent-error"><td colSpan={4} className="text-center text-red-400 py-6">{error}</td></tr>
          ) : requests.length === 0 ? (
            <tr key="sent-empty"><td colSpan={4} className="text-center text-gray-300 py-6">No mentorship requests sent yet.</td></tr>
          ) : (
            requests.map((req, index) => (
              <motion.tr
                key={`sent-request-${req.id || req.requestId || req.alumni?.id || index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="hover:bg-white/10 cursor-pointer transition-colors duration-200"
              >
                <td className="px-2 py-2 whitespace-nowrap font-semibold">
                  <div className="flex items-center gap-2">
                    <img 
                      src={req.alumni?.photoUrl} 
                      alt={req.alumni?.fullName || 'Alumni'} 
                      className="w-7 h-7 rounded-full object-cover border border-white/30" 
                    />
                    <span className="truncate max-w-[120px] block text-white">
                      {req.alumni?.fullName || 'Alumni'}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/30">alumni</span>
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-xs font-medium">
                  <span className={`inline-block px-2 py-1 rounded-full font-semibold border ${
                    req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                    req.status === 'accepted' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    'bg-gray-500/20 text-gray-300 border-gray-500/30'
                  }`}>{req.status}</span>
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-right relative flex gap-2 justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block px-2 py-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold text-xs hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg"
                    onClick={e => { e.stopPropagation(); handleViewSentRequest(req); }}
                  >
                    View
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
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
          </motion.div>
        </>
      )}
      {/* Modal for sent request details */}
      {showSentRequestModal && selectedSentRequestForModal && ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-2xl rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide p-3 border border-white/20 shadow-2xl" style={{ scrollbarWidth: 'none' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base sm:text-lg font-bold text-white">Mentorship Request Details</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSentRequestModal(false)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </motion.button>
            </div>
            {/* Alumni Image */}
            <div className="relative h-28 sm:h-36 bg-white/10 rounded-2xl mb-2 border border-white/20">
              {selectedSentRequestForModal.alumni?.photoUrl ? (
                <img 
                  src={selectedSentRequestForModal.alumni.photoUrl} 
                  alt={selectedSentRequestForModal.alumni.fullName}
                  className="w-full h-full object-cover rounded-2xl"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-2xl">
                  <AcademicCapIcon className="h-12 w-12 text-primary-400" />
                </div>
              )}
              {/* Status Badge */}
              <div className="absolute top-2 left-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                  selectedSentRequestForModal.status === 'accepted' 
                    ? 'bg-green-500/20 text-green-300 border-green-500/30'
                    : selectedSentRequestForModal.status === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    : 'bg-red-500/20 text-red-300 border-red-500/30'
                }`}>
                  {selectedSentRequestForModal.status === 'accepted' ? '✓ Accepted' :
                   selectedSentRequestForModal.status === 'pending' ? '⏳ Pending' : '✗ Rejected'}
                </span>
              </div>
              {/* Tier Badge */}
              {selectedSentRequestForModal.status === 'accepted' && selectedSentRequestForModal.tier && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-500/20 text-primary-300 border border-primary-500/30">
                    <UserIcon className="h-3 w-3 mr-1" />
                    Tier {selectedSentRequestForModal.tier}
                  </span>
                </div>
              )}
            </div>
            {/* Content */}
            <div className="p-2 sm:p-3">
              {/* Alumni Name */}
              <h3 className="font-bold text-white mb-2 line-clamp-2 text-xl sm:text-2xl leading-tight">
                {selectedSentRequestForModal.alumni?.fullName || 'Alumni'}
              </h3>
              {/* Alumni Details */}
              <div className="space-y-1 mb-2">
                {selectedSentRequestForModal.alumni?.graduationYear && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-300">
                    <AcademicCapIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {selectedSentRequestForModal.alumni.graduationYear}
                  </div>
                )}
                {selectedSentRequestForModal.alumni?.course && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-300">
                    <svg className="h-4 w-4 mr-2 text-primary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3a1 1 0 01-1-1V5a1 1 0 011-1h9" /></svg>
                    {selectedSentRequestForModal.alumni.course}
                  </div>
                )}
                {selectedSentRequestForModal.alumni?.currentJobTitle && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-300">
                    <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {selectedSentRequestForModal.alumni.currentJobTitle}
                  </div>
                )}
                {selectedSentRequestForModal.alumni?.companyName && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-300">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {selectedSentRequestForModal.alumni.companyName}
                  </div>
                )}
              </div>
              {/* Your Request Message */}
              {selectedSentRequestForModal.descriptionbyUser && (
                <div className="mb-3">
                  <h4 className="text-base font-semibold text-white mb-1">Your Request Message</h4>
                  <div className="bg-primary-500/10 border-l-4 border-primary-400 rounded-md p-3 text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {selectedSentRequestForModal.descriptionbyUser}
                  </div>
                </div>
              )}
              {/* Alumni's Response Message */}
              {selectedSentRequestForModal.status === 'accepted' && selectedSentRequestForModal.descriptionbyAlumni && (
                <div className="mb-3">
                  <h4 className="text-base font-semibold text-white mb-1">Alumni's Response</h4>
                  <div className="bg-green-500/10 border-l-4 border-green-400 rounded-md p-3 text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {selectedSentRequestForModal.descriptionbyAlumni}
                  </div>
                </div>
              )}
              {/* Contact Information */}
              {getSentRequestContactSection()}
              {/* Close Button */}
              <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSentRequestModal(false)}
                  className="rounded-full px-4 py-1.5 font-semibold border border-white/30 text-white hover:bg-white/10 transition-all duration-200 w-full sm:w-auto"
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
        message={confirmMessage}
        onConfirm={() => { setConfirmOpen(false); if (confirmAction) confirmAction(); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default SentRequests; 