import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface KBDProps {
  children: ReactNode;
  className?: string;
}

/** Keyboard shortcut display: renders like ⌘K */
export function KBD({ children, className }: KBDProps) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center rounded-sm border px-1.5 py-0.5',
        'font-mono text-[0.6875rem] leading-none font-medium',
        'border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--text-secondary)]',
        'min-w-[1.25rem] h-5',
        className,
      )}
    >
      {children}
    </kbd>
  );
}
