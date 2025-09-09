import React, { useEffect, useState } from 'react';
import axios from '../../config/axios';
import EventDetailsModal from '../EventDetailsModal';
import CreateEventModal from '../CreateEventModal';
import { 
  CalendarIcon, 
  XMarkIcon, 
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import EventCard from '../EventCard';
import ConfirmDialog from '../ConfirmDialog';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const MyEvents = ({ showAlert, refreshTrigger = 0 }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');

  const { user } = useAuth();

  // Fetch events created by the user
  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = user.role === 'admin' ? '/api/admin/event/search' : `/api/${user.role}/event/my`;
      const response = await axios.get(endpoint, {
        params: {
          page: currentPage,
          limit: 10,
          userId: user.role !== 'admin' ? user.id : undefined,
          status: selectedStatus === 'all' ? undefined : selectedStatus,
        }
      });
      if (response.data.success) {
        setEvents(response.data.data.events);
        setTotalPages(response.data.data.pagination.totalPages);
      } else {
        setError(response.data.message || 'Failed to fetch events.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching events.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    setConfirmMessage('Are you sure you want to delete this event?');
    setConfirmAction(() => () => handleDeleteEventConfirmed(eventId));
    setConfirmOpen(true);
  };

  const handleDeleteEventConfirmed = async (eventId) => {
    setActionLoading(eventId);
    try {
      const endpoint = `/api/${user.role}/event/${eventId}`;
      const response = await axios.delete(endpoint);
      if (response.data.success) {
        showAlert && showAlert('Event deleted successfully.', 'success');
        setEvents(events => events.filter(e => e.id !== eventId));
      } else {
        showAlert && showAlert(response.data.message || 'Failed to delete event.', 'error');
      }
    } catch (err) {
      showAlert && showAlert(err.response?.data?.message || 'An error occurred during deletion.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditEvent = (event) => {
    setEventToEdit(event);
    setIsEditModalOpen(true);
  };

  const openEventDetails = (event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleEventUpdated = (updatedEvent) => {
    setEvents(events => events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setIsEditModalOpen(false);
  };

  const isEventPast = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare date part only
    return eventDate < today;
  };

  useEffect(() => {
    fetchMyEvents();
  }, [refreshTrigger, currentPage, selectedStatus]);

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-sm font-semibold mb-3 text-white">My Created Events</h3>
      {loading ? (
        <div className="text-center text-gray-300 py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-400 py-8">{error}</div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-300 py-8">You have not created any events yet.</div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-3">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 hover:bg-white/20 transition-colors duration-200"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-sm mb-1 truncate">{event.name || '-'}</h4>
                      <p className="text-xs text-gray-300">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                      event.status === 'approved' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                      event.status === 'rejected' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                      'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                    }`}>
                      {event.status === 'approved' ? 'Approved' :
                     event.status === 'rejected' ? '✗ Rejected' :
                     '⏳ Pending'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-2 py-1.5 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold text-xs hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg"
                      onClick={() => openEventDetails(event)}
                    >
                      View
                    </motion.button>
                    {!isEventPast(event.date) && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-2 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-xs hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg"
                        onClick={() => handleEditEvent(event)}
                      >
                        Edit
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-2 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold text-xs hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={actionLoading === event.id}
                    >
                      Delete
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
            <table className="w-full table-fixed divide-y divide-white/20 text-xs h-full" role="grid" aria-label="My created events table">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-2 py-2 w-48 text-left font-medium text-white/90 uppercase tracking-wider">Event Name</th>
                  <th className="px-2 py-2 w-32 text-left font-medium text-white/90 uppercase tracking-wider">Date</th>
                  <th className="px-2 py-2 w-24 text-left font-medium text-white/90 uppercase tracking-wider">Status</th>
                  <th className="px-2 py-2 w-40 text-right font-medium text-white/90 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white/5 divide-y divide-white/20">
                {events.map((event, index) => (
                  <motion.tr
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-white/10 cursor-pointer transition-colors duration-200"
                  >
                    <td className="px-2 py-2 whitespace-nowrap font-semibold">
                      <span className="truncate max-w-[120px] block text-white">{event.name || '-'}</span>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap">
                      <span className="truncate max-w-[100px] block text-gray-300">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        event.status === 'approved' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        event.status === 'rejected' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                        'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                      }`}>
                        {event.status === 'approved' ? 'Approved' :
                       event.status === 'rejected' ? '✗ Rejected' :
                       '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-right flex gap-2 justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block px-2 py-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold text-xs hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg"
                        onClick={() => openEventDetails(event)}
                      >
                        View
                      </motion.button>
                      {!isEventPast(event.date) && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-block px-2 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-xs hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg"
                          onClick={() => handleEditEvent(event)}
                        >
                          Edit
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block px-2 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold text-xs hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
                        onClick={() => handleDeleteEvent(event.id)}
                        disabled={actionLoading === event.id}
                      >
                        Delete
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </>
      )}

      {/* Modals */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
      
      <CreateEventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editMode={true}
        eventToEdit={eventToEdit}
        onEventCreated={handleEventUpdated}
      />

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

export default MyEvents; 