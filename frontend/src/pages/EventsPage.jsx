import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import EventGrid from '../components/EventGrid';
import EventSearch from '../components/EventSearch';
import EventFilterButton from '../components/EventFilterButton';
import EventActiveFilters from '../components/EventActiveFilters';
import EventPagination from '../components/EventPagination';

import axios from '../config/axios';
import Navbar from '../components/Navbar';

const EventsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [timeFilter, setTimeFilter] = useState('all');

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12, // Show 12 events per page
        search: searchTerm,
        type: selectedEventType,
        sortBy: sortBy,
        sortOrder: sortOrder,
        timeFilter: timeFilter,
      });

      let endpoint;
      const role = user?.role?.toLowerCase();
      if (user && role) {
        endpoint = (searchTerm || selectedEventType || sortBy !== 'createdAt' || sortOrder !== 'desc' || timeFilter !== 'all')
          ? `/api/${role}/event/search?${params}`
          : `/api/${role}/event/all?${params}`;
      } else {
        endpoint = (searchTerm || selectedEventType || sortBy !== 'createdAt' || sortOrder !== 'desc' || timeFilter !== 'all')
          ? `/api/public/event/search?${params}`
          : `/api/public/event/all?${params}`;
      }
      // Debug log
      console.log('Fetching events for role:', role, 'endpoint:', endpoint);

      const response = await axios.get(endpoint);

      if (response.data.success) {
        console.log('Fetched events:', response.data.data.events);
        setEvents(response.data.data.events);
        setTotalPages(response.data.data.pagination.totalPages);
      } else {
        setError(response.data.message || 'Failed to fetch events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      
      if (err.response?.status === 401) {
        setError('Please log in to view events');
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view events.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch events when component mounts or filters change
  useEffect(() => {
    if (!authLoading) {
      fetchEvents();
    }
  }, [authLoading, currentPage, searchTerm, selectedEventType, sortBy, sortOrder, timeFilter]);

  // Handle search
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'eventType') {
      setSelectedEventType(value);
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle sort changes
  const handleSortChange = (sortByValue, sortOrderValue) => {
    setSortBy(sortByValue);
    setSortOrder(sortOrderValue);
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Handle clear filter
  const handleClearFilter = (filterType) => {
    if (filterType === 'eventType') {
      setSelectedEventType('');
    }
    setCurrentPage(1);
  };

  // Handle time filter change
  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">


        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search and Filters */}
          <div className="mb-6 flex flex-row gap-2 items-center w-full">
            <EventSearch
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              isLoading={loading}
            />
            <EventFilterButton
              selectedEventType={selectedEventType}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              timeFilter={timeFilter}
              onTimeFilterChange={handleTimeFilterChange}
            />
          </div>

          {/* Active Filters */}
          <EventActiveFilters
            searchTerm={searchTerm}
            selectedEventType={selectedEventType}
            onClearSearch={handleClearSearch}
            onClearFilter={handleClearFilter}
          />

          {/* Events Grid */}
          <div className="mt-8">
            {authLoading || loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-20">
                <div className="text-red-600 text-lg font-semibold mb-4">{error}</div>
                <button 
                  onClick={fetchEvents}
                  className="rounded-full px-4 py-1.5 font-semibold bg-indigo-600 text-white shadow hover:bg-indigo-700 transition"
                >
                  Retry
                </button>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center text-gray-500 py-20 text-lg font-medium">
                No events found. Try adjusting your filters or search.
              </div>
            ) : (
              <>
                <EventGrid events={events} user={user} onEventUpdate={fetchEvents} />
                <div className="mt-10">
                  <EventPagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsPage; 