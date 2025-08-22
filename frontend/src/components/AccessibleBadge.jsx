import React from 'react';

const AccessibleBadge = ({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-block text-xs px-3 py-1 rounded-full font-medium transition-colors duration-200';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800 border border-gray-300',
    success: 'bg-green-100 text-green-800 border border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    error: 'bg-red-100 text-red-800 border border-red-300',
    info: 'bg-blue-100 text-blue-800 border border-blue-300',
    active: 'bg-emerald-100 text-emerald-800 border border-emerald-300' // Fixed contrast
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default AccessibleBadge;
