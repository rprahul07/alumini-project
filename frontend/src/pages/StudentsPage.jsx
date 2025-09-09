import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
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
                <span>Student Directory</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight">
                Connect with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-pulse">
                  Fellow Students
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-body">
                Find study partners, build lasting friendships, and create meaningful connections with your peers
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
                  <label className="block text-sm font-medium text-white mb-2">Search Students</label>
                  <StudentSearch
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    isLoading={loading}
                  />
                </div>
                <div className="flex-1 lg:flex-none">
                  <label className="block text-sm font-medium text-white mb-2">Filter & Sort</label>
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
            className="mt-8"
          >
            {authLoading || loading ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-400 mb-4"></div>
                <p className="text-gray-300 text-lg font-medium">Loading students...</p>
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
                  onClick={fetchStudents}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
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
                className="flex flex-col items-center py-20"
              >
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border border-white/20">
                  <i className="fas fa-graduation-cap text-primary-400 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No students found</h3>
                <p className="text-gray-300 text-center mb-6 max-w-md">
                  Try adjusting your search terms or filters to find more students.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDepartment('');
                    setSelectedSemester('');
                    setCurrentPage(1);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-refresh mr-2"></i>
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
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
        </div>

      </div>

      {/* Student Details Modal - Rendered outside main container to avoid stacking context issues */}
      <StudentDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        studentId={selectedStudent?.id || selectedStudent?.user?.id}
      />
    </>
  );
};

export default StudentsPage; 