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

  const getBatchLabel = () => {
    return selectedGraduationYear || 'All Batches';
  };

  const getSortLabel = () => {
    if (sortBy === 'createdAt' && sortOrder === 'desc') return 'Latest First';
    if (sortBy === 'createdAt' && sortOrder === 'asc') return 'Oldest First';
    if (sortBy === 'fullName' && sortOrder === 'asc') return 'Name A-Z';
    if (sortBy === 'fullName' && sortOrder === 'desc') return 'Name Z-A';
    if (sortBy === 'companyName' && sortOrder === 'asc') return 'Company A-Z';
    if (sortBy === 'companyName' && sortOrder === 'desc') return 'Company Z-A';
    if (sortBy === 'graduationYear' && sortOrder === 'desc') return 'Batch (Newest)';
    if (sortBy === 'graduationYear' && sortOrder === 'asc') return 'Batch (Oldest)';
    return 'Latest First';
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {selectedGraduationYear && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold shadow-lg animate-fade-in font-sans">
          <span>Batch: {getBatchLabel()}</span>
          <button
            onClick={onClearGraduationYear}
            className="text-primary-600 hover:text-primary-800 transition-colors p-0.5 rounded-full hover:bg-primary-200"
            aria-label="Clear batch filter"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {selectedCompany && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary-100 text-secondary-700 rounded-full text-xs font-semibold shadow-lg animate-fade-in font-sans">
          <span>Company: {selectedCompany}</span>
          <button
            onClick={onClearCompany}
            className="text-secondary-600 hover:text-secondary-800 transition-colors p-0.5 rounded-full hover:bg-secondary-200"
            aria-label="Clear company filter"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {selectedRole && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold shadow-lg animate-fade-in font-sans">
          <span>Role: {selectedRole}</span>
          <button
            onClick={onClearRole}
            className="text-green-600 hover:text-green-800 transition-colors p-0.5 rounded-full hover:bg-green-200"
            aria-label="Clear role filter"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </div>
      )}
      
      {(sortBy !== 'createdAt' || sortOrder !== 'desc') && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold shadow-lg animate-fade-in font-sans">
          <span>Sort: {getSortLabel()}</span>
          <button
            onClick={onClearSort}
            className="text-blue-600 hover:text-blue-800 transition-colors p-0.5 rounded-full hover:bg-blue-200"
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