import React, { useState } from 'react';
import axios from '../../config/axios';

const CreateJobModal = ({ onClose, onSuccess }) => {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [registrationType, setRegistrationType] = useState('internal');
  const [registrationLink, setRegistrationLink] = useState('');
  const [getEmailNotification, setGetEmailNotification] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  // Add jobType state
  const [jobType, setJobType] = useState('job');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        companyName,
        jobTitle,
        description,
        deadline: deadline || undefined,
        registrationType,
        registrationLink: registrationType === 'external' ? registrationLink : undefined,
        getEmailNotification: registrationType === 'internal' ? getEmailNotification : undefined,
        jobType,
      };
      await axios.post('/api/job/', payload);
      setSuccess('Job created successfully! Pending admin approval.');
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1200);
    } catch (err) {
      setError('Failed to create job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[80vh] overflow-y-auto scrollbar-hide p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Create New Opportunity</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-1 sm:p-2 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Company Name</label>
            <input type="text" className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-200 focus:outline-none" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Job Title</label>
            <input type="text" className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-200 focus:outline-none" value={jobTitle} onChange={e => setJobTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
            <textarea className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-200 focus:outline-none resize-none min-h-[80px]" value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          {/* Opportunity Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Opportunity Type</label>
            <div className="flex gap-4">
              <label className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all duration-150 font-medium text-sm shadow-sm
                ${jobType === 'job' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-2 ring-indigo-200' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                <input
                  type="radio"
                  name="jobType"
                  value="job"
                  checked={jobType === 'job'}
                  onChange={() => setJobType('job')}
                  className="form-radio text-indigo-600 focus:ring-indigo-500"
                />
                <span>Job</span>
              </label>
              <label className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all duration-150 font-medium text-sm shadow-sm
                ${jobType === 'internship' ? 'bg-green-50 border-green-500 text-green-700 ring-2 ring-green-200' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                <input
                  type="radio"
                  name="jobType"
                  value="internship"
                  checked={jobType === 'internship'}
                  onChange={() => setJobType('internship')}
                  className="form-radio text-green-600 focus:ring-green-500"
                />
                <span>Internship</span>
              </label>
            </div>
          </div>
          {/* Deadline and Registration Type */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Deadline</label>
              <div className="relative">
                <input
                  type="date"
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-200 focus:outline-none pr-10"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </span>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Registration Type</label>
              <div className="relative">
                <select
                  className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-200 focus:outline-none appearance-none pr-8"
                  value={registrationType}
                  onChange={e => setRegistrationType(e.target.value)}
                >
                  <option value="internal">Internal (Apply on site)</option>
                  <option value="external">External (Redirect to company site)</option>
                </select>
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </div>
            </div>
          </div>
          {/* Registration Link (if external) */}
          {registrationType === 'external' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Registration Link</label>
              <input type="url" className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-200 focus:outline-none" value={registrationLink} onChange={e => setRegistrationLink(e.target.value)} required />
            </div>
          )}
          {/* Notify by Email Switch */}
          <div className="flex items-center gap-3 mt-2">
            <label htmlFor="emailNotification" className="text-sm text-gray-700 cursor-pointer select-none font-medium">Notify me by email when someone applies</label>
            <button
              type="button"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${getEmailNotification ? 'bg-green-500' : 'bg-gray-300'}`}
              onClick={() => setGetEmailNotification(v => !v)}
              id="emailNotification"
              aria-pressed={getEmailNotification}
            >
              <span className="sr-only">Toggle email notification</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${getEmailNotification ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
          {error && <div className="text-red-500 text-xs font-medium mt-1">{error}</div>}
          {success && <div className="text-green-600 text-xs font-medium mt-1">{success}</div>}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
            <button type="button" className="w-full sm:w-auto rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="w-full sm:w-auto rounded-full px-4 py-1.5 font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobModal; 