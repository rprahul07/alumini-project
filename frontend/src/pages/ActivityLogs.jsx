import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import toast from 'react-hot-toast';

const ActivityLogs = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    activityLogs: [],
    passwordChanges: [],
    emailChanges: []
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching admin logs...');

      const [activityResponse, passwordResponse, emailResponse] = await Promise.all([
        axios.get('/api/admin/activity-logs'),
        axios.get('/api/admin/password-changes'),
        axios.get('/api/admin/email-changes')
      ]);

      console.log('Responses received:', { activityResponse, passwordResponse, emailResponse });

      setData({
        activityLogs: activityResponse.data || [],
        passwordChanges: passwordResponse.data || [],
        emailChanges: emailResponse.data || []
      });
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err.message || 'Failed to fetch data');
      toast.error(err.message || 'Failed to fetch logs');
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    navigate('/auth', { replace: true });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (index) => {
    setTabValue(index);
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Activity Logs</h1>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading logs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => handleTabChange(0)}
                    className={`${
                      tabValue === 0
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                  >
                    Activity Logs
                  </button>
                  <button
                    onClick={() => handleTabChange(1)}
                    className={`${
                      tabValue === 1
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                  >
                    Password Changes
                  </button>
                  <button
                    onClick={() => handleTabChange(2)}
                    className={`${
                      tabValue === 2
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                  >
                    Email Changes
                  </button>
                </nav>
              </div>

              <div className="px-4 py-5 sm:p-6">
                {tabValue === 0 && (
                  <div className="space-y-4">
                    {data.activityLogs.map((log, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-md"
                      >
                        <p className="text-sm text-gray-900">{log.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {tabValue === 1 && (
                  <div className="space-y-4">
                    {data.passwordChanges.map((change, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-md"
                      >
                        <p className="text-sm text-gray-900">
                          Password changed for user: {change.userEmail}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(change.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {tabValue === 2 && (
                  <div className="space-y-4">
                    {data.emailChanges.map((change, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-md"
                      >
                        <p className="text-sm text-gray-900">
                          Email changed from {change.oldEmail} to {change.newEmail}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(change.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs; 