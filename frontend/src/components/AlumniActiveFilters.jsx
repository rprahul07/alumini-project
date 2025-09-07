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
    <div className="flex flex-wrap gap-3 mb-6">
      {selectedGraduationYear && (
        <div className="flex items-center gap-3 px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold shadow-lg animate-fade-in">
          <span>Year: {getGraduationYearLabel()}</span>
          <button
            onClick={onClearGraduationYear}
            className="text-accent-600 hover:text-accent-800 transition-colors p-1 rounded-full hover:bg-accent-200"
            aria-label="Clear graduation year filter"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {selectedCompany && (
        <div className="flex items-center gap-3 px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold shadow-lg animate-fade-in">
          <span>Company: {selectedCompany}</span>
          <button
            onClick={onClearCompany}
            className="text-accent-600 hover:text-accent-800 transition-colors p-1 rounded-full hover:bg-accent-200"
            aria-label="Clear company filter"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {selectedRole && (
        <div className="flex items-center gap-3 px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold shadow-lg animate-fade-in">
          <span>Role: {selectedRole}</span>
          <button
            onClick={onClearRole}
            className="text-accent-600 hover:text-accent-800 transition-colors p-1 rounded-full hover:bg-accent-200"
            aria-label="Clear role filter"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {(sortBy !== 'createdAt' || sortOrder !== 'desc') && (
        <div className="flex items-center gap-3 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold shadow-lg animate-fade-in">
          <span>Sort: {getSortLabel()}</span>
          <button
            onClick={onClearSort}
            className="text-secondary-600 hover:text-secondary-800 transition-colors p-1 rounded-full hover:bg-secondary-200"
            aria-label="Clear sort filter"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AlumniActiveFilters; 