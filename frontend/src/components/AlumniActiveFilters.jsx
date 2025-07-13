import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const AlumniActiveFilters = ({ 
  selectedGraduationYear, 
  selectedCompany,
  selectedRole,
  sortBy, 
  sortOrder, 
  onClearGraduationYear, 
  onClearCompany,
  onClearRole,
  onClearSort 
}) => {
  const hasActiveFilters = selectedGraduationYear || selectedCompany || selectedRole || (sortBy !== 'createdAt' || sortOrder !== 'desc');

  if (!hasActiveFilters) return null;

  const getGraduationYearLabel = () => {
    return selectedGraduationYear || 'All Years';
  };

  const getSortLabel = () => {
    if (sortBy === 'createdAt' && sortOrder === 'desc') return 'Latest First';
    if (sortBy === 'createdAt' && sortOrder === 'asc') return 'Oldest First';
    if (sortBy === 'fullName' && sortOrder === 'asc') return 'Name A-Z';
    if (sortBy === 'fullName' && sortOrder === 'desc') return 'Name Z-A';
    if (sortBy === 'companyName' && sortOrder === 'asc') return 'Company A-Z';
    if (sortBy === 'companyName' && sortOrder === 'desc') return 'Company Z-A';
    if (sortBy === 'graduationYear' && sortOrder === 'desc') return 'Graduation Year (Newest)';
    if (sortBy === 'graduationYear' && sortOrder === 'asc') return 'Graduation Year (Oldest)';
    return 'Latest First';
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {selectedGraduationYear && (
        <div className="flex items-center gap-1 px-3 py-2 sm:py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
          <span className="text-xs sm:text-sm">Year: {getGraduationYearLabel()}</span>
          <button
            onClick={onClearGraduationYear}
            className="ml-1 hover:text-indigo-900 transition-colors p-1"
            aria-label="Clear graduation year filter"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {selectedCompany && (
        <div className="flex items-center gap-1 px-3 py-2 sm:py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          <span className="text-xs sm:text-sm">Company: {selectedCompany}</span>
          <button
            onClick={onClearCompany}
            className="ml-1 hover:text-blue-900 transition-colors p-1"
            aria-label="Clear company filter"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {selectedRole && (
        <div className="flex items-center gap-1 px-3 py-2 sm:py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
          <span className="text-xs sm:text-sm">Role: {selectedRole}</span>
          <button
            onClick={onClearRole}
            className="ml-1 hover:text-purple-900 transition-colors p-1"
            aria-label="Clear role filter"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {(sortBy !== 'createdAt' || sortOrder !== 'desc') && (
        <div className="flex items-center gap-1 px-3 py-2 sm:py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          <span className="text-xs sm:text-sm">Sort: {getSortLabel()}</span>
          <button
            onClick={onClearSort}
            className="ml-1 hover:text-green-900 transition-colors p-1"
            aria-label="Clear sort filter"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AlumniActiveFilters; 