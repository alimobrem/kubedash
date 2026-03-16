import { cn } from '../../utils/cn';
import type { K8sStatus } from '../../utils/k8s-status';

const statusColors: Record<K8sStatus, string> = {
  running: 'bg-[var(--status-running)] shadow-[0_0_8px_var(--glow-success)]',
  pending: 'bg-[var(--status-pending)] shadow-[0_0_8px_var(--glow-warning)]',
  failed: 'bg-[var(--status-failed)] shadow-[0_0_8px_var(--glow-danger)]',
  creating: 'bg-[var(--status-creating)] shadow-[0_0_8px_var(--glow-info)]',
  terminating: 'bg-[var(--status-terminating)]',
  unknown: 'bg-[var(--status-unknown)]',
};

export interface HealthDotProps {
  status: K8sStatus;
  /** Pulsing animation for active/live status */
  pulse?: boolean;
  /** Size in pixels */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label */
  label?: string;
  className?: string;
}

export function HealthDot({
  status,
  pulse = status === 'running',
  size = 'md',
  label,
  className,
}: HealthDotProps) {
  const sizeClasses = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
  };

  return (
    <span
      role="status"
      aria-label={label ?? status}
      className={cn(
        'inline-block rounded-full flex-shrink-0 transition-all',
        sizeClasses[size],
        statusColors[status],
        pulse && 'animate-pulse',
        className,
      )}
    />
  );
}
