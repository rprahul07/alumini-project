import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentGrid from '../components/StudentGrid';
import EventPagination from '../components/EventPagination';
import Navbar from '../components/Navbar';
import axios from '../config/axios';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
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
  // const [selectedDepartment, setSelectedDepartment] = useState(''); // For future filter
  // const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

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
      // TODO: Add search and pagination params when backend supports them
      const response = await axios.get('/api/student/getall');
      if (response.data.success) {
        setStudents(response.data.students || response.data.data?.students || []);
        // TODO: Set totalPages from response if backend supports pagination
        setTotalPages(1);
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
  }, [authLoading, currentPage]);

  // Debounced search (UI only, not functional until backend supports it)
  useEffect(() => {
    // No-op for now
  }, [searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search and Filters - match EventsPage */}
          <div className="mb-6 flex flex-row gap-2 items-center w-full">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search students (coming soon)"
                  className="block w-full pl-10 pr-3 py-2 border-2 border-white/40 rounded-full leading-5 bg-white/40 backdrop-blur-md placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 shadow-lg transition-all text-sm sm:text-base"
                  disabled
                />
              </div>
            </div>
            <button
              // onClick={() => setIsFilterDrawerOpen(true)}
              className="rounded-full px-4 py-2 font-semibold border-2 border-indigo-400 bg-white/60 backdrop-blur text-base sm:text-sm text-indigo-700 hover:bg-white/80 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 flex items-center justify-center"
              aria-label="Show Filters"
              disabled
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
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