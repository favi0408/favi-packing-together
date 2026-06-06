import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = false, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    whileHover={hover ? { y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' } : {}}
    onClick={onClick}
    className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl ${hover ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </motion.div>
);