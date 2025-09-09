import React, { useState, useEffect, memo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import EventGrid from '../components/EventGrid';
import EventSearch from '../components/EventSearch';
import EventFilterButton from '../components/EventFilterButton';
import EventActiveFilters from '../components/EventActiveFilters';
import EventPagination from '../components/EventPagination';

import axios from '../config/axios';

const EventsPage = memo(() => {
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
  const fetchEvents = useCallback(async () => {
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

      const response = await axios.get(endpoint);

      if (response.data.success) {
        // Filter out any undefined or null events and ensure they have required properties
        const validEvents = (response.data.data.events || []).filter(event => 
          event && 
          event.id && 
          typeof event.id === 'string' || typeof event.id === 'number'
        );
        setEvents(validEvents);
        const totalPages = response.data.data.pagination?.totalPages || 1;
        setTotalPages(totalPages);
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
  }, [user, currentPage, searchTerm, selectedEventType, sortBy, sortOrder, timeFilter]);

  // Fetch events when component mounts or filters change
  useEffect(() => {
    if (!authLoading) {
      fetchEvents();
    }
  }, [authLoading, fetchEvents]);



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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10"></div>
        
        {/* Loading State */}
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-secondary-400/20 to-transparent rounded-full blur-3xl"></div>
        
        {/* Hero Section */}
        <div className="relative py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 animate-fade-in leading-tight">
                Discover Amazing Events
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 animate-slide-up max-w-2xl mx-auto leading-relaxed font-body">
                Join our community and participate in exciting events that inspire and connect
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up">
                <div className="flex items-center text-white/80 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20">
                  <div className="w-2 h-2 bg-primary-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-sm font-medium font-body">Live Events</span>
                </div>
                <div className="flex items-center text-white/80 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20">
                  <div className="w-2 h-2 bg-secondary-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-sm font-medium font-body">Community Driven</span>
                </div>
                <div className="flex items-center text-white/80 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20">
                  <div className="w-2 h-2 bg-accent-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-sm font-medium font-body">Always Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Search and Filters */}
          <div className="mb-8 relative z-40">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold font-display text-white mb-3">Find Your Perfect Event</h2>
                <p className="text-white/80 font-body">Search and filter through our curated collection of events</p>
              </div>

              {/* Search and Filter Row */}
              <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-semibold text-white/90 mb-3 font-body">
                    Search Events
                  </label>
                  <EventSearch
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    isLoading={loading}
                  />
                </div>
                <div className="w-full xl:w-auto xl:min-w-[200px]">
                  <label className="block text-sm font-semibold text-white/90 mb-3 font-body">
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
              <div className="mt-6">
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
                <h3 className="text-3xl font-bold font-display text-white">
                  {events.length > 0 ? `${events.length} Events Found` : 'Events'}
                </h3>
                <p className="text-white/80 mt-2 font-body">
                  {events.length > 0 
                    ? 'Discover and join amazing events in your community'
                    : 'No events available at the moment'
                  }
                </p>
              </div>
              {events.length > 0 && (
                <div className="flex items-center gap-3 text-sm text-white/70 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                  <span className="font-body">Page {currentPage} of {totalPages}</span>
                </div>
              )}
            </div>

            {/* Content Area */}
            {authLoading || loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-400 border-t-transparent absolute top-0 left-0"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-white text-lg font-medium font-body">Loading amazing events...</p>
                    <p className="text-white/70 text-sm mt-1 font-body">Please wait while we fetch the latest events</p>
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-24">
                <div className="bg-white/10 backdrop-blur-xl border border-red-400/30 rounded-3xl p-8 text-center max-w-lg shadow-2xl">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="text-white text-xl font-semibold mb-2 font-display">Oops! Something went wrong</div>
                  <p className="text-white/80 mb-6 font-body">{error}</p>
                  <button 
                    onClick={fetchEvents}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold bg-red-500 text-white shadow-lg hover:bg-red-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-body"
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
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-12 max-w-lg mx-auto shadow-2xl">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-white text-xl font-semibold mb-2 font-display">No events found</div>
                  <p className="text-white/80 mb-6 font-body">Try adjusting your search terms or filters to find more events</p>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedEventType('');
                      setCurrentPage(1);
                    }}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg hover:from-primary-600 hover:to-secondary-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-body"
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
});

export default EventsPage; 