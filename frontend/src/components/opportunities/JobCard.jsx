import React from 'react';

const JobCard = ({ job, onClick, onApply }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md p-4 border hover:shadow-lg transition cursor-pointer flex flex-col justify-between h-full"
      onClick={onClick}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{job.jobTitle}</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 ml-2">{job.registrationType === 'external' ? 'External' : 'Internal'}</span>
        </div>
        <div className="text-sm text-gray-600 mb-1 truncate">{job.companyName}</div>
        {job.deadline && (
          <div className="text-xs text-gray-400 mb-2">Deadline: {new Date(job.deadline).toLocaleDateString()}</div>
        )}
        <div className="text-xs text-gray-500 mb-2 capitalize">Status: {job.status}</div>
      </div>
      <button
        className="mt-2 px-4 py-1.5 bg-green-600 text-white rounded-full font-semibold shadow hover:bg-green-700 transition"
        onClick={e => { e.stopPropagation(); onApply && onApply(job); }}
      >
        Apply
      </button>
    </div>
  );
};

export default JobCard; 