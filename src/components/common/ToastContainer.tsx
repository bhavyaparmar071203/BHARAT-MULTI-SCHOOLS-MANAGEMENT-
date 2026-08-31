import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />,
        };

        const bgBorders = {
          success: 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/95 dark:bg-emerald-950/90 text-emerald-950 dark:text-emerald-100',
          error: 'border-rose-200 dark:border-rose-900/60 bg-rose-50/95 dark:bg-rose-950/90 text-rose-950 dark:text-rose-100',
          warning: 'border-amber-200 dark:border-amber-900/60 bg-amber-50/95 dark:bg-amber-950/90 text-amber-950 dark:text-amber-100',
          info: 'border-blue-200 dark:border-blue-900/60 bg-blue-50/95 dark:bg-blue-950/90 text-blue-950 dark:text-blue-100',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-300 ${bgBorders[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 text-sm">
              {toast.title && <p className="font-semibold">{toast.title}</p>}
              <p className="font-medium text-xs leading-relaxed opacity-90">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-70 hover:opacity-100 p-0.5 rounded-md transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
