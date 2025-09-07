import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import EventGrid from '../components/EventGrid';
import EventSearch from '../components/EventSearch';
import EventFilterButton from '../components/EventFilterButton';
import EventActiveFilters from '../components/EventActiveFilters';
import EventPagination from '../components/EventPagination';

import axios from '../config/axios';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-secondary-600/90"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in leading-tight">
                Discover Amazing Events
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 animate-slide-up max-w-2xl mx-auto leading-relaxed">
                Join our community and participate in exciting events that inspire and connect
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
                <div className="flex items-center text-white/80">
                  <div className="w-2 h-2 bg-accent-400 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Live Events</span>
                </div>
                <div className="flex items-center text-white/80">
                  <div className="w-2 h-2 bg-accent-400 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Community Driven</span>
                </div>
                <div className="flex items-center text-white/80">
                  <div className="w-2 h-2 bg-accent-400 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Always Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Search and Filters */}
          <div className="mb-8 relative z-40">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Event</h2>
                <p className="text-gray-600">Search and filter through our curated collection of events</p>
              </div>

              {/* Search and Filter Row */}
              <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Search Events
                  </label>
                  <EventSearch
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    isLoading={loading}
                  />
                </div>
                <div className="w-full xl:w-auto xl:min-w-[200px]">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Filters & Sort
                  </label>
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
              </div>

              {/* Active Filters */}
              <div className="mt-4">
                <EventActiveFilters
                  searchTerm={searchTerm}
                  selectedEventType={selectedEventType}
                  onClearSearch={handleClearSearch}
                  onClearFilter={handleClearFilter}
                />
              </div>
            </div>
          </div>

          {/* Events Section */}
          <div className="space-y-8">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {events.length > 0 ? `${events.length} Events Found` : 'Events'}
                </h3>
                <p className="text-gray-600 mt-1">
                  {events.length > 0 
                    ? 'Discover and join amazing events in your community'
                    : 'No events available at the moment'
                  }
                </p>
              </div>
              {events.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Page {currentPage} of {totalPages}</span>
                </div>
              )}
            </div>

            {/* Content Area */}
            {authLoading || loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent absolute top-0 left-0"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-700 text-lg font-medium">Loading amazing events...</p>
                    <p className="text-gray-500 text-sm mt-1">Please wait while we fetch the latest events</p>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-24">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-lg">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="text-red-800 text-xl font-semibold mb-2">Oops! Something went wrong</div>
                  <p className="text-red-600 mb-6">{error}</p>
                  <button 
                    onClick={fetchEvents}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold bg-red-600 text-white shadow-lg hover:bg-red-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Try Again
                  </button>
                </div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-24">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 max-w-lg mx-auto">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-gray-700 text-xl font-semibold mb-2">No events found</div>
                  <p className="text-gray-500 mb-6">Try adjusting your search terms or filters to find more events</p>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedEventType('');
                      setCurrentPage(1);
                    }}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold bg-primary text-white shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                <EventGrid events={events} user={user} onEventUpdate={fetchEvents} />
                {totalPages > 1 && (
                  <div className="mt-12">
                    <EventPagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsPage; 