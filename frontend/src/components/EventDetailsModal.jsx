import React, { useState } from 'react';
import { XMarkIcon, CalendarIcon, ClockIcon, MapPinIcon, UserGroupIcon, UserIcon } from '@heroicons/react/24/outline';
import axios from '../config/axios';

const EventDetailsModal = ({ event, user, isOpen, onClose, onEventUpdate }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(
    user && event.registeredUsers && event.registeredUsers.includes(user.id)
  );

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
    if (!user) {
      alert('Please log in to register for events');
      return;
    }

    try {
      setIsRegistering(true);
      
      const endpoint = `/api/${user.role}/event/${event.id}`;
      const response = await axios.post(endpoint);

      if (response.data.success) {
        setIsRegistered(!isRegistered);
        if (onEventUpdate) {
          onEventUpdate();
        }
      } else {
        alert(response.data.message || 'Failed to register for event');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.status === 401) {
        alert('Please log in to register for events');
      } else if (error.response?.status === 403) {
        alert('Access denied. You cannot register for this event.');
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Network error. Please try again.');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  // Check if user can register
  const canRegister = user && (user.role === 'student' || user.role === 'alumni');
  const isEventFull = event.maxCapacity && event.registeredUsers && 
    event.registeredUsers.length >= event.maxCapacity;

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
          {!user && (
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
    </div>
  );
};

export default EventDetailsModal; 