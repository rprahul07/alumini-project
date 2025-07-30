import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import EventDetailsModal from '../EventDetailsModal';
import { useAuth } from '../../contexts/AuthContext';

const RegisteredEvents = () => {
  const { user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if user is authenticated and has a role
    if (!user || !user.role) {
      console.warn('⚠️ User not authenticated or role missing');
      setLoading(false);
      return;
    }

    // Fetch registered events from backend
    const fetchRegisteredEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the correct endpoint based on user role
        const endpoint = user.role === 'student'
          ? `/api/student/event/my`
          : `/api/${user.role}/event/myregistrations`;

        console.log('🚀 Fetching registered events for user:', {
          role: user.role,
          endpoint,
          userId: user.id
        });

        const res = await axios.get(endpoint);
        console.log('📊 Full API response:', res.data);

        if (res.data.success) {
          const events = res.data.data?.events || res.data.data || [];
          console.log('✅ Events extracted:', events);
          setRegisteredEvents(events);
        } else {
          console.warn('❌ API returned success:false');
          setError('Failed to load registered events.');
        }
      } catch (err) {
        console.error('❌ Error fetching registered events:', err);
        console.error('📋 Error details:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          message: err.message,
          endpoint: user.role === 'student' ? '/api/student/event/my' : `/api/${user.role}/event/myregistrations`
        });

        if (err.response?.status === 404) {
          setError('Registered events service not available. Please try again later.');
        } else if (err.response?.status === 403) {
          setError('Access denied. Please log in again.');
        } else {
          setError('Failed to load registered events. Please check your connection.');
        }
      } finally {
        setLoading(false);
      }
    };

    // Add cleanup for any pending requests
    const controller = new AbortController();

    fetchRegisteredEvents();

    // Cleanup function
    return () => {
      controller.abort();
    };
  }, [user]);

  const handleView = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Registered Events</h3>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600 text-sm">Loading registered events...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center space-y-3">
            <div className="text-red-500 text-4xl">⚠️</div>
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      ) : registeredEvents.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center space-y-3">
            <div className="text-gray-400 text-4xl">📅</div>
            <p className="text-gray-600 font-medium">No registered events found</p>
            <p className="text-gray-500 text-sm">You haven't registered for any events yet.</p>
          </div>
        </div>
      ) : (
        <div className="h-full overflow-x-auto rounded-xl shadow bg-white">
          <table className="w-full table-fixed divide-y divide-gray-200 text-xs h-full" role="grid" aria-label="Registered events table">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-2 py-2 w-48 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Event Name
                </th>
                <th scope="col" className="px-2 py-2 w-32 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-2 py-2 w-40 text-right font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200"
              role="rowgroup"
              aria-live="polite"
              aria-label={`${registeredEvents.length} registered events`}>
              {registeredEvents.map((event, index) => (
                <tr key={event.eventId || event.id || index}
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  role="row"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleView(event);
                    }
                  }}>
                  <td className="px-2 py-2 whitespace-nowrap font-semibold" role="gridcell">
                    <span className="truncate max-w-[120px] block" title={event.eventName || event.name || '-'}>
                      {event.eventName || event.name || '-'}
                    </span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap" role="gridcell">
                    <span className="truncate max-w-[100px] block"
                      title={event.eventDate || event.date ? new Date(event.eventDate || event.date).toLocaleDateString() : 'Date not available'}>
                      {event.eventDate || event.date ? new Date(event.eventDate || event.date).toLocaleDateString() : 'N/A'}
                    </span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-right flex gap-2 justify-end" role="gridcell">
                    <button
                      className="px-2 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all duration-200"
                      onClick={() => handleView(event)}
                      aria-label={`View details for ${event.eventName || event.name || 'event'}`}
                      type="button"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default RegisteredEvents; 