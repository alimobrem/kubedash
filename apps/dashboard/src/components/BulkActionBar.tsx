import { cn } from '@kubedash/ui';
import { ShieldOff, Tag, Trash2, X } from 'lucide-react';

interface BulkActionBarProps {
  count: number;
  resourceKind: string;
  onCordon?: () => void;
  onDrain?: () => void;
  onDelete?: () => void;
  onLabel?: () => void;
  onClear: () => void;
}

/** Floating action bar when resources are selected */
export function BulkActionBar({
  count,
  resourceKind,
  onCordon,
  onDrain,
  onDelete,
  onLabel,
  onClear,
}: BulkActionBarProps) {
  if (count === 0) return null;

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-[var(--z-modal)]',
        'flex items-center gap-3 px-5 py-3 rounded-xl',
        'bg-[var(--surface-floating)] border border-[var(--border-strong)]',
        'shadow-[var(--shadow-modal)]',
        'animate-[slideUp_200ms_cubic-bezier(0.32,0.72,0,1)]',
      )}
    >
      <span className="text-sm font-semibold text-[var(--text-primary)]">
        {count} {resourceKind}
        {count > 1 ? 's' : ''} selected
      </span>

      <div className="w-px h-5 bg-[var(--border-default)]" />

      {onCordon && (
        <button
          type="button"
          onClick={onCordon}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] transition-colors"
        >
          <ShieldOff size={14} />
          Cordon
        </button>
      )}
      {onDrain && (
        <button
          type="button"
          onClick={onDrain}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] transition-colors"
        >
          Drain
        </button>
      )}
      {onLabel && (
        <button
          type="button"
          onClick={onLabel}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] transition-colors"
        >
          <Tag size={14} />
          Label
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--status-failed)]/30 text-[var(--status-failed)] hover:bg-[var(--status-failed-bg)] transition-colors"
        >
          <Trash2 size={14} />
          Delete
        </button>
      )}

      <div className="w-px h-5 bg-[var(--border-default)]" />

      <button
        type="button"
        onClick={onClear}
        className="p-1 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        aria-label="Clear selection"
      >
        <X size={16} />
      </button>

      <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(100%); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
