import { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { Sidebar } from './components/Layout/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ShoppingList from './pages/ShoppingList';
import Categories from './pages/Categories';
import Documents from './pages/Documents';
import Budget from './pages/Budget';
import Statistics from './pages/Statistics';
import DeliveryTracker from './pages/DeliveryTracker';
import Notes from './pages/Notes';
import Activity from './pages/Activity';

// ── Rising hearts — start at bottom, float to top, loop forever ──────────────
// [left%, duration(s), delay(s), size(px)]
const BG_HEARTS = [
  [3,  9,  0],   [8,  7,  1.5], [13, 11, 0.3], [18, 8,  2.8],
  [23, 10, 0.7], [28, 7,  3.5], [33, 9,  1.1], [38, 12, 0.4],
  [43, 8,  2.2], [48, 10, 1.8], [52, 7,  0.9], [57, 9,  3.1],
  [62, 11, 0.2], [67, 8,  2.5], [72, 10, 1.3], [77, 7,  0.6],
  [82, 9,  2],   [87, 11, 1.7], [92, 8,  0.5], [96, 10, 3.3],
  [10, 7,  4],   [35, 9,  4.5], [60, 8,  4.2], [80, 10, 4.8],
  [50, 11, 5],
];

const FloatingHearts = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {BG_HEARTS.map(([left, dur, delay], i) => {
      const size = 14 + (i % 5) * 5;   // sizes: 14,19,24,29,34
      const isLight = i % 3 === 0;
      return (
        <span
          key={i}
          className={`absolute bottom-0 select-none rise-heart
            ${isLight
              ? 'text-pink-400 dark:text-pink-300'
              : 'text-rose-400 dark:text-rose-300'
            }`}
          style={{
            left:              `${left}%`,
            fontSize:          size,
            opacity:           0.55 + (i % 4) * 0.1,
            animationDuration: `${dur}s`,
            animationDelay:    `${delay}s`,
          }}
        >
          ♥
        </span>
      );
    })}
  </div>
);

// ── Click-burst hearts ─────────────────────────────────────────────────────────
const BURST_COLORS = ['text-pink-400','text-rose-400','text-pink-300','text-red-400','text-pink-500'];

const ClickHearts = () => {
  const [bursts, setBursts] = useState([]);

  const handleClick = useCallback((e) => {
    // Don't burst on interactive elements like buttons/inputs
    const tag = e.target.tagName.toLowerCase();
    if (['input','textarea','select','option'].includes(tag)) return;

    const count = 4 + Math.floor(Math.random() * 3); // 4-6 hearts
    const newHearts = Array.from({ length: count }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      x: e.clientX,
      y: e.clientY,
      dx: (Math.random() - 0.5) * 70,
      dy: -(30 + Math.random() * 60),
      size: 12 + Math.random() * 14,
      color: BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)],
    }));
    setBursts(prev => [...prev, ...newHearts]);
    setTimeout(() => {
      setBursts(prev => prev.filter(h => !newHearts.some(n => n.id === h.id)));
    }, 900);
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [handleClick]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {bursts.map(h => (
          <motion.span key={h.id}
            initial={{ opacity: 1, x: h.x, y: h.y, scale: 0.5 }}
            animate={{ opacity: 0, x: h.x + h.dx, y: h.y + h.dy, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className={`fixed select-none font-bold ${h.color}`}
            style={{ fontSize: h.size, lineHeight: 1 }}>
            ♥
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ── Protected layout ───────────────────────────────────────────────────────────
const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50 dark:bg-drose-950">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">♥</div>
          <p className="text-pink-400 dark:text-pink-300 text-sm">Loading our little app...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-pink-50 dark:bg-drose-950 relative">
      <FloatingHearts />
      <ClickHearts />
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col min-w-0 relative z-10">
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/shopping"  element={<ShoppingList />} />
          <Route path="/categories"element={<Categories />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/budget"    element={<Budget />} />
          <Route path="/statistics"element={<Statistics />} />
          <Route path="/delivery"  element={<DeliveryTracker />} />
          <Route path="/notes"     element={<Notes />} />
          <Route path="/activity"  element={<Activity />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

// ── Root ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<PublicRoute />} />
            <Route path="/*"     element={<ProtectedLayout />} />
          </Routes>
        </HashRouter>
      </AppProvider>
    </AuthProvider>
  );
}

const PublicRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <Login />;
};
