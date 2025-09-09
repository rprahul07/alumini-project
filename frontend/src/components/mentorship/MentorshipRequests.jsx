import React, { useState, useEffect } from 'react';
import ReceivedRequests from './ReceivedRequests';
import SentRequests from './SentRequests';
import axios from '../../config/axios';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const MentorshipRequests = ({ showAlert, jobs }) => {
  const { user } = useAuth();
  // Mentorship sub-tab state
  const [tab, setTab] = useState('received');
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sentLoading, setSentLoading] = useState(false);
  const [sentError, setSentError] = useState(null);

  // Fetch received requests - skip for faculty users
  useEffect(() => {
    // Don't make API calls for faculty users as they don't have access to mentorship endpoints
    if (!user || user.role === 'faculty') {
      setLoading(false);
      setError('Mentorship requests are not available for faculty users');
      return;
    }

    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/support/self/received');
        if (response.data.success) {
          setReceivedRequests(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch requests');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user]);

  // Fetch sent requests
  useEffect(() => {
    if (tab !== 'sent') return;
    setSentLoading(true);
    setSentError(null);
    axios.get('/api/support/check_tier/alumni')
      .then(res => {
        if (res.data.success) {
          setSentRequests(res.data.requests.map(r => ({ ...r, id: r.requestId })));
        } else {
          setSentError(res.data.message || 'Failed to fetch sent requests');
        }
      })
      .catch((error) => {
          setSentError('Network error.');
      })
      .finally(() => setSentLoading(false));
  }, [tab]);

  return (
    <div className="flex flex-col h-full">
      {/* Mobile-First Mentorship Tabs */}
      <div className="flex flex-col gap-2 mb-3">
        {/* Mobile Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-shrink-0 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
              tab === 'received' 
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-500' 
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
            }`}
            onClick={() => setTab('received')}
          >
            Received
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-shrink-0 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
              tab === 'sent' 
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-500' 
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
            }`}
            onClick={() => setTab('sent')}
          >
            Sent
          </motion.button>
        </div>
      </div>
      
      {/* Tab Content - Mobile Optimized */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {tab === 'received' ? (
          <ReceivedRequests
            requests={receivedRequests}
            loading={loading}
            error={error}
            setRequests={setReceivedRequests}
            showAlert={showAlert}
          />
        ) : (
          <SentRequests
            requests={sentRequests}
            loading={sentLoading}
            error={sentError}
            setRequests={setSentRequests}
            showAlert={showAlert}
          />
        )}
      </div>
    </div>
  );
};

export default MentorshipRequests; 