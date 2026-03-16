import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

export interface BreadcrumbTrailProps {
  items: BreadcrumbItem[];
  /** Click handler for breadcrumb navigation */
  onNavigate?: (href: string) => void;
  className?: string;
}

/** Breadcrumb: Cluster > Namespace > Deployment > ReplicaSet > Pod > Container */
export function BreadcrumbTrail({ items, onNavigate, className }: BreadcrumbTrailProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1', className)}>
      <ol className="flex items-center gap-1">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight
                  size={14}
                  className="text-[var(--text-muted)] flex-shrink-0"
                  aria-hidden
                />
              )}
              {item.href && !isLast && onNavigate ? (
                <button
                  type="button"
                  onClick={() => onNavigate(item.href!)}
                  className="flex items-center gap-1 text-xs text-[var(--text-link)] hover:text-[var(--text-link-hover)] hover:underline transition-colors"
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  {item.label}
                </button>
              ) : (
                <span
                  className={cn(
                    'flex items-center gap-1 text-xs',
                    isLast
                      ? 'text-[var(--text-primary)] font-medium'
                      : 'text-[var(--text-secondary)]',
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
