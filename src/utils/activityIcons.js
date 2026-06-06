import {
  Plus, Pencil, Trash2, RefreshCw, MessageSquare, FileText, Tag, Dot,
} from 'lucide-react';

// Maps an activity type to a lucide icon + tint colour classes.
export const ACTIVITY_ICONS = {
  item_added:       { Icon: Plus,          color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
  item_updated:     { Icon: Pencil,        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
  item_deleted:     { Icon: Trash2,        color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
  status_changed:   { Icon: RefreshCw,     color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
  comment_added:    { Icon: MessageSquare, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' },
  document_updated: { Icon: FileText,      color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400' },
  category_added:   { Icon: Tag,           color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' },
  default:          { Icon: Dot,           color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400' },
};

export const getActivityIcon = (type) => ACTIVITY_ICONS[type] || ACTIVITY_ICONS.default;
