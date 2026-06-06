import React from 'react';

// A clean, emoji-free category badge: a rounded square tinted with the
// category colour, showing the first letter of the category name.
export const CategoryIcon = ({ category, size = 40, className = '' }) => {
  const color = category?.color || '#6b7280';
  const letter = (category?.name || '?').trim().charAt(0).toUpperCase();
  return (
    <div
      className={`rounded-xl flex items-center justify-center font-semibold flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color + '20',
        color,
        fontSize: Math.round(size * 0.45),
      }}
    >
      {letter}
    </div>
  );
};
