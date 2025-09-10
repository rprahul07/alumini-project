import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import AlumniSearch from '../components/AlumniSearch';
import AlumniFilterButton from '../components/AlumniFilterButton';
import AlumniActiveFilters from '../components/AlumniActiveFilters';
import AlumniCard from '../components/AlumniCard';
import MentorshipRequestModal from '../components/MentorshipRequestModal';
import AlumniDetailsModal from '../components/AlumniDetailsModal';
import axios from '../config/axios';
import useAlert from '../hooks/useAlert';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventPagination from '../components/EventPagination';
import { useNavigate } from 'react-router-dom';
import { bookmarkAPI } from '../services/bookmarkService';
import BookmarkFilterButton from '../components/BookmarkFilterButton';
import { motion, AnimatePresence } from 'framer-motion';

const AlumniPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const limit = 12; // Show 12 alumni per page
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAlumniForDetails, setSelectedAlumniForDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGraduationYear, setSelectedGraduationYear] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const { showAlert } = useAlert();
  const [supportRequests, setSupportRequests] = useState([]);

  // Bookmark-related state
  const [bookmarkedUserIds, setBookmarkedUserIds] = useState(new Set());
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  // Redirect if not logged in
  if (!user && !authLoading) {
    navigate('/role-selection');
    return null;
  }

  // Fetch alumni from API
  const fetchAlumni = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.append('limit', limit);
      params.append('offset', (currentPage - 1) * limit);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (selectedGraduationYear) params.append('graduationYear', selectedGraduationYear);
      if (selectedCompany) params.append('company', selectedCompany);
      if (selectedRole) params.append('role', selectedRole);
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
    // Only fetch support requests for students and alumni
    if (!user || !['student', 'alumni'].includes(user.role)) {
      return;
    }
    
    try {
      const response = await axios.get('/api/support/get');
      if (response.data.success) {
        setSupportRequests(response.data.data || []);
      }
    } catch (err) {
      // Ignore errors for now
    }
  };

  // Fetch bookmarks for current user
  const fetchBookmarks = async () => {
    try {
      const result = await bookmarkAPI.getBookmarks();
      if (result.success) {
        // Extract User IDs from bookmark data
        const userIds = result.data
          .map(bookmark => bookmark.alumni?.user?.id)
          .filter(Boolean);
        setBookmarkedUserIds(new Set(userIds));
      }
    } catch (error) {
    }
  };

  // Fetch alumni when filters/search/page change
  useEffect(() => {
    setCurrentPage(1);
    fetchAlumni();
    // eslint-disable-next-line
  }, [searchTerm, selectedGraduationYear, selectedCompany, selectedRole, sortBy, sortOrder]);

  // Fetch on page change
  useEffect(() => {
    fetchAlumni();
    // eslint-disable-next-line
  }, [currentPage]);

  useEffect(() => {
    if (!authLoading) {
      fetchSupportRequests();
      fetchBookmarks();
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

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'graduationYear':
        setSelectedGraduationYear(value);
        break;
      case 'company':
        setSelectedCompany(value);
        break;
      case 'role':
        setSelectedRole(value);
        break;
      default:
        break;
    }
    setCurrentPage(1);
  };

  // Handle sort changes
  const handleSortChange = (sortByValue, sortOrderValue) => {
    setSortBy(sortByValue);
    setSortOrder(sortOrderValue);
    setCurrentPage(1);
  };

  // Clear filter handlers
  const handleClearGraduationYear = () => {
    setSelectedGraduationYear('');
    setCurrentPage(1);
  };

  const handleClearCompany = () => {
    setSelectedCompany('');
    setCurrentPage(1);
  };

  const handleClearRole = () => {
    setSelectedRole('');
    setCurrentPage(1);
  };

  const handleClearSort = () => {
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = async (alumniUserId) => {
    setBookmarkLoading(true);
    const isBookmarked = bookmarkedUserIds.has(alumniUserId);
    
    // Optimistic update for immediate UI feedback
    setBookmarkedUserIds(prev => {
      const newSet = new Set(prev);
      if (isBookmarked) {
        newSet.delete(alumniUserId);
      } else {
        newSet.add(alumniUserId);
      }
      return newSet;
    });
    
    try {
      const result = isBookmarked 
        ? await bookmarkAPI.removeBookmark(alumniUserId)
        : await bookmarkAPI.addBookmark(alumniUserId);
        
      if (result.success) {
        showAlert(result.message, 'success');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      // Revert optimistic update on error
      setBookmarkedUserIds(prev => {
        const newSet = new Set(prev);
        if (isBookmarked) {
          newSet.add(alumniUserId);
        } else {
          newSet.delete(alumniUserId);
        }
        return newSet;
      });
      showAlert('Failed to update bookmark', 'error');
    } finally {
      setBookmarkLoading(false);
    }
  };

  // Filter alumni based on bookmark status
  const filteredAlumni = showBookmarkedOnly 
    ? alumni.filter(a => bookmarkedUserIds.has(a.userId))
    : alumni;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
        {/* Enhanced Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-primary-400/30 to-secondary-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-secondary-400/30 to-primary-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-300/20 to-secondary-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-secondary-400/60 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary-300/60 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }}></div>
        </div>

        {/* Hero Section */}
        <section className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm text-white border border-white/20 mb-8 shadow-lg">
                <span className="w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mr-3 animate-pulse"></span>
                <span>Alumni Network</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight">
                Connect with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-pulse">
                  Successful Graduates
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-body">
                Find mentors, build meaningful professional relationships, and unlock new opportunities through our vibrant alumni community
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 mb-8 relative z-40"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400/10 to-secondary-400/10 rounded-2xl animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center w-full">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-white mb-2">Search Alumni</label>
                  <AlumniSearch onSearch={handleSearch} isLoading={loading} />
                </div>
                <div className="flex gap-3 w-full lg:w-auto">
                  <div className="flex-1 lg:flex-none">
                    <label className="block text-sm font-medium text-white mb-2">Filter & Sort</label>
                    <AlumniFilterButton 
                      selectedGraduationYear={selectedGraduationYear}
                      selectedCompany={selectedCompany}
                      selectedRole={selectedRole}
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                      onFilterChange={handleFilterChange}
                      onSortChange={handleSortChange}
                    />
                  </div>
                  <div className="flex-1 lg:flex-none">
                    <label className="block text-sm font-medium text-white mb-2">Bookmarks</label>
                    <BookmarkFilterButton
                      showBookmarkedOnly={showBookmarkedOnly}
                      onToggle={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
                      bookmarkCount={bookmarkedUserIds.size}
                      loading={bookmarkLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Active Filters */}
          <AlumniActiveFilters
            selectedGraduationYear={selectedGraduationYear}
            selectedCompany={selectedCompany}
            selectedRole={selectedRole}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onClearGraduationYear={handleClearGraduationYear}
            onClearCompany={handleClearCompany}
            onClearRole={handleClearRole}
            onClearSort={handleClearSort}
          />

          {/* Alumni Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8"
          >
            {loading ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-400 mb-4"></div>
                <p className="text-gray-300 text-lg font-medium">Loading alumni...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center py-20"
              >
                <div className="w-16 h-16 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border border-red-500/30">
                  <i className="fas fa-exclamation-triangle text-red-400 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
                <p className="text-gray-300 text-center mb-6 max-w-md">{error}</p>
                <button
                  onClick={fetchAlumni}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-refresh mr-2"></i>
                  Try Again
                </button>
              </motion.div>
            ) : alumni.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center py-20"
              >
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border border-white/20">
                  <i className="fas fa-users text-primary-400 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No alumni found</h3>
                <p className="text-gray-300 text-center mb-6 max-w-md">
                  Try adjusting your search terms or filters to find more alumni.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedGraduationYear('');
                    setSelectedCompany('');
                    setSelectedRole('');
                    setCurrentPage(1);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-refresh mr-2"></i>
                  Clear Filters
                </button>
              </motion.div>
            ) : filteredAlumni.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center py-20"
              >
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border border-white/20">
                  <i className="fas fa-bookmark text-secondary-400 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No bookmarked alumni</h3>
                <p className="text-gray-300 text-center mb-6 max-w-md">
                  Bookmark some alumni to see them here. Click the bookmark icon on any alumni card.
                </p>
                <button
                  onClick={() => setShowBookmarkedOnly(false)}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-eye mr-2"></i>
                  View All Alumni
                </button>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
                  <AnimatePresence>
                    {filteredAlumni.map((a, index) => {
                      // Disable for self
                      if (user && a.userId === user.id) {
                        return (
                          <motion.div
                            key={a.userId}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            exit={{ opacity: 0, y: -30 }}
                          >
                            <AlumniCard
                              alumni={a}
                              onRequestMentorship={handleRequestMentorship}
                              onCardClick={handleAlumniCardClick}
                              buttonDisabled={true}
                              buttonLabel="You can't send yourself"
                              isBookmarked={bookmarkedUserIds.has(a.userId)}
                              onBookmarkToggle={handleBookmarkToggle}
                              bookmarkLoading={bookmarkLoading}
                              user={user}
                            />
                          </motion.div>
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
                        <motion.div
                          key={a.userId}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          exit={{ opacity: 0, y: -30 }}
                        >
                          <AlumniCard
                            alumni={a}
                            onRequestMentorship={handleRequestMentorship}
                            onCardClick={handleAlumniCardClick}
                            buttonDisabled={buttonDisabled}
                            buttonLabel={buttonLabel}
                            isBookmarked={bookmarkedUserIds.has(a.userId)}
                            onBookmarkToggle={handleBookmarkToggle}
                            bookmarkLoading={bookmarkLoading}
                            user={user}
                          />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
                {/* Pagination Controls - Always at bottom, full width */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="mt-10"
                >
                  <EventPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Mentorship Request Modal */}
          <MentorshipRequestModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            alumni={selectedAlumni || {}}
            onSend={handleSendMentorshipRequest}
            onResult={handleMentorshipResult}
          />

          {/* Centered Alert */}
          <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </div>
      </div>

      {/* Alumni Details Modal - Rendered outside main container to avoid stacking context issues */}
      <AlumniDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        alumni={selectedAlumniForDetails || {}}
        onRequestMentorship={handleRequestMentorship}
        onRefresh={fetchAlumni}
      />
    </>
  );
};

export default AlumniPage; 