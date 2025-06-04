import React from 'react';
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const ALERT_TYPES = {
  error: {
    icon: FiAlertCircle,
    baseClass: 'bg-red-50 text-red-600 border-red-200',
    iconClass: 'text-red-500',
  },
  success: {
    icon: FiCheckCircle,
    baseClass: 'bg-green-50 text-green-600 border-green-200',
    iconClass: 'text-green-500',
  },
  info: {
    icon: FiInfo,
    baseClass: 'bg-blue-50 text-blue-600 border-blue-200',
    iconClass: 'text-blue-500',
  },
};

const Alert = ({ 
  type = 'error',
  message,
  onClose,
  className = '',
  showIcon = true,
}) => {
  if (!message) return null;

  const { icon: Icon, baseClass, iconClass } = ALERT_TYPES[type] || ALERT_TYPES.error;

  return (
    <div
      className={`flex items-start p-4 rounded-lg border ${baseClass} ${className}`}
      role="alert"
    >
      {showIcon && (
        <Icon className={`w-5 h-5 ${iconClass} mt-0.5 flex-shrink-0`} />
      )}
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          type="button"
          className={`ml-3 flex-shrink-0 ${iconClass} hover:opacity-75 focus:outline-none`}
          onClick={onClose}
          aria-label="Close alert"
        >
          <FiX className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Alert; 