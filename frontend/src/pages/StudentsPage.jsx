import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StudentCard from '../components/StudentCard';
import StudentDetailsModal from '../components/StudentDetailsModal';
import EventPagination from '../components/EventPagination';
import StudentSearch from '../components/StudentSearch';
import StudentFilterButton from '../components/StudentFilterButton';
import StudentActiveFilters from '../components/StudentActiveFilters';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const StudentsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Redirect if not logged in
  if (!user && !authLoading) {
    navigate('/role-selection');
    return null;
  }



  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const limit = 12;
      const offset = (currentPage - 1) * limit;
      const params = new URLSearchParams({
        search: searchTerm,
        department: selectedDepartment,
        currentSemester: selectedSemester,
        limit,
        offset,
      });
      const response = await axios.get(`/api/student/searchstudent?${params}`);
      if (response.data.success) {
        setStudents(response.data.data.profiles || []);
        setTotalPages(response.data.data.pagination.totalPages || 1);
      } else {
        setError(response.data.message || 'Failed to fetch students');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchStudents();
    }
  }, [authLoading, currentPage, searchTerm, selectedDepartment, selectedSemester]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'department') {
      setSelectedDepartment(value);
    } else if (filterType === 'semester') {
      setSelectedSemester(value);
    }
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleClearFilter = (filterType) => {
    if (filterType === 'department') {
      setSelectedDepartment('');
    } else if (filterType === 'semester') {
      setSelectedSemester('');
    }
    setCurrentPage(1);
  };

  // Handle student card click for details
  const handleStudentCardClick = (student) => {
    setSelectedStudent(student);
    setDetailsModalOpen(true);
  };

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
        <section className="relative z-10 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white border border-slate-200 mb-6 shadow-sm text-slate-700 font-sans">
                <span className="flex h-2 w-2 relative mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                <span>Student Directory</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-sans text-slate-900 mb-6 leading-tight tracking-tight">
                The Faces of{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 animate-pulse">
                  Today's Campus
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-sans">
                From study partners to future leaders — meet the students carrying forward our legacy
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
            className="bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200 p-4 mb-6 relative z-40"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-100/40 to-secondary-100/40 rounded-xl"></div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center w-full">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-slate-700 mb-2 font-sans">Search Students</label>
                  <StudentSearch
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    isLoading={loading}
                  />
                </div>
                <div className="flex-1 lg:flex-none">
                  <label className="block text-xs font-medium text-slate-700 mb-2 font-sans">Filter & Sort</label>
                  <StudentFilterButton
                    selectedDepartment={selectedDepartment}
                    selectedSemester={selectedSemester}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Active Filters */}
          <StudentActiveFilters
            searchTerm={searchTerm}
            selectedDepartment={selectedDepartment}
            selectedSemester={selectedSemester}
            onClearSearch={handleClearSearch}
            onClearFilter={handleClearFilter}
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6"
          >
            {authLoading || loading ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-3"></div>
                <p className="text-slate-600 text-sm font-medium font-sans">Loading students...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center py-12"
              >
                <div className="w-16 h-16 bg-red-100/40 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border border-red-200">
                  <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h3>
                <p className="text-slate-600 text-center mb-6 max-w-md">{error}</p>
                <button
                  onClick={fetchStudents}
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-refresh mr-2"></i>
                  Try Again
                </button>
              </motion.div>
            ) : students.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center py-12"
              >
                <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border border-slate-200">
                  <i className="fas fa-graduation-cap text-primary-500 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No students found</h3>
                <p className="text-slate-600 text-center mb-6 max-w-md">
                  Try adjusting your search terms or filters to find more students.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDepartment('');
                    setSelectedSemester('');
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-refresh mr-2"></i>
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
                  <AnimatePresence>
                    {students.map((student, idx) => (
                      <motion.div
                        key={student.id || idx}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        exit={{ opacity: 0, y: -30 }}
                      >
                        <StudentCard
                          student={student}
                          onCardClick={handleStudentCardClick}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
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
        </div>

      </div>

      {/* Student Details Modal - Rendered outside main container to avoid stacking context issues */}
      <StudentDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        studentId={selectedStudent?.id || selectedStudent?.user?.id}
      />

      {/* Footer */}
      <Footer />
    </>
  );
};

export default StudentsPage; 
