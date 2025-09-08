import React from 'react';
import { motion } from 'framer-motion';
import JobCard from './JobCard';

const JobGrid = ({ jobs, user, appliedJobIds, onJobClick, onApply }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No opportunities found</h3>
        <p className="text-gray-300 text-lg font-medium">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job, index) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <JobCard
            job={job}
            user={user}
            isApplied={appliedJobIds && appliedJobIds.has(job.id)}
            onClick={() => onJobClick(job)}
            onApply={() => onApply(job)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default JobGrid; 