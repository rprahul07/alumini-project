import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentGrid from '../components/StudentGrid';
import EventPagination from '../components/EventPagination';
import Navbar from '../components/Navbar';
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search and Filters */}
          <div className="mb-6 flex flex-row gap-2 items-center w-full">
            <StudentSearch
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              isLoading={loading}
            />
            <StudentFilterButton
              selectedDepartment={selectedDepartment}
              selectedSemester={selectedSemester}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Active Filters */}
          <StudentActiveFilters
            searchTerm={searchTerm}
            selectedDepartment={selectedDepartment}
            selectedSemester={selectedSemester}
            onClearSearch={handleClearSearch}
            onClearFilter={handleClearFilter}
          />
          <div className="mt-8">
            {authLoading || loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-20">
                <div className="text-red-600 text-lg font-semibold mb-4">{error}</div>
                <button 
                  onClick={fetchStudents}
                  className="rounded-full px-4 py-1.5 font-semibold bg-indigo-600 text-white shadow hover:bg-indigo-700 transition"
                >
                  Retry
                </button>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center text-gray-500 py-20 text-lg font-medium">
                No students found.
              </div>
            ) : (
              <>
                <StudentGrid students={students} />
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

export default StudentsPage; 