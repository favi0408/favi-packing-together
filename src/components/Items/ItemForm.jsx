import React, { useState } from 'react';
import { Button } from '../UI/Button';
import { VENDORS, USERS_LIST, ITEM_STATUSES } from '../../utils/constants';
import { useAuth } from '../../contexts/AuthContext';

// `minimal` is used when first adding an item — we only capture what we know
// up front (name, category, quantity). Price, vendor, status and dates are
// added later via the full form once the item is actually bought/ordered.
export const ItemForm = ({ onSubmit, onCancel, initial = {}, categories = [], minimal = false }) => {
  const { displayName } = useAuth();
  const [form, setForm] = useState({
    name: '', categoryId: '', quantity: 1, unitPrice: 0,
    vendor: '', purchaseUrl: '', status: 'not_purchased', notes: '',
    addedBy: displayName || USERS_LIST[0], orderedDate: '', deliveryDate: '',
    ...initial
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const totalPrice = (form.quantity || 1) * (form.unitPrice || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, totalPrice });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Name *</label>
          <input required autoFocus value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="e.g. Travel Adapter"
            className="w-full px-3 py-2 border border-gray-300 dark:border-drose-600 rounded-xl bg-white dark:bg-drose-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <select value={form.categoryId} onChange={e => set('categoryId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-drose-600 rounded-xl bg-white dark:bg-drose-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm">
            <option value="">-- Select --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity</label>
          <input type="number" min="1" value={form.quantity} onChange={e => set('quantity', +e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-drose-600 rounded-xl bg-white dark:bg-drose-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm" />
        </div>

        {/* Everything below is only relevant after the item is bought/ordered. */}
        {!minimal && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-drose-600 rounded-xl bg-white dark:bg-drose-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm">
                {ITEM_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit Price (₹)</label>
              <input type="number" min="0" value={form.unitPrice} onChange={e => set('unitPrice', +e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-drose-600 rounded-xl bg-white dark:bg-drose-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Price (₹)</label>
              <div className="px-3 py-2 border border-gray-200 dark:border-drose-600 rounded-xl bg-gray-50 dark:bg-drose-800/50 text-pink-600 dark:text-pink-400 font-semibold text-sm">
                ₹{totalPrice.toLocaleString('en-IN')}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vendor</label>
              <select value={form.vendor} onChange={e => set('vendor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-drose-600 rounded-xl bg-white dark:bg-drose-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm">
                <option value="">-- Select --</option>
                {VENDORS.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>

            {(form.status === 'ordered' || form.status === 'delivered') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ordered Date</label>
                  <input type="date" value={form.orderedDate} onChange={e => set('orderedDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-drose-600 rounded-xl bg-white dark:bg-drose-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Delivery</label>
                  <input type="date" value={form.deliveryDate} onChange={e => set('deliveryDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-drose-600 rounded-xl bg-white dark:bg-drose-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm" />
                </div>
              </>
            )}

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purchase URL</label>
              <input type="url" value={form.purchaseUrl} onChange={e => set('purchaseUrl', e.target.value)}
                placeholder="https://amazon.in/..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-drose-600 rounded-xl bg-white dark:bg-drose-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
              <textarea rows={3} value={form.notes} onChange={e => set('notes', e.target.value)}
                placeholder="e.g. Buy during Amazon sale..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-drose-600 rounded-xl bg-white dark:bg-drose-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm resize-none" />
            </div>
          </>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" className="flex-1">
          {initial?.name ? 'Save Changes' : 'Add Item'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};
