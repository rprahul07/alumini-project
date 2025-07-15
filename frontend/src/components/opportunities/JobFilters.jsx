import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const JobFilters = ({
  selectedType,
  selectedCompany,
  sortBy,
  sortOrder,
  onFilterChange,
  onSortChange,
  isMobile = false
}) => {
  // Example job types and companies (customize as needed)
  const jobTypes = [
    { value: '', label: 'All Types' },
    { value: 'job', label: 'Job' },
    { value: 'internship', label: 'Internship' },
  ];

  const companies = [
    { value: '', label: 'All Companies' },
    // You can populate this dynamically if you have a list of companies
    { value: 'Google', label: 'Google' },
    { value: 'Microsoft', label: 'Microsoft' },
    { value: 'Amazon', label: 'Amazon' },
    { value: 'Startup', label: 'Startup' },
    { value: 'Other', label: 'Other' }
  ];

  const sortOptions = [
    { value: 'deadline', label: 'Deadline' },
    { value: 'jobTitle', label: 'Title' },
    { value: 'companyName', label: 'Company' },
    { value: 'createdAt', label: 'Created Date' }
  ];

  const handleTypeChange = (e) => {
    onFilterChange(e.target.value, selectedCompany);
  };

  const handleCompanyChange = (e) => {
    onFilterChange(selectedType, e.target.value);
  };

  const handleSortChange = (e) => {
    onSortChange(e.target.value, sortOrder);
  };

  const handleSortOrderChange = (e) => {
    onSortChange(sortBy, e.target.value);
  };

  return (
    <div className={`flex gap-4 ${isMobile ? 'flex-col' : 'flex-row'}`}>
      {/* Job Type Filter */}
      <div className="flex-shrink-0">
        <div className="relative">
          <select
            id="type"
            value={selectedType}
            onChange={handleTypeChange}
            className="rounded-full px-4 py-2 font-semibold border-2 border-indigo-400 bg-white/60 backdrop-blur text-base sm:text-sm text-indigo-700 hover:bg-white/80 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 min-w-[120px]"
          >
            {jobTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDownIcon className="h-4 w-4 text-indigo-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFilters; 