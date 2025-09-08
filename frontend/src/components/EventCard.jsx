import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon, UserGroupIcon, UsersIcon } from '@heroicons/react/24/outline';
import EventDetailsModal from './EventDetailsModal';
import EventRegistrationsModal from './EventRegistrationsModal';
import OptimizedImage from './OptimizedImage';
import axios from '../config/axios';
import { toast } from 'react-toastify';
import ConfirmDialog from './ConfirmDialog';

const EventCard = ({ event, user, onEventUpdate, showEdit, showDelete, onEdit, onDelete, sm }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistrationsModalOpen, setIsRegistrationsModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  // Add state for confirm dialog if needed
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState(null);
  const [confirmMessage, setConfirmMessage] = React.useState('');

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (timeString) => {
    return timeString;
  };

  // Handle registration
  const handleRegistration = async (e) => {
    e.stopPropagation(); // Prevent card click when clicking register button
    if (!user) {
      toast.error('Only for registered users');
      return;
    }

    try {
      setIsRegistering(true);
      const endpoint = `/api/${user.role}/event/${event.id}`;
      const response = await axios.post(endpoint);

      if (response.data.success) {
        toast.success(response.data.message || 'Action successful!');
        // Refetch events to update UI with new isRegistered and registeredCount
        if (onEventUpdate) {
          onEventUpdate();
        }
      } else {
        // Show specific message if already registered
        if (response.data.message && response.data.message.toLowerCase().includes('already registered')) {
          toast.info('You are already registered for this event.');
        } else {
          toast.error(response.data.message || 'Failed to register for event');
        }
      }
    } catch (error) {
      // Show specific message if already registered
      if (error.response && error.response.data && error.response.data.message && error.response.data.message.toLowerCase().includes('already registered')) {
        toast.info('You are already registered for this event.');
      } else {
        toast.error('Network error. Please try again.');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  // Handle card click to open modal
  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  // Handle view registrations
  const handleViewRegistrations = (e) => {
    e.stopPropagation(); // Prevent card click
    setIsRegistrationsModalOpen(true);
  };

  // Check if user can register
  const canRegister = user && (user.role === 'student' || user.role === 'alumni');
  const isEventFull = event.maxCapacity && event.registeredCount && 
    event.registeredCount >= event.maxCapacity;
  const isAdmin = user?.role === 'admin';
  // Check if user is the organizer
  const isOrganizer = user && event.createdBy && event.createdBy.id === user.id;

  // Coerce maxCapacity to a number for robust badge logic
  const maxCapacity = Number(event.maxCapacity) > 0 ? Number(event.maxCapacity) : null;
  const registeredCount = Number(event.registeredCount) || 0;
  const isRegistered = !!event.isRegistered;
  console.log('DEBUG: EventCard event:', event);

  // Check if event is in the past
  const isPastEvent = new Date(event.date) < new Date(new Date().setHours(0,0,0,0));

  // Registration button logic
  const isLoggedIn = !!user;
  const isFaculty = user?.role === 'faculty';
  const registrationClosed = isPastEvent || (maxCapacity && registeredCount >= maxCapacity);
  const buttonText = registrationClosed
    ? 'Registration Closed'
    : (!isLoggedIn || isFaculty)
      ? 'Login to register'
      : (isRegistered ? 'Registered' : 'Register Now');
  const buttonDisabled = registrationClosed || !isLoggedIn || isFaculty || isRegistered || isRegistering;
  const buttonClass = registrationClosed
    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
    : (!isLoggedIn || isFaculty)
      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
    : isRegistered
        ? 'bg-accent text-white cursor-not-allowed'
        : 'bg-primary text-white hover:bg-primary-700';

  return (
    <>
      <div 
        className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:scale-[1.01] w-full z-10 ${sm ? 'h-32' : 'h-80'} ${sm ? 'p-1 text-xs' : ''}`}
        onClick={handleCardClick}
      >
        {/* Event Image with Gradient Overlay */}
        <div className={`relative ${sm ? 'h-16' : 'h-full'} w-full overflow-hidden`}>
          {event.imageUrl ? (
            <OptimizedImage 
              src={event.imageUrl} 
              alt={event.name}
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-100 to-accent-200">
              <CalendarIcon className={`${sm ? 'h-8 w-8' : 'h-20 w-20'} text-accent-400`} />
            </div>
          )}
          
          {/* Black Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
          {/* Event Type Badge */}
          {!sm && (
            <div className="absolute top-6 left-6 z-10">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/90 backdrop-blur-sm text-accent-700 shadow-lg">
                {event.type}
              </span>
            </div>
          )}

          {/* Registration/Capacity Badge */}
          {!sm && isLoggedIn && user?.role !== 'admin' && (
            <div className="absolute top-6 right-6 z-10">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm ${
                maxCapacity
                  ? (registeredCount >= maxCapacity
                      ? 'bg-red-500/90 text-white'
                      : 'bg-green-500/90 text-white')
                  : 'bg-gray-500/90 text-white'
              }`}>
                {maxCapacity
                  ? `${registeredCount}/${maxCapacity}`
                  : `${registeredCount} Registered`}
                {maxCapacity && registeredCount >= maxCapacity && (
                  <span className="ml-2 font-bold">FULL</span>
                )}
              </span>
            </div>
          )}

          {/* Event Content Overlay */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 text-white ${sm ? 'p-2' : ''}`}>
            {/* Event Title */}
            <h3 className={`font-bold mb-2 line-clamp-2 ${sm ? 'text-sm' : 'text-xl md:text-2xl'} leading-tight drop-shadow-lg`}>
              {event.name}
            </h3>

            {/* Event Details */}
            <div className={`space-y-1 mb-3 ${sm ? 'space-y-1 mb-2' : ''}`}>
              <div className="flex items-center text-sm text-white/90 drop-shadow-md">
                <CalendarIcon className="h-3 w-3 mr-2 text-white/80" />
                {formatDate(event.date)}
              </div>
              
              <div className="flex items-center text-sm text-white/90 drop-shadow-md">
                <ClockIcon className="h-3 w-3 mr-2 text-white/80" />
                {formatTime(event.time)}
              </div>
              
              <div className="flex items-center text-sm text-white/90 drop-shadow-md">
                <MapPinIcon className="h-3 w-3 mr-2 text-white/80" />
                {event.location}
              </div>
            </div>

            {/* Organizer */}
            <div className={`text-xs text-white/80 mb-3 drop-shadow-md ${sm ? 'text-xs mb-2' : ''}`}>
              Organized by: {event.organizer}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {showEdit || showDelete ? (
                <div className="flex gap-2">
                  {showEdit && (
                    <button
                      onClick={e => { e.stopPropagation(); onEdit && onEdit(event); }}
                      className="px-4 py-2 bg-secondary text-white rounded-full font-semibold text-xs shadow-lg hover:bg-secondary-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Edit
                    </button>
                  )}
                  {showDelete && (
                    <button
                      onClick={e => { e.stopPropagation(); onDelete && onDelete(event); }}
                      className="px-4 py-2 bg-red-500 text-white rounded-full font-semibold text-xs shadow-lg hover:bg-red-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ) : isAdmin ? (
                <button
                  onClick={handleViewRegistrations}
                  className="px-4 py-2 bg-secondary text-white rounded-full font-semibold text-xs shadow-lg hover:bg-secondary-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-1"
                >
                  <UsersIcon className="h-3 w-3" />
                  <span>View</span>
                </button>
              ) : isOrganizer ? (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-500/50 text-white rounded-full font-semibold text-xs cursor-not-allowed"
                >
                  Organizer
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={isLoggedIn && !isRegistered && !isFaculty && !registrationClosed ? handleRegistration : undefined}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    disabled={buttonDisabled}
                    className={`px-4 py-2 rounded-full text-xs font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center ${buttonClass}`}
                    title={!isLoggedIn || isFaculty ? 'Login to register' : ''}
                  >
                    {buttonText}
                  </button>
                  <button
                    onClick={handleCardClick}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold text-xs shadow-lg hover:bg-white/30 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Read More
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal
        event={event}
        user={user}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventUpdate={onEventUpdate}
      />

      {/* Event Registrations Modal */}
      <EventRegistrationsModal
        event={event}
        user={user}
        isOpen={isRegistrationsModalOpen}
        onClose={() => setIsRegistrationsModalOpen(false)}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Action"
        message={confirmMessage}
        onConfirm={() => { setConfirmOpen(false); if (confirmAction) confirmAction(); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default EventCard; 