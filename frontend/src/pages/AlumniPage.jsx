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
      console.error('Error fetching bookmarks:', error);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
                Alumni Network
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Connect with successful graduates, find mentors, and build meaningful professional relationships
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 z-40 relative animate-slide-up">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center w-full">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Alumni</label>
                <AlumniSearch onSearch={handleSearch} isLoading={loading} />
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <div className="flex-1 lg:flex-none">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter & Sort</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bookmarks</label>
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
          <div className="mt-8 animate-fade-in">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading alumni...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-20">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h3>
                <p className="text-gray-600 text-center mb-6 max-w-md">{error}</p>
                <button
                  onClick={fetchAlumni}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 flex items-center"
                >
                  <i className="fas fa-refresh mr-2"></i>
                  Try Again
                </button>
              </div>
            ) : alumni.length === 0 ? (
              <div className="flex flex-col items-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-users text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No alumni found</h3>
                <p className="text-gray-600 text-center mb-6 max-w-md">
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
                  className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 flex items-center"
                >
                  <i className="fas fa-refresh mr-2"></i>
                  Clear Filters
                </button>
              </div>
            ) : filteredAlumni.length === 0 ? (
              <div className="flex flex-col items-center py-20">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-bookmark text-accent-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No bookmarked alumni</h3>
                <p className="text-gray-600 text-center mb-6 max-w-md">
                  Bookmark some alumni to see them here. Click the bookmark icon on any alumni card.
                </p>
                <button
                  onClick={() => setShowBookmarkedOnly(false)}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 flex items-center"
                >
                  <i className="fas fa-eye mr-2"></i>
                  View All Alumni
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
                  {filteredAlumni.map((a) => {
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
                          isBookmarked={bookmarkedUserIds.has(a.userId)}
                          onBookmarkToggle={handleBookmarkToggle}
                          bookmarkLoading={bookmarkLoading}
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
                        isBookmarked={bookmarkedUserIds.has(a.userId)}
                        onBookmarkToggle={handleBookmarkToggle}
                        bookmarkLoading={bookmarkLoading}
                      />
                    );
                  })}
                </div>
                {/* Pagination Controls - Always at bottom, full width */}
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