import { useState, useEffect } from 'react';
import { subscribeToCollection, addDocument, updateDocument, deleteDocument, COLLECTIONS, orderBy } from '../firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useActivity } from './useActivity';

export const useItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { displayName } = useAuth();
  const { logActivity } = useActivity();

  useEffect(() => {
    const unsub = subscribeToCollection(COLLECTIONS.ITEMS, (data) => {
      setItems(data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      setLoading(false);
    }, [orderBy('createdAt', 'desc')]);
    return unsub;
  }, []);

  const addItem = async (data) => {
    const totalPrice = (data.quantity || 1) * (data.unitPrice || 0);
    const item = { ...data, totalPrice, status: data.status || 'not_purchased', createdBy: displayName, lastModifiedBy: displayName };
    const ref = await addDocument(COLLECTIONS.ITEMS, item);
    await logActivity('item_added', `${displayName} added ${data.name}`, { itemId: ref.id, itemName: data.name });
    return ref;
  };

  const updateItem = async (id, data, oldItem) => {
    const totalPrice = (data.quantity || 1) * (data.unitPrice || 0);
    await updateDocument(COLLECTIONS.ITEMS, id, { ...data, totalPrice, lastModifiedBy: displayName });
    if (oldItem?.status !== data.status) {
      await logActivity('status_changed', `${displayName} changed ${data.name} to ${data.status}`, { itemId: id, itemName: data.name });
    } else {
      await logActivity('item_updated', `${displayName} updated ${data.name}`, { itemId: id, itemName: data.name });
    }
  };

  const deleteItem = async (id, name) => {
    await deleteDocument(COLLECTIONS.ITEMS, id);
    await logActivity('item_deleted', `${displayName} deleted ${name}`, { itemName: name });
  };

  return { items, loading, addItem, updateItem, deleteItem };
};