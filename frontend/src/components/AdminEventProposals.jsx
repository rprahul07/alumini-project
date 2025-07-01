import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from '../config/axios';
import { 
  ClipboardDocumentListIcon, 
  CheckIcon, 
  XMarkIcon, 
  EyeIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const AdminEventProposals = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch all events for admin
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      let endpoint = '';
      let params = { page: currentPage, limit: 10 };
      if (user?.role === 'admin') {
        endpoint = '/api/admin/event/all';
      } else if (user?.role === 'alumni') {
        endpoint = '/api/alumni/event/proposals';
      } else if (user?.role === 'faculty') {
        endpoint = '/api/faculty/event/proposals';
      } else {
        setError('You are not authorized to view event proposals.');
        setLoading(false);
        return;
      }
      const response = await axios.get(endpoint, { params });
      if (response.data.success) {
        const allEvents = response.data.data.events || [];
        // Admin sees only pending, others see all their proposals
        const eventsToShow = user?.role === 'admin'
          ? allEvents.filter(event => event.status === 'pending')
          : allEvents;
        setEvents(eventsToShow);
        setTotalPages(response.data.data.pagination.totalPages || 1);
      } else {
        setError(response.data.message || 'Failed to fetch events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      if (err.response?.status === 401) {
        setError('Please log in to view event proposals');
      } else if (err.response?.status === 403) {
        setError('Access denied. You cannot view event proposals.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle approve/reject event
  const handleEventAction = async (eventId, action) => {
    try {
      setActionLoading(eventId);
      
      if (action === 'approve') {
        const response = await axios.post(`/api/admin/event/${eventId}`);
        
        if (response.data.success) {
          // Update the event status in the list
          setEvents(prevEvents => 
            prevEvents.map(event => 
              event.id === eventId 
                ? { ...event, status: 'approved' }
                : event
            )
          );
          alert('Event approved successfully!');
        } else {
          alert(response.data.message || 'Failed to approve event');
        }
      } else if (action === 'reject') {
        // For rejection, we'll need to implement a reject endpoint or use a different approach
        // For now, let's show a confirmation dialog
        if (confirm('Are you sure you want to reject this event? This action cannot be undone.')) {
          // You can implement rejection logic here
          alert('Event rejection feature will be implemented soon.');
        }
      }
    } catch (error) {
      console.error('Error handling event action:', error);
      
      if (error.response?.status === 401) {
        alert('Please log in to perform this action');
      } else if (error.response?.status === 403) {
        alert('Access denied. Only admins can approve events.');
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Network error. Please try again.');
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Open event details modal
  const openEventDetails = (event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fetch events when component mounts or page changes
  useEffect(() => {
    if (isModalOpen) {
      fetchEvents();
    }
  }, [isModalOpen, currentPage]);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors"
      >
        <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
        Event Proposals
      </button>

      {/* Main Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Event Proposals Management</h2>
                <p className="text-gray-600 mt-1">Review and manage event proposals from alumni and faculty</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-600 text-lg font-medium">{error}</div>
                  <button 
                    onClick={fetchEvents}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
                  <p className="mt-1 text-sm text-gray-500">There are no events to review at the moment.</p>
                </div>
              ) : (
                <>
                  {/* Events Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Event
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Creator
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {events.map((event) => (
                          <tr key={event.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  {event.imageUrl ? (
                                    <img 
                                      className="h-10 w-10 rounded-lg object-cover" 
                                      src={event.imageUrl} 
                                      alt={event.name}
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                      <PhotoIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{event.name}</div>
                                  <div className="text-sm text-gray-500">{event.type}</div>
                                  <div className="text-sm text-gray-500">{event.location}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{event.createdBy.fullName}</div>
                              <div className="text-sm text-gray-500">{event.createdBy.email}</div>
                              <div className="text-sm text-gray-500 capitalize">{event.createdBy.role}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatDate(event.date)}</div>
                              <div className="text-sm text-gray-500">{event.time}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(event.status)}`}>
                                {event.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => openEventDetails(event)}
                                  className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                  title="View Details"
                                >
                                  <EyeIcon className="h-4 w-4" />
                                </button>
                                
                                {user?.role === 'admin' && event.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleEventAction(event.id, 'approve')}
                                      disabled={actionLoading === event.id}
                                      className="text-green-600 hover:text-green-900 transition-colors disabled:opacity-50"
                                      title="Approve Event"
                                    >
                                      {actionLoading === event.id ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                      ) : (
                                        <CheckIcon className="h-4 w-4" />
                                      )}
                                    </button>
                                    
                                    <button
                                      onClick={() => handleEventAction(event.id, 'reject')}
                                      disabled={actionLoading === event.id}
                                      className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                                      title="Reject Event"
                                    >
                                      <XMarkIcon className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {isDetailModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Event Details</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Event Image */}
            <div className="relative h-64 bg-gray-200">
              {selectedEvent.imageUrl ? (
                <img 
                  src={selectedEvent.imageUrl} 
                  alt={selectedEvent.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200">
                  <PhotoIcon className="h-20 w-20 text-indigo-400" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(selectedEvent.status)}`}>
                  {selectedEvent.status}
                </span>
              </div>
            </div>

            {/* Event Content */}
            <div className="p-6">
              {/* Event Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedEvent.name}
              </h3>

              {/* Event Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="font-medium">{formatDate(selectedEvent.date)}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="font-medium">{selectedEvent.time}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="font-medium">{selectedEvent.location}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <UserIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <span className="font-medium">Organized by: {selectedEvent.organizer}</span>
                </div>
              </div>

              {/* Event Description */}
              {selectedEvent.description && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {/* Creator Information */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Event Creator</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    {selectedEvent.createdBy.photoUrl ? (
                      <img 
                        className="h-10 w-10 rounded-full object-cover" 
                        src={selectedEvent.createdBy.photoUrl} 
                        alt={selectedEvent.createdBy.fullName}
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{selectedEvent.createdBy.fullName}</div>
                      <div className="text-sm text-gray-500">{selectedEvent.createdBy.email}</div>
                      <div className="text-sm text-gray-500 capitalize">{selectedEvent.createdBy.role}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedEvent.status === 'pending' && (
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => {
                      handleEventAction(selectedEvent.id, 'approve');
                      setIsDetailModalOpen(false);
                    }}
                    disabled={actionLoading === selectedEvent.id}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === selectedEvent.id ? 'Approving...' : 'Approve Event'}
                  </button>
                  <button
                    onClick={() => {
                      handleEventAction(selectedEvent.id, 'reject');
                      setIsDetailModalOpen(false);
                    }}
                    disabled={actionLoading === selectedEvent.id}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Reject Event
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminEventProposals; 