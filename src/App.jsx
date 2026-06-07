import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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

const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50 dark:bg-drose-950">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">♥</div>
          <p className="text-pink-400 dark:text-pink-500 text-sm">Loading our little app...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Scattered background hearts for the main app area
  const BG_HEARTS = [
    [10,15,8],[25,45,6],[40,20,10],[60,70,7],[75,30,9],
    [88,55,6],[15,80,8],[50,10,7],[70,85,10],[35,60,6],
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-pink-50 dark:bg-drose-950 relative">
      {/* Subtle background hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {BG_HEARTS.map(([l, t, d], i) => (
          <span key={i} className="absolute text-pink-200 dark:text-drose-700 bg-heart select-none"
            style={{ left:`${l}%`, top:`${t}%`, fontSize: 28 + i*4,
              animationDuration:`${d}s`, animationDelay:`${i*0.7}s` }}>
            ♥
          </span>
        ))}
      </div>
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col min-w-0 relative z-10">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/shopping" element={<ShoppingList />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/delivery" element={<DeliveryTracker />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<PublicRoute />} />
            <Route path="/*" element={<ProtectedLayout />} />
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