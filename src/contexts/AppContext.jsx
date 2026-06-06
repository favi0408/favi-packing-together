import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, COLLECTIONS } from '../firebase/firestore';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const SETTINGS_DOC = 'app';

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [budget, setBudgetState] = useState(100000);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // Keep the budget in Firestore so it survives reloads and syncs across devices.
  // Only subscribe once signed in, otherwise the read is denied by the rules.
  useEffect(() => {
    if (!user) return;
    const ref = doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOC);
    return onSnapshot(
      ref,
      snap => {
        const val = snap.data()?.budget;
        if (typeof val === 'number') setBudgetState(val);
      },
      err => console.error('Settings subscription error:', err?.message)
    );
  }, [user]);

  const setBudget = async (val) => {
    setBudgetState(val); // optimistic update
    try {
      await setDoc(doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOC), { budget: val }, { merge: true });
    } catch (e) {
      console.error('Failed to save budget to Firestore:', e?.message);
    }
  };

  const toggleDark = () => setDarkMode(p => !p);
  const toggleSidebar = () => setSidebarOpen(p => !p);

  return (
    <AppContext.Provider value={{ darkMode, toggleDark, sidebarOpen, toggleSidebar, setSidebarOpen, budget, setBudget }}>
      {children}
    </AppContext.Provider>
  );
};