import React from 'react';

export const Badge = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 dark:bg-drose-800 text-gray-700 dark:text-gray-300',
    primary: 'bg-pink-100 dark:bg-rose-900/40 text-pink-700 dark:text-pink-400',
    success: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400',
    danger: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};