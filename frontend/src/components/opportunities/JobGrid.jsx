import React from 'react';
import JobCard from './JobCard';

const JobGrid = ({ jobs, user, appliedJobIds, onJobClick, onApply }) => {
  if (!jobs || jobs.length === 0) {
    return <div className="text-center text-gray-400 py-20 text-lg font-medium">No jobs found. Try adjusting your filters or search.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {jobs.map(job => (
        <JobCard
          key={job.id}
          job={job}
          user={user}
          isApplied={appliedJobIds && appliedJobIds.has(job.id)}
          onClick={() => onJobClick(job)}
          onApply={() => onApply(job)}
        />
      ))}
    </div>
  );
};

export default JobGrid; 