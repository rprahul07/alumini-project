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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl sm:max-w-lg max-h-[90vh] overflow-y-auto p-2 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Event Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Event Image */}
        <div className="relative h-64 bg-gray-200">
          {event.imageUrl ? (
            <img 
              src={event.imageUrl} 
              alt={event.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200">
              <CalendarIcon className="h-20 w-20 text-indigo-400" />
            </div>
          )}
          
          {/* Event Type Badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              {event.type}
            </span>
          </div>

          {/* Capacity Badge */}
          {event.maxCapacity && (
            <div className="absolute top-4 right-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isEventFull 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                <UserGroupIcon className="h-4 w-4 mr-1" />
                {event.registeredUsers ? event.registeredUsers.length : 0}/{event.maxCapacity}
              </span>
            </div>
          )}
        </div>

        {/* Event Content */}
        <div className="p-6">
          {/* Event Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {event.name}
          </h3>

          {/* Event Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="h-5 w-5 mr-3 text-gray-400" />
              <span className="font-medium">{formatDate(event.date)}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <ClockIcon className="h-5 w-5 mr-3 text-gray-400" />
              <span className="font-medium">{event.time}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <MapPinIcon className="h-5 w-5 mr-3 text-gray-400" />
              <span className="font-medium">{event.location}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <UserIcon className="h-5 w-5 mr-3 text-gray-400" />
              <span className="font-medium">Organized by: {event.organizer}</span>
            </div>
          </div>

          {/* Event Description */}
          {event.description && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600 leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

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
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Login to Register
              </a>
            </div>
          )}

          {/* Close Button */}
          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
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