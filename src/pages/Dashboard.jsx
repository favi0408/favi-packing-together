import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, Truck, Clock, TrendingUp, Activity, ArrowRight, FileText, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TopBar } from '../components/Layout/TopBar';
import { Card } from '../components/UI/Card';
import { ProgressBar } from '../components/UI/ProgressBar';
import { formatCurrency, formatRelativeTime } from '../utils/formatters';
import { useItems } from '../hooks/useItems';
import { subscribeToCollection, COLLECTIONS, orderBy, limit } from '../firebase/firestore';
import { useApp } from '../contexts/AppContext';
import { getActivityIcon } from '../utils/activityIcons';

const StatCard = ({ icon: Icon, label, value, sub, color = 'blue', delay = 0 }) => {
  const colors = {
    blue: 'bg-pink-50 dark:bg-rose-900/20 text-pink-600 dark:text-pink-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  };
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="bg-white dark:bg-drose-900 border border-gray-200 dark:border-drose-700 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </motion.div>
  );
};

export default function Dashboard() {
  const { items, loading } = useItems();
  const [activities, setActivities] = useState([]);
  const { budget } = useApp();

  useEffect(() => {
    const unsub = subscribeToCollection(COLLECTIONS.ACTIVITIES, setActivities, [orderBy('createdAt','desc'), limit(8)]);
    return unsub;
  }, []);

  const total = items.length;
  const purchased = items.filter(i => i.status === 'ordered' || i.status === 'delivered').length;
  const delivered = items.filter(i => i.status === 'delivered').length;
  const pending = items.filter(i => i.status === 'not_purchased').length;

  const totalCost = items.reduce((s, i) => s + (i.totalPrice || 0), 0);
  const orderedCost = items.filter(i => i.status === 'ordered').reduce((s, i) => s + (i.totalPrice || 0), 0);
  const deliveredCost = items.filter(i => i.status === 'delivered').reduce((s, i) => s + (i.totalPrice || 0), 0);
  const remaining = budget - totalCost;
  const pct = total > 0 ? Math.round((delivered / total) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <TopBar title="Dashboard" subtitle="Favi Packing Together — Costa Rica Move" />
      <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">

        {/* Hero Banner */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-pink-600 to-rose-800 rounded-3xl p-6 text-white">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-8 text-8xl">🇨🇷</div>
          </div>
          <div className="relative">
            <p className="text-pink-200 text-sm mb-1">India → Costa Rica 🇨🇷</p>
            <h2 className="text-2xl font-bold mb-4">Packing Progress</h2>
            <div className="mb-2">
              <ProgressBar value={delivered} max={total || 1} color="green" showLabel={false} height="h-3" />
            </div>
            <div className="flex justify-between text-sm">
              <span>{pct}% complete</span>
              <span>{delivered} of {total} items delivered</span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={ShoppingCart} label="Total Items" value={total} color="blue" delay={0.1} />
          <StatCard icon={Package} label="Delivered" value={delivered} color="green" delay={0.2} />
          <StatCard icon={Clock} label="Pending" value={pending} color="yellow" delay={0.3} />
          <StatCard icon={Truck} label="Ordered" value={purchased - delivered} color="purple" delay={0.4} />
        </div>

        {/* Budget */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-pink-600" /> Budget Overview
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Total Budget', val: formatCurrency(budget), color: 'text-pink-600' },
                { label: 'Total Planned', val: formatCurrency(totalCost), color: 'text-gray-900 dark:text-white' },
                { label: 'Delivered Cost', val: formatCurrency(deliveredCost), color: 'text-green-600' },
                { label: 'Ordered Cost', val: formatCurrency(orderedCost), color: 'text-yellow-600' },
                { label: 'Remaining', val: formatCurrency(remaining), color: remaining >= 0 ? 'text-green-600' : 'text-red-600' },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className={`font-semibold ${color}`}>{val}</span>
                </div>
              ))}
              <div className="pt-2">
                <ProgressBar value={totalCost} max={budget} color={totalCost > budget ? 'red' : 'blue'} showLabel={false} />
              </div>
            </div>
          </Card>

          {/* Activity */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Activity size={18} className="text-purple-600" /> Recent Activity
              </h3>
              <Link to="/activity" className="text-xs text-pink-600 hover:underline flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {activities.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No activity yet. Start adding items!</p>
            ) : (
              <div className="space-y-3">
                {activities.map(a => {
                  const { Icon, color } = getActivityIcon(a.type);
                  return (
                  <div key={a.id} className="flex items-start gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}><Icon size={14} /></span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{a.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatRelativeTime(a.createdAt)}</p>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/shopping', label: 'Add Item', icon: ShoppingCart, color: 'from-pink-500 to-pink-600' },
            { to: '/documents', label: 'Documents', icon: FileText, color: 'from-green-500 to-green-600' },
            { to: '/budget', label: 'Budget', icon: Wallet, color: 'from-yellow-500 to-orange-500' },
            { to: '/delivery', label: 'Delivery', icon: Package, color: 'from-purple-500 to-purple-600' },
          ].map(({ to, label, icon: Icon, color }) => (
            <Link key={to} to={to}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className={`bg-gradient-to-br ${color} rounded-2xl p-4 text-white text-center cursor-pointer`}>
                <Icon size={24} className="mx-auto mb-1.5" />
                <p className="text-sm font-medium">{label}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}