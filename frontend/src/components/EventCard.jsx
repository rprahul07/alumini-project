import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon, UserGroupIcon, UsersIcon } from '@heroicons/react/24/outline';
import EventDetailsModal from './EventDetailsModal';
import EventRegistrationsModal from './EventRegistrationsModal';
import axios from '../config/axios';

const EventCard = ({ event, user, onEventUpdate, showEdit, showDelete, onEdit, onDelete, sm }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistrationsModalOpen, setIsRegistrationsModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

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
      alert('Only for registered users');
      return;
    }

    try {
      setIsRegistering(true);
      const endpoint = `/api/${user.role}/event/${event.id}`;
      const response = await axios.post(endpoint);

      if (response.data.success) {
        alert(response.data.message || 'Action successful!');
        // Refetch events to update UI with new isRegistered and registeredCount
        if (onEventUpdate) {
          onEventUpdate();
        }
      } else {
        // Show specific message if already registered
        if (response.data.message && response.data.message.toLowerCase().includes('already registered')) {
          alert('You are already registered for this event.');
        } else {
          alert(response.data.message || 'Failed to register for event');
        }
      }
    } catch (error) {
      // Show specific message if already registered
      if (error.response && error.response.data && error.response.data.message && error.response.data.message.toLowerCase().includes('already registered')) {
        alert('You are already registered for this event.');
      } else {
        alert('Network error. Please try again.');
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
  const isEventFull = event.maxCapacity && event.registeredUsers && 
    event.registeredUsers.length >= event.maxCapacity;
  const isAdmin = user?.role === 'admin';
  // Check if user is the organizer
  const isOrganizer = user && event.createdBy && event.createdBy.id === user.id;

  // Coerce maxCapacity to a number for robust badge logic
  const maxCapacity = Number(event.maxCapacity) > 0 ? Number(event.maxCapacity) : null;
  const registeredCount = Number(event.registeredCount) || 0;
  const isRegistered = !!event.isRegistered;
  console.log('DEBUG: EventCard event:', event);

  // Registration button logic
  const isLoggedIn = !!user;
  const isFaculty = user?.role === 'faculty';
  const buttonText = (!isLoggedIn || isFaculty)
    ? "Login to register"
    : (isRegistered ? "Registered" : "Register Now");
  const buttonDisabled = !isLoggedIn || isFaculty || isRegistered || isRegistering || (maxCapacity && registeredCount >= maxCapacity);
  const buttonClass = (!isLoggedIn || isFaculty)
    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
    : isRegistered
      ? "bg-green-500 text-white cursor-not-allowed"
      : maxCapacity && registeredCount >= maxCapacity
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-indigo-600 text-white hover:bg-indigo-700";

  return (
    <>
      <div 
        className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-[1.02] flex flex-col h-full w-full max-w-sm sm:max-w-md md:max-w-lg ${sm ? 'p-1 text-xs' : 'p-3'}`}
        onClick={handleCardClick}
      >
        {/* Event Image */}
        <div className={`relative ${sm ? 'h-16' : 'h-28'} bg-gray-200 flex-shrink-0 w-full rounded-2xl`}>
          {event.imageUrl ? (
            <img 
              src={event.imageUrl} 
              alt={event.name}
              className="w-full h-full object-cover rounded-2xl"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl">
              <CalendarIcon className={`${sm ? 'h-8 w-8' : 'h-12 w-12'} text-indigo-400`} />
            </div>
          )}
          
          {/* Event Type Badge */}
          {!sm && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {event.type}
              </span>
            </div>
          )}

          {/* Registration/Capacity Badge - only show for logged-in users and not for admin */}
          {!sm && isLoggedIn && user?.role !== 'admin' && (
            <div className="absolute top-3 right-3 z-10">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-sm ${
                maxCapacity
                  ? (registeredCount >= maxCapacity
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700')
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {maxCapacity
                  ? `${registeredCount} / ${maxCapacity} Registered`
                  : `${registeredCount} Registered`}
                {maxCapacity && registeredCount >= maxCapacity && (
                  <span className="ml-2 font-bold">(Full)</span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Event Content */}
        <div className={`p-3 flex flex-col flex-grow ${sm ? 'p-1' : ''}`}>
          {/* Event Title */}
          <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 ${sm ? 'text-sm' : 'text-xl'} sm:text-lg md:text-xl leading-tight`}>
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
              {formatTime(event.time)}
            </div>
            
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
              {event.location}
            </div>
          </div>

          {/* Organizer */}
          <div className="text-xs sm:text-sm text-gray-400 mb-2">
            Organized by: {event.organizer}
          </div>

          {/* Spacer to push button to bottom */}
          <div className="flex-grow"></div>

          {/* Button - Different for admin vs regular users */}
          {showEdit || showDelete ? (
            <div className="flex space-x-1 mt-2 w-full">
              {showEdit && (
                <button
                  onClick={e => { e.stopPropagation(); onEdit && onEdit(event); }}
                  className={`rounded-full px-4 py-1.5 font-semibold bg-blue-600 text-white hover:bg-blue-700 text-sm`}
                >
                  Edit
                </button>
              )}
              {showDelete && (
                <button
                  onClick={e => { e.stopPropagation(); onDelete && onDelete(event); }}
                  className={`rounded-full px-4 py-1.5 font-semibold bg-red-600 text-white hover:bg-red-700 text-sm`}
                >
                  Delete
                </button>
              )}
            </div>
          ) : isAdmin ? (
            // Admin sees "View Registrations" button
            <button
              onClick={handleViewRegistrations}
              className={`rounded-full px-4 py-1.5 font-semibold bg-indigo-600 text-white text-sm shadow hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2`}
            >
              <UsersIcon className="h-5 w-5" />
              <span>View Registrations</span>
            </button>
          ) : isOrganizer ? (
            // Organizer sees a disabled button
            <button
              disabled
              className={`rounded-full px-4 py-1.5 font-semibold bg-gray-200 text-gray-600 cursor-not-allowed`}
            >
              You are the organizer
            </button>
          ) : (
            // Registration button for all other users
            <button
              onClick={isLoggedIn && !isRegistered && !isFaculty ? handleRegistration : undefined}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              disabled={buttonDisabled}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors flex items-center justify-center ${buttonClass}`}
              title={!isLoggedIn || isFaculty ? "Login to register" : ""}
            >
              {buttonText}
            </button>
          )}
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
    </>
  );
};

export default EventCard; 