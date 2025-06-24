import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from '../config/axios';
import { CalendarIcon, XMarkIcon, EyeIcon, PencilIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import EventDetailsModal from './EventDetailsModal';
import EditEventModal from './EditEventModal';
import toast from 'react-hot-toast';
import EventCard from './EventCard';

const AdminAllEventsButton = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const fetchAllEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/admin/event/search', {
        params: {
          page: currentPage,
          limit: 12,
          status: selectedStatus === 'all' ? undefined : selectedStatus,
        }
      });
      if (response.data.success) {
        setEvents(response.data.data.events);
        setTotalPages(response.data.data.pagination.totalPages);
      } else {
        toast.error(response.data.message || 'Failed to fetch events.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred while fetching events.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    setActionLoading(eventId);
    try {
      const endpoint = `/api/admin/event/${eventId}`;
      const response = await axios.delete(endpoint);
      if (response.data.success) {
        toast.success('Event deleted successfully.');
        setEvents(events => events.filter(e => e.id !== eventId));
      } else {
        toast.error(response.data.message || 'Failed to delete event.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred during deletion.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenModal = () => {
    fetchAllEvents();
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => setIsModalOpen(false);
  const handleEditEvent = (event) => {
    setSelectedEvent(event);
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

  useEffect(() => {
    if(isModalOpen) {
      fetchAllEvents();
    }
    // eslint-disable-next-line
  }, [isModalOpen, currentPage, selectedStatus]);

  if (!user || user.role !== 'admin') return null;

  return (
    <>
      <button onClick={handleOpenModal} className="bg-indigo-600 text-white font-semibold rounded-md px-3 py-1.5 text-sm shadow hover:bg-indigo-700 transition-colors">
        <span className="hidden xs:inline">All Events</span>
        <CalendarIcon className="h-5 w-5 inline-block xs:ml-0 align-text-bottom" />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end sm:items-start p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-lg shadow-xl w-full sm:max-w-6xl mt-0 sm:mt-16 max-h-[90vh] sm:max-h-[75vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg sm:text-xl font-bold">All Events</h2>
              <button onClick={handleCloseModal} className="rounded-full p-2 hover:bg-gray-100"><XMarkIcon className="h-6 w-6" /></button>
            </div>
            {/* Filter Buttons */}
            <div className="flex gap-2 p-3 pb-6 mb-4 min-h-[56px] border-b bg-gray-50 overflow-x-auto flex-wrap">
              {['all', 'approved'].map(status => (
                <button
                  key={status}
                  onClick={() => { setCurrentPage(1); setSelectedStatus(status); }}
                  className={`px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${selectedStatus === status ?
                    (status === 'approved' ? 'bg-green-600 text-white' :
                     'bg-indigo-600 text-white') :
                    'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
            <div className="overflow-y-auto p-2 sm:p-6 flex-1">
              {loading && <p>Loading events...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading && !error && events.length === 0 && (
                <div className="text-center text-gray-500 py-12">No events found.</div>
              )}
              {/* Mobile: vertical bars, Desktop: grid cards */}
              {!loading && !error && events.length > 0 && (
                <>
                  {/* Mobile: vertical bars */}
                  <div className="block sm:hidden divide-y divide-gray-200">
                    {events.map(event => (
                      <div key={event.id} className="flex items-center py-3 px-2 gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base truncate">{event.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <ClockIcon className="h-4 w-4 inline-block" /> {event.date} {event.time}
                          </div>
                          <div className="text-xs text-gray-400 truncate">{event.location}</div>
                        </div>
                        <div className="flex flex-col gap-1 items-end ml-2">
                          <button onClick={() => openEventDetails(event)} className="p-1 rounded hover:bg-gray-100" title="View"><EyeIcon className="h-5 w-5 text-indigo-600" /></button>
                          <button onClick={() => handleEditEvent(event)} className="p-1 rounded hover:bg-gray-100" title="Edit"><PencilIcon className="h-5 w-5 text-green-600" /></button>
                          <button onClick={() => handleDeleteEvent(event.id)} className="p-1 rounded hover:bg-gray-100" title="Delete" disabled={actionLoading === event.id}><TrashIcon className="h-5 w-5 text-red-600" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Desktop: grid cards */}
                  <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-center">
                    {events.map(event => (
                      <EventCard
                        key={event.id}
                        event={event}
                        user={user}
                        showEdit={true}
                        showDelete={true}
                        onEdit={handleEditEvent}
                        onDelete={() => handleDeleteEvent(event.id)}
                        onEventUpdate={fetchAllEvents}
                        sm
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* Pagination controls can be added here */}
          </div>
        </div>
      )}

      {isDetailModalOpen && <EventDetailsModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} event={selectedEvent} />}
      {isEditModalOpen && <EditEventModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} event={selectedEvent} onEventUpdated={handleEventUpdated} />}
    </>
  );
};

export default AdminAllEventsButton; 