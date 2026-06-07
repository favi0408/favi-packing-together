import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, ShoppingBag, Tag, FileText, PiggyBank,
  Sparkles, Truck, MessageCircleHeart, Zap, X, Moon, Sun,
  Heart, LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

const NAV = [
  { to: '/',          icon: Home,               label: 'Home'          },
  { to: '/shopping',  icon: ShoppingBag,         label: 'Packing List'  },
  { to: '/categories',icon: Tag,                 label: 'Categories'    },
  { to: '/documents', icon: FileText,             label: 'Our Docs'      },
  { to: '/budget',    icon: PiggyBank,            label: 'Budget'        },
  { to: '/statistics',icon: Sparkles,             label: 'Progress'      },
  { to: '/delivery',  icon: Truck,               label: 'Deliveries'    },
  { to: '/notes',     icon: MessageCircleHeart,   label: 'Love Notes'    },
  { to: '/activity',  icon: Zap,                 label: "What's New"    },
];

export const Sidebar = () => {
  const { user, displayName, logout } = useAuth();
  const { darkMode, toggleDark, sidebarOpen, setSidebarOpen } = useApp();

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-pink-100 dark:border-pink-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-600 flex items-center justify-center shadow-lg">
            <Heart size={20} className="text-white fill-white/80" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">Favi Packing</h1>
            <p className="text-xs text-pink-400 dark:text-pink-400">Together ❤️ 🇨🇷</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin space-y-0.5">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm shadow-pink-200 dark:shadow-pink-900/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-700 dark:hover:text-pink-300'
              }`
            }>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + controls */}
      <div className="p-4 border-t border-pink-100 dark:border-pink-900/30 space-y-3">
        <div className="flex items-center gap-3 px-3">
          {user?.photoURL
            ? <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full ring-2 ring-pink-400" />
            : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-sm font-bold">{displayName?.[0]}</div>
          }
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleDark}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            {darkMode ? 'Light' : 'Dark'}
          </button>
          <button onClick={logout}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-drose-900 border-r border-pink-100 dark:border-pink-900/30 h-screen sticky top-0 flex-shrink-0">
        {content}
      </aside>

      {/* Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-white dark:bg-drose-900 shadow-2xl flex flex-col lg:hidden">
              <button onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20 text-gray-500">
                <X size={20} />
              </button>
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
