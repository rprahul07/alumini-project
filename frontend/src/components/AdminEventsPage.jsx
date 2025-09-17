import React, { useState, useEffect, useMemo } from 'react';
import axios from '../config/axios';
import { toast } from 'react-toastify';
import { 
  FiPlus, 
  FiSearch, 
  FiEdit2, 
  FiTrash2, 
  FiCheckCircle, 
  FiUsers, 
  FiEye, 
  FiCalendar,
  FiClock,
  FiMapPin,
  FiFilter,
  FiRefreshCw,
  FiTrendingUp,
  FiUserCheck,
  FiAlertCircle
} from 'react-icons/fi';
import CreateEventModal from './CreateEventModal';
import EventDetailsModal from './EventDetailsModal';
import EventRegistrationsModal from './EventRegistrationsModal';
import ConfirmDialog from './ConfirmDialog';
import { EVENT_TYPES } from '../constants/eventTypes';

const statusColors = {
  approved: 'bg-green-50 text-green-700 border-green-200',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

const statusIcons = {
  approved: FiCheckCircle,
  pending: FiClock,
  rejected: FiAlertCircle,
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

  // Calculate stats
  const stats = useMemo(() => {
    const total = events.length;
    const approved = events.filter(e => e.status === 'approved').length;
    const pending = events.filter(e => e.status === 'pending').length;
    const rejected = events.filter(e => e.status === 'rejected').length;
    return { total, approved, pending, rejected };
  }, [events]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Event Management</h1>
            <p className="text-primary-100 mt-1">Manage and monitor all events in your platform</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl text-slate-900 font-semibold hover:bg-white transition-all duration-200 border border-slate-200"
          >
            <FiPlus className="h-5 w-5" />
            Create Event
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-secondary-100 rounded-lg">
              <FiCalendar className="h-6 w-6 text-secondary-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-primary-600">{stats.approved}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FiClock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <FiAlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FiFilter className="h-5 w-5" />
            Filters
          </h3>
          <button
            onClick={fetchEvents}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FiRefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
          >
            {eventTypeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          
          <input
            type="date"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-500">
              <FiRefreshCw className="h-5 w-5 animate-spin" />
              <span>Loading events...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FiCalendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No events found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or create a new event</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.map(event => {
                const StatusIcon = statusIcons[event.status] || FiClock;
                return (
                  <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
                    {/* Event Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{event.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{event.type}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[event.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                        <StatusIcon className="h-3 w-3" />
                        {event.status}
                      </span>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiCalendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiMapPin className="h-4 w-4" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                      {event.time && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiClock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                      )}
                    </div>

                    {/* Event Description */}
                    {event.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewDetails(event)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <FiEye className="h-4 w-4" />
                        View
                      </button>
                      
                      <button
                        onClick={() => handleViewRegistrations(event)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <FiUsers className="h-4 w-4" />
                        Registrations
                      </button>
                      
                      <button
                        onClick={() => handleEdit(event)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <FiEdit2 className="h-4 w-4" />
                        Edit
                      </button>
                      
                      {event.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(event)}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                          disabled={actionLoading === event.id}
                        >
                          <FiCheckCircle className="h-4 w-4" />
                          Approve
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(event)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        disabled={actionLoading === event.id}
                      >
                        <FiTrash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

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