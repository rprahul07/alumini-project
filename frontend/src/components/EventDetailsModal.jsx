import React, { useState } from 'react';
import { XMarkIcon, CalendarIcon, ClockIcon, MapPinIcon, UserGroupIcon, UserIcon } from '@heroicons/react/24/outline';
import axios from '../config/axios';
import { toast } from 'react-toastify';
import ConfirmDialog from './ConfirmDialog';
import { useAuth } from '../contexts/AuthContext';

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
            : 'bg-indigo-600 text-white hover:bg-indigo-700';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide p-3" style={{ scrollbarWidth: 'none' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Event Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Event Image */}
        <div className="relative h-28 sm:h-36 bg-gray-200 rounded-2xl mb-2">
          {event.imageUrl ? (
            <img 
              src={event.imageUrl} 
              alt={event.name}
              className="w-full h-full object-cover rounded-2xl"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl">
              <CalendarIcon className="h-12 w-12 text-indigo-400" />
            </div>
          )}
          
          {/* Event Type Badge */}
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-800">
              {event.type}
            </span>
          </div>
        </div>

        {/* Event Content */}
        <div className="p-2 sm:p-3">
          {/* Event Title */}
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-xl sm:text-2xl leading-tight">
            {event.name}
          </h3>

          {/* Event Details */}
          <div className="space-y-1 mb-2">
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
              {formatDate(event.date)}
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
              {event.time}
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
              {event.location}
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-400">
              <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
              Organized by: {event.organizer}
            </div>
          </div>

          {/* Event Description */}
          <div className="mb-3">
            <h4 className="text-base font-semibold text-gray-900 mb-1">Description</h4>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Guest User CTA */}
          {!isLoggedIn && !authLoading && (
            <div className="border-t pt-6 text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Want to join this event?
              </h4>
              <p className="text-gray-600 mb-4">
                Please log in to register and see more details.
              </p>
              <a
                href="/role-selection"
                className="inline-block rounded-full px-4 py-1.5 font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Login to Register
              </a>
            </div>
          )}

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

export default EventDetailsModal; 