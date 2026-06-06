export const DEFAULT_CATEGORIES = [
  { name: 'Accessories', color: '#3b82f6' },
  { name: 'Medicines', color: '#ef4444' },
  { name: 'Dresses', color: '#8b5cf6' },
  { name: 'Electronics', color: '#f59e0b' },
  { name: 'Documents', color: '#10b981' },
  { name: 'Toiletries', color: '#06b6d4' },
  { name: 'Miscellaneous', color: '#6b7280' },
];

export const DEFAULT_DOCUMENTS = [
  'Passport','Visa','Travel Insurance','Degree Certificates',
  'Mark Sheets','International Driving Permit','Vaccination Records',
  'Employment Documents','Financial Statements','Bank Documents',
  'Emergency Contacts','Passport Photos','Costa Rica Entry Documents',
];

export const ITEM_STATUSES = [
  { value: 'not_purchased', label: 'Not Purchased', dot: 'bg-gray-400', bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-300' },
  { value: 'ordered', label: 'Ordered', dot: 'bg-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-700 dark:text-yellow-400' },
  { value: 'delivered', label: 'Delivered', dot: 'bg-green-500', bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-400' },
  { value: 'cancelled', label: 'Cancelled', dot: 'bg-red-500', bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-700 dark:text-red-400' },
];

export const DOCUMENT_STATUSES = [
  { value: 'missing', label: 'Missing', bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-700 dark:text-red-400' },
  { value: 'in_progress', label: 'In Progress', bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-700 dark:text-yellow-400' },
  { value: 'completed', label: 'Completed', bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-400' },
];

export const VENDORS = ['Amazon','Flipkart','Decathlon','Local Store','Myntra','Nykaa','Other'];
export const PURCHASE_TYPES = ['Online','Shop'];

// Maps a signed-in Google account to its display name.
export const USER_NAMES = {
  'vigneshvelmurugann@gmail.com': 'Vignesh V',
  's.firdousefathima@gmail.com': 'Firdouse Fathima',
};
export const USERS_LIST = ['Vignesh V', 'Firdouse Fathima'];
export const resolveDisplayName = (email) =>
  USER_NAMES[(email || '').toLowerCase()] || email || 'Guest';

export const PRIORITY_LEVELS = ['high','medium','low'];

export const ACTIVITY_TYPES = {
  ITEM_ADDED: 'item_added', ITEM_UPDATED: 'item_updated', ITEM_DELETED: 'item_deleted',
  STATUS_CHANGED: 'status_changed', COMMENT_ADDED: 'comment_added',
  DOCUMENT_UPDATED: 'document_updated', CATEGORY_ADDED: 'category_added',
};