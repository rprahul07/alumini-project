import React, { useState } from 'react';
import { XMarkIcon, CalendarIcon, ClockIcon, MapPinIcon, UserGroupIcon, UserIcon } from '@heroicons/react/24/outline';
import OptimizedImage from './OptimizedImage';
import axios from '../config/axios';
import { toast } from 'react-toastify';
import ConfirmDialog from './ConfirmDialog';
import { useAuth } from '../contexts/AuthContext';
import ReactDOM from 'react-dom';

const EventDetailsModal = ({ event, user, isOpen, onClose, onEventUpdate }) => {
  // Use auth context as primary source, fallback to prop for backward compatibility
  const { user: authUser, loading: authLoading } = useAuth();
  const currentUser = authUser || user; // Use authUser as primary, user prop as fallback
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(
    currentUser && event && event.registeredUsers && event.registeredUsers.includes(currentUser.id)
  );
  // Add state for confirm dialog if needed
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState(null);
  const [confirmMessage, setConfirmMessage] = React.useState('');

  // Update registration status when user or event changes
  React.useEffect(() => {
    if (currentUser && event && event.registeredUsers) {
      setIsRegistered(event.registeredUsers.includes(currentUser.id));
    } else {
      setIsRegistered(false);
    }
  }, [currentUser, event]);

  if (!isOpen || !event) return null;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle registration
  const handleRegistration = async () => {
    if (!currentUser) {
      toast.error('Please log in to register for events');
      return;
    }

    try {
      setIsRegistering(true);
      
      const endpoint = `/api/${currentUser.role}/event/${event.id}`;
      const response = await axios.post(endpoint);

      if (response.data.success) {
        setIsRegistered(!isRegistered);
        if (onEventUpdate) {
          onEventUpdate();
        }
      } else {
        toast.error(response.data.message || 'Failed to register for event');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.status === 401) {
        toast.error('Please log in to register for events');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. You cannot register for this event.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Network error. Please try again.');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  // Check if user can register - improved logic with auth loading handling
  const isLoggedIn = !authLoading && !!currentUser;
  const isEventCreator = currentUser && event.user && currentUser.id === event.user.id;
  const isAdmin = currentUser?.role === 'admin';
  const isFaculty = currentUser?.role === 'faculty';
  
  const canRegister = isLoggedIn && 
    (currentUser.role === 'student' || currentUser.role === 'alumni') && 
    !isEventCreator && 
    !isAdmin;
  
  // Check if event is in the past
  const isPastEvent = event ? new Date(event.date) < new Date(new Date().setHours(0,0,0,0)) : false;
  const maxCapacity = event && Number(event.maxCapacity) > 0 ? Number(event.maxCapacity) : null;
  const registeredCount = event && event.registeredUsers ? event.registeredUsers.length : 0;
  const isEventFull = maxCapacity && registeredCount >= maxCapacity;
  const registrationClosed = isPastEvent || isEventFull;

  // Registration button logic - improved with loading state
  const buttonText = authLoading
    ? 'Loading...'
    : registrationClosed
      ? 'Registration Closed'
      : !isLoggedIn
        ? 'Login to Register'
        : isEventCreator
          ? 'You Created This Event'
        : isAdmin
          ? 'Admin Cannot Register'
        : isFaculty
          ? 'Faculty Cannot Register'
          : isRegistered
            ? 'Registered'
            : 'Register Now';
            
  const buttonDisabled = authLoading || registrationClosed || !isLoggedIn || isFaculty || isAdmin || isEventCreator || isRegistered || isRegistering;
  
  const buttonClass = authLoading
    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
    : registrationClosed
      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
      : !isLoggedIn
        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
        : isEventCreator || isAdmin || isFaculty
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : isRegistered
            ? 'bg-green-500 text-white cursor-not-allowed'
            : 'bg-primary text-white hover:bg-primary-700';

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Event Type Badge */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-white/90 text-primary-700">
                {event.type}
              </span>
              {event.maxCapacity && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-700">
                  {event.registeredCount || 0}/{event.maxCapacity} spots
                </span>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Event Title */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              {event.name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <div className="flex items-center text-sm">
                <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                {formatDate(event.date)}
              </div>
              <div className="flex items-center text-sm">
                <ClockIcon className="h-4 w-4 mr-2 text-primary" />
                {event.time}
              </div>
              <div className="flex items-center text-sm">
                <MapPinIcon className="h-4 w-4 mr-2 text-primary" />
                {event.location}
              </div>
            </div>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Organizer Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <UserIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Organized by</h3>
                  <p className="text-gray-600 text-sm">{event.organizer}</p>
                </div>
              </div>
            </div>

            {/* Registration Status */}
            {isLoggedIn && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-2">Registration Status</h3>
                <div className="flex items-center">
                  {isRegistered ? (
                    <div className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium">You're registered!</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                      <span className="text-sm font-medium">Not registered</span>
                    </div>
                  )}
                </div>
                {event.maxCapacity && (
                  <div className="text-xs text-gray-500 mt-1">
                    {event.registeredCount || 0} of {event.maxCapacity} spots taken
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Event Description */}
          {event.description && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                About This Event
              </h3>
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed text-sm">
                  {event.description}
                </p>
              </div>
            </div>
          )}

          {/* Event Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-primary-600 mb-1">
                {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric' })}
              </div>
              <div className="text-xs text-gray-600">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-secondary-600 mb-1">
                {event.time}
              </div>
              <div className="text-xs text-gray-600">Time</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-accent-600 mb-1">
                {event.registeredCount || 0}
              </div>
              <div className="text-xs text-gray-600">Registered</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-gray-600 mb-1">
                {event.maxCapacity || '∞'}
              </div>
              <div className="text-xs text-gray-600">Capacity</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
            {!isLoggedIn && !authLoading ? (
              <div className="text-center sm:text-left">
                <h4 className="text-lg font-bold text-gray-900 mb-1">
                  Ready to join this event?
                </h4>
                <p className="text-gray-600 mb-4 text-sm">
                  Sign in to register and get updates about this event.
                </p>
                <a
                  href="/role-selection"
                  className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold bg-primary text-white hover:bg-primary-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm"
                >
                  <UserIcon className="h-4 w-4" />
                  Login to Register
                </a>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 text-sm"
                >
                  Close
                </button>
                {canRegister && (
                  <button
                    onClick={handleRegistration}
                    disabled={buttonDisabled}
                    className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-sm ${buttonClass}`}
                  >
                    {isRegistered ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {buttonText}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {buttonText}
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Action"
        message={confirmMessage}
        onConfirm={() => { setConfirmOpen(false); if (confirmAction) confirmAction(); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default EventDetailsModal; 
    