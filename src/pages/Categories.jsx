import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { TopBar } from '../components/Layout/TopBar';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { CategoryIcon } from '../components/UI/CategoryIcon';
import { useCategories } from '../hooks/useCategories';
import { useItems } from '../hooks/useItems';

const COLORS = ['#3b82f6','#ef4444','#8b5cf6','#f59e0b','#10b981','#06b6d4','#6b7280','#ec4899','#14b8a6','#f97316'];

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { items } = useItems();
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ name: '', color: '#3b82f6' });

  const reset = () => { setForm({ name:'', color:'#3b82f6' }); setEdit(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (edit) { await updateCategory(edit.id, form); }
    else { await addCategory(form); }
    reset(); setModal(false);
  };

  const openEdit = (cat) => { setEdit(cat); setForm({ name: cat.name, color: cat.color }); setModal(true); };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <TopBar title="Categories" subtitle={categories.length + ' categories'}
        actions={<Button variant="primary" size="sm" icon={Plus} onClick={() => { reset(); setModal(true); }}>Add Category</Button>}
      />
      <div className="p-4 lg:p-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => {
            const count = items.filter(item => item.categoryId === cat.id).length;
            const catTotal = items.filter(item => item.categoryId === cat.id).reduce((s, item) => s + (item.totalPrice || 0), 0);
            return (
              <motion.div key={cat.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 hover:border-blue-300 dark:hover:border-blue-700 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CategoryIcon category={cat} size={48} />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{cat.name}</h3>
                      <p className="text-xs text-gray-500">{count} items</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600"><Edit2 size={14}/></button>
                    <button onClick={() => deleteCategory(cat.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><Trash2 size={14}/></button>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{count} items</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{catTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: count > 0 ? `${Math.min(100,(count/Math.max(...categories.map(c=>items.filter(i=>i.categoryId===c.id).length),1))*100)}%` : '0%', backgroundColor: cat.color }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Modal isOpen={modal} onClose={() => { setModal(false); reset(); }} title={edit ? 'Edit Category' : 'Add Category'} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Name *</label>
            <input required value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="e.g. Accessories"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setForm(p => ({...p, color: c}))}
                  className={`w-8 h-8 rounded-full transition-transform ${form.color === c ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : ''}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" className="flex-1">{edit ? 'Update' : 'Add Category'}</Button>
            <Button type="button" variant="secondary" onClick={() => { setModal(false); reset(); }}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}