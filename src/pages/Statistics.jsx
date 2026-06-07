import React from 'react';
import { Package, Wallet, CheckCircle, Store, TrendingDown } from 'lucide-react';
import { TopBar } from '../components/Layout/TopBar';
import { Card } from '../components/UI/Card';
import { CategoryIcon } from '../components/UI/CategoryIcon';
import { formatCurrency } from '../utils/formatters';
import { useItems } from '../hooks/useItems';
import { useCategories } from '../hooks/useCategories';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#3b82f6','#ef4444','#8b5cf6','#f59e0b','#10b981','#06b6d4','#6b7280','#ec4899'];

export default function Statistics() {
  const { items } = useItems();
  const { categories } = useCategories();

  const totalCost = items.reduce((s,i) => s+(i.totalPrice||0), 0);
  const deliveredCost = items.filter(i=>i.status==='delivered').reduce((s,i) => s+(i.totalPrice||0), 0);
  const orderedCost = items.filter(i=>i.status==='ordered').reduce((s,i) => s+(i.totalPrice||0), 0);
  const pendingCost = items.filter(i=>i.status==='not_purchased').reduce((s,i) => s+(i.totalPrice||0), 0);

  const catData = categories.map((cat,idx) => ({
    name: cat.name,
    total: items.filter(i=>i.categoryId===cat.id).reduce((s,i)=>s+(i.totalPrice||0),0),
    count: items.filter(i=>i.categoryId===cat.id).length,
    color: COLORS[idx%COLORS.length],
  })).filter(d=>d.total>0).sort((a,b)=>b.total-a.total);

  const statusData = [
    { name:'Not Purchased', value: items.filter(i=>i.status==='not_purchased').reduce((s,i)=>s+(i.totalPrice||0),0), color:'#6b7280' },
    { name:'Ordered', value: orderedCost, color:'#f59e0b' },
    { name:'Delivered', value: deliveredCost, color:'#10b981' },
    { name:'Cancelled', value: items.filter(i=>i.status==='cancelled').reduce((s,i)=>s+(i.totalPrice||0),0), color:'#ef4444' },
  ].filter(d=>d.value>0);

  const top10 = [...items].sort((a,b)=>(b.totalPrice||0)-(a.totalPrice||0)).slice(0,10);

  const vendorMap = {};
  items.forEach(i=>{ if(i.vendor){ vendorMap[i.vendor]=(vendorMap[i.vendor]||0)+1; } });
  const topVendor = Object.entries(vendorMap).sort((a,b)=>b[1]-a[1])[0];

  const vendorData = Object.entries(vendorMap).map(([name,count])=>({ name, count })).sort((a,b)=>b.count-a.count);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <TopBar title="Statistics" subtitle="Spending insights & analytics" />
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l:'Total Items', v:items.length, Icon:Package, color:'text-pink-600 bg-pink-50 dark:bg-rose-900/20' },
            { l:'Total Cost', v:formatCurrency(totalCost), Icon:Wallet, color:'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' },
            { l:'Delivered Value', v:formatCurrency(deliveredCost), Icon:CheckCircle, color:'text-green-600 bg-green-50 dark:bg-green-900/20' },
            { l:'Top Vendor', v:topVendor?topVendor[0]:'—', Icon:Store, color:'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
          ].map(({l,v,Icon,color})=>(
            <div key={l} className="bg-white dark:bg-drose-900 border border-gray-200 dark:border-drose-700 rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}><Icon size={20} /></div>
              <p className="text-xl font-bold text-gray-900 dark:text-white truncate">{v}</p>
              <p className="text-xs text-gray-500 mt-1">{l}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Bar Chart */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Cost by Category</h3>
            {catData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={catData} margin={{left:0,right:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{fontSize:10}} interval={0} angle={-20} textAnchor="end" height={50} />
                  <YAxis tickFormatter={v=>'₹'+v.toLocaleString('en-IN')} tick={{fontSize:10}} width={70} />
                  <Tooltip formatter={v=>formatCurrency(v)} />
                  <Bar dataKey="total" radius={[6,6,0,0]}>
                    {catData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-gray-400 py-16 text-sm">No data yet</p>}
          </Card>

          {/* Status Pie */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Cost by Status</h3>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({name,percent})=>name+' '+Math.round(percent*100)+'%'} labelLine={false}>
                    {statusData.map((d,i)=><Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={v=>formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-gray-400 py-16 text-sm">No data yet</p>}
          </Card>
        </div>

        {/* Top 10 Items */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><TrendingDown size={18} className="text-red-500" /> Top 10 Expensive Items</h3>
          <div className="space-y-3">
            {top10.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No items yet</p>}
            {top10.map((item,i)=>{
              const cat = categories.find(c=>c.id===item.categoryId);
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="w-6 text-sm font-bold text-gray-400">#{i+1}</span>
                  <CategoryIcon category={cat || { name: item.name }} size={28} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{cat?.name} · {item.vendor||'—'}</p>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">{formatCurrency(item.totalPrice)}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Vendor Stats */}
        {vendorData.length > 0 && (
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Store size={18} className="text-pink-600" /> Vendor Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={vendorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{fontSize:11}} />
                <YAxis tick={{fontSize:11}} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6,6,0,0]} name="Items" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>
    </div>
  );
}