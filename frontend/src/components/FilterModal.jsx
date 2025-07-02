import React, { useState, useEffect } from 'react';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const departments = [
  { value: '', label: 'All Departments' },
  { value: 'CSE', label: 'Computer Science Engineering' },
  { value: 'MECH', label: 'Mechanical Engineering' },
  { value: 'Civil', label: 'Civil Engineering' },
  { value: 'EEE', label: 'Electrical & Electronics Engineering' },
  { value: 'IT', label: 'Information Technology' },
  { value: 'EC', label: 'Electronics & Communication' },
  { value: 'MCA', label: 'Master of Computer Applications' }
];

const eventTypes = [
  { value: '', label: 'All Types' },
  { value: 'Academic Workshop', label: 'Academic Workshop' },
  { value: 'Workshop', label: 'Workshop' },
  { value: 'Technical Seminar', label: 'Technical Seminar' },
  { value: 'Industry Conference', label: 'Industry Conference' },
  { value: 'Online Webinar', label: 'Online Webinar' },
  { value: 'Coding Hackathon', label: 'Coding Hackathon' },
  { value: 'Networking Meetup', label: 'Networking Meetup' },
  { value: 'Skill Training', label: 'Skill Training' },
  { value: 'Academic Competition', label: 'Academic Competition' },
  { value: 'Cultural Festival', label: 'Cultural Festival' },
  { value: 'Sports Tournament', label: 'Sports Tournament' },
  { value: 'Career Fair', label: 'Career Fair' },
  { value: 'Research Symposium', label: 'Research Symposium' },
  { value: 'Student Club Event', label: 'Student Club Event' },
  { value: 'Alumni Reunion', label: 'Alumni Reunion' },
  { value: 'Faculty Development', label: 'Faculty Development' },
  { value: 'Other', label: 'Other' }
];

const sortOptions = [
  { value: 'date', label: 'Date' },
  { value: 'name', label: 'Name' },
  { value: 'type', label: 'Type' },
  { value: 'createdAt', label: 'Created Date' }
];

const FilterModal = ({ open, onClose, selectedDepartment, selectedType, sortBy, sortOrder, onApply, onReset }) => {
  const [dep, setDep] = useState(selectedDepartment || '');
  const [type, setType] = useState(selectedType || '');
  const [sort, setSort] = useState(sortBy || 'createdAt');
  const [order, setOrder] = useState(sortOrder || 'desc');

  useEffect(() => {
    setDep(selectedDepartment || '');
    setType(selectedType || '');
    setSort(sortBy || 'createdAt');
    setOrder(sortOrder || 'desc');
  }, [selectedDepartment, selectedType, sortBy, sortOrder, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
      <div className="bg-white/80 border border-indigo-100 rounded-2xl shadow-lg backdrop-blur w-full max-w-xs sm:max-w-md p-4 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black mb-4 text-center">Filter & Sort Events</h2>
          <button onClick={onClose} className="rounded-full p-2 bg-white/70 border border-indigo-100 shadow hover:bg-white/90 transition-all">
            <XMarkIcon className="h-6 w-6 text-indigo-500" />
          </button>
        </div>
        {/* Dropdowns */}
        <div className="flex flex-col gap-3 mb-4">
          {/* Department */}
          <div>
            <label htmlFor="modal-department" className="block text-sm font-bold text-black mb-1">Department</label>
            <div className="relative">
              <select
                id="modal-department"
                value={dep}
                onChange={e => setDep(e.target.value)}
                className="block w-full pl-3 pr-8 py-2 border-2 border-indigo-200 rounded-full bg-white/60 backdrop-blur shadow text-black focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all appearance-auto"
              >
                {departments.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Event Type */}
          <div>
            <label htmlFor="modal-type" className="block text-sm font-bold text-black mb-1">Event Type</label>
            <div className="relative">
              <select
                id="modal-type"
                value={type}
                onChange={e => setType(e.target.value)}
                className="block w-full pl-3 pr-8 py-2 border-2 border-indigo-200 rounded-full bg-white/60 backdrop-blur shadow text-black focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all appearance-auto"
              >
                {eventTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Sort By */}
          <div>
            <label htmlFor="modal-sort" className="block text-sm font-bold text-black mb-1">Sort By</label>
            <div className="relative">
              <select
                id="modal-sort"
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="block w-full pl-3 pr-8 py-2 border-2 border-indigo-200 rounded-full bg-white/60 backdrop-blur shadow text-black focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all appearance-auto"
              >
                {sortOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Order */}
          <div>
            <label htmlFor="modal-order" className="block text-sm font-bold text-black mb-1">Order</label>
            <div className="relative">
              <select
                id="modal-order"
                value={order}
                onChange={e => setOrder(e.target.value)}
                className="block w-full pl-3 pr-8 py-2 border-2 border-indigo-200 rounded-full bg-white/60 backdrop-blur shadow text-black focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all appearance-auto"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onReset()}
            className="flex-1 rounded-full px-4 py-1.5 font-semibold bg-gray-100 text-black hover:bg-gray-200 transition"
          >
            Reset
          </button>
          <button
            onClick={() => onApply(dep, type, sort, order)}
            className="flex-1 rounded-full px-4 py-1.5 font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal; 