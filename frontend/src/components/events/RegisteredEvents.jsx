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
    // Fetch registered events from backend
    const fetchRegisteredEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the correct endpoint based on user role
        const endpoint = `/api/${user.role}/event/myregistrations`;
        const res = await axios.get(endpoint);
        
        if (res.data.success) {
          setRegisteredEvents(res.data.data.events || []);
        } else {
          setError('Failed to load registered events.');
        }
      } catch (err) {
        console.error('Error fetching registered events:', err);
        setError('Failed to load registered events.');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchRegisteredEvents();
    }
  }, [user]);

  const handleView = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Registered Events</h3>
      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : registeredEvents.length === 0 ? (
        <div className="text-center text-gray-400">You have not registered for any events yet.</div>
      ) : (
        <div className="h-full overflow-x-auto rounded-xl shadow bg-white">
          <table className="w-full table-fixed divide-y divide-gray-200 text-xs h-full" role="grid" aria-label="Registered events table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 w-48 text-left font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                <th className="px-2 py-2 w-32 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-2 py-2 w-40 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {registeredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-2 py-2 whitespace-nowrap font-semibold">
                    <span className="truncate max-w-[120px] block">{event.name || '-'}</span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <span className="truncate max-w-[100px] block">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-right flex gap-2 justify-end">
                    <button
                      className="px-2 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                      onClick={() => handleView(event)}
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