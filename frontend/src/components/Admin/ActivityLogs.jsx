import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import apiService from '../../services/api';

// Create admin API methods
const adminAPI = {
  getActivityLogs: async () => {
    const response = await apiService.get('/api/admin/logs/activity');
    return response.data;
  },
  
  getPasswordChanges: async () => {
    const response = await apiService.get('/api/admin/logs/password-changes');
    return response.data;
  },
  
  getEmailChanges: async () => {
    const response = await apiService.get('/api/admin/logs/email-changes');
    return response.data;
  }
};

// Custom TabPanel component
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ padding: '20px 0' }}>
      {value === index && children}
    </div>
  );
}

const ActivityLogs = () => {
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

      const [activityResponse, passwordResponse, emailResponse] = await Promise.all([
        adminAPI.getActivityLogs(),
        adminAPI.getPasswordChanges(),
        adminAPI.getEmailChanges()
      ]);

      if (!activityResponse.success || !passwordResponse.success || !emailResponse.success) {
        throw new Error('Failed to fetch some log data');
      }

      setData({
        activityLogs: activityResponse.data || [],
        passwordChanges: passwordResponse.data || [],
        emailChanges: emailResponse.data || []
      });
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        System Logs
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Activity Logs" />
          <Tab label="Password Changes" />
          <Tab label="Email Changes" />
        </Tabs>
      </Box>

      {/* Activity Logs Table */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>User Type</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.activityLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.user_id}</TableCell>
                  <TableCell>{log.user_type}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </TableCell>
                  <TableCell>{formatTimestamp(log.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Password Changes Table */}
      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>User Type</TableCell>
                <TableCell>Changed At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.passwordChanges.map((change) => (
                <TableRow key={change.id}>
                  <TableCell>{change.user_id}</TableCell>
                  <TableCell>{change.user_type}</TableCell>
                  <TableCell>{formatTimestamp(change.changed_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Email Changes Table */}
      <TabPanel value={tabValue} index={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>User Type</TableCell>
                <TableCell>Old Email</TableCell>
                <TableCell>New Email</TableCell>
                <TableCell>Changed At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.emailChanges.map((change) => (
                <TableRow key={change.id}>
                  <TableCell>{change.user_id}</TableCell>
                  <TableCell>{change.user_type}</TableCell>
                  <TableCell>{change.old_email}</TableCell>
                  <TableCell>{change.new_email}</TableCell>
                  <TableCell>{formatTimestamp(change.changed_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Box>
  );
};

export default ActivityLogs; 