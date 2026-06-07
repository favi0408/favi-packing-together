import { Menu } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const TopBar = ({ title, subtitle, actions }) => {
  const { toggleSidebar } = useApp();
  return (
    <div className="sticky top-0 z-30 bg-pink-50/90 dark:bg-drose-900/90 backdrop-blur-sm border-b border-pink-100 dark:border-drose-700">
      <div className="flex items-center gap-4 px-4 lg:px-8 h-16">
        <button onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl hover:bg-pink-100 dark:hover:bg-drose-800 text-pink-500">
          <Menu size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-rose-800 dark:text-pink-200 truncate">
            ♥ {title}
          </h1>
          {subtitle && <p className="text-xs text-pink-400 dark:text-pink-500 hidden sm:block">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
    </div>
  );
};