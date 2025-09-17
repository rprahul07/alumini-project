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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2 z-50">
      <div className="bg-white/95 backdrop-blur-xl rounded-xl lg:rounded-2xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide p-3 sm:p-4 lg:p-6 border border-slate-200 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 font-display">
            {isAccept ? 'Accept Mentorship Request' : 'Request Mentorship'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors p-1 sm:p-2 rounded-full hover:bg-slate-100"
          >
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
        </div>

        {/* Alumni Info */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 border border-slate-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-200">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="font-semibold text-lg text-slate-900 font-display">{alumni.fullName || alumni.name || ''}</div>
            <div className="text-sm text-slate-600 mt-1">
              {((alumni.alumni?.graduationYear || alumni.graduationYear) || (alumni.alumni?.course || alumni.course)) && (
                <>
                  {(alumni.alumni?.graduationYear || alumni.graduationYear || '')}
                  {(alumni.alumni?.graduationYear || alumni.graduationYear) && (alumni.alumni?.course || alumni.course) ? ' | ' : ''}
                  {(alumni.alumni?.course || alumni.course || '')}
                </>
              )}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {((alumni.alumni?.currentJobTitle || alumni.currentJobTitle) || (alumni.alumni?.companyName || alumni.companyName)) && (
                <>
                  {(alumni.alumni?.currentJobTitle || alumni.currentJobTitle || '')}
                  {(alumni.alumni?.currentJobTitle || alumni.currentJobTitle) && (alumni.alumni?.companyName || alumni.companyName) ? ' at ' : ''}
                  {(alumni.alumni?.companyName || alumni.companyName || '')}
                </>
              )}
            </div>
          </div>
        </div>
        {/* Mentorship Tier Selection (for accept mode) */}
        {isAccept && (
          <div className="bg-white/80 backdrop-blur-xl rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 border border-slate-200">
            <div className="font-semibold text-slate-900 mb-4 text-left font-body">Choose Mentorship Tier:</div>
            <div className="space-y-3">
              {TIERS.map(tier => (
                <label
                  key={tier.value}
                  className={`flex items-center rounded-2xl border px-4 py-3 cursor-pointer transition-all duration-200 ${
                    selectedTier === tier.value 
                      ? 'border-primary-500 bg-primary-50 shadow-lg' 
                      : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
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
                    className="form-radio text-primary-500 mr-3"
                  />
                  <div className="flex-1">
                    <span className="font-semibold text-slate-900 mr-2 font-body">{tier.name}</span>
                    <span className="text-xs text-slate-600 font-body">{tier.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
        {/* Message Input */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-3 font-body">
            {isAccept ? 'Message to Mentee' : 'Your Message'}
          </label>
          <textarea
            className="w-full bg-slate-50 backdrop-blur-xl border border-slate-300 text-slate-900 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 placeholder-slate-500 font-body"
            rows={4}
            maxLength={200}
            placeholder={isAccept ? "Write a message to the mentee..." : "Write your mentorship request message..."}
            value={message}
            onChange={e => setMessage(e.target.value)}
            disabled={loading}
          />
          <div className="text-xs text-slate-500 mt-2 text-right font-body">{message.length}/200</div>
        </div>

        {/* Action Button */}
        <div className="mt-4 flex justify-end">
          <button
            className="rounded-full px-4 py-2 font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={handleSend}
            disabled={loading || (isAccept && (!selectedTier || !message.trim()))}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isAccept ? 'Accepting...' : 'Sending...'}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {isAccept ? 'Accept Request' : 'Send Request'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default MentorshipRequestModal; 
 
 