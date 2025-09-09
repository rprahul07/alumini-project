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
            {/* Department Filter */}
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-4 font-body">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 text-white text-sm font-body"
              >
                {departmentOptions.map((dept) => (
                  <option key={dept.value} value={dept.value} className="bg-gray-800 text-white">
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester Filter */}
            <div>
              <label className="block text-sm font-semibold text-white/90 mb-4 font-body">
                Semester
              </label>
              <select
                value={selectedSemester}
                onChange={handleSemesterChange}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 text-white text-sm font-body"
              >
                {semesterOptions.map((sem) => (
                  <option key={sem.value} value={sem.value} className="bg-gray-800 text-white">
                    {sem.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Selection Display */}
            <div className="pt-4 border-t border-white/20">
              <div className="text-xs text-white/70 space-y-2 font-body">
                <div>Dept: <span className="font-semibold text-white/90">{getDepartmentLabel()}</span></div>
                <div>Semester: <span className="font-semibold text-white/90">{getSemesterLabel()}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFilterButton; 