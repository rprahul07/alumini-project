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
      <h3 className="text-lg font-semibold mb-4 text-gray-800">My Created Events</h3>
      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-400">You have not created any events yet.</div>
      ) : (
        <div className="h-full overflow-x-auto rounded-xl shadow bg-white">
          <table className="w-full table-fixed divide-y divide-gray-200 text-xs h-full" role="grid" aria-label="My created events table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 w-48 text-left font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                <th className="px-2 py-2 w-32 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-2 py-2 w-24 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-2 py-2 w-40 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-2 py-2 whitespace-nowrap font-semibold">
                    <span className="truncate max-w-[120px] block">{event.name || '-'}</span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <span className="truncate max-w-[100px] block">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      event.status === 'approved' ? 'bg-green-100 text-green-700' :
                      event.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {event.status === 'approved' ? 'Approved' :
                     event.status === 'rejected' ? '✗ Rejected' :
                     '⏳ Pending'}
                    </span>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap text-right flex gap-2 justify-end">
                    <button
                      className="inline-block px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs hover:bg-indigo-200 transition-colors"
                      onClick={() => openEventDetails(event)}
                    >
                      View
                    </button>
                    {!isEventPast(event.date) && (
                      <button
                        className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs hover:bg-blue-200 transition-colors"
                        onClick={() => handleEditEvent(event)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="inline-block px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-xs hover:bg-red-200 transition-colors"
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={actionLoading === event.id}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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