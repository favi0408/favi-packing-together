import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, Trash2 } from 'lucide-react';
import { TopBar } from '../components/Layout/TopBar';
import { Button } from '../components/UI/Button';
import { subscribeToCollection, addDocument, deleteDocument, COLLECTIONS, orderBy } from '../firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { formatRelativeTime } from '../utils/formatters';

export default function Notes() {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { displayName } = useAuth();

  useEffect(() => {
    return subscribeToCollection(COLLECTIONS.COMMENTS, setComments, [orderBy('createdAt','desc')]);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    await addDocument(COLLECTIONS.COMMENTS, { text: text.trim(), author: displayName });
    setText('');
    setLoading(false);
  };

  const handleDelete = (id) => deleteDocument(COLLECTIONS.COMMENTS, id);

  const USER_COLORS = { 'Vignesh V': 'bg-pink-600', 'Firdouse Fathima': 'bg-purple-600' };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TopBar title="Notes & Comments" subtitle="Shared space for both of you" />
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 lg:p-8 max-w-3xl mx-auto w-full">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <MessageSquare size={48} className="mb-4 opacity-30" />
            <p className="text-lg font-medium">No comments yet</p>
            <p className="text-sm mt-1">Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {[...comments].reverse().map(c => {
                const isMe = c.author === displayName;
                const color = USER_COLORS[c.author] || 'bg-gray-600';
                return (
                  <motion.div key={c.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                    className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''} group`}>
                    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {c.author?.[0]}
                    </div>
                    <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">{c.author}</span>
                        <span className="text-xs text-gray-400">{formatRelativeTime(c.createdAt)}</span>
                      </div>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-pink-600 text-white rounded-tr-sm' : 'bg-white dark:bg-drose-900 border border-gray-200 dark:border-drose-700 text-gray-900 dark:text-white rounded-tl-sm'}`}>
                        {c.text}
                      </div>
                    </div>
                    {isMe && (
                      <button onClick={() => handleDelete(c.id)} className="self-center opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-drose-700 bg-white dark:bg-drose-900 p-4">
        <form onSubmit={handleSend} className="flex gap-3 max-w-3xl mx-auto">
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a note or comment..."
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-drose-600 rounded-2xl bg-gray-50 dark:bg-drose-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500" />
          <Button type="submit" variant="primary" disabled={!text.trim() || loading} icon={Send}>Send</Button>
        </form>
      </div>
    </div>
  );
}