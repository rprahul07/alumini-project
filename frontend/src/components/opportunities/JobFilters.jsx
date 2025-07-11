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
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Internship', label: 'Internship' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Remote', label: 'Remote' },
    { value: 'Other', label: 'Other' }
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
    <div className={`flex gap-4 ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'}`}>
      {/* Job Type Filter */}
      <div className="flex-1">
        <label htmlFor="type" className="block text-sm font-bold text-indigo-700 mb-1">
          Job Type
        </label>
        <div className="relative">
          <select
            id="type"
            value={selectedType}
            onChange={handleTypeChange}
            className="block w-full pl-3 pr-10 py-2 border-2 border-indigo-200 rounded-full bg-white/60 backdrop-blur shadow focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
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

      {/* Company Filter */}
      <div className="flex-1">
        <label htmlFor="company" className="block text-sm font-bold text-indigo-700 mb-1">
          Company
        </label>
        <div className="relative">
          <select
            id="company"
            value={selectedCompany}
            onChange={handleCompanyChange}
            className="block w-full pl-3 pr-10 py-2 border-2 border-indigo-200 rounded-full bg-white/60 backdrop-blur shadow focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
          >
            {companies.map((company) => (
              <option key={company.value} value={company.value}>
                {company.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDownIcon className="h-4 w-4 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div className="flex-1">
        <label htmlFor="sortBy" className="block text-sm font-bold text-indigo-700 mb-1">
          Sort By
        </label>
        <div className="relative">
          <select
            id="sortBy"
            value={sortBy}
            onChange={handleSortChange}
            className="block w-full pl-3 pr-10 py-2 border-2 border-indigo-200 rounded-full bg-white/60 backdrop-blur shadow focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDownIcon className="h-4 w-4 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Sort Order */}
      <div className="flex-1">
        <label htmlFor="sortOrder" className="block text-sm font-bold text-indigo-700 mb-1">
          Order
        </label>
        <div className="relative">
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={handleSortOrderChange}
            className="block w-full pl-3 pr-10 py-2 border-2 border-indigo-200 rounded-full bg-white/60 backdrop-blur shadow focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
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