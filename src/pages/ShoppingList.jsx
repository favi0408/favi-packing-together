import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, Download, CheckCircle2, Circle, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { TopBar } from '../components/Layout/TopBar';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { Card } from '../components/UI/Card';
import { CategoryIcon } from '../components/UI/CategoryIcon';
import { ItemForm } from '../components/Items/ItemForm';
import { useItems } from '../hooks/useItems';
import { useCategories } from '../hooks/useCategories';
import { formatCurrency } from '../utils/formatters';

const isDone = (item) => item.status === 'delivered';

// A single item line inside a category box.
const ItemRow = ({ item, onToggle, onEdit, onDelete }) => {
  const done = isDone(item);
  return (
    <div className="flex items-center gap-3 py-2.5 group">
      <button onClick={() => onToggle(item)} className="flex-shrink-0" title={done ? 'Mark as not bought' : 'Mark as bought'}>
        {done
          ? <CheckCircle2 size={20} className="text-green-500" />
          : <Circle size={20} className="text-gray-300 dark:text-gray-600 hover:text-blue-500" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${done ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>{item.name}</p>
        {(item.vendor || item.status === 'ordered') && (
          <p className="text-xs text-gray-400 truncate">{item.status === 'ordered' ? 'Ordered' : ''}{item.vendor ? (item.status === 'ordered' ? ' · ' : '') + item.vendor : ''}</p>
        )}
      </div>
      {item.quantity > 1 && <span className="text-xs text-gray-400 flex-shrink-0">×{item.quantity}</span>}
      {item.totalPrice > 0 && <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">{formatCurrency(item.totalPrice)}</span>}
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {item.purchaseUrl && (
          <a href={item.purchaseUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"><ExternalLink size={14} /></a>
        )}
        <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600" title="Add price / details"><Pencil size={14} /></button>
        <button onClick={() => onDelete(item.id, item.name)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><Trash2 size={14} /></button>
      </div>
    </div>
  );
};

export default function ShoppingList() {
  const { items, loading, addItem, updateItem, deleteItem } = useItems();
  const { categories } = useCategories();
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');
  const [hideDone, setHideDone] = useState(false);

  const handleAdd = async (data) => { await addItem(data); setAddOpen(false); };
  const handleEdit = async (data) => { await updateItem(editItem.id, data, editItem); setEditItem(null); };
  const togglePurchased = (item) => {
    const status = isDone(item) ? 'not_purchased' : 'delivered';
    updateItem(item.id, { ...item, status }, item);
  };

  const filtered = useMemo(() => {
    let res = [...items];
    if (search) res = res.filter(i => (i.name || '').toLowerCase().includes(search.toLowerCase()));
    if (hideDone) res = res.filter(i => !isDone(i));
    return res;
  }, [items, search, hideDone]);

  // Group items into category boxes (plus an "Uncategorized" box at the end).
  const groups = useMemo(() => {
    const byId = {};
    categories.forEach(c => { byId[c.id] = { category: c, items: [] }; });
    const uncategorized = [];
    filtered.forEach(item => {
      if (item.categoryId && byId[item.categoryId]) byId[item.categoryId].items.push(item);
      else uncategorized.push(item);
    });
    const list = Object.values(byId).filter(g => g.items.length > 0);
    list.sort((a, b) => (a.category.name || '').localeCompare(b.category.name || ''));
    if (uncategorized.length) list.push({ category: null, items: uncategorized });
    return list;
  }, [filtered, categories]);

  const doneCount = items.filter(isDone).length;
  const totalSpent = items.reduce((s, i) => s + (i.totalPrice || 0), 0);

  const exportCSV = () => {
    const rows = [['Name', 'Category', 'Qty', 'Total', 'Status', 'Vendor', 'Added By', 'Notes']];
    items.forEach(i => {
      const cat = categories.find(c => c.id === i.categoryId);
      rows.push([i.name, cat?.name || '', i.quantity, i.totalPrice, i.status, i.vendor, i.addedBy, i.notes]);
    });
    const csv = rows.map(r => r.map(v => '"' + (v ?? '').toString().replace(/"/g, '""') + '"').join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'packing-list.csv';
    a.click();
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <TopBar title="Packing List" subtitle={`${items.length} items · ${doneCount} bought · ${formatCurrency(totalSpent)} spent`}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={Download} onClick={exportCSV}>Export</Button>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setAddOpen(true)}>Add Item</Button>
          </div>
        }
      />
      <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-5">
        {/* Search + filter */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..."
              className="w-full pl-9 pr-9 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X size={14} /></button>}
          </div>
          <button onClick={() => setHideDone(p => !p)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${hideDone ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            Hide bought
          </button>
        </div>

        {/* Category boxes */}
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : groups.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No items yet</p>
            <p className="text-sm mt-1">Tap “Add Item” to start your packing list</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            <AnimatePresence>
              {groups.map(({ category, items: groupItems }) => {
                const groupDone = groupItems.filter(isDone).length;
                const groupTotal = groupItems.reduce((s, i) => s + (i.totalPrice || 0), 0);
                return (
                  <motion.div key={category?.id || 'uncategorized'} layout
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <Card className="p-5">
                      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                        <CategoryIcon category={category || { name: 'Other', color: '#6b7280' }} size={40} />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{category?.name || 'Uncategorized'}</h3>
                          <p className="text-xs text-gray-500">{groupDone}/{groupItems.length} bought{groupTotal > 0 ? ` · ${formatCurrency(groupTotal)}` : ''}</p>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                        {groupItems.map(item => (
                          <ItemRow key={item.id} item={item} onToggle={togglePurchased} onEdit={setEditItem} onDelete={deleteItem} />
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Quick add — name, category, quantity only */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add Item" size="sm">
        <ItemForm minimal onSubmit={handleAdd} onCancel={() => setAddOpen(false)} categories={categories} />
      </Modal>

      {/* Full edit — add price/vendor/status after buying */}
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Item Details" size="md">
        {editItem && <ItemForm onSubmit={handleEdit} onCancel={() => setEditItem(null)} initial={editItem} categories={categories} />}
      </Modal>
    </div>
  );
}
