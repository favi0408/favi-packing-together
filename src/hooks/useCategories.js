import { useState, useEffect } from 'react';
import { subscribeToCollection, addDocument, updateDocument, deleteDocument, COLLECTIONS } from '../firebase/firestore';
import { DEFAULT_CATEGORIES } from '../utils/constants';
import { db } from '../firebase/firestore';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

// Runs the seed/dedupe exactly once per app load, even though several
// components mount this hook at the same time (which is what created the
// duplicate categories in the first place).
let initPromise = null;

const initCategories = async () => {
  const snap = await getDocs(collection(db, COLLECTIONS.CATEGORIES));
  const existing = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  // 1. Remove duplicates — keep the first category for each name.
  const seen = new Set();
  const dupes = [];
  for (const c of existing) {
    const key = (c.name || '').trim().toLowerCase();
    if (!key) continue;
    if (seen.has(key)) dupes.push(c);
    else seen.add(key);
  }
  await Promise.all(dupes.map(c => deleteDoc(doc(db, COLLECTIONS.CATEGORIES, c.id))));

  // 2. Seed the default set only when there are no categories at all,
  //    so deletions the user makes on purpose aren't resurrected.
  if (seen.size === 0) {
    for (const cat of DEFAULT_CATEGORIES) {
      await addDoc(collection(db, COLLECTIONS.CATEGORIES), { ...cat, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    }
  }
};

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initPromise) {
      initPromise = initCategories().catch(e => {
        initPromise = null; // allow a retry on the next mount
        console.error('Category init failed:', e?.message);
      });
    }
    const unsub = subscribeToCollection(COLLECTIONS.CATEGORIES, (data) => {
      setCategories([...data].sort((a, b) => (a.name || '').localeCompare(b.name || '')));
      setLoading(false);
    });
    return unsub;
  }, []);

  const addCategory = (data) => addDocument(COLLECTIONS.CATEGORIES, data);
  const updateCategory = (id, data) => updateDocument(COLLECTIONS.CATEGORIES, id, data);
  const deleteCategory = (id) => deleteDocument(COLLECTIONS.CATEGORIES, id);

  return { categories, loading, addCategory, updateCategory, deleteCategory };
};
