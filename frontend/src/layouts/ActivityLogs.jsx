import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAlert from '../hooks/useAlert';
import { FiLogOut, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Create admin API methods
const adminAPI = {
  getActivityLogs: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/logs/activity`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Server response:', text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch activity logs');
      }
      return data;
    } catch (error) {
      console.error('Activity logs error:', error);
      throw new Error('Failed to fetch activity logs. Please try again.');
    }
  },
  
  getPasswordChanges: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/logs/password-changes`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Server response:', text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch password changes');
      }
      return data;
    } catch (error) {
      console.error('Password changes error:', error);
      throw new Error('Failed to fetch password changes. Please try again.');
    }
  },
  
  getEmailChanges: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/logs/email-changes`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Server response:', text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch email changes');
      }
      return data;
    } catch (error) {
      console.error('Email changes error:', error);
      throw new Error('Failed to fetch email changes. Please try again.');
    }
  }
};

// Custom TabPanel component
function TabPanel({ children, value, index }) {
  return (
    <div className={`${value !== index ? 'hidden' : ''} py-5`}>
      {value === index && children}
    </div>
  );
}

const ActivityLogs = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showAlert } = useAlert();
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
        adminAPI.getActivityLogs(),
        adminAPI.getPasswordChanges(),
        adminAPI.getEmailChanges()
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
      showAlert(err.message || 'Failed to fetch logs', 'error');
      
      // If unauthorized, redirect to login
      if (err.message.includes('unauthorized') || err.message.includes('Unauthorized')) {
        await handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showAlert('Logged out successfully!', 'success');
      navigate('/role-selection', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      showAlert(error.message || 'Failed to logout', 'error');
    }
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

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="text-white text-xl font-semibold">
                Admin Dashboard
              </div>
              <div className="ml-4 text-white text-sm">
                System Logs
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className="flex items-center px-4 py-2 text-white hover:bg-primary/80 rounded-md transition-colors"
                title="Refresh"
                disabled={loading}
              >
                <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-white hover:bg-primary/80 rounded-md transition-colors"
                title="Logout"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8" aria-label="Tabs">
              {['Activity Logs', 'Password Changes', 'Email Changes'].map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(index)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    tabValue === index
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="p-4">
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {error}
                <button
                  onClick={handleRefresh}
                  className="ml-4 text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Activity Logs Table */}
              <TabPanel value={tabValue} index={0}>
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.activityLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.user_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.user_type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.action}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <pre className="whitespace-pre-wrap font-sans">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatTimestamp(log.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabPanel>

              {/* Password Changes Table */}
              <TabPanel value={tabValue} index={1}>
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Changed At</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.passwordChanges.map((change) => (
                        <tr key={change.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{change.user_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{change.user_type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatTimestamp(change.changed_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabPanel>

              {/* Email Changes Table */}
              <TabPanel value={tabValue} index={2}>
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Old Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Changed At</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.emailChanges.map((change) => (
                        <tr key={change.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{change.user_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{change.user_type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{change.old_email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{change.new_email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatTimestamp(change.changed_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabPanel>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs; 