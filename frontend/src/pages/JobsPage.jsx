import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
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
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-secondary-400/20 to-transparent rounded-full blur-3xl"></div>
        
        {/* Hero Section */}
        <section className="relative py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm text-white border border-white/20 mb-8 shadow-lg">
                  <span className="w-3 h-3 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full mr-3 animate-pulse"></span>
                  <span>💼 Career Opportunities</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight">
                  Discover Your{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 animate-pulse">
                    Dream Career
                  </span>
                </h1>
                <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-body">
                  Connect with amazing job opportunities and internships shared by our alumni network. Your next career move starts here.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4 text-sm sm:text-base"
              >
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">Verified Opportunities</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <div className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">Alumni Network</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">Direct Applications</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 overflow-visible">
          {/* Search and Filters Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 mb-8 relative"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400/5 to-secondary-400/5 rounded-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-semibold text-white/90 mb-3 font-body">
                    Search Jobs
                  </label>
                  <JobSearch onSearch={handleSearch} isLoading={loading} />
                </div>
                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-semibold text-white/90 mb-3 font-body">
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
          </motion.div>

          {/* Active Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ActiveFilters
              selectedType={selectedType}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onClearType={handleClearType}
              onClearSort={handleClearSort}
            />
          </motion.div>

          {/* Jobs Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center mb-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Loading Opportunities</h3>
                <p className="text-gray-300 text-center max-w-md">
                  Discovering amazing career opportunities for you...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-20">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-300 mb-6 text-center max-w-md">
                  We couldn't load the job opportunities. Please try again.
                </p>
                <button
                  onClick={fetchJobs}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-semibold shadow-lg hover:from-primary-600 hover:to-secondary-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Try Again
                </button>
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex flex-col items-center py-20">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No opportunities found</h3>
                <p className="text-gray-300 mb-6 text-center max-w-md">
                  Try adjusting your search terms or filters to find more opportunities.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('');
                    setCurrentPage(1);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-semibold shadow-lg hover:from-primary-600 hover:to-secondary-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-8">
                  {/* Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-3xl font-bold font-display text-white">
                        {jobs.length > 0 ? `${jobs.length} Opportunities Found` : 'Opportunities'}
                      </h3>
                      <p className="text-white/80 mt-2 font-body">
                        {jobs.length > 0 
                          ? 'Discover and apply to amazing career opportunities'
                          : 'No opportunities available at the moment'
                        }
                      </p>
                    </div>
                    {jobs.length > 0 && (
                      <div className="flex items-center gap-3 text-sm text-white/70 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20">
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                        <span className="font-body">Page {currentPage} of {totalPages}</span>
                      </div>
                    )}
                  </div>

                  {/* Jobs Grid */}
                  <JobGrid jobs={jobs} user={user} appliedJobIds={appliedJobIds} onJobClick={handleJobClick} onApply={handleApply} />
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mt-12"
                >
                  <JobPagination
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