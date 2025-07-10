import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';

const ApplyJobModal = ({ open, onClose, job }) => {
  const [useExistingCV, setUseExistingCV] = useState(true);
  const [cvFile, setCvFile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      axios.get('/api/job/register/prefill')
        .then(res => setUserData(res.data.data))
        .catch(() => setError('Failed to load user info.'))
        .finally(() => setLoading(false));
    }
  }, [open]);

  if (!open || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // For now, just send userData; in real use, add CV upload logic
      const payload = {
        ...userData,
        // Add more fields as needed
      };
      await axios.post(`/api/job/${job.id}/register`, payload);
      setSuccess('Application submitted!');
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1200);
    } catch (err) {
      setError('Failed to submit application.');
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
        <h2 className="text-xl font-bold mb-4 text-gray-800">Apply for {job.jobTitle}</h2>
        {loading && <div className="text-center text-gray-400">Loading...</div>}
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
        {userData && !loading && !success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Prefilled user info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" className="mt-1 block w-full border rounded px-3 py-2" value={userData.name || ''} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" className="mt-1 block w-full border rounded px-3 py-2" value={userData.email || ''} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="text" className="mt-1 block w-full border rounded px-3 py-2" value={userData.phoneNumber || ''} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Highest Qualification</label>
                <input type="text" className="mt-1 block w-full border rounded px-3 py-2" value={userData.highestQualification || ''} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Passout Year</label>
                <input type="text" className="mt-1 block w-full border rounded px-3 py-2" value={userData.passoutYear || ''} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Job Title</label>
                <input type="text" className="mt-1 block w-full border rounded px-3 py-2" value={userData.currentJobTitle || ''} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Experience (years)</label>
                <input type="text" className="mt-1 block w-full border rounded px-3 py-2" value={userData.totalExperience || ''} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
                <input type="text" className="mt-1 block w-full border rounded px-3 py-2" value={userData.linkedInProfile || ''} disabled />
              </div>
            </div>
            {/* CV upload/use */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="cvOption"
                    checked={useExistingCV}
                    onChange={() => setUseExistingCV(true)}
                  />
                  Use existing CV
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="cvOption"
                    checked={!useExistingCV}
                    onChange={() => setUseExistingCV(false)}
                  />
                  Upload new CV
                </label>
              </div>
              {!useExistingCV && (
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="mt-2"
                  onChange={e => setCvFile(e.target.files[0])}
                  required
                />
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={onClose} disabled={loading}>Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700" disabled={loading}>{loading ? 'Submitting...' : 'Submit Application'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyJobModal; 