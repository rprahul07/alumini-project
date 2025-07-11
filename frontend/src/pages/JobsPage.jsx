import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import JobGrid from '../components/opportunities/JobGrid';
import JobSearch from '../components/opportunities/JobSearch';
import JobFilters from '../components/opportunities/JobFilters';
import JobPagination from '../components/opportunities/JobPagination';
import JobDetailsModal from '../components/opportunities/JobDetailsModal';
import axios from '../config/axios';

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
  const [showModal, setShowModal] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Fetch jobs from API
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        search: searchTerm,
        type: selectedType,
        company: selectedCompany,
        sortBy,
        sortOrder
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

  // Handlers
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };
  const handleFilterChange = (type, company) => {
    setSelectedType(type);
    setSelectedCompany(company);
    setCurrentPage(1);
  };
  const handleSortChange = (sortByValue, sortOrderValue) => {
    setSortBy(sortByValue);
    setSortOrder(sortOrderValue);
    setCurrentPage(1);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleJobClick = (job) => {
    setSelectedJobId(job.id);
    setShowModal(true);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col gap-3">
            <div className="flex flex-row gap-2 items-center">
              <div className="flex-1">
                <JobSearch onSearch={handleSearch} />
              </div>
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="rounded-full px-4 py-1.5 font-semibold flex items-center justify-center border-2 border-indigo-400 bg-white/60 backdrop-blur text-sm text-indigo-700 hover:bg-white/80 shadow-lg transition-all"
                aria-label="Show Filters"
              >
                <span className="material-icons mr-1">tune</span>
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Filter Drawer/Modal */}
          {isFilterDrawerOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setIsFilterDrawerOpen(false)}
                >
                  &times;
                </button>
                <JobFilters
                  selectedType={selectedType}
                  selectedCompany={selectedCompany}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onFilterChange={handleFilterChange}
                  onSortChange={handleSortChange}
                  isMobile={true}
                />
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition"
                    onClick={() => setIsFilterDrawerOpen(false)}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Jobs Grid */}
          <div className="mt-8">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-20">
                <div className="text-red-600 text-lg font-semibold mb-4">{error}</div>
                <button
                  onClick={fetchJobs}
                  className="rounded-full px-4 py-1.5 font-semibold bg-indigo-600 text-white shadow hover:bg-indigo-700 transition"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <JobGrid jobs={jobs} onJobClick={handleJobClick} />
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
        jobId={selectedJobId}
        open={showModal}
        onClose={() => setShowModal(false)}
        onApply={() => alert('Apply logic/modal goes here')}
      />
    </>
  );
};

export default JobsPage; 