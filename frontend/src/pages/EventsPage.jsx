import React, { useState, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden pt-16">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/40 via-transparent to-secondary-100/40"></div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-100/40 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-secondary-100/40 to-transparent rounded-full blur-3xl"></div>

        {/* Section Header with Badge */}
        <div className="relative py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white border border-slate-200 shadow-sm mb-6 text-slate-700 font-sans">
                <span className="flex h-2 w-2 relative mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                Events & Activities
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 tracking-tight leading-tight font-sans">
                Discover{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600">
                  Amazing Events
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-sans mb-8">
                Join our community and participate in exciting events that inspire and connect
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <div className="flex items-center text-slate-700 bg-white/80 backdrop-blur-xl rounded-full px-4 py-2 border border-slate-200 hover:bg-white hover:border-slate-300 transition-all duration-300 shadow-sm">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium font-sans">Live Events</span>
                </div>
                <div className="flex items-center text-slate-700 bg-white/80 backdrop-blur-xl rounded-full px-4 py-2 border border-slate-200 hover:bg-white hover:border-slate-300 transition-all duration-300 shadow-sm">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium font-sans">Community Driven</span>
                </div>
                <div className="flex items-center text-slate-700 bg-white/80 backdrop-blur-xl rounded-full px-4 py-2 border border-slate-200 hover:bg-white hover:border-slate-300 transition-all duration-300 shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium font-sans">Always Free</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 relative z-40"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-2xl p-6">
              {/* Search and Filter Row */}
              <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-semibold text-slate-700 mb-2 font-sans">
                    Search Events
                  </label>
                  <EventSearch
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    isLoading={loading}
                  />
                </div>
                <div className="w-full xl:w-auto xl:min-w-[200px]">
                  <label className="block text-sm font-semibold text-slate-700 mb-2 font-sans">
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
          </motion.div>

          {/* Events Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-50 to-secondary-50 backdrop-blur-sm text-slate-700 border border-slate-200 mb-3 shadow-lg font-sans">
                  <span className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mr-2 animate-pulse"></span>
                  <span>📅 Events List</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-sans">
                  {events.length > 0 ? `${events.length} Events Found` : 'Events'}
                </h3>
                <p className="text-slate-600 mt-2 text-sm font-sans">
                  {events.length > 0
                    ? 'Discover and join amazing events in your community'
                    : 'No events available at the moment'
                  }
                </p>
              </div>
              {events.length > 0 && (
                <div className="flex items-center gap-3 text-sm text-slate-600 bg-white/80 backdrop-blur-xl rounded-full px-3 py-1.5 border border-slate-200">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                  <span className="font-sans">Page {currentPage} of {totalPages}</span>
                </div>
              )}
            </div>

            {/* Content Area */}
            {authLoading || loading ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex justify-center items-center py-12"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20"></div>
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-400 border-t-transparent absolute top-0 left-0"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-900 text-base font-medium font-sans">Loading amazing events...</p>
                    <p className="text-slate-600 text-sm mt-1 font-sans">Please wait while we fetch the latest events</p>
                  </div>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center py-12"
              >
                <div className="bg-white/80 backdrop-blur-xl border border-red-200 rounded-2xl p-6 text-center max-w-lg shadow-2xl">
                  <div className="w-12 h-12 bg-red-100/40 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="text-slate-900 text-lg font-semibold mb-2 font-sans">Oops! Something went wrong</div>
                  <p className="text-slate-600 mb-4 text-sm font-sans">{error}</p>
                  <button
                    onClick={fetchEvents}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold bg-red-500 text-white shadow-lg hover:bg-red-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm font-sans"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Try Again
                  </button>
                </div>
              </motion.div>
            ) : events.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center py-12"
              >
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 p-8 max-w-lg mx-auto shadow-2xl">
                  <div className="w-16 h-16 bg-slate-100/40 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-slate-900 text-lg font-semibold mb-2 font-sans">No events found</div>
                  <p className="text-slate-600 mb-4 text-sm font-sans">Try adjusting your search terms or filters to find more events</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedEventType('');
                      setCurrentPage(1);
                    }}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg hover:from-primary-600 hover:to-secondary-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm font-sans"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Clear Filters
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                <EventGrid events={events} user={user} onEventUpdate={fetchEvents} />
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-12"
                  >
                    <EventPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
});

export default EventsPage; 