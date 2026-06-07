import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Edit2, Trash2, CheckCircle2, Circle, Clock } from 'lucide-react';
import { TopBar } from '../components/Layout/TopBar';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { subscribeToCollection, addDocument, updateDocument, deleteDocument, COLLECTIONS } from '../firebase/firestore';
import { DEFAULT_DOCUMENTS } from '../utils/constants';
import { db } from '../firebase/firestore';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

// Cycle order when tapping the status icon directly
const STATUS_CYCLE = ['missing', 'in_progress', 'completed'];

const StatusIcon = ({ status, size = 20 }) => {
  if (status === 'completed') return <CheckCircle2 size={size} className="text-green-500" />;
  if (status === 'in_progress') return <Clock size={size} className="text-yellow-500" />;
  return <Circle size={size} className="text-gray-400" />;
};

const EMPTY_FORM = { name: '', status: 'missing', notes: '', expiryDate: '' };

export default function Documents() {
  const [docs, setDocs]   = useState([]);
  const [modal, setModal] = useState(false);
  const [edit, setEdit]   = useState(null);
  const [form, setForm]   = useState(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const init = async () => {
      const snap = await getDocs(collection(db, COLLECTIONS.DOCUMENTS));
      if (snap.empty) {
        for (const name of DEFAULT_DOCUMENTS) {
          await addDoc(collection(db, COLLECTIONS.DOCUMENTS), {
            name, status: 'missing', notes: '', createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
          });
        }
      }
    };
    init();
    return subscribeToCollection(COLLECTIONS.DOCUMENTS, setDocs);
  }, []);

  // Tap the status icon → cycle missing → in_progress → completed → missing
  const cycleStatus = (doc) => {
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(doc.status) + 1) % STATUS_CYCLE.length];
    updateDocument(COLLECTIONS.DOCUMENTS, doc.id, { status: next });
  };

  const openAdd = () => { setEdit(null); setForm(EMPTY_FORM); setModal(true); };
  const openEdit = (doc) => {
    setEdit(doc);
    setForm({ name: doc.name, status: doc.status, notes: doc.notes || '', expiryDate: doc.expiryDate || '' });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (edit) await updateDocument(COLLECTIONS.DOCUMENTS, edit.id, form);
    else await addDocument(COLLECTIONS.DOCUMENTS, form);
    setModal(false);
    setEdit(null);
    setForm(EMPTY_FORM);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    await deleteDocument(COLLECTIONS.DOCUMENTS, confirmDelete.id);
    setConfirmDelete(null);
  };

  const missing    = docs.filter(d => d.status === 'missing').length;
  const inProgress = docs.filter(d => d.status === 'in_progress').length;
  const completed  = docs.filter(d => d.status === 'completed').length;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <TopBar
        title="Documents"
        subtitle={`${completed}/${docs.length} ready`}
        actions={
          <Button variant="primary" size="sm" icon={Plus} onClick={openAdd}>
            Add Document
          </Button>
        }
      />

      <div className="p-4 lg:p-8 max-w-3xl mx-auto space-y-6">

        {/* Summary chips */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Missing',     value: missing,    color: 'red'    },
            { label: 'In Progress', value: inProgress, color: 'yellow' },
            { label: 'Ready',       value: completed,  color: 'green'  },
          ].map(({ label, value, color }) => (
            <div key={label}
              className={`rounded-2xl p-4 text-center bg-${color}-50 dark:bg-${color}-900/20 border border-${color}-200 dark:border-${color}-800`}>
              <p className={`text-2xl font-bold text-${color}-700 dark:text-${color}-400`}>{value}</p>
              <p className={`text-xs text-${color}-600 dark:text-${color}-500 mt-1`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Hint */}
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Tap the circle to cycle status &nbsp;·&nbsp; hover for edit / delete
        </p>

        {/* Document list */}
        <div className="space-y-2">
          <AnimatePresence>
            {docs.map((doc, i) => (
              <motion.div key={doc.id}
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-3 bg-white dark:bg-drose-900 border rounded-xl px-4 py-3 group transition-all
                  ${doc.status === 'completed'
                    ? 'border-green-200 dark:border-green-800'
                    : doc.status === 'in_progress'
                    ? 'border-yellow-200 dark:border-yellow-800'
                    : 'border-gray-200 dark:border-drose-700'}`}
              >
                {/* Status toggle */}
                <button
                  onClick={() => cycleStatus(doc)}
                  title="Tap to cycle status"
                  className="shrink-0 transition-transform hover:scale-110"
                >
                  <StatusIcon status={doc.status} />
                </button>

                {/* Name + meta */}
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate
                    ${doc.status === 'completed'
                      ? 'line-through text-gray-400 dark:text-gray-500'
                      : 'text-gray-900 dark:text-white'}`}>
                    {doc.name}
                  </p>
                  <div className="flex flex-wrap gap-x-3 mt-0.5">
                    {doc.notes && (
                      <span className="text-xs text-gray-400 truncate">{doc.notes}</span>
                    )}
                    {doc.expiryDate && (
                      <span className="text-xs text-orange-500">Expires {doc.expiryDate}</span>
                    )}
                  </div>
                </div>

                {/* Actions — visible on hover */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => openEdit(doc)}
                    className="p-1.5 rounded-lg hover:bg-pink-50 dark:hover:bg-rose-900/20 text-pink-500"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(doc)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {docs.length === 0 && (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500">
              <FileText size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No documents yet. Add one above.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={edit ? 'Edit Document' : 'Add Document'} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document Name *</label>
            <input required autoFocus value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Passport"
              className="w-full px-3 py-2 border border-gray-300 dark:border-drose-600 rounded-xl bg-white dark:bg-drose-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-drose-600 rounded-xl bg-white dark:bg-drose-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm">
              <option value="missing">Missing</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Ready / Have it</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
            <input type="date" value={form.expiryDate} onChange={e => setForm(p => ({ ...p, expiryDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-drose-600 rounded-xl bg-white dark:bg-drose-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="e.g. Renewed in Jan 2025"
              className="w-full px-3 py-2 border border-gray-300 dark:border-drose-600 rounded-xl bg-white dark:bg-drose-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm resize-none" />
          </div>
          <div className="flex gap-3">
            <Button type="submit" variant="primary" className="flex-1">{edit ? 'Save' : 'Add'}</Button>
            <Button type="button" variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm modal */}
      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete Document" size="sm">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Remove <span className="font-semibold text-gray-900 dark:text-white">"{confirmDelete?.name}"</span> from your list?
        </p>
        <div className="flex gap-3">
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Delete</Button>
          <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}
