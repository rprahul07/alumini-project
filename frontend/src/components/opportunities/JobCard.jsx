import React from 'react';
import { CalendarIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';

const JobCard = ({ job, user, onClick, onApply }) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-[1.02] flex flex-col h-full w-full max-w-sm sm:max-w-md md:max-w-lg p-3"
      onClick={onClick}
    >
      {/* Job Content */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Job Title */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-xl sm:text-lg md:text-xl leading-tight">
          {job.jobTitle}
        </h3>
        {/* Job Details */}
        <div className="space-y-1 mb-2">
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
            {formatDate(job.deadline)}
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <BuildingOffice2Icon className="h-4 w-4 mr-2 text-gray-400" />
            {job.companyName}
          </div>
        </div>
        {/* Spacer to push button to bottom */}
        <div className="flex-grow"></div>
        {/* Apply Button */}
        <button
          className="mt-2 px-4 py-1.5 bg-indigo-600 text-white rounded-full font-semibold shadow hover:bg-indigo-700 transition"
          onClick={e => { e.stopPropagation(); onApply && onApply(job); }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default JobCard; 