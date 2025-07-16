import React from 'react';

const ConfirmDialog = ({ open, title = 'Confirm', message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1 sm:p-2 z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg shadow-xl p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        {/* Message */}
        <div className="mb-6 text-gray-700 text-sm sm:text-base">{message}</div>
        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-full px-4 py-1.5 font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full px-4 py-1.5 font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors w-full sm:w-auto"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 