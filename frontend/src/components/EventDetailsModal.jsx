import React, { useState, useCallback } from 'react';
import { XMarkIcon, CalendarIcon, ClockIcon, MapPinIcon, UserGroupIcon, UserIcon } from '@heroicons/react/24/outline';
import OptimizedImage from './OptimizedImage';
import axios from '../config/axios';
import { toast } from 'react-toastify';
import ConfirmDialog from './ConfirmDialog';
import { useAuth } from '../contexts/AuthContext';
import ReactDOM from 'react-dom';
import { useInteractionTracking, useAnalytics } from '../hooks/useAnalytics';

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
  
  // Analytics tracking
  const { trackClick, trackHover } = useInteractionTracking('modal');
  const { trackEngagement, trackConversion } = useAnalytics();
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

  // Early return if event is null or not open - AFTER all hooks
  if (!event || !isOpen) {
    return null;
  }

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
  const isEventCreator = currentUser && event?.user && currentUser.id === event.user.id;
  const isAdmin = currentUser?.role === 'admin';
  const isFaculty = currentUser?.role === 'faculty';
  
  const canRegister = isLoggedIn && 
    currentUser && 
    (currentUser.role === 'student' || currentUser.role === 'alumni') && 
    !isEventCreator && 
    !isAdmin;
  
  // Check if event is in the past
  const isPastEvent = event ? new Date(event.date) < new Date(new Date().setHours(0,0,0,0)) : false;
  const maxCapacity = event && Number(event.maxCapacity) > 0 ? Number(event.maxCapacity) : null;
  const registeredCount = event && event.registeredCount ? Number(event.registeredCount) : 0;
  const isEventFull = maxCapacity && registeredCount >= maxCapacity;
  
  // Debug logging to see what data we're receiving
  console.log('EventDetailsModal - Event data:', event);
  console.log('EventDetailsModal - Registered count:', registeredCount);
  console.log('EventDetailsModal - Max capacity:', maxCapacity);
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-fade-in">
      <div className="bg-white/80 backdrop-blur-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 animate-slide-up">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 backdrop-blur-xl px-5 py-3 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {/* Event Type Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 backdrop-blur-xl text-slate-700 border border-slate-300 font-sans">
                {event.type}
              </span>
              {event.maxCapacity && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 backdrop-blur-xl font-sans">
                  {registeredCount}/{event.maxCapacity} spots
                </span>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                trackClick(null, 'event_modal_close');
                trackEngagement('modal_close', {
                  modal_type: 'event_details',
                  event_id: event?.id,
                  event_title: event?.title
                });
                onClose();
              }}
              className="w-7 h-7 bg-slate-100 backdrop-blur-xl text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 transition-all duration-200 border border-slate-300"
            >
              <XMarkIcon className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)] scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Event Title */}
          <div className="mb-4">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-2 leading-tight font-sans">
              {event.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-slate-600">
              <div className="flex items-center text-xs font-sans">
                <CalendarIcon className="h-3 w-3 mr-1.5 text-primary-400" />
                {formatDate(event.date)}
              </div>
              <div className="flex items-center text-xs font-sans">
                <ClockIcon className="h-3 w-3 mr-1.5 text-secondary-400" />
                {event.time}
              </div>
              <div className="flex items-center text-xs font-sans">
                <MapPinIcon className="h-3 w-3 mr-1.5 text-accent-400" />
                {event.location}
              </div>
            </div>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Organizer Info */}
            <div className="bg-slate-100 backdrop-blur-xl rounded-xl p-3 border border-slate-200">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center mr-2 border border-primary-400/30">
                  <UserIcon className="h-4 w-4 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-xs font-sans">Organized by</h3>
                  <p className="text-slate-600 text-xs font-sans">{event.organizer}</p>
                </div>
              </div>
            </div>

            {/* Registration Status */}
            {isLoggedIn && (
              <div className="bg-slate-100 backdrop-blur-xl rounded-xl p-3 border border-slate-200">
                <h3 className="font-semibold text-slate-900 text-xs mb-2 font-sans">Registration Status</h3>
                <div className="flex items-center">
                  {isRegistered ? (
                    <div className="flex items-center text-green-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
                      <span className="text-xs font-medium font-sans">You're registered!</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-slate-500">
                      <div className="w-2 h-2 bg-white/40 rounded-full mr-1.5"></div>
                      <span className="text-xs font-medium font-sans">Not registered</span>
                    </div>
                  )}
                </div>
                {maxCapacity && (
                  <div className="text-xs text-slate-500 mt-1 font-sans">
                    {registeredCount} of {maxCapacity} spots taken
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Event Description */}
          {event.description && (
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center font-sans">
                <div className="w-2 h-2 bg-primary-400 rounded-full mr-2"></div>
                About This Event
              </h3>
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 backdrop-blur-xl rounded-xl p-3 border border-slate-200">
                <p className="text-slate-700 leading-relaxed text-xs font-sans">
                  {event.description}
                </p>
              </div>
            </div>
          )}

          {/* Event Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-slate-100 backdrop-blur-xl border border-slate-200 rounded-xl p-2 text-center">
              <div className="text-sm font-bold text-primary-400 mb-1 font-sans">
                {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric' })}
              </div>
              <div className="text-xs text-slate-500 font-sans">
                {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
              </div>
            </div>
            <div className="bg-slate-100 backdrop-blur-xl border border-slate-200 rounded-xl p-2 text-center">
              <div className="text-sm font-bold text-secondary-400 mb-1 font-sans">
                {event.time}
              </div>
              <div className="text-xs text-slate-500 font-sans">Time</div>
            </div>
            <div className="bg-slate-100 backdrop-blur-xl border border-slate-200 rounded-xl p-2 text-center">
              <div className="text-sm font-bold text-accent-400 mb-1 font-sans">
                {registeredCount}
              </div>
              <div className="text-xs text-slate-500 font-sans">Registered</div>
            </div>
            <div className="bg-slate-100 backdrop-blur-xl border border-slate-200 rounded-xl p-2 text-center">
              <div className="text-sm font-bold text-slate-700 mb-1 font-sans">
                {event.maxCapacity || '∞'}
              </div>
              <div className="text-xs text-slate-500 font-sans">Capacity</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 justify-end pt-3 border-t border-slate-200">
            {!isLoggedIn && !authLoading ? (
              <div className="text-center sm:text-left">
                <h4 className="text-base font-bold text-slate-900 mb-1 font-sans">
                  Ready to join this event?
                </h4>
                <p className="text-slate-600 mb-3 text-xs font-sans">
                  Sign in to register and get updates about this event.
                </p>
                <a
                  href="/role-selection"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-xs font-sans"
                >
                  <UserIcon className="h-3 w-3" />
                  Login to Register
                </a>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => {
                    trackClick(null, 'event_modal_close_bottom');
                    trackEngagement('modal_close', {
                      modal_type: 'event_details',
                      event_id: event?.id,
                      event_title: event?.title,
                      close_location: 'bottom'
                    });
                    onClose();
                  }}
                  className="px-5 py-2.5 rounded-xl font-semibold border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 transition-all duration-300 text-xs font-sans"
                >
                  Close
                </button>
                {canRegister && (
                  <button
                    onClick={handleRegistration}
                    disabled={buttonDisabled}
                    className={`px-5 py-2.5 rounded-full font-semibold shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-1.5 text-xs font-sans ${
                      buttonDisabled
                        ? 'bg-slate-200 backdrop-blur-xl text-slate-500 cursor-not-allowed border border-slate-300'
                        : isRegistered
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 hover:shadow-2xl'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {buttonText}
                      </>
                    ) : (
                      <>
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    