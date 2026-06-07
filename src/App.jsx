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

// ── Fixed background hearts that always float over everything ─────────────────
const BG_HEARTS = [
  { l:5,  t:10, s:22, d:9,  delay:0   },
  { l:15, t:60, s:18, d:7,  delay:1.2 },
  { l:25, t:30, s:28, d:11, delay:0.5 },
  { l:38, t:75, s:16, d:8,  delay:2   },
  { l:50, t:15, s:24, d:10, delay:0.8 },
  { l:62, t:55, s:20, d:7,  delay:1.6 },
  { l:72, t:85, s:26, d:9,  delay:0.3 },
  { l:80, t:25, s:18, d:8,  delay:1.9 },
  { l:90, t:65, s:22, d:11, delay:0.6 },
  { l:45, t:45, s:30, d:12, delay:2.4 },
  { l:8,  t:88, s:16, d:7,  delay:1   },
  { l:95, t:40, s:20, d:9,  delay:1.5 },
];

const FloatingHearts = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {BG_HEARTS.map((h, i) => (
      <span key={i} className="absolute select-none bg-heart
          text-pink-300/30 dark:text-pink-400/20"
        style={{
          left: `${h.l}%`, top: `${h.t}%`,
          fontSize: h.s,
          animationDuration: `${h.d}s`,
          animationDelay: `${h.delay}s`,
        }}>
        ♥
      </span>
    ))}
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
