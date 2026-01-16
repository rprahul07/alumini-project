import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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

const JobsPage = memo(() => {
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

  // Memoized API parameters to prevent unnecessary re-renders
  const apiParams = useMemo(() => {
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
    return params;
  }, [currentPage, searchTerm, selectedType, sortBy, sortOrder]);

  // Fetch jobs from API with optimized caching
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/job/', { params: apiParams });
      setJobs(res.data.data.jobs);
      setTotalPages(res.data.data.totalPages || 1);
    } catch (err) {
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  }, [apiParams]);

  // Fetch jobs when filters/search/page change
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Memoized user eligibility for applied jobs
  const canApplyForJobs = useMemo(() => {
    return user && (user.role === 'student' || user.role === 'alumni');
  }, [user]);

  // Fetch applied jobs for logged-in user with optimized caching
  const fetchAppliedJobs = useCallback(async () => {
    if (!canApplyForJobs) {
      setAppliedJobIds(new Set());
      return;
    }

    try {
      const res = await axios.get('/api/job/applied');
      setAppliedJobIds(new Set((res.data.data || []).map(job => job.id)));
    } catch (err) {
      setAppliedJobIds(new Set());
    }
  }, [canApplyForJobs]);

  // Fetch applied jobs when user changes
  useEffect(() => {
    fetchAppliedJobs();
  }, [fetchAppliedJobs]);

  // Optimized handlers with useCallback
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((type) => {
    setSelectedType(type);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((sortByValue, sortOrderValue) => {
    setSortBy(sortByValue);
    setSortOrder(sortOrderValue);
    setCurrentPage(1);
  }, []);

  const handleClearType = useCallback(() => {
    setSelectedType('');
    setCurrentPage(1);
  }, []);

  const handleClearSort = useCallback(() => {
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleJobClick = useCallback((job) => {
    setSelectedJob(job);
    setShowModal(true);
  }, []);

  const handleApply = useCallback((job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  }, []);

  // Optimized refresh function
  const refreshJobsAndApplied = useCallback(async () => {
    await fetchJobs();
    await fetchAppliedJobs();
  }, [fetchJobs, fetchAppliedJobs]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white relative pt-16">
        {/* Enhanced Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-primary-100/40 to-secondary-100/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-secondary-100/40 to-primary-100/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-50/30 to-secondary-50/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-secondary-400/40 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-primary-300/40 rounded-full animate-bounce" style={{ animationDelay: '2.5s' }}></div>
        </div>

        {/* Hero Section */}
        <section className="relative py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white border border-slate-200 mb-6 shadow-sm text-slate-700 font-sans">
                  <span className="flex h-2 w-2 relative mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                  </span>
                  <span>💼 Career Opportunities</span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight font-sans tracking-tight">
                  Discover Your{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 animate-pulse">
                    Dream Career
                  </span>
                </h1>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-sans">
                  Connect with amazing job opportunities and internships shared by our alumni network. Your next career move starts here.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-3 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xl rounded-full px-4 py-2 border border-slate-200/50 hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-sm font-sans">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                  </span>
                  <span className="text-slate-700 font-medium">Verified Opportunities</span>
                </div>
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xl rounded-full px-4 py-2 border border-slate-200/50 hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-sm font-sans">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-500"></span>
                  </span>
                  <span className="text-slate-700 font-medium">Alumni Network</span>
                </div>
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xl rounded-full px-4 py-2 border border-slate-200/50 hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-sm font-sans">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-slate-700 font-medium">Direct Applications</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Search and Filters Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 p-5 mb-6 relative z-40"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            }}
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-50/30 to-secondary-50/30 rounded-2xl"></div>

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-semibold text-slate-700 mb-2 font-sans">
                    Search Jobs
                  </label>
                  <JobSearch onSearch={handleSearch} isLoading={loading} />
                </div>
                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-semibold text-slate-700 mb-2 font-sans">
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
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-3"></div>
                <p className="text-slate-600 text-sm font-medium font-sans">Loading opportunities...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">Oops! Something went wrong</h3>
                <p className="text-slate-600 mb-4 text-center max-w-md text-sm font-sans">
                  We couldn't load the job opportunities. Please try again.
                </p>
                <button
                  onClick={fetchJobs}
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold shadow-lg hover:from-primary-700 hover:to-secondary-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm font-sans"
                >
                  Try Again
                </button>
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex flex-col items-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">No opportunities found</h3>
                <p className="text-slate-600 mb-4 text-center max-w-md text-sm font-sans">
                  Try adjusting your search terms or filters to find more opportunities.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('');
                    setCurrentPage(1);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold shadow-lg hover:from-primary-700 hover:to-secondary-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm font-sans"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {/* Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 font-sans">
                        {jobs.length > 0 ? `${jobs.length} Opportunities Found` : 'Opportunities'}
                      </h3>
                      <p className="text-slate-600 mt-2 text-sm font-sans">
                        {jobs.length > 0
                          ? 'Discover and apply to amazing career opportunities'
                          : 'No opportunities available at the moment'
                        }
                      </p>
                    </div>
                    {jobs.length > 0 && (
                      <div className="flex items-center gap-3 text-sm text-slate-600 bg-white/90 backdrop-blur-xl rounded-full px-3 py-1.5 border border-slate-200/50 shadow-md font-sans">
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                        <span className="font-sans">Page {currentPage} of {totalPages}</span>
                      </div>
                    )}
                  </div>

                  {/* Jobs Grid */}
                  <JobGrid
                    jobs={jobs}
                    user={user}
                    appliedJobIds={appliedJobIds}
                    onJobClick={handleJobClick}
                    onApply={handleApply}
                    isLoading={loading}
                  />
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
});

export default JobsPage; 