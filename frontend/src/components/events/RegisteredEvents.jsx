import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import EventDetailsModal from '../EventDetailsModal';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

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

        const res = await axios.get(endpoint);

        if (res.data.success) {
          const events = res.data.data?.events || res.data.data || [];
          setRegisteredEvents(events);
        } else {
          setError('Failed to load registered events.');
        }
      } catch (err) {

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
      <h3 className="text-sm font-semibold mb-3 text-white">Registered Events</h3>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <p className="text-gray-300 text-xs">Loading events...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-center space-y-2">
            <div className="text-red-400 text-2xl">⚠️</div>
            <p className="text-red-400 font-medium text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-md hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 text-xs shadow-lg"
            >
              Retry
            </button>
          </div>
        </div>
      ) : registeredEvents.length === 0 ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-center space-y-2">
            <div className="text-gray-400 text-2xl">📅</div>
            <p className="text-gray-300 font-medium text-sm">No registered events</p>
            <p className="text-gray-400 text-xs">You haven't registered for any events yet.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-3">
            {registeredEvents.map((event, index) => (
              <motion.div
                key={event.eventId || event.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 hover:bg-white/20 transition-colors duration-200"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-sm mb-1 truncate" title={event.eventName || event.name || '-'}>
                        {event.eventName || event.name || '-'}
                      </h4>
                      <p className="text-xs text-gray-300">
                        {event.eventDate || event.date ? new Date(event.eventDate || event.date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg"
                      onClick={() => handleView(event)}
                      aria-label={`View details for ${event.eventName || event.name || 'event'}`}
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop Table View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block h-full overflow-x-auto rounded-xl shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20"
          >
            <table className="w-full table-fixed divide-y divide-white/20 text-xs h-full" role="grid" aria-label="Registered events table">
              <thead className="bg-white/10">
                <tr>
                  <th scope="col" className="px-2 py-2 w-48 text-left font-medium text-white/90 uppercase tracking-wider">
                    Event Name
                  </th>
                  <th scope="col" className="px-2 py-2 w-32 text-left font-medium text-white/90 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-2 py-2 w-40 text-right font-medium text-white/90 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/5 divide-y divide-white/20"
                role="rowgroup"
                aria-live="polite"
                aria-label={`${registeredEvents.length} registered events`}>
                {registeredEvents.map((event, index) => (
                  <motion.tr
                    key={event.eventId || event.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-white/10 cursor-pointer transition-colors duration-200"
                    role="row"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleView(event);
                      }
                    }}>
                    <td className="px-2 py-2 whitespace-nowrap font-semibold" role="gridcell">
                      <span className="truncate max-w-[120px] block text-white" title={event.eventName || event.name || '-'}>
                        {event.eventName || event.name || '-'}
                      </span>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap" role="gridcell">
                      <span className="truncate max-w-[100px] block text-gray-300"
                        title={event.eventDate || event.date ? new Date(event.eventDate || event.date).toLocaleDateString() : 'Date not available'}>
                        {event.eventDate || event.date ? new Date(event.eventDate || event.date).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-right flex gap-2 justify-end" role="gridcell">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-2 py-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-semibold hover:from-primary-600 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-all duration-200 shadow-lg"
                        onClick={() => handleView(event)}
                        aria-label={`View details for ${event.eventName || event.name || 'event'}`}
                        type="button"
                      >
                        View
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </>
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