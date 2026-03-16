import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface EmptyStateProps {
  /** Icon or illustration */
  icon?: ReactNode;
  /** Title */
  title: string;
  /** Description */
  description?: string;
  /** Action buttons */
  actions?: ReactNode;
  className?: string;
}

/** Empty state with illustration and CTAs. Shown when a list has no items. */
export function EmptyState({ icon, title, description, actions, className }: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center py-16 px-8 text-center', className)}
    >
      {icon && (
        <div className="mb-4 text-[var(--text-muted)] [&>svg]:h-12 [&>svg]:w-12">{icon}</div>
      )}
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--text-secondary)] max-w-sm mb-4">{description}</p>
      )}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
