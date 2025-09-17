import React from 'react';

const RoleSpecificProfileForm = ({ role, formData, handleChange, setFormData }) => {
  return (
    <>
      {role === 'student' && (
        <>
          <div className="mb-4">
            <label htmlFor="rollNumber" className="block text-xs font-sans font-medium text-slate-700 mb-2">
              Roll Number
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <input
                type="text"
                id="rollNumber"
                name="rollNumber"
                value={formData.rollNumber || ''}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 backdrop-blur-sm"
                placeholder="Enter your roll number"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="currentSemester" className="block text-xs font-sans font-medium text-slate-700 mb-2">
              Current Semester
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <input
                type="number"
                id="currentSemester"
                name="currentSemester"
                min="1"
                max="8"
                value={formData.currentSemester || ''}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 backdrop-blur-sm"
                placeholder="1-8"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="graduationYear" className="block text-xs font-sans font-medium text-slate-700 mb-2">
              Graduation Year
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="number"
                id="graduationYear"
                name="graduationYear"
                value={formData.graduationYear || ''}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 backdrop-blur-sm"
                placeholder="2024"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="batch_startYear" className="block text-xs font-sans font-medium text-slate-700 mb-2">
              Batch Start Year
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="number"
                id="batch_startYear"
                name="batch_startYear"
                value={formData.batch_startYear || ''}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 backdrop-blur-sm"
                placeholder="2020"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="batch_endYear" className="block text-xs font-sans font-medium text-slate-700 mb-2">
              Batch End Year
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="number"
                id="batch_endYear"
                name="batch_endYear"
                value={formData.batch_endYear || ''}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 backdrop-blur-sm"
                placeholder="2024"
              />
            </div>
          </div>
        </>
      )}

      {role === 'alumni' && (
        <>
          <div className="mb-4">
            <label htmlFor="graduationYear" className="block text-xs font-sans font-medium text-slate-700 mb-2">
              Graduation Year
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="number"
                id="graduationYear"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 backdrop-blur-sm"
                placeholder="2020"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="currentJobTitle" className="block text-xs font-sans font-medium text-slate-700 mb-2">
              Current Job Title
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <input
                type="text"
                id="currentJobTitle"
                name="currentJobTitle"
                value={formData.currentJobTitle}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 backdrop-blur-sm"
                placeholder="e.g., Software Engineer"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-xs font-sans font-medium text-slate-700 mb-2">
              Current Company
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 backdrop-blur-sm"
                placeholder="e.g., Google, Microsoft"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="company_role" className="block text-xs font-sans font-medium text-slate-700 mb-2">
              Company Role
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="company_role"
                name="company_role"
                value={formData.company_role}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 backdrop-blur-sm"
                placeholder="e.g., Senior Developer"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="course" className="block text-xs font-sans font-medium text-slate-700 mb-2">
              Course Studied
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <input
                type="text"
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 backdrop-blur-sm"
                placeholder="e.g., B.Tech Computer Science"
              />
            </div>
          </div>
        </>
      )}

      {role === 'faculty' && (
        <>
          <div className="mb-4">
            <label htmlFor="designation" className="block text-xs font-sans font-medium text-slate-700 mb-2">
              Designation
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 backdrop-blur-sm"
                placeholder="e.g., Professor, Assistant Professor"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RoleSpecificProfileForm; 