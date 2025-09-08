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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
                Student Directory
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Connect with fellow students, find study partners, and build lasting friendships
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 z-40 relative animate-slide-up">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center w-full">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
                <StudentSearch
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                  isLoading={loading}
                />
              </div>
              <div className="flex-1 lg:flex-none">
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter & Sort</label>
                <StudentFilterButton
                  selectedDepartment={selectedDepartment}
                  selectedSemester={selectedSemester}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <StudentActiveFilters
            searchTerm={searchTerm}
            selectedDepartment={selectedDepartment}
            selectedSemester={selectedSemester}
            onClearSearch={handleClearSearch}
            onClearFilter={handleClearFilter}
          />
          <div className="mt-8 animate-fade-in">
            {authLoading || loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading students...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-20">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h3>
                <p className="text-gray-600 text-center mb-6 max-w-md">{error}</p>
                <button 
                  onClick={fetchStudents}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 flex items-center"
                >
                  <i className="fas fa-refresh mr-2"></i>
                  Try Again
                </button>
              </div>
            ) : students.length === 0 ? (
              <div className="flex flex-col items-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-graduation-cap text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No students found</h3>
                <p className="text-gray-600 text-center mb-6 max-w-md">
                  Try adjusting your search terms or filters to find more students.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedDepartment('');
                    setSelectedSemester('');
                    setCurrentPage(1);
                  }}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 flex items-center"
                >
                  <i className="fas fa-refresh mr-2"></i>
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
                  {students.map((student, idx) => (
                    <StudentCard 
                      key={student.id || idx} 
                      student={student} 
                      onCardClick={handleStudentCardClick}
                    />
                  ))}
                </div>
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

        {/* Student Details Modal */}
        <StudentDetailsModal
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          studentId={selectedStudent?.id || selectedStudent?.user?.id}
        />
      </div>
    </>
  );
};

export default StudentsPage; 