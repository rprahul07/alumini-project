import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { PaperClipIcon } from '@heroicons/react/24/outline';

const ApplyJobModal = ({ open, onClose, job, onSuccess }) => {
  const [useExistingCV, setUseExistingCV] = useState(true);
  const [cvFile, setCvFile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploadingCV, setUploadingCV] = useState(false);

  const { user } = useAuth();

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

  const handleCvUpload = async (file) => {
    setUploadingCV(true);
    try {
      const formData = new FormData();
      formData.append('chunk', file);
      formData.append('filename', file.name);
      formData.append('chunkIndex', '0');
      formData.append('totalChunks', '1');
      const uploadEndpoint = `/api/${user.role}/upload/resume`;
      const res = await axios.post(uploadEndpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      if (res.data.success && res.data.url) {
        // Update user context with new resumeUrl
        user.resumeUrl = res.data.url;
        setCvFile(null);
        setUploadingCV(false);
        return res.data.url;
      } else {
        setUploadingCV(false);
        throw new Error(res.data.message || 'Failed to upload CV');
      }
    } catch (err) {
      setUploadingCV(false);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      let resumeUrl = user.resumeUrl;
      if (!useExistingCV && cvFile) {
        // Upload new CV and update profile
        resumeUrl = await handleCvUpload(cvFile);
      }
      const payload = {
        ...userData,
        resumeUrl,
      };
      await axios.post(`/api/job/${job.id}/register`, payload);
      setSuccess('Application submitted!');
      setTimeout(() => {
        setSuccess(null);
        onClose();
        if (onSuccess) onSuccess();
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
            {/* CV logic */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV</label>
              <div className="flex items-center gap-4 mb-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600"
                    checked={useExistingCV}
                    onChange={() => { setUseExistingCV(true); setCvFile(null); }}
                  />
                  <span className="ml-2 text-sm text-gray-700">Use my profile CV</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600"
                    checked={!useExistingCV}
                    onChange={() => setUseExistingCV(false)}
                  />
                  <span className="ml-2 text-sm text-gray-700">Upload new CV</span>
                </label>
              </div>
              {useExistingCV ? (
                user && user.resumeUrl ? (
                  <div className="flex items-center gap-2 mb-1">
                    <PaperClipIcon className="h-4 w-4 text-green-500" />
                    <a href={user.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 underline font-medium">View Current CV</a>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm mb-1">No CV uploaded in your profile.</div>
                )
              ) : (
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={e => setCvFile(e.target.files[0])}
                    disabled={uploadingCV}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {uploadingCV && <div className="text-xs text-gray-500 mt-1">Uploading...</div>}
                  {cvFile && <div className="text-xs text-gray-600">Selected: {cvFile.name}</div>}
                </div>
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