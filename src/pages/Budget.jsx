import React, { useState } from 'react';
import { Target, ClipboardList, CheckCircle, Wallet, Edit2 } from 'lucide-react';
import { TopBar } from '../components/Layout/TopBar';
import { Card } from '../components/UI/Card';
import { ProgressBar } from '../components/UI/ProgressBar';
import { Modal } from '../components/UI/Modal';
import { Button } from '../components/UI/Button';
import { formatCurrency } from '../utils/formatters';
import { useItems } from '../hooks/useItems';
import { useCategories } from '../hooks/useCategories';
import { useApp } from '../contexts/AppContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6','#ef4444','#8b5cf6','#f59e0b','#10b981','#06b6d4','#6b7280','#ec4899'];

export default function Budget() {
  const { items } = useItems();
  const { categories } = useCategories();
  const { budget, setBudget } = useApp();
  const [editBudget, setEditBudget] = useState(false);
  const [newBudget, setNewBudget] = useState(budget);

  const totalPlanned = items.reduce((s,i) => s+(i.totalPrice||0), 0);
  const totalDelivered = items.filter(i=>i.status==='delivered').reduce((s,i) => s+(i.totalPrice||0), 0);
  const totalOrdered = items.filter(i=>i.status==='ordered').reduce((s,i) => s+(i.totalPrice||0), 0);
  const remaining = budget - totalPlanned;

  const catData = categories.map((cat, idx) => {
    const total = items.filter(i => i.categoryId === cat.id).reduce((s,i) => s+(i.totalPrice||0), 0);
    return { name: cat.name, value: total, color: COLORS[idx % COLORS.length] };
  }).filter(d => d.value > 0).sort((a,b) => b.value - a.value);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <TopBar title="Budget" subtitle="Track your moving expenses"
        actions={<Button variant="secondary" size="sm" icon={Edit2} onClick={() => setEditBudget(true)}>Set Budget</Button>}
      />
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Budget Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l:'Total Budget', v:formatCurrency(budget), Icon:Target, c:'blue' },
            { l:'Total Planned', v:formatCurrency(totalPlanned), Icon:ClipboardList, c:'purple' },
            { l:'Delivered Cost', v:formatCurrency(totalDelivered), Icon:CheckCircle, c:'green' },
            { l:'Remaining', v:formatCurrency(remaining), Icon:Wallet, c: remaining >= 0 ? 'green' : 'red' },
          ].map(({ l,v,Icon,c }) => {
            const tint = { blue:'text-blue-600 bg-blue-50 dark:bg-blue-900/20', purple:'text-purple-600 bg-purple-50 dark:bg-purple-900/20', green:'text-green-600 bg-green-50 dark:bg-green-900/20', red:'text-red-600 bg-red-50 dark:bg-red-900/20' }[c];
            return (
            <div key={l} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${tint}`}><Icon size={20} /></div>
              <p className={`text-xl font-bold ${c==='red'?'text-red-600':c==='green'?'text-green-600':'text-gray-900 dark:text-white'}`}>{v}</p>
              <p className="text-xs text-gray-500 mt-1">{l}</p>
            </div>
            );
          })}
        </div>

        {/* Progress */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Budget Usage</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Planned ({((totalPlanned/budget)*100).toFixed(0)}%)</span>
                <span className="font-medium">{formatCurrency(totalPlanned)}</span>
              </div>
              <ProgressBar value={totalPlanned} max={budget} color={totalPlanned>budget?'red':'blue'} showLabel={false} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Delivered ({((totalDelivered/budget)*100).toFixed(0)}%)</span>
                <span className="font-medium">{formatCurrency(totalDelivered)}</span>
              </div>
              <ProgressBar value={totalDelivered} max={budget} color="green" showLabel={false} />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
            {catData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={catData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                    {catData.map((_, i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-gray-400 py-16">No spending data yet</p>}
          </Card>

          {/* Category Breakdown Table */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Category Breakdown</h3>
            <div className="space-y-3">
              {catData.map((cat, i) => (
                <div key={cat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} /> {cat.name}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(cat.value)}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: totalPlanned > 0 ? `${(cat.value/totalPlanned)*100}%` : '0%', backgroundColor: COLORS[i%COLORS.length] }} />
                  </div>
                </div>
              ))}
              {catData.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">Add items with prices to see breakdown</p>}
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={editBudget} onClose={() => setEditBudget(false)} title="Set Total Budget" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget Amount (₹)</label>
            <input type="number" value={newBudget} onChange={e => setNewBudget(+e.target.value)} min="0" step="1000"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold" />
          </div>
          <div className="flex gap-3">
            <Button variant="primary" className="flex-1" onClick={() => { setBudget(newBudget); setEditBudget(false); }}>Save Budget</Button>
            <Button variant="secondary" onClick={() => setEditBudget(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}