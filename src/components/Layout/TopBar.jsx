import React from 'react';
import { Menu, Search } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const TopBar = ({ title, subtitle, actions }) => {
  const { toggleSidebar } = useApp();
  return (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-4 px-4 lg:px-8 h-16">
        <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
          <Menu size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">{title}</h1>
          {subtitle && <p className="text-xs text-gray-500 hidden sm:block">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>
    </div>
  );
};