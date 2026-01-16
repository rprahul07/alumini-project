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
  const isPastEvent = new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0));

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
        className={`group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 w-full z-10 flex flex-col ${sm ? 'h-auto' : 'h-full min-h-[420px]'}`}
        onClick={handleCardClick}
      >
        {/* Event Image - Top Half */}
        <div className={`relative ${sm ? 'h-32' : 'h-48'} w-full overflow-hidden flex-shrink-0`}>
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
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
              <CalendarIcon className={`${sm ? 'h-8 w-8' : 'h-16 w-16'} text-slate-300`} />
            </div>
          )}

          {/* Badges Overlay on Image */}
          {!sm && (
            <>
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-sm text-slate-700 shadow-md font-sans">
                  {event.type}
                </span>
              </div>

              {isLoggedIn && user?.role !== 'admin' && (
                <div className="absolute top-4 right-4 z-10">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm ${maxCapacity
                      ? (registeredCount >= maxCapacity
                        ? 'bg-red-50 text-red-700 border border-red-100'
                        : 'bg-white/95 text-green-700')
                      : 'bg-white/95 text-slate-700'
                    }`}>
                    {maxCapacity
                      ? `${registeredCount}/${maxCapacity}`
                      : `${registeredCount} Reg`}
                    {maxCapacity && registeredCount >= maxCapacity && (
                      <span className="ml-1.5 font-bold text-red-600">FULL</span>
                    )}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Content - Bottom Half */}
        <div className={`flex-1 flex flex-col p-5 ${sm ? 'p-3' : ''}`}>
          {/* Organized By */}
          <div className="text-xs text-slate-500 mb-2 font-medium font-sans uppercase tracking-wider">
            {event.organizer}
          </div>

          {/* Event Title */}
          <h3 className={`font-bold text-slate-900 mb-4 line-clamp-2 ${sm ? 'text-sm' : 'text-lg'} leading-snug font-sans group-hover:text-primary-600 transition-colors`}>
            {event.name}
          </h3>

          {/* Event Details */}
          <div className={`space-y-2 mb-6 flex-1 ${sm ? 'space-y-1 mb-3' : ''}`}>
            <div className="flex items-center text-sm text-slate-600 font-sans">
              <CalendarIcon className="h-4 w-4 mr-2.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{formatDate(event.date)}</span>
            </div>

            <div className="flex items-center text-sm text-slate-600 font-sans">
              <ClockIcon className="h-4 w-4 mr-2.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{formatTime(event.time)}</span>
            </div>

            <div className="flex items-center text-sm text-slate-600 font-sans">
              <MapPinIcon className="h-4 w-4 mr-2.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 mt-auto">
            <div className="flex gap-2">
              {showEdit || showDelete ? (
                <div className="flex gap-2 w-full">
                  {showEdit && (
                    <button
                      onClick={e => { e.stopPropagation(); onEdit && onEdit(event); }}
                      className="flex-1 px-3 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg font-semibold text-xs hover:bg-slate-50 hover:border-slate-300 transition-all font-sans"
                    >
                      Edit
                    </button>
                  )}
                  {showDelete && (
                    <button
                      onClick={e => { e.stopPropagation(); onDelete && onDelete(event); }}
                      className="flex-1 px-3 py-2 bg-white text-red-600 border border-red-200 rounded-lg font-semibold text-xs hover:bg-red-50 hover:border-red-300 transition-all font-sans"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ) : isAdmin ? (
                <button
                  onClick={handleViewRegistrations}
                  className="w-full px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 font-sans"
                >
                  <UsersIcon className="h-4 w-4" />
                  <span>View Registrations</span>
                </button>
              ) : isOrganizer ? (
                <button
                  disabled
                  className="w-full px-4 py-2 bg-slate-50 text-slate-400 border border-slate-200 rounded-lg font-semibold text-sm cursor-not-allowed font-sans text-center"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    You are Organizing
                  </span>
                </button>
              ) : (
                <div className="flex gap-2 w-full">
                  <button
                    onClick={isLoggedIn && !isRegistered && !isFaculty && !registrationClosed ? handleRegistration : undefined}
                    onMouseEnter={() => {
                      setIsHovering(true);
                      trackHover(null, `event_register_${event.id}`);
                    }}
                    onMouseLeave={() => setIsHovering(false)}
                    disabled={buttonDisabled}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all duration-300 flex items-center justify-center font-sans ${buttonDisabled
                        ? 'bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed'
                        : isRegistered
                          ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed'
                          : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md'
                      }`}
                  >
                    {isRegistered ? (
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Registered
                      </span>
                    ) : buttonText}
                  </button>
                  <button
                    onClick={handleCardClick}
                    className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all font-sans"
                  >
                    Details
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