import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  BookOpen,
  CalendarCheck,
  FileText,
  Award,
  Receipt,
  AlertCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { NotificationCategory } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
  onNavigate?: (tab: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onNavigate,
}) => {
  const navigate = (tab: string) => {
    if (typeof onNavigateTab === 'function') {
      onNavigateTab(tab);
    } else if (typeof onNavigate === 'function') {
      onNavigate(tab);
    }
  };

  const {
    scopedNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  if (!isOpen) return null;

  const categoryIcons: Record<NotificationCategory, React.ReactNode> = {
    academic: <BookOpen className="w-4 h-4 text-blue-500" />,
    attendance: <CalendarCheck className="w-4 h-4 text-emerald-500" />,
    homework: <FileText className="w-4 h-4 text-orange-500" />,
    examination: <Award className="w-4 h-4 text-purple-500" />,
    result: <Award className="w-4 h-4 text-indigo-500" />,
    fees: <Receipt className="w-4 h-4 text-teal-500" />,
    notice: <Bell className="w-4 h-4 text-amber-500" />,
    system: <AlertCircle className="w-4 h-4 text-slate-500" />,
    account: <AlertCircle className="w-4 h-4 text-sky-500" />,
  };

  const filteredNotifications = scopedNotifications.filter((n) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !n.isRead;
    return n.category === selectedFilter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                  Notifications
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {scopedNotifications.filter((n) => !n.isRead).length} unread updates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {scopedNotifications.some((n) => !n.isRead) && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="p-1.5 text-xs text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 rounded-lg flex items-center gap-1 font-medium transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Read all</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
            {['all', 'unread', 'homework', 'notice', 'fees', 'result', 'examination'].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-3 py-1 rounded-lg font-semibold capitalize whitespace-nowrap transition-colors ${
                  selectedFilter === f
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 p-2">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-6 text-slate-400">
                <Bell className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No notifications found</p>
                <p className="text-xs text-slate-400 mt-1">You are all caught up with recent updates!</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.isRead) markNotificationAsRead(notif.id);
                    if (notif.link) {
                      navigate(notif.link);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-xl transition-all cursor-pointer relative group flex items-start gap-3 my-1 ${
                    notif.isRead
                      ? 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                      : 'bg-orange-50/60 dark:bg-orange-950/20 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-slate-900 dark:text-slate-100 border border-orange-100 dark:border-orange-900/30'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex-shrink-0 mt-0.5">
                    {categoryIcons[notif.category] || <Bell className="w-4 h-4 text-orange-500" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold truncate leading-snug">{notif.title}</h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-orange-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notif.timestamp}
                      </span>
                      {notif.link && (
                        <span className="text-orange-600 dark:text-orange-400 flex items-center gap-0.5 font-bold group-hover:underline">
                          View details <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity rounded"
                    title="Dismiss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
