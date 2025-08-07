import React, { useState, useEffect, useMemo } from 'react';
import axios from '../config/axios';
import { toast } from 'react-toastify';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiCheckCircle, FiUsers, FiEye } from 'react-icons/fi';
import CreateEventModal from './CreateEventModal';
import EventDetailsModal from './EventDetailsModal';
import EventRegistrationsModal from './EventRegistrationsModal';
import ConfirmDialog from './ConfirmDialog';
import { EVENT_TYPES } from '../constants/eventTypes';

const statusColors = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
};

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [eventToView, setEventToView] = useState(null);
  const [isRegistrationsModalOpen, setIsRegistrationsModalOpen] = useState(false);
  const [eventToViewRegistrations, setEventToViewRegistrations] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch events
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      let events = [];
      if (filterStatus === 'pending') {
        // Fetch all events and filter pending
        const params = { page: 1, limit: 100 };
        const res = await axios.get('/api/admin/event/all', { params });
        if (res.data.success) {
          events = res.data.data.events || [];
          events = events.filter(ev => ev.status === 'pending');
        } else {
          setError(res.data.message || 'Failed to fetch events');
          setEvents([]);
          setLoading(false);
          return;
        }
      } else {
        // Use search endpoint for approved/all
        const params = { page: 1, limit: 100 };
        if (search) params.search = search;
        if (filterType) params.type = filterType;
        if (filterStatus === 'approved') params.status = 'approved';
        // Date filter is client-side for simplicity
        const res = await axios.get('/api/admin/event/search', { params });
        if (res.data.success) {
          events = res.data.data.events || [];
        } else {
          setError(res.data.message || 'Failed to fetch events');
          setEvents([]);
          setLoading(false);
          return;
        }
      }
      // Client-side date filter
      if (filterDate) {
        events = events.filter(ev => ev.date && ev.date.startsWith(filterDate));
      }
      setEvents(events);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, [search, filterType, filterStatus, filterDate]);

  // Handlers
  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };
  const handleEdit = (event) => {
    setEventToEdit(event);
    setIsEditModalOpen(true);
  };
  const handleDelete = (event) => {
    setConfirmMessage(`Are you sure you want to delete the event "${event.name}"? This action cannot be undone.`);
    setConfirmAction(() => () => confirmDelete(event.id));
    setConfirmOpen(true);
  };
  const confirmDelete = async (id) => {
    setActionLoading(id);
    try {
      await axios.delete(`/api/admin/event/${id}`);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (err) {
      toast.error('Failed to delete event');
    } finally {
      setActionLoading(null);
      setConfirmOpen(false);
    }
  };
  const handleApprove = (event) => {
    setConfirmMessage(`Approve the event "${event.name}"?`);
    setConfirmAction(() => () => confirmApprove(event.id));
    setConfirmOpen(true);
  };
  const confirmApprove = async (id) => {
    setActionLoading(id);
    try {
      await axios.post(`/api/admin/event/${id}`);
      toast.success('Event approved successfully');
      fetchEvents();
    } catch (err) {
      toast.error('Failed to approve event');
    } finally {
      setActionLoading(null);
      setConfirmOpen(false);
    }
  };
  const handleViewDetails = (event) => {
    setEventToView(event);
    setIsDetailsModalOpen(true);
  };
  const handleViewRegistrations = (event) => {
    setEventToViewRegistrations(event);
    setIsRegistrationsModalOpen(true);
  };
  const handleEventCreatedOrUpdated = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setEventToEdit(null);
    fetchEvents();
  };

  // Filtered event types for dropdown
  const eventTypeOptions = useMemo(() => [
    { value: '', label: 'All Types' },
    ...EVENT_TYPES.filter(t => t.value !== '').map(t => ({ value: t.value, label: t.label }))
  ], []);

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Admin Events</h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition-colors"
        >
          <FiPlus className="h-5 w-5" />
          Create Event
        </button>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-48"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
        >
          {eventTypeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input
          type="date"
          className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
        />
      </div>
      {/* Table/Grid */}
      {loading ? (
        <div className="text-center text-gray-400 py-8">Loading events...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No events found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map(event => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{event.name}</td>
                  <td className="px-4 py-3 text-gray-700">{event.type}</td>
                  <td className="px-4 py-3 text-gray-700">{event.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[event.status] || 'bg-gray-100 text-gray-800'}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        title="View Details"
                        onClick={() => handleViewDetails(event)}
                        className="p-2 rounded-full hover:bg-indigo-50 text-indigo-600"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                      <button
                        title="View Registered Users"
                        onClick={() => handleViewRegistrations(event)}
                        className="p-2 rounded-full hover:bg-indigo-50 text-blue-600"
                      >
                        <FiUsers className="h-5 w-5" />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => handleEdit(event)}
                        className="p-2 rounded-full hover:bg-indigo-50 text-green-600"
                      >
                        <FiEdit2 className="h-5 w-5" />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(event)}
                        className="p-2 rounded-full hover:bg-red-50 text-red-600"
                        disabled={actionLoading === event.id}
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                      {event.status === 'pending' && (
                        <button
                          title="Approve"
                          onClick={() => handleApprove(event)}
                          className="p-2 rounded-full hover:bg-green-50 text-green-700"
                          disabled={actionLoading === event.id}
                        >
                          <FiCheckCircle className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modals */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onEventCreated={handleEventCreatedOrUpdated}
        editMode={false}
      />
      <CreateEventModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEventToEdit(null); }}
        onEventCreated={handleEventCreatedOrUpdated}
        editMode={true}
        eventToEdit={eventToEdit}
      />
      <EventDetailsModal
        event={eventToView}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
      <EventRegistrationsModal
        event={eventToViewRegistrations}
        isOpen={isRegistrationsModalOpen}
        onClose={() => setIsRegistrationsModalOpen(false)}
        user={{ role: 'admin' }}
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

export default AdminEventsPage;
