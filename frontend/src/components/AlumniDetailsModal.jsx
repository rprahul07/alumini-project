import React, { useState, useEffect } from 'react';
import { XMarkIcon, EnvelopeIcon, PhoneIcon, GlobeAltIcon, AcademicCapIcon, UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
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
    // Prevent self-request: if viewing own profile, show message instead of button
    if (user && alumni?.userId === user.id) {
      return (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3 font-display">Contact Information</h4>
          <div className="text-center pt-2">
            <p className="text-sm text-gray-300 mb-3">
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
            <h4 className="text-lg font-semibold text-white mb-3 font-display">Contact Information</h4>
            <div className="space-y-3">
              <div className="animate-pulse flex items-center space-x-3">
                <div className="h-5 w-5 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-full animate-spin"></div>
                <div className="h-4 bg-white/20 rounded w-48"></div>
              </div>
              <div className="animate-pulse flex items-center space-x-3">
                <div className="h-5 w-5 bg-gradient-to-r from-secondary-400 to-primary-500 rounded-full animate-spin"></div>
                <div className="h-4 bg-white/20 rounded w-32"></div>
              </div>
              <div className="animate-pulse flex items-center space-x-3">
                <div className="h-5 w-5 bg-gradient-to-r from-accent-400 to-primary-500 rounded-full animate-spin"></div>
                <div className="h-4 bg-white/20 rounded w-40"></div>
              </div>
            </div>
          </div>
        );
      }

      if (contactError) {
        return (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3 font-display">Contact Information</h4>
            <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/50 rounded-2xl p-4 text-center">
              <p className="text-red-300 text-sm">Unable to load contact information</p>
              <button 
                onClick={fetchContactInfo}
                className="mt-2 text-red-300 hover:text-red-200 text-sm underline transition-colors"
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
            <h4 className="text-lg font-semibold text-white mb-3 font-display">Contact Information</h4>
            <div className="space-y-3">
              {contactInfo.email && (
                <div className="flex items-center text-sm text-gray-300">
                  <EnvelopeIcon className="h-5 w-5 mr-3 text-primary-400" />
                  <a 
                    href={`mailto:${contactInfo.email}`}
                    className="text-primary-300 hover:text-primary-200 transition-colors font-medium"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              )}
              {contactInfo.linkedinUrl && (
                <div className="flex items-center text-sm text-gray-300">
                  <GlobeAltIcon className="h-5 w-5 mr-3 text-secondary-400" />
                  <a 
                    href={contactInfo.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary-300 hover:text-secondary-200 transition-colors font-medium"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
              {contactInfo.phoneNumber && (
                <div className="flex items-center text-sm text-gray-300">
                  <PhoneIcon className="h-5 w-5 mr-3 text-accent-400" />
                  <a 
                    href={`tel:${contactInfo.phoneNumber}`}
                    className="text-accent-300 hover:text-accent-200 transition-colors font-medium"
                  >
                    {contactInfo.phoneNumber}
                  </a>
                </div>
              )}
              {!contactInfo.email && !contactInfo.linkedinUrl && !contactInfo.phoneNumber && (
                <p className="text-gray-400 text-sm">No contact information available</p>
              )}
            </div>
          </div>
        );
      }
    }

    // Show blurred contact section for pending or no request
    return (
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-3 font-display">Contact Information</h4>
        <div className="space-y-3 filter blur-sm pointer-events-none">
          <div className="flex items-center text-sm text-gray-500">
            <EnvelopeIcon className="h-5 w-5 mr-3 text-gray-400" />
            <span className="text-gray-400">••••••••@••••••••.com</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <GlobeAltIcon className="h-5 w-5 mr-3 text-gray-400" />
            <span className="text-gray-400">LinkedIn Profile</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <PhoneIcon className="h-5 w-5 mr-3 text-gray-400" />
            <span className="text-gray-400">+•• ••• ••• ••••</span>
          </div>
        </div>
        <div className="text-center pt-4">
          <p className="text-sm text-gray-300 mb-4">
            {alumni?.connectionStatus === 'pending' 
              ? 'Contact information will be available once your mentorship request is accepted'
              : 'Request mentorship to access contact information'
            }
          </p>
          {alumni?.connectionStatus !== 'pending' && (
            <button
              onClick={handleRequestMentorship}
              className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-2xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Request Mentorship
            </button>
          )}
        </div>
      </div>
    );
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2 z-[999999]"
        style={{ zIndex: 999999 }}
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white/10 backdrop-blur-2xl rounded-3xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide p-6 border border-white/20 shadow-2xl relative"
          style={{ scrollbarWidth: 'none' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400/10 to-secondary-400/10 rounded-3xl animate-pulse"></div>
          {/* Header */}
          <div className="relative z-10 flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400 font-display">
              Alumni Profile
            </h2>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white/70 hover:text-white hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Alumni Image */}
          <div className="relative z-10 h-32 sm:h-40 bg-white/10 backdrop-blur-sm rounded-3xl mb-6 overflow-hidden border border-white/20">
            {alumni?.photoUrl ? (
              <img 
                src={alumni.photoUrl} 
                alt={alumni.name}
                className="w-full h-full object-cover rounded-3xl"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400/20 to-secondary-400/20 rounded-3xl">
                <AcademicCapIcon className="h-16 w-16 text-primary-300" />
              </div>
            )}
            
            {/* Connection Status Badge */}
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${
                alumni?.connectionStatus === 'accepted' 
                  ? 'bg-green-500/20 text-green-300 border-green-400/50'
                  : alumni?.connectionStatus === 'pending'
                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50'
                  : alumni?.connectionStatus === 'rejected'
                  ? 'bg-red-500/20 text-red-300 border-red-400/50'
                  : 'bg-white/20 text-white border-white/30'
              }`}>
                {alumni?.connectionStatus === 'accepted' ? '✓ Connected' :
                 alumni?.connectionStatus === 'pending' ? '⏳ Pending' :
                 alumni?.connectionStatus === 'rejected' ? '✗ Rejected' : 'No Request'}
              </span>
            </div>

            {/* Tier Badge */}
            {alumni?.connectionStatus === 'accepted' && alumni?.tier && (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-300 border border-primary-400/50 backdrop-blur-sm">
                  <UserIcon className="h-3 w-3 mr-1" />
                  Tier {alumni.tier}
                </span>
              </div>
            )}
          </div>

          {/* Alumni Content */}
          <div className="relative z-10 space-y-6">
            {/* Alumni Name */}
            <h3 className="font-bold text-white mb-4 line-clamp-2 text-2xl sm:text-3xl leading-tight font-display">
              {alumni?.name}
            </h3>

            {/* Alumni Details */}
            <div className="space-y-3 mb-6">
              {alumni?.graduationYear && (
                <div className="flex items-center text-sm text-gray-300">
                  <AcademicCapIcon className="h-5 w-5 mr-3 text-primary-400" />
                  <span className="font-medium">Batch: {alumni.graduationYear}</span>
                </div>
              )}
              {alumni?.course && (
                <div className="flex items-center text-sm text-gray-300">
                  <svg className="h-5 w-5 mr-3 text-secondary-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3a1 1 0 01-1-1V5a1 1 0 011-1h9" /></svg>
                  <span className="font-medium">{alumni.course}</span>
                </div>
              )}
              {alumni?.currentJobTitle && (
                <div className="flex items-center text-sm text-gray-300">
                  <UserIcon className="h-5 w-5 mr-3 text-accent-400" />
                  <span className="font-medium">{alumni.currentJobTitle}</span>
                </div>
              )}
              {alumni?.companyName && (
                <div className="flex items-center text-sm text-gray-300">
                  <BuildingOfficeIcon className="h-5 w-5 mr-3 text-primary-300" />
                  <span className="font-medium">{alumni.companyName}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {alumni?.bio && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3 font-display">Bio</h4>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-gray-300 text-sm leading-relaxed whitespace-pre-line break-words border border-white/20">
                  {alumni.bio}
                </div>
              </div>
            )}

            {/* Alumni Response Message (if accepted) */}
            {alumni?.connectionStatus === 'accepted' && contactInfo?.descriptionbyAlumni && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3 font-display">Alumni's Response</h4>
                <div className="bg-green-500/10 backdrop-blur-sm border-l-4 border-green-400/50 rounded-2xl p-4 text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {contactInfo.descriptionbyAlumni}
                </div>
              </div>
            )}

            {/* Contact Information */}
            {getContactSection()}

            {/* Close Button */}
            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-2xl px-6 py-3 font-semibold border border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlumniDetailsModal; 
 
 