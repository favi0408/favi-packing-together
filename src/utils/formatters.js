export const formatCurrency = (amount, currency = 'INR') => {
  const symbols = { INR: '₹', USD: '$', CRC: '₡' };
  return (symbols[currency] || currency) + Number(amount || 0).toLocaleString('en-IN');
};

export const formatDate = (ts) => {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatRelativeTime = (ts) => {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Date.now() - d;
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), day = Math.floor(diff / 86400000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  if (h < 24) return h + 'h ago';
  return day + 'd ago';
};

export const getStatusConfig = (status) => {
  const map = {
    not_purchased: { label:'Not Purchased', bg:'bg-gray-100 dark:bg-gray-800', text:'text-gray-600 dark:text-gray-300', dot:'bg-gray-400' },
    ordered: { label:'Ordered', bg:'bg-yellow-100 dark:bg-yellow-900/40', text:'text-yellow-700 dark:text-yellow-400', dot:'bg-yellow-400' },
    delivered: { label:'Delivered', bg:'bg-green-100 dark:bg-green-900/40', text:'text-green-700 dark:text-green-400', dot:'bg-green-500' },
    cancelled: { label:'Cancelled', bg:'bg-red-100 dark:bg-red-900/40', text:'text-red-700 dark:text-red-400', dot:'bg-red-500' },
    missing: { label:'Missing', bg:'bg-red-100 dark:bg-red-900/40', text:'text-red-700 dark:text-red-400', dot:'bg-red-500' },
    in_progress: { label:'In Progress', bg:'bg-yellow-100 dark:bg-yellow-900/40', text:'text-yellow-700 dark:text-yellow-400', dot:'bg-yellow-400' },
    completed: { label:'Completed', bg:'bg-green-100 dark:bg-green-900/40', text:'text-green-700 dark:text-green-400', dot:'bg-green-500' },
  };
  return map[status] || map.not_purchased;
};