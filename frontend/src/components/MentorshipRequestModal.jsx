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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 w-full max-w-md relative animate-slide-up">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-xl text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 border border-white/30 z-10"
          onClick={onClose}
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-xl px-6 py-4 border-b border-white/20 rounded-t-3xl">
          <h2 className="text-xl font-bold text-white text-center font-display">
            {isAccept ? 'Accept Mentorship Request' : 'Request Mentorship'}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Alumni Info */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-white/30">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="font-semibold text-lg text-white font-display">{alumni.fullName || alumni.name || ''}</div>
            <div className="text-sm text-white/80 mt-1">
              {((alumni.alumni?.graduationYear || alumni.graduationYear) || (alumni.alumni?.course || alumni.course)) && (
                <>
                  {(alumni.alumni?.graduationYear || alumni.graduationYear || '')}
                  {(alumni.alumni?.graduationYear || alumni.graduationYear) && (alumni.alumni?.course || alumni.course) ? ' | ' : ''}
                  {(alumni.alumni?.course || alumni.course || '')}
                </>
              )}
            </div>
            <div className="text-sm text-white/70 mt-1">
              {((alumni.alumni?.currentJobTitle || alumni.currentJobTitle) || (alumni.alumni?.companyName || alumni.companyName)) && (
                <>
                  {(alumni.alumni?.currentJobTitle || alumni.currentJobTitle || '')}
                  {(alumni.alumni?.currentJobTitle || alumni.currentJobTitle) && (alumni.alumni?.companyName || alumni.companyName) ? ' at ' : ''}
                  {(alumni.alumni?.companyName || alumni.companyName || '')}
                </>
              )}
            </div>
          </div>
          {/* Mentorship Tier Selection (for accept mode) */}
          {isAccept && (
            <div className="mb-6">
              <div className="font-semibold text-white mb-4 text-left font-body">Choose Mentorship Tier:</div>
              <div className="space-y-3">
                {TIERS.map(tier => (
                  <label
                    key={tier.value}
                    className={`flex items-center rounded-2xl border px-4 py-3 cursor-pointer transition-all duration-200 ${
                      selectedTier === tier.value 
                        ? 'border-primary-400/50 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 shadow-lg' 
                        : 'border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/30'
                    }`}
                    onMouseEnter={e => e.currentTarget.title = tier.description}
                    onMouseLeave={e => e.currentTarget.title = ''}
                  >
                    <input
                      type="radio"
                      name="tier"
                      value={tier.value}
                      checked={selectedTier === tier.value}
                      onChange={() => setSelectedTier(tier.value)}
                      className="form-radio text-primary-400 mr-3"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-white mr-2 font-body">{tier.name}</span>
                      <span className="text-xs text-white/70 font-body">{tier.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
          {/* Message Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-3 font-body">
              {isAccept ? 'Message to Mentee' : 'Your Message'}
            </label>
            <textarea
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-200 placeholder-white/50 font-body"
              rows={4}
              maxLength={200}
              placeholder={isAccept ? "Write a message to the mentee..." : "Write your mentorship request message..."}
              value={message}
              onChange={e => setMessage(e.target.value)}
              disabled={loading}
            />
            <div className="text-xs text-white/60 mt-2 text-right font-body">{message.length}/200</div>
          </div>

          {/* Action Button */}
          <button
            className="w-full rounded-2xl px-6 py-4 font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-xl hover:from-primary-600 hover:to-secondary-600 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-base disabled:opacity-50 disabled:transform-none disabled:hover:scale-100 font-body"
            onClick={handleSend}
            disabled={loading || (isAccept && (!selectedTier || !message.trim()))}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isAccept ? 'Accepting...' : 'Sending...'}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {isAccept ? 'Accept Request' : 'Send Request'}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default MentorshipRequestModal; 
 
 