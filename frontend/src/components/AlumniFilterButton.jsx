import React, { useState, useRef, useEffect } from 'react';
import { FunnelIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const AlumniFilterButton = ({ 
  selectedGraduationYear, 
  selectedCompany,
  selectedRole,
  sortBy, 
  sortOrder, 
  onFilterChange, 
  onSortChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate batch years (last 30 years)
  const currentYear = new Date().getFullYear();
  const batchYears = [
    { value: '', label: 'All Batches' },
    ...Array.from({ length: 30 }, (_, i) => ({
      value: (currentYear - i).toString(),
      label: (currentYear - i).toString()
    }))
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Latest First' },
    { value: 'createdAt_asc', label: 'Oldest First' },
    { value: 'graduationYear', label: 'Batch (Newest)' },
    { value: 'graduationYear_asc', label: 'Batch (Oldest)' },
  ];

  const handleBatchChange = (e) => {
    onFilterChange('graduationYear', e.target.value);
    setIsOpen(false);
  };

  const handleCompanyChange = (e) => {
    onFilterChange('company', e.target.value);
    setIsOpen(false);
  };

  const handleRoleChange = (e) => {
    onFilterChange('role', e.target.value);
    setIsOpen(false);
  };

  const handleSortChange = (value) => {
    if (value.includes('_')) {
      const [field, order] = value.split('_');
      onSortChange(field, order);
    } else {
      onSortChange(value, 'desc');
    }
    setIsOpen(false);
  };

  const getSortLabel = () => {
    const option = sortOptions.find(opt => {
      if (sortBy === 'createdAt' && sortOrder === 'desc') return opt.value === 'createdAt';
      if (sortBy === 'createdAt' && sortOrder === 'asc') return opt.value === 'createdAt_asc';
      if (sortBy === 'fullName' && sortOrder === 'asc') return opt.value === 'fullName';
      if (sortBy === 'fullName' && sortOrder === 'desc') return opt.value === 'fullName_desc';
      if (sortBy === 'companyName' && sortOrder === 'asc') return opt.value === 'companyName';
      if (sortBy === 'companyName' && sortOrder === 'desc') return opt.value === 'companyName_desc';
      if (sortBy === 'graduationYear' && sortOrder === 'desc') return opt.value === 'graduationYear';
      if (sortBy === 'graduationYear' && sortOrder === 'asc') return opt.value === 'graduationYear_asc';
      return false;
    });
    return option ? option.label : 'Latest First';
  };

  const getBatchLabel = () => {
    const year = batchYears.find(y => y.value === selectedGraduationYear);
    return year ? year.label : 'All Batches';
  };

  return (
    <div className="relative z-[9999]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-4 font-semibold bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20 hover:border-primary-400/50 shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 rounded-2xl whitespace-nowrap group w-full xl:w-auto font-body text-base"
      >
        <FunnelIcon className="h-5 w-5" />
        <span className="hidden sm:inline">Filters</span>
        <ChevronDownIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:right-0 left-0 sm:left-auto mt-3 w-80 sm:w-72 bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 z-[99999] max-h-[80vh] overflow-y-auto scrollbar-hide" style={{ zIndex: 99999 }}>
          {/* Dark gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60 rounded-3xl"></div>
          <div className="relative z-10 p-6 space-y-6">
            {/* Batch Filter */}
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-4 font-body">
                Batch
              </label>
              <select
                value={selectedGraduationYear}
                onChange={handleBatchChange}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 text-white text-sm font-body"
              >
                {batchYears.map((year) => (
                  <option key={year.value} value={year.value} className="bg-gray-800 text-white">
                    {year.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-4 font-body">
                Sort By
              </label>
              <div className="space-y-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 font-body ${
                      getSortLabel() === option.label
                        ? 'bg-primary-500/20 text-primary-300 font-semibold border border-primary-400/50'
                        : 'text-white/80 hover:bg-white/10 border border-transparent hover:border-white/20'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Selection Display */}
            <div className="pt-4 border-t border-white/20">
              <div className="text-xs text-white/70 space-y-2 font-body">
                <div>Batch: <span className="font-semibold text-white/90">{getBatchLabel()}</span></div>
                <div>Sort: <span className="font-semibold text-white/90">{getSortLabel()}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniFilterButton; 