import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity as ActivityIcon } from 'lucide-react';
import { TopBar } from '../components/Layout/TopBar';
import { subscribeToCollection, COLLECTIONS, orderBy, limit } from '../firebase/firestore';
import { formatRelativeTime } from '../utils/formatters';
import { getActivityIcon } from '../utils/activityIcons';

export default function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeToCollection(COLLECTIONS.ACTIVITIES, (data) => {
      setActivities(data);
      setLoading(false);
    }, [orderBy('createdAt','desc'), limit(100)]);
  }, []);

  // Group by date
  const grouped = activities.reduce((acc, a) => {
    const d = a.createdAt ? (a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) : new Date();
    const key = d.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <TopBar title="Activity Timeline" subtitle={activities.length + ' total events'} />
      <div className="p-4 lg:p-8 max-w-3xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : activities.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ActivityIcon size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No activity yet</p>
            <p className="text-sm">Activity will appear here as you use the app</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([date, acts]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
                  <span className="text-xs font-medium text-gray-500 bg-white dark:bg-gray-950 px-3">{date}</span>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
                </div>
                <div className="space-y-3">
                  {acts.map((a, i) => {
                    const { Icon, color } = getActivityIcon(a.type);
                    return (
                      <motion.div key={a.id} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.03 }}
                        className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                          <Icon size={15} />
                        </div>
                        <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3">
                          <p className="text-sm text-gray-800 dark:text-gray-200">{a.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(a.createdAt)}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}