import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmDialog = ({ open, title = 'Confirm', message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white/10 backdrop-blur-2xl rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-lg shadow-2xl p-4 sm:p-6 border border-white/20"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
          {/* Message */}
          <div className="mb-6 text-gray-300 text-sm sm:text-base">{message}</div>
          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="rounded-full px-4 py-1.5 font-semibold border border-white/30 text-white hover:bg-white/10 transition-all duration-200 w-full sm:w-auto"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onConfirm}
              className="rounded-full px-4 py-1.5 font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg w-full sm:w-auto"
            >
              Confirm
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmDialog; 