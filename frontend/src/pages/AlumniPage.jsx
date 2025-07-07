import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import AlumniSearch from '../components/AlumniSearch';
import AlumniFilters from '../components/AlumniFilters';
import AlumniCard from '../components/AlumniCard';
import MentorshipRequestModal from '../components/MentorshipRequestModal';
import AlumniDetailsModal from '../components/AlumniDetailsModal';
// import AlumniPagination from '../components/AlumniPagination';
import axios from '../config/axios';
import useAlert from '../hooks/useAlert';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AlumniPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const limit = 12; // Show 12 alumni per page
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAlumniForDetails, setSelectedAlumniForDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGraduationYear, setSelectedGraduationYear] = useState('');
  const { showAlert } = useAlert();
  const [supportRequests, setSupportRequests] = useState([]);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 + 1 }, (_, i) => currentYear - i);
  let debounceTimeout = null;

  // Fetch alumni from API
  const fetchAlumni = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.append('limit', limit);
      params.append('offset', (currentPage - 1) * limit);
      if (sortOrder) params.append('sortOrder', sortOrder);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (selectedGraduationYear) params.append('graduationYear', selectedGraduationYear);
      const response = await axios.get(`/api/alumni/searchalumni?${params}`);
      if (response.data.success) {
        setAlumni(response.data.data.profiles || []);
        setTotalPages(response.data.data.pagination.totalPages);
      } else {
        setError('Failed to load alumni. Please try again or adjust your filters.');
      }
    } catch (err) {
      setError('Failed to load alumni. Please try again or adjust your filters.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch support requests for current user
  const fetchSupportRequests = async () => {
    try {
      const response = await axios.get('/api/support/get');
      if (response.data.success) {
        setSupportRequests(response.data.data || []);
      }
    } catch (err) {
      // Ignore errors for now
    }
  };

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      setCurrentPage(1);
      fetchAlumni();
    }, 400);
    return () => clearTimeout(debounceTimeout);
    // eslint-disable-next-line
  }, [searchTerm, selectedGraduationYear, sortOrder]);

  // Fetch on page change
  useEffect(() => {
    fetchAlumni();
    // eslint-disable-next-line
  }, [currentPage]);

  useEffect(() => {
    if (!authLoading) {
      fetchSupportRequests();
    }
    // eslint-disable-next-line
  }, [authLoading]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle mentorship request button
  const handleRequestMentorship = (alumni) => {
    setSelectedAlumni(alumni);
    setModalOpen(true);
  };

  // Handle alumni card click for details
  const handleAlumniCardClick = (alumni) => {
    setSelectedAlumniForDetails(alumni);
    setDetailsModalOpen(true);
  };

  // Send mentorship request
  const handleSendMentorshipRequest = async (message) => {
    if (!user || !selectedAlumni) return;
    await axios.post('/api/support/create', {
      user_id: user.id,
      alumni_id: selectedAlumni.userId,
      descriptionbyUser: message,
    });
    // Refresh alumni list to update request status
    fetchAlumni();
  };

  // Handle mentorship request result
  const handleMentorshipResult = (result) => {
    showAlert(result.message, result.success ? 'success' : 'error');
    if (result.success) setModalOpen(false);
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Handle filter
  const handleFilterChange = (year) => {
    setSelectedGraduationYear(year);
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          {/* Search, Filter, Sort - Always full width, above the grid */}
          <div className="mb-6 flex flex-row gap-2 items-center w-full">
            <div className="flex-1">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search alumni by name or company..."
                  className="block w-full pl-10 pr-3 py-2 border-2 border-white/40 rounded-full leading-5 bg-white/40 backdrop-blur-md placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 shadow-lg transition-all"
                />
              </div>
            </div>
            <select
              value={selectedGraduationYear}
              onChange={e => setSelectedGraduationYear(e.target.value)}
              className="w-full sm:w-auto rounded-full px-4 py-2 font-semibold border-2 border-indigo-400 bg-white/60 backdrop-blur text-sm text-indigo-700 hover:bg-white/80 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-full sm:w-auto rounded-full px-4 py-2 font-semibold border-2 border-indigo-400 bg-white/60 text-sm text-indigo-700 hover:bg-white/80 shadow-lg transition-all"
            >
              Sort: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </button>
          </div>

          {/* Alumni Grid - Flex-1 to take remaining space */}
          <div className="flex-1 flex flex-col">
            {loading ? (
              <div className="flex-1 flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="flex-1 flex flex-col justify-center items-center py-20">
                <div className="text-red-600 text-lg font-semibold mb-4">{error}</div>
                <button
                  onClick={fetchAlumni}
                  className="rounded-full px-4 py-1.5 font-semibold bg-indigo-600 text-white shadow hover:bg-indigo-700 transition"
                >
                  Retry
                </button>
              </div>
            ) : alumni.length === 0 ? (
              <div className="flex-1 flex justify-center items-center">
                <div className="text-center text-gray-500 py-20 text-lg font-medium">
                  No alumni found. Try adjusting your filters or search.
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {alumni.map((a) => {
                    // Disable for self
                    if (user && a.userId === user.id) {
                      return (
                        <AlumniCard
                          key={a.userId}
                          alumni={a}
                          onRequestMentorship={handleRequestMentorship}
                          onCardClick={handleAlumniCardClick}
                          buttonDisabled={true}
                          buttonLabel="You can't send yourself"
                        />
                      );
                    }
                    // Find existing request
                    const req = supportRequests.find(r => r.alumniId === a.userId && r.support_requester === user.id);
                    let buttonDisabled = false;
                    let buttonLabel = 'Request Mentorship';
                    if (req) {
                      if (req.status === 'pending') {
                        buttonDisabled = true;
                        buttonLabel = 'Pending';
                      } else if (req.status === 'accepted') {
                        buttonDisabled = false;
                        buttonLabel = 'Connected';
                      } else if (req.status === 'rejected') {
                        buttonDisabled = false;
                        buttonLabel = 'Request Mentorship';
                      }
                    }
                    return (
                      <AlumniCard
                        key={a.userId}
                        alumni={a}
                        onRequestMentorship={handleRequestMentorship}
                        onCardClick={handleAlumniCardClick}
                        buttonDisabled={buttonDisabled}
                        buttonLabel={buttonLabel}
                      />
                    );
                  })}
                </div>
                {/* Pagination Controls - Always at bottom, full width */}
                <div className="mt-10 flex justify-center w-full">
                  {/* Use EventPagination for consistent UI */}
                  {/* <EventPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} /> */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-1.5 rounded-full font-semibold bg-white border border-indigo-300 text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-1.5 text-indigo-700 font-medium">Page {currentPage} of {totalPages}</span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-1.5 rounded-full font-semibold bg-white border border-indigo-300 text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mentorship Request Modal */}
          <MentorshipRequestModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            alumni={selectedAlumni || {}}
            onSend={handleSendMentorshipRequest}
            onResult={handleMentorshipResult}
          />

          {/* Alumni Details Modal */}
          <AlumniDetailsModal
            open={detailsModalOpen}
            onClose={() => setDetailsModalOpen(false)}
            alumni={selectedAlumniForDetails || {}}
            onRequestMentorship={handleRequestMentorship}
            onRefresh={fetchAlumni}
          />

          {/* Centered Alert */}
          <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </div>
      </div>
    </>
  );
};

export default AlumniPage; 
