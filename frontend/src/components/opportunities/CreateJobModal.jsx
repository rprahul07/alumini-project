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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Opportunity</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input type="text" className="mt-1 block w-full border rounded px-3 py-2" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input type="text" className="mt-1 block w-full border rounded px-3 py-2" value={jobTitle} onChange={e => setJobTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea className="mt-1 block w-full border rounded px-3 py-2" value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Deadline</label>
            <input type="date" className="mt-1 block w-full border rounded px-3 py-2" value={deadline} onChange={e => setDeadline(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Registration Type</label>
            <select className="mt-1 block w-full border rounded px-3 py-2" value={registrationType} onChange={e => setRegistrationType(e.target.value)}>
              <option value="internal">Internal (Apply on site)</option>
              <option value="external">External (Redirect to company site)</option>
            </select>
          </div>
          {registrationType === 'external' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Registration Link</label>
              <input type="url" className="mt-1 block w-full border rounded px-3 py-2" value={registrationLink} onChange={e => setRegistrationLink(e.target.value)} required />
            </div>
          )}
          {registrationType === 'internal' && (
            <div className="flex items-center gap-2">
              <input type="checkbox" id="emailNotification" checked={getEmailNotification} onChange={e => setGetEmailNotification(e.target.checked)} />
              <label htmlFor="emailNotification" className="text-sm text-gray-700">Enable email notification for each applicant</label>
            </div>
          )}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobModal; 