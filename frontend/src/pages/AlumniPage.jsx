import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
       <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden pt-16">
         {/* Enhanced Background decorative elements */}
         <div className="absolute inset-0 overflow-hidden">
           {/* Animated gradient orbs */}
           <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-primary-100/40 to-secondary-100/40 rounded-full blur-3xl animate-pulse"></div>
           <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-secondary-100/40 to-primary-100/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-100/30 to-secondary-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
           
           {/* Floating particles */}
           <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
           <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-secondary-400/40 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
           <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary-300/40 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }}></div>
         </div>

        {/* Hero Section */}
        <section className="relative z-10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
               <div className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-primary-50 to-secondary-50 backdrop-blur-sm text-slate-700 border border-slate-200 mb-4 shadow-lg font-sans">
                 <span className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mr-2 animate-pulse"></span>
                 <span>Alumni Network</span>
               </div>
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-sans text-slate-900 mb-4 leading-tight">
                 Connect with{' '}
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 animate-pulse">
                   Successful Graduates
                 </span>
               </h1>
               <p className="text-sm md:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed font-sans">
                 Find mentors, build meaningful professional relationships, and unlock new opportunities through our vibrant alumni community
               </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          {/* Search and Filters */}
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200 p-4 mb-6 relative z-40"
           >
             {/* Animated background */}
             <div className="absolute inset-0 bg-gradient-to-r from-primary-100/40 to-secondary-100/40 rounded-xl"></div>
             
             <div className="relative z-10">
               <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center w-full">
                 <div className="flex-1 w-full">
                   <label className="block text-xs font-medium text-slate-700 mb-2 font-sans">Search Alumni</label>
                   <AlumniSearch onSearch={handleSearch} isLoading={loading} />
                 </div>
                 <div className="flex gap-2 w-full lg:w-auto">
                   <div className="flex-1 lg:flex-none">
                     <label className="block text-xs font-medium text-slate-700 mb-2 font-sans">Filter & Sort</label>
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
                     <label className="block text-xs font-medium text-slate-700 mb-2 font-sans">Bookmarks</label>
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
            className="mt-6"
          >
             {loading ? (
               <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8 }}
                 className="flex flex-col items-center justify-center py-12"
               >
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-3"></div>
                 <p className="text-slate-600 text-sm font-medium font-sans">Loading alumni...</p>
               </motion.div>
             ) : error ? (
               <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8 }}
                 className="flex flex-col items-center py-12"
               >
                 <div className="w-12 h-12 bg-red-100 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 border border-red-200">
                   <i className="fas fa-exclamation-triangle text-red-500 text-lg"></i>
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">Something went wrong</h3>
                 <p className="text-slate-600 text-center mb-4 max-w-md text-sm font-sans">{error}</p>
                 <button
                   onClick={fetchAlumni}
                   className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl text-sm font-sans"
                 >
                   <i className="fas fa-refresh mr-2 text-xs"></i>
                   Try Again
                 </button>
               </motion.div>
             ) : alumni.length === 0 ? (
               <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8 }}
                 className="flex flex-col items-center py-12"
               >
                 <div className="w-12 h-12 bg-primary-100 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 border border-primary-200">
                   <i className="fas fa-users text-primary-600 text-lg"></i>
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">No alumni found</h3>
                 <p className="text-slate-600 text-center mb-4 max-w-md text-sm font-sans">
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
                   className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl text-sm font-sans"
                 >
                   <i className="fas fa-refresh mr-2 text-xs"></i>
                   Clear Filters
                 </button>
               </motion.div>
             ) : filteredAlumni.length === 0 ? (
               <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8 }}
                 className="flex flex-col items-center py-12"
               >
                 <div className="w-12 h-12 bg-secondary-100 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 border border-secondary-200">
                   <i className="fas fa-bookmark text-secondary-600 text-lg"></i>
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">No bookmarked alumni</h3>
                 <p className="text-slate-600 text-center mb-4 max-w-md text-sm font-sans">
                   Bookmark some alumni to see them here. Click the bookmark icon on any alumni card.
                 </p>
                 <button
                   onClick={() => setShowBookmarkedOnly(false)}
                   className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl text-sm font-sans"
                 >
                   <i className="fas fa-eye mr-2 text-xs"></i>
                   View All Alumni
                 </button>
               </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
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
                  className="mt-8"
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
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default AlumniPage; 