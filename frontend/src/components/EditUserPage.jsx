import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../middleware/api';
import { toast } from 'react-hot-toast';

const userTypeToApi = {
  students: 'student',
  alumni: 'alumni',
  faculty: 'faculty',
};

const EditUserPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiType = userTypeToApi[type];
        if (!apiType) throw new Error('Invalid user type');
        const res = await apiService.raw.get(`/api/${apiType}/${id}`);
        setUserData(res.data.data || res.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [type, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const apiType = userTypeToApi[type];
      if (!apiType) throw new Error('Invalid user type');
      await apiService.raw.patch(`/api/${apiType}/${id}`, userData);
      toast.success('User updated successfully!');
      setTimeout(() => navigate('/admin/dashboard', { replace: true }), 1500);
    } catch (err) {
      setError(err.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading user data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!userData) return null;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6">Edit {type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)} Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(userData).map(([key, value]) => (
          key !== 'id' && key !== 'userId' && key !== 'createdAt' && key !== 'user' && (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="text"
                name={key}
                value={value ?? ''}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          )
        ))}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserPage; 