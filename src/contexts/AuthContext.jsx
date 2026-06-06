import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, signOutUser } from '../firebase/auth';
import { db, COLLECTIONS } from '../firebase/firestore';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { resolveDisplayName } from '../utils/constants';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Sign the user in immediately — the app should load even if the
          // Firestore profile write fails (e.g. rules not deployed yet).
          const name = resolveDisplayName(firebaseUser.email);
          setDisplayName(name);
          setUser(firebaseUser);

          try {
            const userRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
            const snap = await getDoc(userRef);
            if (!snap.exists()) {
              await setDoc(userRef, {
                uid: firebaseUser.uid, email: firebaseUser.email,
                displayName: name, photoURL: firebaseUser.photoURL,
                createdAt: serverTimestamp(), lastSeen: serverTimestamp(),
              });
            } else {
              await setDoc(userRef, { displayName: name, lastSeen: serverTimestamp() }, { merge: true });
            }
          } catch (profileErr) {
            console.warn('Could not sync user profile — check your Firestore rules:', profileErr?.message);
          }
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const login = () => signInWithGoogle();
  const logout = () => signOutUser();

  return (
    <AuthContext.Provider value={{ user, displayName, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};