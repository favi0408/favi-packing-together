import {
  getFirestore, collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, getDoc, onSnapshot, query, where, orderBy,
  serverTimestamp, Timestamp, limit
} from 'firebase/firestore';
import app from './config';

export const db = getFirestore(app);

export const COLLECTIONS = {
  USERS: 'users', CATEGORIES: 'categories', ITEMS: 'items',
  DOCUMENTS: 'documents', COMMENTS: 'comments', ACTIVITIES: 'activities',
  SETTINGS: 'settings', BUDGETS: 'budgets',
};

export const addDocument = (col, data) =>
  addDoc(collection(db, col), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });

export const updateDocument = (col, id, data) =>
  updateDoc(doc(db, col, id), { ...data, updatedAt: serverTimestamp() });

export const deleteDocument = (col, id) => deleteDoc(doc(db, col, id));

export const getDocument = (col, id) => getDoc(doc(db, col, id));

export const subscribeToCollection = (col, callback, constraints = [], onError) => {
  const q = constraints.length ? query(collection(db, col), ...constraints) : collection(db, col);
  return onSnapshot(
    q,
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
    err => {
      // Without this handler a permissions/connection error would silently
      // leave pages stuck on their loading spinner forever.
      console.error(`Firestore subscription error on "${col}":`, err?.message);
      if (onError) onError(err);
      else callback([]); // clear loading and show the empty state instead of hanging
    }
  );
};

export { serverTimestamp, Timestamp, orderBy, where, query, collection, doc, limit };