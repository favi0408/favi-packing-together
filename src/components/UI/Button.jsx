import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, type = 'button', icon: Icon }) => {
  const variants = {
    primary:   'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-sm shadow-pink-200 dark:shadow-pink-900/30',
    secondary: 'bg-pink-50 dark:bg-drose-800 hover:bg-pink-100 dark:hover:bg-drose-700 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-drose-600',
    danger:    'bg-red-500 hover:bg-red-600 text-white shadow-sm',
    ghost:     'hover:bg-pink-50 dark:hover:bg-drose-800 text-pink-600 dark:text-pink-400',
    success:   'bg-green-500 hover:bg-green-600 text-white shadow-sm',
  };
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type} onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition-colors ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
      {children}
    </motion.button>
  );
};