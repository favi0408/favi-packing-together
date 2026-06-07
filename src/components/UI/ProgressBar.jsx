import React from 'react';
import { motion } from 'framer-motion';

export const ProgressBar = ({ value, max = 100, color = 'blue', showLabel = true, height = 'h-2' }) => {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const colors = {
    blue: 'bg-pink-500', green: 'bg-green-500', yellow: 'bg-yellow-500',
    red: 'bg-red-500', purple: 'bg-purple-500',
  };
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{value} / {max}</span><span>{pct.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${height} overflow-hidden`}>
        <motion.div initial={{ width: 0 }} animate={{ width: pct + '%' }} transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`${height} rounded-full ${colors[color] || colors.blue}`} />
      </div>
    </div>
  );
};