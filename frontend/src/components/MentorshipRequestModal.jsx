import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const TIERS = [
  {
    value: 1,
    name: 'Basic',
    description: 'Share your professional email address with the mentee.'
  },
  {
    value: 2,
    name: 'Advanced',
    description: 'Share your professional email and LinkedIn profile.'
  },
  {
    value: 3,
    name: 'Premium',
    description: 'Share your professional email, LinkedIn, and WhatsApp contact.'
  }
];

const MentorshipRequestModal = ({ open, onClose, alumni, onSend, onResult, acceptMode }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const isAccept = !!acceptMode;

  if (!open) return null;

  const handleSend = async () => {
    if (isAccept) {
      if (!selectedTier) {
        onResult && onResult({ success: false, message: 'Please select a mentorship tier.' });
        return;
      }
      if (!message.trim()) {
        onResult && onResult({ success: false, message: 'Please enter a message.' });
        return;
      }
    } else {
      if (!message.trim()) {
        onResult && onResult({ success: false, message: 'Please enter a message.' });
        return;
      }
    }
    setLoading(true);
    try {
      if (isAccept) {
        await onSend({ alumniMsg: message, tier: selectedTier });
      } else {
        await onSend(message);
      }
      setMessage('');
      setSelectedTier(null);
      onResult && onResult({ success: true, message: isAccept ? 'Mentorship request accepted!' : 'Mentorship request sent successfully!' });
      // Do not close modal here; let parent handle it
    } catch (err) {
      onResult && onResult({ success: false, message: isAccept ? 'Failed to accept request.' : 'Failed to send request.' });
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold text-indigo-700 mb-2 text-center">
          {isAccept ? 'Accept Mentorship Request' : 'Request Mentorship'}
        </h2>
        <div className="text-center mb-4">
          <div className="font-semibold text-lg text-gray-800">{alumni.fullName || alumni.name || ''}</div>
          <div className="text-sm text-gray-500">
            {((alumni.alumni?.graduationYear || alumni.graduationYear) || (alumni.alumni?.course || alumni.course)) && (
              <>
                {(alumni.alumni?.graduationYear || alumni.graduationYear || '')}
                {(alumni.alumni?.graduationYear || alumni.graduationYear) && (alumni.alumni?.course || alumni.course) ? ' | ' : ''}
                {(alumni.alumni?.course || alumni.course || '')}
              </>
            )}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {((alumni.alumni?.currentJobTitle || alumni.currentJobTitle) || (alumni.alumni?.companyName || alumni.companyName)) && (
              <>
                {(alumni.alumni?.currentJobTitle || alumni.currentJobTitle || '')}
                {(alumni.alumni?.currentJobTitle || alumni.currentJobTitle) && (alumni.alumni?.companyName || alumni.companyName) ? ' at ' : ''}
                {(alumni.alumni?.companyName || alumni.companyName || '')}
              </>
            )}
          </div>
        </div>
        {isAccept && (
          <div className="mb-4">
            <div className="font-semibold text-gray-700 mb-2 text-left">Choose Mentorship Tier:</div>
            <div className="flex flex-col gap-2">
              {TIERS.map(tier => (
                <label
                  key={tier.value}
                  className={`flex items-center rounded-lg border px-3 py-2 cursor-pointer transition-all ${selectedTier === tier.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                  onMouseEnter={e => e.currentTarget.title = tier.description}
                  onMouseLeave={e => e.currentTarget.title = ''}
                >
                  <input
                    type="radio"
                    name="tier"
                    value={tier.value}
                    checked={selectedTier === tier.value}
                    onChange={() => setSelectedTier(tier.value)}
                    className="form-radio text-indigo-600 mr-2"
                  />
                  <span className="font-semibold text-indigo-700 mr-2">{tier.name}</span>
                  <span className="text-xs text-gray-500">{tier.description}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        <textarea
          className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          rows={4}
          maxLength={200}
          placeholder={isAccept ? "Write a message to the mentee (required)..." : "Write your mentorship request message..."}
          value={message}
          onChange={e => setMessage(e.target.value)}
          disabled={loading}
        />
        <div className="text-xs text-gray-400 mb-2 text-right">{message.length}/200</div>
        <button
          className="w-full rounded-full px-4 py-2 font-semibold bg-indigo-600 text-white shadow hover:bg-indigo-700 transition text-base disabled:opacity-50"
          onClick={handleSend}
          disabled={loading || (isAccept && (!selectedTier || !message.trim()))}
        >
          {loading ? (isAccept ? 'Accepting...' : 'Sending...') : (isAccept ? 'Accept Request' : 'Send Request')}
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default MentorshipRequestModal; 
 
 