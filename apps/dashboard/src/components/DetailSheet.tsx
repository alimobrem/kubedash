import { cn } from '@kubedash/ui';
import { X } from 'lucide-react';
import { type ReactNode, useCallback, useEffect } from 'react';

interface DetailSheetProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Action buttons in the header */
  actions?: ReactNode;
  children: ReactNode;
  /** Width in pixels */
  width?: number;
}

export function DetailSheet({
  open,
  onClose,
  title,
  subtitle,
  actions,
  children,
  width = 480,
}: DetailSheetProps) {
  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-[var(--z-overlay)] transition-opacity duration-200',
          open ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : 'Detail panel'}
        className={cn(
          'fixed top-0 right-0 bottom-0 z-[var(--z-drawer)] flex flex-col',
          'bg-[var(--surface-raised)] border-l border-[var(--border-default)]',
          'shadow-[var(--shadow-floating)]',
          'transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        style={{ width }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-[var(--border-default)] flex-shrink-0">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[var(--text-primary)] truncate">{title}</div>
            {subtitle && (
              <div className="text-xs text-[var(--text-secondary)] mt-0.5">{subtitle}</div>
            )}
          </div>
          <div className="flex items-center gap-2 ml-3 flex-shrink-0">
            {actions}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md hover:bg-[var(--surface-overlay)] text-[var(--text-muted)] transition-colors"
              aria-label="Close panel"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </aside>
    </>
  );
}
