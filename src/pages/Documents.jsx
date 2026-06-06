import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Edit2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { TopBar } from '../components/Layout/TopBar';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { subscribeToCollection, addDocument, updateDocument, COLLECTIONS } from '../firebase/firestore';
import { DEFAULT_DOCUMENTS, DOCUMENT_STATUSES } from '../utils/constants';
import { db } from '../firebase/firestore';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const STATUS_ICONS = { missing: AlertCircle, in_progress: Clock, completed: CheckCircle };
const STATUS_COLORS = { missing: 'text-red-500', in_progress: 'text-yellow-500', completed: 'text-green-500' };

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ name:'', status:'missing', notes:'', expiryDate:'' });

  useEffect(() => {
    const init = async () => {
      const snap = await getDocs(collection(db, COLLECTIONS.DOCUMENTS));
      if (snap.empty) {
        for (const name of DEFAULT_DOCUMENTS) {
          await addDoc(collection(db, COLLECTIONS.DOCUMENTS), { name, status:'missing', notes:'', createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        }
      }
    };
    init();
    return subscribeToCollection(COLLECTIONS.DOCUMENTS, setDocs);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (edit) { await updateDocument(COLLECTIONS.DOCUMENTS, edit.id, form); setEdit(null); }
    else { await addDocument(COLLECTIONS.DOCUMENTS, form); }
    setModal(false);
    setForm({ name:'', status:'missing', notes:'', expiryDate:'' });
  };

  const openEdit = (doc) => { setEdit(doc); setForm({ name:doc.name, status:doc.status, notes:doc.notes||'', expiryDate:doc.expiryDate||'' }); setModal(true); };

  const byStatus = (s) => docs.filter(d => d.status === s);
  const missing = byStatus('missing').length, inProg = byStatus('in_progress').length, done = byStatus('completed').length;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <TopBar title="Documents" subtitle={`${done}/${docs.length} completed`}
        actions={<Button variant="primary" size="sm" icon={Plus} onClick={() => { setEdit(null); setForm({ name:'', status:'missing', notes:'', expiryDate:'' }); setModal(true); }}>Add Document</Button>}
      />
      <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[{l:'Missing',v:missing,c:'red'},{l:'In Progress',v:inProg,c:'yellow'},{l:'Completed',v:done,c:'green'}].map(({l,v,c}) => (
            <div key={l} className={`rounded-2xl p-4 text-center bg-${c}-50 dark:bg-${c}-900/20 border border-${c}-200 dark:border-${c}-800`}>
              <p className={`text-2xl font-bold text-${c}-700 dark:text-${c}-400`}>{v}</p>
              <p className={`text-xs text-${c}-600 dark:text-${c}-500 mt-1`}>{l}</p>
            </div>
          ))}
        </div>

        {/* Docs List */}
        <div className="space-y-3">
          {DOCUMENT_STATUSES.map(({ value, label }) => {
            const group = docs.filter(d => d.status === value);
            if (group.length === 0) return null;
            const Icon = STATUS_ICONS[value];
            return (
              <div key={value}>
                <h3 className={`flex items-center gap-2 text-sm font-semibold mb-2 ${STATUS_COLORS[value]}`}>
                  <Icon size={16} /> {label} ({group.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.map((doc, i) => (
                    <motion.div key={doc.id} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.04 }}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between group hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={STATUS_COLORS[value]} />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{doc.name}</p>
                          {doc.notes && <p className="text-xs text-gray-500 mt-0.5">{doc.notes}</p>}
                          {doc.expiryDate && <p className="text-xs text-orange-500 mt-0.5">Expires: {doc.expiryDate}</p>}
                        </div>
                      </div>
                      <button onClick={() => openEdit(doc)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={edit ? 'Edit Document' : 'Add Document'} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document Name *</label>
            <input required value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="e.g. Passport"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
              <option value="missing">Missing</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
            <input type="date" value={form.expiryDate} onChange={e => setForm(p => ({...p, expiryDate: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea rows={2} value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" />
          </div>
          <div className="flex gap-3">
            <Button type="submit" variant="primary" className="flex-1">{edit ? 'Update' : 'Add'}</Button>
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}