import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import JobGrid from '../components/opportunities/JobGrid';
import JobSearch from '../components/opportunities/JobSearch';
import FilterButton from '../components/opportunities/FilterButton';
import ActiveFilters from '../components/opportunities/ActiveFilters';
import JobPagination from '../components/opportunities/JobPagination';
import JobDetailsModal from '../components/opportunities/JobDetailsModal';
import SimpleApplyModal from '../components/opportunities/SimpleApplyModal';
import axios from '../config/axios';
import { useAuth } from '../contexts/AuthContext';
import useAlert from '../hooks/useAlert';

const JobsPage = () => {
  // State for jobs and UI
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  // Fetch jobs from API
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        search: searchTerm,
        jobType: selectedType,
        sortBy: sortBy,
        sortOrder: sortOrder,
      };
      // Remove empty params
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      const res = await axios.get('/api/job/', { params });
      setJobs(res.data.data.jobs);
      setTotalPages(res.data.data.totalPages || 1);
    } catch (err) {
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs when filters/search/page change
  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, [currentPage, searchTerm, selectedType, selectedCompany, sortBy, sortOrder]);

  // Fetch applied jobs for logged-in user
  useEffect(() => {
    if (user && (user.role === 'student' || user.role === 'alumni')) {
      axios.get('/api/job/applied').then(res => {
        setAppliedJobIds(new Set((res.data.data || []).map(job => job.id)));
      }).catch(() => setAppliedJobIds(new Set()));
    } else {
      setAppliedJobIds(new Set());
    }
  }, [user]);

  // Handlers
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };
  const handleFilterChange = (type) => {
    setSelectedType(type);
    setCurrentPage(1);
  };
  const handleSortChange = (sortByValue, sortOrderValue) => {
    setSortBy(sortByValue);
    setSortOrder(sortOrderValue);
    setCurrentPage(1);
  };
  
  const handleClearType = () => {
    setSelectedType('');
    setCurrentPage(1);
  };
  
  const handleClearSort = () => {
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };
  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  // Refresh jobs and appliedJobIds after application
  const refreshJobsAndApplied = async () => {
    await fetchJobs();
    if (user && (user.role === 'student' || user.role === 'alumni')) {
      axios.get('/api/job/applied').then(res => {
        setAppliedJobIds(new Set((res.data.data || []).map(job => job.id)));
      }).catch(() => setAppliedJobIds(new Set()));
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
                Career Opportunities
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Discover amazing job opportunities and internships from our alumni network
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                  <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></div>
                  <span>Verified Opportunities</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                  <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></div>
                  <span>Alumni Network</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                  <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></div>
                  <span>Direct Applications</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Search and Filters Container */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 z-40 relative animate-slide-up">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Jobs
                </label>
                <JobSearch onSearch={handleSearch} isLoading={loading} />
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter & Sort
                </label>
                <FilterButton 
                  selectedType={selectedType}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onFilterChange={handleFilterChange}
                  onSortChange={handleSortChange}
                />
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <ActiveFilters
            selectedType={selectedType}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onClearType={handleClearType}
            onClearSort={handleClearSort}
          />

          {/* Jobs Grid */}
          <div className="mt-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading opportunities...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-20 animate-fade-in">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-600 mb-6 text-center max-w-md">
                  We couldn't load the job opportunities. Please try again.
                </p>
                <button
                  onClick={fetchJobs}
                  className="px-6 py-3 bg-primary text-white rounded-full font-semibold shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Try Again
                </button>
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex flex-col items-center py-20 animate-fade-in">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No opportunities found</h3>
                <p className="text-gray-600 mb-6 text-center max-w-md">
                  Try adjusting your search terms or filters to find more opportunities.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('');
                    setCurrentPage(1);
                  }}
                  className="px-6 py-3 bg-primary text-white rounded-full font-semibold shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="animate-fade-in">
                  <JobGrid jobs={jobs} user={user} appliedJobIds={appliedJobIds} onJobClick={handleJobClick} onApply={handleApply} />
                </div>
                <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <JobPagination
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
      
      {/* Modals and Toast Container */}
      <JobDetailsModal
        job={selectedJob}
        open={showModal}
        onClose={() => setShowModal(false)}
        onApply={() => { setShowModal(false); setShowApplyModal(true); }}
      />
      <SimpleApplyModal
        open={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        job={selectedJob}
        showAlert={showAlert}
        onSuccess={() => {
          setShowApplyModal(false);
          refreshJobsAndApplied();
        }}
      />
      
      <ToastContainer 
        position="top-right" 
        autoClose={4000} 
        hideProgressBar={false} 
        newestOnTop 
        closeOnClick 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </>
  );
};

export default JobsPage; 