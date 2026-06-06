import { addDocument, subscribeToCollection, COLLECTIONS, orderBy, limit } from '../firebase/firestore';

export const useActivity = () => {
  const logActivity = async (type, message, meta = {}) => {
    try {
      await addDocument(COLLECTIONS.ACTIVITIES, { type, message, ...meta });
    } catch (e) { console.error('Activity log error', e); }
  };
  return { logActivity };
};

export const useActivityFeed = (count = 20) => {
  const [activities, setActivities] = useState([]);
  
  useEffect(() => {
    const unsub = subscribeToCollection(COLLECTIONS.ACTIVITIES, setActivities, [orderBy('createdAt','desc'), limit(count)]);
    return unsub;
  }, [count]);
  
  return activities;
};

import { useState, useEffect } from 'react';