import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, ExternalLink, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { getStatusConfig, formatCurrency, formatDate } from '../../utils/formatters';
import { Badge } from '../UI/Badge';
import { CategoryIcon } from '../UI/CategoryIcon';

const PRIORITY_COLORS = { high: 'danger', medium: 'warning', low: 'success' };

export const ItemCard = ({ item, categories = [], onEdit, onDelete, onStatusChange }) => {
  const [expanded, setExpanded] = useState(false);
  const status = getStatusConfig(item.status);
  const category = categories.find(c => c.id === item.categoryId);

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-drose-900 border border-gray-200 dark:border-drose-700 rounded-2xl overflow-hidden hover:border-pink-300 dark:hover:border-pink-700 transition-all group">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {category && <CategoryIcon category={category} size={24} />}
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">{item.name}</h3>
              {item.priority && <Badge variant={PRIORITY_COLORS[item.priority]}>{item.priority}</Badge>}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
              {category && <span className="text-xs text-gray-500 dark:text-gray-400">{category.name}</span>}
              {item.vendor && <span className="text-xs text-gray-400">• {item.vendor}</span>}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(item.totalPrice)}</p>
            <p className="text-xs text-gray-500">{item.quantity} × {formatCurrency(item.unitPrice)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-drose-700">
          <div className="flex items-center gap-1">
            <select value={item.status} onChange={e => onStatusChange(item.id, e.target.value, item)}
              className="text-xs px-2 py-1 border border-gray-200 dark:border-drose-600 rounded-lg bg-white dark:bg-drose-800 text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-1 focus:ring-pink-500">
              <option value="not_purchased">Not Purchased</option>
              <option value="ordered">Ordered</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setExpanded(p => !p)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            {item.purchaseUrl && (
              <a href={item.purchaseUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                <ExternalLink size={15} />
              </a>
            )}
            <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg hover:bg-pink-50 dark:hover:bg-rose-900/20 text-pink-600">
              <Edit2 size={15} />
            </button>
            <button onClick={() => onDelete(item.id, item.name)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            className="mt-3 pt-3 border-t border-gray-100 dark:border-drose-700 space-y-2">
            {item.addedBy && <p className="text-xs text-gray-500">Added by: <span className="font-medium text-gray-700 dark:text-gray-300">{item.addedBy}</span></p>}
            {item.orderedDate && <p className="text-xs text-gray-500">Ordered: <span className="font-medium text-gray-700 dark:text-gray-300">{item.orderedDate}</span></p>}
            {item.deliveryDate && <p className="text-xs text-gray-500">Expected delivery: <span className="font-medium text-gray-700 dark:text-gray-300">{item.deliveryDate}</span></p>}
            {item.notes && <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-drose-800 rounded-lg p-2">{item.notes}</p>}
            {item.createdAt && <p className="text-xs text-gray-400">Added {formatDate(item.createdAt)}</p>}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};