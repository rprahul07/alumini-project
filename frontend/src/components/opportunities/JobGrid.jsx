import React from 'react';
import { motion } from 'framer-motion';
import JobCard from './JobCard';

const JobGrid = ({ jobs, user, appliedJobIds, onJobClick, onApply }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-r from-slate-100/40 to-slate-200/40 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-2 font-sans">No opportunities found</h3>
        <p className="text-slate-600 text-xs font-medium font-sans">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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