import { cn } from '@kubedash/ui';
import { CheckCircle, X, XCircle, AlertTriangle, Info } from 'lucide-react';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  action?: { label: string; onClick: () => void };
  duration?: number;
}

interface ToastContextValue {
  toast: (message: string, opts?: { variant?: ToastVariant; action?: Toast['action']; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const icons: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle size={16} className="text-[var(--status-running)]" />,
  error: <XCircle size={16} className="text-[var(--status-failed)]" />,
  warning: <AlertTriangle size={16} className="text-[var(--status-pending)]" />,
  info: <Info size={16} className="text-[var(--status-creating)]" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (
      message: string,
      opts?: { variant?: ToastVariant; action?: Toast['action']; duration?: number },
    ) => {
      const id = `${Date.now()}-${Math.random()}`;
      const duration = opts?.duration ?? (opts?.action ? 8000 : 4000);
      const toast: Toast = { id, message, variant: opts?.variant ?? 'info', action: opts?.action };

      setToasts((prev) => [...prev, toast]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[var(--z-toast)] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-[var(--shadow-floating)]',
              'bg-[var(--surface-floating)] border-[var(--border-default)]',
              'animate-[slideIn_200ms_ease-out]',
            )}
          >
            {icons[t.variant]}
            <span className="text-sm text-[var(--text-primary)] flex-1">{t.message}</span>
            {t.action && (
              <button
                type="button"
                onClick={() => {
                  t.action?.onClick();
                  removeToast(t.id);
                }}
                className="text-xs font-semibold text-[var(--interactive-primary)] hover:underline flex-shrink-0"
              >
                {t.action.label}
              </button>
            )}
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="p-0.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)] flex-shrink-0"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
