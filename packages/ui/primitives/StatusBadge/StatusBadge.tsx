import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import type { K8sStatus } from '../../utils/k8s-status';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md font-semibold transition-colors whitespace-nowrap',
  {
    variants: {
      status: {
        running:
          'bg-[var(--status-running-bg)] text-[var(--status-running)] border border-[var(--status-running)]/20',
        pending:
          'bg-[var(--status-pending-bg)] text-[var(--status-pending)] border border-[var(--status-pending)]/20',
        failed:
          'bg-[var(--status-failed-bg)] text-[var(--status-failed)] border border-[var(--status-failed)]/20',
        creating:
          'bg-[var(--status-creating-bg)] text-[var(--status-creating)] border border-[var(--status-creating)]/20',
        terminating:
          'bg-[var(--status-terminating-bg)] text-[var(--status-terminating)] border border-[var(--status-terminating)]/20',
        unknown:
          'bg-[var(--status-unknown-bg)] text-[var(--status-unknown)] border border-[var(--status-unknown)]/20',
      },
      variant: {
        filled: '',
        outline: 'bg-transparent',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-[0.6875rem] leading-4',
        md: 'px-2 py-0.5 text-xs leading-5',
        lg: 'px-2.5 py-1 text-sm leading-5',
      },
    },
    defaultVariants: {
      size: 'sm',
      variant: 'filled',
    },
  },
);

/** Shape icon for accessible status indication (not color-only per WCAG 2.2) */
function StatusShape({ status }: { status: K8sStatus }) {
  const size = 8;
  const common = { width: size, height: size, 'aria-hidden': true, role: 'img' } as const;

  switch (status) {
    case 'running':
      return (
        <svg {...common} viewBox="0 0 8 8">
          <title>Running</title>
          <circle cx="4" cy="4" r="3.5" fill="currentColor" />
        </svg>
      );
    case 'pending':
      return (
        <svg {...common} viewBox="0 0 8 8">
          <title>Pending</title>
          <polygon points="4,0.5 7.5,7.5 0.5,7.5" fill="currentColor" />
        </svg>
      );
    case 'failed':
      return (
        <svg {...common} viewBox="0 0 8 8">
          <title>Failed</title>
          <rect x="0.5" y="0.5" width="7" height="7" fill="currentColor" />
        </svg>
      );
    case 'unknown':
      return (
        <svg {...common} viewBox="0 0 8 8">
          <title>Unknown</title>
          <polygon points="4,0 8,4 4,8 0,4" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg {...common} viewBox="0 0 8 8">
          <title>Status</title>
          <circle cx="4" cy="4" r="3.5" fill="currentColor" />
        </svg>
      );
  }
}

export interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  status: K8sStatus;
  /** Override the default label */
  children?: ReactNode;
  /** Show shape icon for accessible status (default: true) */
  showShape?: boolean;
  /** Pulse animation for active alerts */
  pulse?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  children,
  showShape = true,
  pulse = false,
  size,
  variant,
  className,
}: StatusBadgeProps) {
  const label =
    children ??
    {
      running: 'Running',
      pending: 'Pending',
      failed: 'Failed',
      creating: 'Creating',
      terminating: 'Terminating',
      unknown: 'Unknown',
    }[status];

  return (
    <span
      role="status"
      className={cn(badgeVariants({ status, size, variant }), pulse && 'animate-pulse', className)}
    >
      {showShape && <StatusShape status={status} />}
      {label}
    </span>
  );
}
