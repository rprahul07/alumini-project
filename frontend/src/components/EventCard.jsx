import React, { useState, useEffect, memo, useCallback } from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon, UserGroupIcon, UsersIcon } from '@heroicons/react/24/outline';
import EventDetailsModal from './EventDetailsModal';
import EventRegistrationsModal from './EventRegistrationsModal';
import OptimizedImage from './OptimizedImage';
import axios from '../config/axios';
import { toast } from 'react-toastify';
import ConfirmDialog from './ConfirmDialog';
import { useInteractionTracking, useAnalytics } from '../hooks/useAnalytics';

const EventCard = memo(({ event, user, onEventUpdate, showEdit, showDelete, onEdit, onDelete, sm }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistrationsModalOpen, setIsRegistrationsModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  // Add state for confirm dialog if needed
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState(null);
  const [confirmMessage, setConfirmMessage] = React.useState('');
  
  // Analytics tracking
  const { trackClick, trackHover } = useInteractionTracking('events');
  const { trackEngagement, trackConversion } = useAnalytics();


  // Format date - memoized for performance
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Format time - memoized for performance
  const formatTime = useCallback((timeString) => {
    return timeString;
  }, []);

  // Handle registration
  const handleRegistration = async (e) => {
    e.stopPropagation(); // Prevent card click when clicking register button
    if (!user) {
      toast.error('Only for registered users');
      return;
    }

    try {
      setIsRegistering(true);
      
      // Track registration attempt
      trackConversion('event_registration_attempt', {
        event_id: event.id,
        event_title: event.title,
        user_role: user.role,
        event_type: event.eventType
      });
      
      const endpoint = `/api/${user.role}/event/${event.id}`;
      const response = await axios.post(endpoint);

      if (response.data.success) {
        // Track successful registration
        trackConversion('event_registration_success', {
          event_id: event.id,
          event_title: event.title,
          user_role: user.role,
          event_type: event.eventType
        });
        
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
    trackClick(null, `event_card_${event.id}`);
    trackEngagement('event_view', {
      event_id: event.id,
      event_title: event.title,
      event_type: event.eventType
    });
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
        className={`group relative bg-slate-50 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 w-full z-10 ${sm ? 'h-32' : 'h-80'} ${sm ? 'p-1 text-xs' : ''}`}
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
              priority={false} // Let intersection observer handle this
              quality={75}
              loading="lazy"
              fallbackSrc="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
              <CalendarIcon className={`${sm ? 'h-8 w-8' : 'h-20 w-20'} text-white/60`} />
            </div>
          )}
          
          {/* Enhanced Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          
          {/* Event Type Badge */}
          {!sm && (
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 backdrop-blur-xl text-slate-700 border border-slate-300 shadow-xl font-sans">
                {event.type}
              </span>
            </div>
          )}

          {/* Registration/Capacity Badge */}
          {!sm && isLoggedIn && user?.role !== 'admin' && (
            <div className="absolute top-4 right-4 z-10">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-xl backdrop-blur-xl border ${
                maxCapacity
                  ? (registeredCount >= maxCapacity
                      ? 'bg-red-100 text-red-700 border-red-300'
                      : 'bg-green-100 text-green-700 border-green-300')
                  : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}>
                {maxCapacity
                  ? `${registeredCount}/${maxCapacity}`
                  : `${registeredCount} Registered`}
                {maxCapacity && registeredCount >= maxCapacity && (
                  <span className="ml-1.5 font-bold">FULL</span>
                )}
              </span>
            </div>
          )}

          {/* Event Content Overlay */}
          <div className={`absolute bottom-0 left-0 right-0 p-5 text-slate-900 ${sm ? 'p-2' : ''}`}>
            {/* Event Title */}
            <h3 className={`font-bold mb-2 line-clamp-2 ${sm ? 'text-xs' : 'text-base md:text-lg'} leading-tight drop-shadow-lg group-hover:text-primary-600 transition-colors duration-300 font-sans`}>
              {event.name}
            </h3>

            {/* Event Details */}
            <div className={`space-y-1.5 mb-3 ${sm ? 'space-y-1 mb-2' : ''}`}>
              <div className="flex items-center text-xs text-slate-700 drop-shadow-md font-sans">
                <CalendarIcon className="h-3 w-3 mr-2 text-primary-600" />
                {formatDate(event.date)}
              </div>
              
              <div className="flex items-center text-xs text-slate-700 drop-shadow-md font-sans">
                <ClockIcon className="h-3 w-3 mr-2 text-secondary-600" />
                {formatTime(event.time)}
              </div>
              
              <div className="flex items-center text-xs text-slate-700 drop-shadow-md font-sans">
                <MapPinIcon className="h-3 w-3 mr-2 text-accent-600" />
                {event.location}
              </div>
            </div>

            {/* Organizer */}
            <div className={`text-xs text-slate-600 mb-3 drop-shadow-md font-sans ${sm ? 'text-xs mb-2' : ''}`}>
              <span className="text-slate-500">Organized by:</span> {event.organizer}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {showEdit || showDelete ? (
                <div className="flex gap-2">
                  {showEdit && (
                    <button
                      onClick={e => { e.stopPropagation(); onEdit && onEdit(event); }}
                      className="px-3 py-1.5 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-full font-semibold text-xs shadow-xl hover:from-secondary-600 hover:to-secondary-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-sans"
                    >
                      Edit
                    </button>
                  )}
                  {showDelete && (
                    <button
                      onClick={e => { e.stopPropagation(); onDelete && onDelete(event); }}
                      className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-semibold text-xs shadow-xl hover:from-red-600 hover:to-red-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-sans"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ) : isAdmin ? (
                <button
                  onClick={handleViewRegistrations}
                  className="px-3 py-1.5 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-full font-semibold text-xs shadow-xl hover:from-secondary-600 hover:to-secondary-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-1.5 font-sans"
                >
                  <UsersIcon className="h-3 w-3" />
                  <span>View</span>
                </button>
              ) : isOrganizer ? (
                <button
                  disabled
                  className="px-3 py-1.5 bg-slate-100 backdrop-blur-xl text-slate-500 rounded-full font-semibold text-xs cursor-not-allowed border border-slate-300 font-sans"
                >
                  Organizer
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={isLoggedIn && !isRegistered && !isFaculty && !registrationClosed ? handleRegistration : undefined}
                    onMouseEnter={() => {
                      setIsHovering(true);
                      trackHover(null, `event_register_${event.id}`);
                    }}
                    onMouseLeave={() => setIsHovering(false)}
                    disabled={buttonDisabled}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center font-sans ${
                      buttonDisabled
                        ? 'bg-slate-100 backdrop-blur-xl text-slate-500 cursor-not-allowed border border-slate-300'
                        : isRegistered
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white cursor-not-allowed'
                          : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 hover:shadow-2xl'
                    }`}
                    title={!isLoggedIn || isFaculty ? 'Login to register' : ''}
                  >
                    {buttonText}
                  </button>
                  <button
                    onClick={handleCardClick}
                    onMouseEnter={() => trackHover(null, `event_read_more_${event.id}`)}
                    className="px-3 py-1.5 bg-slate-100 backdrop-blur-xl text-slate-700 rounded-full font-semibold text-xs shadow-xl hover:bg-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-slate-300 font-sans"
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
});

export default EventCard; 