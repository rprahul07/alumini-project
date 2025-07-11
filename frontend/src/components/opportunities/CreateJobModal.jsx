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
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl p-0 relative">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2 border-b">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Create New Opportunity</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-5 pt-4 pb-6 space-y-4">
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Deadline</label>
              <input type="date" className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-200 focus:outline-none" value={deadline} onChange={e => setDeadline(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Registration Type</label>
              <select className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-200 focus:outline-none" value={registrationType} onChange={e => setRegistrationType(e.target.value)}>
                <option value="internal">Internal (Apply on site)</option>
                <option value="external">External (Redirect to company site)</option>
              </select>
            </div>
          </div>
          {registrationType === 'external' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Registration Link</label>
              <input type="url" className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-200 focus:outline-none" value={registrationLink} onChange={e => setRegistrationLink(e.target.value)} required />
            </div>
          )}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="emailNotification"
              checked={getEmailNotification}
              onChange={e => setGetEmailNotification(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="emailNotification" className="text-sm text-gray-700 cursor-pointer select-none">
              Notify me by email when someone applies
            </label>
          </div>
          {error && <div className="text-red-500 text-xs font-medium mt-1">{error}</div>}
          {success && <div className="text-green-600 text-xs font-medium mt-1">{success}</div>}
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" className="rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="rounded-full px-4 py-1.5 font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobModal; 