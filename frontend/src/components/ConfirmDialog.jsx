import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmDialog = ({ open, title = 'Confirm', message, onConfirm, onCancel }) => {
  if (!open) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white/95 backdrop-blur-xl rounded-xl lg:rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg shadow-2xl p-4 sm:p-6 border border-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display">{title}</h3>
          </div>
          {/* Message */}
          <div className="mb-6 text-slate-600 text-sm sm:text-base leading-relaxed">{message}</div>
          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="rounded-full px-4 py-2 font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 transition-all duration-200 w-full sm:w-auto"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onConfirm}
              className="rounded-full px-4 py-2 font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg w-full sm:w-auto"
            >
              Confirm
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ConfirmDialog; 