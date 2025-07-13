import React, { useState, useRef, useEffect } from 'react';
import { FunnelIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 font-semibold border-2 border-indigo-400 bg-white/60 backdrop-blur text-sm text-indigo-700 hover:bg-white/80 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 rounded-full whitespace-nowrap"
      >
        <FunnelIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Filters</span>
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-[80vh] overflow-y-auto scrollbar-hide">
          <div className="p-4 space-y-4">
            {/* Department Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-sm"
              >
                {departmentOptions.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Semester
              </label>
              <select
                value={selectedSemester}
                onChange={handleSemesterChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-sm"
              >
                {semesterOptions.map((sem) => (
                  <option key={sem.value} value={sem.value}>
                    {sem.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Selection Display */}
            <div className="pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <div>Dept: <span className="font-medium text-gray-700">{getDepartmentLabel()}</span></div>
                <div>Semester: <span className="font-medium text-gray-700">{getSemesterLabel()}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFilterButton; 