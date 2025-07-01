import React from 'react';

const RoleSpecificProfileForm = ({ role, formData, handleChange, setFormData }) => {
  return (
    <>
      {role === 'student' && (
        <>
          <div className="mb-4">
            <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Roll Number
            </label>
            <input
              type="text"
              id="rollNumber"
              name="rollNumber"
              value={formData.rollNumber || ''}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department || ''}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="currentSemester" className="block text-sm font-medium text-gray-700 mb-1">
              Current Semester
            </label>
            <input
              type="number"
              id="currentSemester"
              name="currentSemester"
              min="1"
              max="8"
              value={formData.currentSemester || ''}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </>
      )}

      {role === 'alumni' && (
        <>
          <div className="mb-4">
            <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
              Graduation Year
            </label>
            <input
              type="number"
              id="graduationYear"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="currentJobTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Current Job Title
            </label>
            <input
              type="text"
              id="currentJobTitle"
              name="currentJobTitle"
              value={formData.currentJobTitle}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Current Company
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </>
      )}

      {role === 'faculty' && (
        <>
          <div className="mb-4">
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
              Designation
            </label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </>
      )}
    </>
  );
};

export default RoleSpecificProfileForm; 