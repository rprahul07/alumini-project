import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import JobCard from '../components/opportunities/JobCard';
import JobDetailsModal from '../components/opportunities/JobDetailsModal';
import axios from '../config/axios';

const JobsPage = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { page, limit: 6 };
        if (search) params.search = search;
        if (filter !== 'all') params.registrationType = filter;
        const res = await axios.get('/api/job/', { params });
        setJobs(res.data.data.jobs);
        setTotalPages(res.data.data.totalPages);
      } catch (err) {
        setError('Failed to load jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [search, filter, page]);

  const handleCardClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-4">Jobs</h1>
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center">
          <input
            type="text"
            placeholder="Search jobs or companies..."
            className="w-full sm:w-1/3 border rounded px-3 py-2"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <select
            className="w-full sm:w-48 border rounded px-3 py-2"
            value={filter}
            onChange={e => { setFilter(e.target.value); setPage(1); }}
          >
            <option value="all">All Types</option>
            <option value="internal">Internal</option>
            <option value="external">External</option>
          </select>
        </div>
        {/* Jobs Grid */}
        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading jobs...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {jobs.length === 0 ? (
              <div className="col-span-full text-center text-gray-400">No jobs found.</div>
            ) : (
              jobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onClick={() => handleCardClick(job)}
                  onApply={() => handleCardClick(job)}
                />
              ))
            )}
          </div>
        )}
        {/* Pagination */}
        <div className="flex justify-center mt-8 gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="px-3 py-1 text-gray-600">Page {page} of {totalPages}</span>
          <button
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <JobDetailsModal
        job={selectedJob}
        open={showModal}
        onClose={() => setShowModal(false)}
        onApply={() => alert('Apply logic/modal goes here')}
      />
    </>
  );
};

export default JobsPage; 