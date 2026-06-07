import React from 'react';
import { motion } from 'framer-motion';
import { Truck, AlertTriangle, CheckCircle } from 'lucide-react';
import { TopBar } from '../components/Layout/TopBar';
import { CategoryIcon } from '../components/UI/CategoryIcon';
import { useItems } from '../hooks/useItems';
import { useCategories } from '../hooks/useCategories';
import { formatCurrency } from '../utils/formatters';

export default function DeliveryTracker() {
  const { items } = useItems();
  const { categories } = useCategories();

  const ordered = items.filter(i => i.status === 'ordered');
  const delivered = items.filter(i => i.status === 'delivered');

  const today = new Date();
  const isLate = (item) => {
    if (!item.deliveryDate) return false;
    return new Date(item.deliveryDate) < today;
  };

  const Section = ({ title, icon: Icon, items: list, color }) => (
    <div>
      <div className={`flex items-center gap-2 mb-3`}>
        <Icon size={18} className={color} />
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span className="text-xs bg-gray-100 dark:bg-drose-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{list.length}</span>
      </div>
      {list.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8 bg-gray-50 dark:bg-drose-900 rounded-2xl border border-dashed border-gray-200 dark:border-drose-700">No items in this section</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((item, i) => {
            const cat = categories.find(c => c.id === item.categoryId);
            const late = isLate(item) && item.status === 'ordered';
            return (
              <motion.div key={item.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.05 }}
                className={`bg-white dark:bg-drose-900 border rounded-2xl p-5 ${late ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-drose-700'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CategoryIcon category={cat || { name: item.name }} size={36} />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">{item.name}</p>
                      <p className="text-xs text-gray-500">{cat?.name}</p>
                    </div>
                  </div>
                  {late && <span className="flex items-center gap-1 text-xs text-red-600 font-medium"><AlertTriangle size={12}/> Late</span>}
                </div>
                <div className="space-y-1.5 text-xs text-gray-500">
                  {item.vendor && <div className="flex justify-between"><span>Vendor</span><span className="font-medium text-gray-700 dark:text-gray-300">{item.vendor}</span></div>}
                  {item.orderedDate && <div className="flex justify-between"><span>Ordered</span><span className="font-medium text-gray-700 dark:text-gray-300">{item.orderedDate}</span></div>}
                  {item.deliveryDate && <div className="flex justify-between"><span>Expected</span><span className={`font-medium ${late ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'}`}>{item.deliveryDate}</span></div>}
                  <div className="flex justify-between"><span>Amount</span><span className="font-bold text-gray-900 dark:text-white">{formatCurrency(item.totalPrice)}</span></div>
                </div>
                {item.purchaseUrl && (
                  <a href={item.purchaseUrl} target="_blank" rel="noreferrer"
                    className="mt-3 block text-center text-xs text-pink-600 hover:underline">Track Order</a>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <TopBar title="Delivery Tracker"
        subtitle={`${ordered.length} ordered · ${delivered.length} delivered · ${ordered.filter(isLate).length} late`} />
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { l:'Ordered', v:ordered.length, Icon:Truck, color:'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' },
            { l:'Delivered', v:delivered.length, Icon:CheckCircle, color:'text-green-600 bg-green-50 dark:bg-green-900/20' },
            { l:'Late', v:ordered.filter(isLate).length, Icon:AlertTriangle, color:'text-red-600 bg-red-50 dark:bg-red-900/20' },
          ].map(({l,v,Icon,color})=>(
            <div key={l} className="bg-white dark:bg-drose-900 border border-gray-200 dark:border-drose-700 rounded-2xl p-4 text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${color}`}><Icon size={20} /></div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{v}</p>
              <p className="text-xs text-gray-500">{l}</p>
            </div>
          ))}
        </div>
        <Section title="Ordered / In Transit" icon={Truck} items={ordered} color="text-yellow-600" />
        <Section title="Delivered" icon={CheckCircle} items={delivered} color="text-green-600" />
      </div>
    </div>
  );
}