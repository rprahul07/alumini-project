import React, { useState, useRef, useEffect } from 'react';
import { FunnelIcon, ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

// Custom Dropdown Component
const CustomDropdown = ({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = "Select an option",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label className="block text-xs font-semibold text-slate-700 mb-2 font-sans">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-lg text-slate-900 text-xs font-sans hover:bg-white hover:border-primary-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 flex items-center justify-between"
      >
        <span className="text-left">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDownIcon className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-lg shadow-2xl z-50 max-h-48 overflow-y-auto scrollbar-hide">
          {/* Light gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-slate-100/50 rounded-lg pointer-events-none"></div>
          <div className="relative z-10">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-sans transition-all duration-200 flex items-center justify-between hover:bg-slate-100 ${
                  value === option.value
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <CheckIcon className="h-3 w-3 text-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StudentFilterButton = ({ 
  selectedDepartment, 
  selectedSemester,
  onFilterChange
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

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    { value: 'CSE', label: 'Computer Science Engineering' },
    { value: 'MECH', label: 'Mechanical Engineering' },
    { value: 'Civil', label: 'Civil Engineering' },
    { value: 'EEE', label: 'Electrical & Electronics Engineering' },
    { value: 'IT', label: 'Information Technology' },
    { value: 'EC', label: 'Electronics & Communication' },
    { value: 'MCA', label: 'Master of Computer Applications' }
  ];

  const semesterOptions = [
    { value: '', label: 'All Semesters' },
    ...Array.from({ length: 8 }, (_, i) => ({ 
      value: (i + 1).toString(), 
      label: `Semester ${i + 1}` 
    }))
  ];

  const handleDepartmentChange = (e) => {
    onFilterChange('department', e.target.value);
    setIsOpen(false);
  };

  const handleSemesterChange = (e) => {
    onFilterChange('semester', e.target.value);
    setIsOpen(false);
  };

  const getDepartmentLabel = () => {
    const dept = departmentOptions.find(d => d.value === selectedDepartment);
    return dept ? dept.label : 'All Departments';
  };

  const getSemesterLabel = () => {
    const sem = semesterOptions.find(s => s.value === selectedSemester);
    return sem ? sem.label : 'All Semesters';
  };

  return (
    <div className="relative z-[9999]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 font-semibold bg-white/80 backdrop-blur-xl border border-slate-200 text-slate-700 hover:bg-white hover:border-primary-500/50 shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 rounded-xl whitespace-nowrap group w-full xl:w-auto font-sans text-sm"
      >
        <FunnelIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Filters</span>
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:right-0 left-0 sm:left-auto mt-2 w-72 sm:w-64 bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl border border-slate-200 z-[99999] max-h-[70vh] overflow-y-auto scrollbar-hide" style={{ zIndex: 99999 }}>
          {/* Light gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-slate-100/50 rounded-xl pointer-events-none"></div>
          <div className="relative z-10 p-4 space-y-4">
            {/* Department Filter */}
            <CustomDropdown
              label="Department"
              options={departmentOptions}
              value={selectedDepartment}
              onChange={(value) => onFilterChange('department', value)}
              placeholder="All Departments"
            />

            {/* Semester Filter */}
            <CustomDropdown
              label="Semester"
              options={semesterOptions}
              value={selectedSemester}
              onChange={(value) => onFilterChange('semester', value)}
              placeholder="All Semesters"
            />

            {/* Current Selection Display */}
            <div className="pt-3 border-t border-slate-200">
              <div className="text-xs text-slate-600 space-y-1 font-sans">
                <div>Dept: <span className="font-semibold text-slate-700">{getDepartmentLabel()}</span></div>
                <div>Semester: <span className="font-semibold text-slate-700">{getSemesterLabel()}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFilterButton; 