import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface FilterChipProps {
  /** Filter label */
  label: string;
  /** Filter value */
  value: string;
  /** Remove handler */
  onRemove: () => void;
  className?: string;
}

/** Removable filter tag: "namespace: payments ×" */
export function FilterChip({ label, value, onRemove, className }: FilterChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5',
        'text-xs font-medium',
        'bg-[var(--interactive-primary)]/10 text-[var(--interactive-primary)]',
        'border border-[var(--interactive-primary)]/20',
        className,
      )}
    >
      <span className="text-[var(--text-secondary)]">{label}:</span>
      <span>{value}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter ${label}: ${value}`}
        className="ml-0.5 rounded-sm hover:bg-[var(--interactive-primary)]/20 p-0.5 transition-colors"
      >
        <X size={12} />
      </button>
    </span>
  );
}
