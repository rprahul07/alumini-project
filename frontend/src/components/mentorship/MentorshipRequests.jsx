import React, { useState, useEffect } from 'react';
import ReceivedRequests from './ReceivedRequests';
import SentRequests from './SentRequests';
import axios from '../../config/axios';

const MentorshipRequests = ({ showAlert, jobs }) => {
  // Mentorship sub-tab state
  const [tab, setTab] = useState('received');
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sentLoading, setSentLoading] = useState(false);
  const [sentError, setSentError] = useState(null);

  // Fetch received requests
  useEffect(() => {
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
  }, []);

  // Fetch sent requests
  useEffect(() => {
    if (tab !== 'sent') return;
    setSentLoading(true);
    setSentError(null);
    axios.get('/api/support/check_tier/alumni')
      .then(res => {
        if (res.data.success) {
          setSentRequests(res.data.requests.map(r => ({ ...r, id: r.requestId })));
        } else setSentError(res.data.message || 'Failed to fetch sent requests');
      })
      .catch((error) => {
        if (error.response && error.response.status === 404 && error.response.data && error.response.data.message === 'No support requests found for this user.') {
          setSentRequests([]);
          setSentError('You have no support requests yet.');
        } else {
          setSentError('Network error.');
        }
      })
      .finally(() => setSentLoading(false));
  }, [tab]);

  return (
    <div className="flex flex-col h-full">
      {/* Nested mentorship tabs */}
      <div className="flex flex-row gap-2 mb-4 items-center">
        <button
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${tab === 'received' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
          onClick={() => setTab('received')}
        >
          Received Requests
        </button>
        <button
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${tab === 'sent' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
          onClick={() => setTab('sent')}
        >
          Sent Requests
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
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