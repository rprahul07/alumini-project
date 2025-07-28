import React, { useState, useEffect } from 'react';
import { XMarkIcon, EnvelopeIcon, PhoneIcon, GlobeAltIcon, AcademicCapIcon, UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { Heart } from 'lucide-react';
import axios from '../config/axios';
import useAlert from '../hooks/useAlert';
import { useAuth } from '../contexts/AuthContext';

const AlumniDetailsModal = ({ open, onClose, alumni, onRequestMentorship, onRefresh, isBookmarked = false, onBookmarkToggle, bookmarkLoading = false }) => {
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
        <div className="mb-3">
          <h4 className="text-base font-semibold text-gray-900 mb-1">Contact Information</h4>
          <div className="text-center pt-2">
            <p className="text-xs sm:text-sm text-gray-500 mb-3">
              You can't send a request to yourself.
            </p>
          </div>
        </div>
      );
    }

    if (alumni?.connectionStatus === 'accepted') {
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
                onClick={fetchContactInfo}
                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
              >
                Try again
              </button>
            </div>
          </div>
        );
      }

      if (contactInfo) {
        return (
          <div className="mb-3">
            <h4 className="text-base font-semibold text-gray-900 mb-1">Contact Information</h4>
            <div className="space-y-1">
              {contactInfo.email && (
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <a 
                    href={`mailto:${contactInfo.email}`}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              )}
              {contactInfo.linkedinUrl && (
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <a 
                    href={contactInfo.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
              {contactInfo.phoneNumber && (
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                  <a 
                    href={`tel:${contactInfo.phoneNumber}`}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {contactInfo.phoneNumber}
                  </a>
                </div>
              )}
              {!contactInfo.email && !contactInfo.linkedinUrl && !contactInfo.phoneNumber && (
                <p className="text-gray-500 text-xs sm:text-sm">No contact information available</p>
              )}
            </div>
          </div>
        );
      }
    }

    // Show blurred contact section for pending or no request
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
            {alumni?.connectionStatus === 'pending' 
              ? 'Contact information will be available once your mentorship request is accepted'
              : 'Request mentorship to access contact information'
            }
          </p>
          {alumni?.connectionStatus !== 'pending' && (
            <button
              onClick={handleRequestMentorship}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
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
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
        <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide p-3" style={{ scrollbarWidth: 'none' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Alumni Profile</h2>
            <div className="flex items-center gap-2">
              {/* Bookmark Button */}
              <button
                onClick={() => onBookmarkToggle && onBookmarkToggle(alumni?.userId)}
                disabled={bookmarkLoading}
                className={`p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors ${
                  bookmarkLoading ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                {bookmarkLoading ? (
                  <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Heart 
                    size={14} 
                    className={`${isBookmarked ? 'text-red-500 fill-red-500' : 'text-gray-600'} transition-colors`} 
                  />
                )}
              </button>
              {/* Close Button */}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Alumni Image */}
          <div className="relative h-28 sm:h-36 bg-gray-200 rounded-2xl mb-2">
            {alumni?.photoUrl ? (
              <img 
                src={alumni.photoUrl} 
                alt={alumni.name}
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl">
                <AcademicCapIcon className="h-12 w-12 text-indigo-400" />
              </div>
            )}
            
            {/* Connection Status Badge */}
            <div className="absolute top-2 left-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                alumni?.connectionStatus === 'accepted' 
                  ? 'bg-green-100 text-green-800'
                  : alumni?.connectionStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : alumni?.connectionStatus === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {alumni?.connectionStatus === 'accepted' ? '✓ Connected' :
                 alumni?.connectionStatus === 'pending' ? '⏳ Pending' :
                 alumni?.connectionStatus === 'rejected' ? '✗ Rejected' : 'No Request'}
              </span>
            </div>

            {/* Tier Badge */}
            {alumni?.connectionStatus === 'accepted' && alumni?.tier && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-800">
                  <UserIcon className="h-3 w-3 mr-1" />
                  Tier {alumni.tier}
                </span>
              </div>
            )}
          </div>

          {/* Alumni Content */}
          <div className="p-2 sm:p-3">
            {/* Alumni Name */}
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-xl sm:text-2xl leading-tight">
              {alumni?.name}
            </h3>

            {/* Alumni Details */}
            <div className="space-y-1 mb-2">
              {alumni?.graduationYear && (
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <AcademicCapIcon className="h-4 w-4 mr-2 text-gray-400" />
                  {alumni.graduationYear}
                </div>
              )}
              {alumni?.course && (
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <svg className="h-4 w-4 mr-2 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3a1 1 0 01-1-1V5a1 1 0 011-1h9" /></svg>
                  {alumni.course}
                </div>
              )}
              {alumni?.currentJobTitle && (
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                  {alumni.currentJobTitle}
                </div>
              )}
              {alumni?.companyName && (
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-400" />
                  {alumni.companyName}
                </div>
              )}
            </div>

            {/* Bio */}
            {alumni?.bio && (
              <div className="mb-3">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Bio</h4>
                <div className="bg-gray-50 rounded-lg p-3 text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line break-words">
                  {alumni.bio}
                </div>
              </div>
            )}

            {/* Alumni Response Message (if accepted) */}
            {alumni?.connectionStatus === 'accepted' && contactInfo?.descriptionbyAlumni && (
              <div className="mb-3">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Alumni's Response</h4>
                <div className="bg-green-50 border-l-4 border-green-400 rounded-md p-3 text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {contactInfo.descriptionbyAlumni}
                </div>
              </div>
            )}

            {/* Contact Information */}
            {getContactSection()}

            {/* Close Button */}
            <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={onClose}
                className="rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlumniDetailsModal; 
 
 