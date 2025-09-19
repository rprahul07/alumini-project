import React, { useState, useEffect } from 'react';
import { XMarkIcon, EnvelopeIcon, PhoneIcon, GlobeAltIcon, AcademicCapIcon, UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';
import axios from '../config/axios';
import useAlert from '../hooks/useAlert';
import { useAuth } from '../contexts/AuthContext';

const AlumniDetailsModal = ({ open, onClose, alumni, onRequestMentorship, onRefresh }) => {
  const [contactInfo, setContactInfo] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState(false);
  const { showAlert } = useAlert();
  const { user } = useAuth();

  // Fetch contact info and alumni response if mentorship request is accepted
  useEffect(() => {
    if (open && alumni?.userId && alumni?.connectionStatus === 'accepted') {
      fetchContactInfo();
    } else {
      setContactInfo(null);
      setContactError(false);
    }
  }, [open, alumni?.userId, alumni?.connectionStatus]);

  const fetchContactInfo = async () => {
    try {
      setContactLoading(true);
      setContactError(false);
      const response = await axios.get(`/api/alumni/tier/${alumni.userId}`);
      if (response.data.success) {
        setContactInfo(response.data.data);
      } else {
        setContactError(true);
      }
    } catch (error) {
      setContactError(true);
    } finally {
      setContactLoading(false);
    }
  };

  const handleRequestMentorship = () => {
    onRequestMentorship(alumni);
    onClose();
  };

  const getContactSection = () => {
    // Hide mentorship functionality for admin users
    if (user && user.role === 'admin') {
      return (
        <div className="mb-6">
          <h4 className="text-base font-semibold text-slate-900 mb-2 font-sans">Contact Information</h4>
          <div className="text-center pt-2">
            <p className="text-xs text-slate-600 mb-2 font-sans">
              Admin users cannot request mentorship.
            </p>
          </div>
        </div>
      );
    }

    // Prevent self-request: if viewing own profile, show message instead of button
    if (user && alumni?.userId === user.id) {
      return (
        <div className="mb-6">
          <h4 className="text-base font-semibold text-slate-900 mb-2 font-sans">Contact Information</h4>
          <div className="text-center pt-2">
            <p className="text-xs text-slate-600 mb-2 font-sans">
              You can't send a request to yourself.
            </p>
          </div>
        </div>
      );
    }

    if (alumni?.connectionStatus === 'accepted') {
      if (contactLoading) {
        return (
          <div className="mb-6">
            <h4 className="text-base font-semibold text-slate-900 mb-2 font-sans">Contact Information</h4>
            <div className="space-y-2">
              <div className="animate-pulse flex items-center space-x-3">
                <div className="h-4 w-4 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-full animate-spin"></div>
                <div className="h-3 bg-slate-100 rounded w-40"></div>
              </div>
              <div className="animate-pulse flex items-center space-x-3">
                <div className="h-4 w-4 bg-gradient-to-r from-secondary-400 to-primary-500 rounded-full animate-spin"></div>
                <div className="h-3 bg-slate-100 rounded w-28"></div>
              </div>
              <div className="animate-pulse flex items-center space-x-3">
                <div className="h-4 w-4 bg-gradient-to-r from-accent-400 to-primary-500 rounded-full animate-spin"></div>
                <div className="h-3 bg-slate-100 rounded w-32"></div>
              </div>
            </div>
          </div>
        );
      }

      if (contactError) {
        return (
          <div className="mb-6">
            <h4 className="text-base font-semibold text-slate-900 mb-2 font-sans">Contact Information</h4>
            <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/50 rounded-xl p-3 text-center">
              <p className="text-red-600 text-xs font-sans">Unable to load contact information</p>
              <button 
                onClick={fetchContactInfo}
                className="mt-1 text-red-600 hover:text-red-200 text-xs underline transition-colors font-sans"
              >
                Try again
              </button>
            </div>
          </div>
        );
      }

      if (contactInfo) {
        return (
          <div className="mb-6">
            <h4 className="text-base font-semibold text-slate-900 mb-2 font-sans">Contact Information</h4>
            <div className="space-y-2">
              {contactInfo.email && (
                <div className="flex items-center text-xs text-slate-600 font-sans">
                  <EnvelopeIcon className="h-4 w-4 mr-2 text-primary-500" />
                  <a 
                    href={`mailto:${contactInfo.email}`}
                    className="text-primary-600 hover:text-primary-200 transition-colors font-medium"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              )}
              {contactInfo.linkedinUrl && (
                <div className="flex items-center text-xs text-slate-600 font-sans">
                  <GlobeAltIcon className="h-4 w-4 mr-2 text-secondary-500" />
                  <a 
                    href={contactInfo.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary-600 hover:text-secondary-200 transition-colors font-medium"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
              {contactInfo.phoneNumber && (
                <div className="flex items-center text-xs text-slate-600 font-sans">
                  <PhoneIcon className="h-4 w-4 mr-2 text-accent-500" />
                  <a 
                    href={`tel:${contactInfo.phoneNumber}`}
                    className="text-accent-600 hover:text-accent-200 transition-colors font-medium"
                  >
                    {contactInfo.phoneNumber}
                  </a>
                </div>
              )}
              {!contactInfo.email && !contactInfo.linkedinUrl && !contactInfo.phoneNumber && (
                <p className="text-gray-400 text-xs font-sans">No contact information available</p>
              )}
            </div>
          </div>
        );
      }
    }

    // Show blurred contact section for pending or no request
    return (
      <div className="mb-6">
        <h4 className="text-base font-semibold text-slate-900 mb-2 font-sans">Contact Information</h4>
        <div className="space-y-2 filter blur-sm pointer-events-none">
          <div className="flex items-center text-xs text-gray-500 font-sans">
            <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-gray-400">••••••••@••••••••.com</span>
          </div>
          <div className="flex items-center text-xs text-gray-500 font-sans">
            <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-gray-400">LinkedIn Profile</span>
          </div>
          <div className="flex items-center text-xs text-gray-500 font-sans">
            <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-gray-400">+•• ••• ••• ••••</span>
          </div>
        </div>
        <div className="text-center pt-3">
          <p className="text-xs text-slate-600 mb-3 font-sans">
            {alumni?.connectionStatus === 'pending' 
              ? 'Contact information will be available once your mentorship request is accepted'
              : 'Request mentorship to access contact information'
            }
          </p>
          {alumni?.connectionStatus !== 'pending' && (
            <button
              onClick={handleRequestMentorship}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-slate-900 px-4 py-2 rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 text-xs font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 font-sans"
            >
              Request Mentorship
            </button>
          )}
        </div>
      </div>
    );
  };

  if (!open) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2 z-[999999]"
        style={{ zIndex: 999999 }}
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur-2xl rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide p-4 border border-slate-200 shadow-2xl relative"
          style={{ scrollbarWidth: 'none' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100/40 to-secondary-100/40 rounded-2xl"></div>
          {/* Header */}
          <div className="relative z-10 flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600 font-sans">
              Alumni Profile
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-100 backdrop-blur-sm rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all duration-300 border border-slate-200 hover:border-slate-300"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Alumni Image */}
          <div className="relative z-10 h-28 sm:h-32 bg-slate-50 backdrop-blur-sm rounded-2xl mb-4 overflow-hidden border border-slate-200">
            {alumni?.photoUrl ? (
              <img 
                src={alumni.photoUrl} 
                alt={alumni.name}
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl">
                <AcademicCapIcon className="h-12 w-12 text-primary-600" />
              </div>
            )}
            
            {/* Connection Status Badge */}
            <div className="absolute top-2 left-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm border ${
                alumni?.connectionStatus === 'accepted' 
                  ? 'bg-green-500/20 text-green-600 border-green-400/50'
                  : alumni?.connectionStatus === 'pending'
                  ? 'bg-yellow-500/20 text-yellow-600 border-yellow-400/50'
                  : alumni?.connectionStatus === 'rejected'
                  ? 'bg-red-500/20 text-red-600 border-red-400/50'
                  : 'bg-slate-100 text-slate-900 border-slate-300'
              }`}>
                {alumni?.connectionStatus === 'accepted' ? '✓ Connected' :
                 alumni?.connectionStatus === 'pending' ? '⏳ Pending' :
                 alumni?.connectionStatus === 'rejected' ? '✗ Rejected' : 'No Request'}
              </span>
            </div>

            {/* Tier Badge */}
            {alumni?.connectionStatus === 'accepted' && alumni?.tier && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-600 border border-primary-400/50 backdrop-blur-sm">
                  <UserIcon className="h-2.5 w-2.5 mr-1" />
                  Tier {alumni.tier}
                </span>
              </div>
            )}
          </div>

          {/* Alumni Content */}
          <div className="relative z-10 space-y-4">
            {/* Alumni Name */}
            <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 text-lg sm:text-xl leading-tight font-sans">
              {alumni?.name}
            </h3>

            {/* Alumni Details */}
            <div className="space-y-2 mb-4">
              {alumni?.graduationYear && (
                <div className="flex items-center text-xs text-slate-600 font-sans">
                  <AcademicCapIcon className="h-4 w-4 mr-2 text-primary-500" />
                  <span className="font-medium">Batch: {alumni.graduationYear}</span>
                </div>
              )}
              {alumni?.course && (
                <div className="flex items-center text-xs text-slate-600 font-sans">
                  <svg className="h-4 w-4 mr-2 text-secondary-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3a1 1 0 01-1-1V5a1 1 0 011-1h9" /></svg>
                  <span className="font-medium">{alumni.course}</span>
                </div>
              )}
              {alumni?.currentJobTitle && (
                <div className="flex items-center text-xs text-slate-600 font-sans">
                  <UserIcon className="h-4 w-4 mr-2 text-accent-500" />
                  <span className="font-medium">{alumni.currentJobTitle}</span>
                </div>
              )}
              {alumni?.companyName && (
                <div className="flex items-center text-xs text-slate-600 font-sans">
                  <BuildingOfficeIcon className="h-4 w-4 mr-2 text-primary-600" />
                  <span className="font-medium">{alumni.companyName}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {alumni?.bio && (
              <div className="mb-6">
                <h4 className="text-base font-semibold text-slate-900 mb-2 font-sans">Bio</h4>
                <div className="bg-slate-50 backdrop-blur-sm rounded-xl p-3 text-slate-600 text-xs leading-relaxed whitespace-pre-line break-words border border-slate-200 font-sans">
                  {alumni.bio}
                </div>
              </div>
            )}

            {/* Alumni Response Message (if accepted) */}
            {alumni?.connectionStatus === 'accepted' && contactInfo?.descriptionbyAlumni && (
              <div className="mb-6">
                <h4 className="text-base font-semibold text-slate-900 mb-2 font-sans">Alumni's Response</h4>
                <div className="bg-green-500/10 backdrop-blur-sm border-l-4 border-green-400/50 rounded-xl p-3 text-slate-600 text-xs leading-relaxed whitespace-pre-line font-sans">
                  {contactInfo.descriptionbyAlumni}
                </div>
              </div>
            )}

            {/* Contact Information */}
            {getContactSection()}

            {/* Close Button */}
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={onClose}
                className="rounded-xl px-4 py-2 font-semibold border border-slate-300 text-slate-900 hover:bg-slate-100 hover:border-white/50 transition-all duration-300 w-full sm:w-auto backdrop-blur-sm text-sm font-sans"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default AlumniDetailsModal; 
 
 