import { cn } from '../../utils/cn';

export interface SkeletonProps {
  className?: string;
  /** Width preset */
  width?: 'sm' | 'md' | 'lg' | 'full';
  /** Height preset */
  height?: 'xs' | 'sm' | 'md' | 'lg';
}

/** Layout-identical loading placeholder. Must match loaded component dimensions. */
export function Skeleton({ className, width = 'full', height = 'sm' }: SkeletonProps) {
  const widthClasses = { sm: 'w-16', md: 'w-32', lg: 'w-48', full: 'w-full' };
  const heightClasses = { xs: 'h-3', sm: 'h-4', md: 'h-6', lg: 'h-10' };

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading..."
      className={cn(
        'animate-pulse rounded-md bg-[var(--text-muted)]/10',
        widthClasses[width],
        heightClasses[height],
        className,
      )}
    />
  );
}
