import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
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
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search and Filters */}
          <div className="mb-6 flex flex-row gap-2 items-center w-full">
            <JobSearch onSearch={handleSearch} isLoading={loading} />
            <FilterButton 
              selectedType={selectedType}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
            />
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
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-16">
                <div className="text-red-600 text-lg font-semibold mb-4">{error}</div>
                <button
                  onClick={fetchJobs}
                  className="rounded-full px-4 py-1.5 font-semibold bg-indigo-600 text-white shadow hover:bg-indigo-700 transition"
                >
                  Retry
                </button>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center text-gray-500 py-16 text-lg font-medium">
                No jobs found. Try adjusting your filters or search.
              </div>
            ) : (
              <>
                <JobGrid jobs={jobs} user={user} appliedJobIds={appliedJobIds} onJobClick={handleJobClick} onApply={handleApply} />
                <div className="mt-10">
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
      
      {/* Toast Container for Alerts */}
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