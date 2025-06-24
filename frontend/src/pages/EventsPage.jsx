import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import EventGrid from '../components/EventGrid';
import EventSearch from '../components/EventSearch';
import EventFilters from '../components/EventFilters';
import EventPagination from '../components/EventPagination';
import CreateEventButton from '../components/CreateEventButton';
import MyEventsButton from '../components/MyEventsButton';
import AdminEventProposals from '../components/AdminEventProposals';
import AdminAllEventsButton from '../components/AdminAllEventsButton';
import axios from '../config/axios';
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';

const EventsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

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
        department: selectedDepartment,
        type: selectedType,
        sortBy: sortBy,
        sortOrder: sortOrder
      });

      let endpoint;
      const role = user?.role?.toLowerCase();
      if (user && role) {
        endpoint = (searchTerm || selectedDepartment || selectedType || sortBy !== 'createdAt' || sortOrder !== 'desc')
          ? `/api/${role}/event/search?${params}`
          : `/api/${role}/event/all?${params}`;
      } else {
        endpoint = (searchTerm || selectedDepartment || selectedType || sortBy !== 'createdAt' || sortOrder !== 'desc')
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
    fetchEvents();
  }, [currentPage, searchTerm, selectedDepartment, selectedType, sortBy, sortOrder]);

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle filter changes
  const handleFilterChange = (department, type) => {
    setSelectedDepartment(department);
    setSelectedType(type);
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Action Buttons Row (compact, no big header) */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-row gap-2 items-center">
            {user && (user.role === 'alumni' || user.role === 'faculty' || user.role === 'admin') && (
              <CreateEventButton onEventCreated={fetchEvents} />
            )}
            {user && (user.role === 'alumni' || user.role === 'faculty') && (
              <MyEventsButton />
            )}
            {user && user.role === 'admin' && (
              <>
                <AdminEventProposals />
                <AdminAllEventsButton />
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col gap-3">
            <div className="flex flex-row gap-2 items-center">
              <div className="flex-1">
                <EventSearch onSearch={handleSearch} />
              </div>
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 shadow-sm transition"
                aria-label="Show Filters"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Filter Modal/Drawer */}
          {isFilterDrawerOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 z-[100] flex justify-end sm:justify-center">
              <div 
                className="h-full sm:h-auto bg-white w-full sm:w-96 max-w-full shadow-2xl p-4 z-[101] flex flex-col sm:rounded-xl sm:mt-20 mt-12"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Filters & Sort</h2>
                  <button onClick={() => setIsFilterDrawerOpen(false)} className="rounded-full p-2 hover:bg-gray-100">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <EventFilters 
                    selectedDepartment={selectedDepartment}
                    selectedType={selectedType}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                    isMobile={true}
                  />
                </div>
              </div>
            </div>
          )}

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
                  className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
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