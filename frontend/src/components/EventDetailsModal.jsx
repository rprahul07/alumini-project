import React, { useState, useCallback } from 'react';
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
    currentUser && event && event.isRegistered
  );
  // Add state for confirm dialog if needed
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState(null);
  const [confirmMessage, setConfirmMessage] = React.useState('');

  // Update registration status when user or event changes
  React.useEffect(() => {
    if (currentUser && event) {
      setIsRegistered(!!event.isRegistered);
    } else {
      setIsRegistered(false);
    }
  }, [currentUser, event]);

  // Format date
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

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
  const registeredCount = event && event.registeredCount ? Number(event.registeredCount) : 0;
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-white/20 animate-slide-up">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-xl px-6 py-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            {/* Event Type Badge */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-xl text-white border border-white/30 font-body">
                {event.type}
              </span>
              {event.maxCapacity && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent-500/20 text-accent-300 border border-accent-400/30 backdrop-blur-xl">
                  {event.registeredCount || 0}/{event.maxCapacity} spots
                </span>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 backdrop-blur-xl text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 border border-white/30"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Event Title */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-white mb-3 leading-tight">
              {event.name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <div className="flex items-center text-sm font-body">
                <CalendarIcon className="h-4 w-4 mr-2 text-primary-400" />
                {formatDate(event.date)}
              </div>
              <div className="flex items-center text-sm font-body">
                <ClockIcon className="h-4 w-4 mr-2 text-secondary-400" />
                {event.time}
              </div>
              <div className="flex items-center text-sm font-body">
                <MapPinIcon className="h-4 w-4 mr-2 text-accent-400" />
                {event.location}
              </div>
            </div>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Organizer Info */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center mr-3 border border-primary-400/30">
                  <UserIcon className="h-5 w-5 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm font-body">Organized by</h3>
                  <p className="text-white/80 text-sm font-body">{event.organizer}</p>
                </div>
              </div>
            </div>

            {/* Registration Status */}
            {isLoggedIn && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                <h3 className="font-semibold text-white text-sm mb-2 font-body">Registration Status</h3>
                <div className="flex items-center">
                  {isRegistered ? (
                    <div className="flex items-center text-green-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium font-body">You're registered!</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-white/60">
                      <div className="w-2 h-2 bg-white/40 rounded-full mr-2"></div>
                      <span className="text-sm font-medium font-body">Not registered</span>
                    </div>
                  )}
                </div>
                {maxCapacity && (
                  <div className="text-xs text-white/60 mt-1 font-body">
                    {registeredCount} of {maxCapacity} spots taken
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Event Description */}
          {event.description && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center font-display">
                <div className="w-2 h-2 bg-primary-400 rounded-full mr-2"></div>
                About This Event
              </h3>
              <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                <p className="text-white/90 leading-relaxed text-sm font-body">
                  {event.description}
                </p>
              </div>
            </div>
          )}

          {/* Event Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 text-center">
              <div className="text-lg font-bold text-primary-400 mb-1 font-display">
                {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric' })}
              </div>
              <div className="text-xs text-white/70 font-body">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 text-center">
              <div className="text-lg font-bold text-secondary-400 mb-1 font-display">
                {event.time}
              </div>
              <div className="text-xs text-white/70 font-body">Time</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 text-center">
              <div className="text-lg font-bold text-accent-400 mb-1 font-display">
                {registeredCount}
              </div>
              <div className="text-xs text-white/70 font-body">Registered</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 text-center">
              <div className="text-lg font-bold text-white/80 mb-1 font-display">
                {event.maxCapacity || '∞'}
              </div>
              <div className="text-xs text-white/70 font-body">Capacity</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-white/20">
            {!isLoggedIn && !authLoading ? (
              <div className="text-center sm:text-left">
                <h4 className="text-lg font-bold text-white mb-1 font-display">
                  Ready to join this event?
                </h4>
                <p className="text-white/80 mb-4 text-sm font-body">
                  Sign in to register and get updates about this event.
                </p>
                <a
                  href="/role-selection"
                  className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-sm font-body"
                >
                  <UserIcon className="h-4 w-4" />
                  Login to Register
                </a>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl font-semibold border-2 border-white/30 text-white/80 hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-sm font-body"
                >
                  Close
                </button>
                {canRegister && (
                  <button
                    onClick={handleRegistration}
                    disabled={buttonDisabled}
                    className={`px-6 py-3 rounded-2xl font-semibold shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-sm font-body ${
                      buttonDisabled
                        ? 'bg-white/20 backdrop-blur-xl text-white/60 cursor-not-allowed border border-white/30'
                        : isRegistered
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 hover:shadow-2xl'
                    }`}
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

  // Only render modal if it's open and event exists
  if (!isOpen || !event) return null;
  
  return ReactDOM.createPortal(modalContent, document.body);
};

export default EventDetailsModal; 
    