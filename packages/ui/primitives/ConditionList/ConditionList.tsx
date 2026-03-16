import { cn } from '../../utils/cn';

export interface K8sCondition {
  type: string;
  status: 'True' | 'False' | 'Unknown';
  reason?: string;
  message?: string;
  lastTransitionTime?: string;
}

export interface ConditionListProps {
  conditions: K8sCondition[];
  /** Compact mode shows only type + status icon */
  compact?: boolean;
  className?: string;
}

/** K8s conditions list (Ready, Initialized, PodScheduled) with status/reason/message */
export function ConditionList({ conditions, compact = false, className }: ConditionListProps) {
  if (conditions.length === 0) {
    return <span className="text-sm text-[var(--text-muted)]">No conditions</span>;
  }

  if (compact) {
    return (
      <div className={cn('flex flex-wrap gap-1.5', className)}>
        {conditions.map((c) => (
          <span
            key={c.type}
            className={cn(
              'inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[0.6875rem] font-medium border',
              c.status === 'True'
                ? 'text-[var(--status-running)] border-[var(--status-running)]/20 bg-[var(--status-running-bg)]'
                : c.status === 'False'
                  ? 'text-[var(--status-failed)] border-[var(--status-failed)]/20 bg-[var(--status-failed-bg)]'
                  : 'text-[var(--status-unknown)] border-[var(--status-unknown)]/20 bg-[var(--status-unknown-bg)]',
            )}
            title={c.message || c.reason}
          >
            <span>{c.status === 'True' ? '✓' : c.status === 'False' ? '✗' : '?'}</span>
            {c.type}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {conditions.map((c) => (
        <div
          key={c.type}
          className={cn(
            'rounded-md border px-3 py-2',
            c.status === 'True'
              ? 'border-[var(--status-running)]/20 bg-[var(--status-running-bg)]'
              : c.status === 'False'
                ? 'border-[var(--status-failed)]/20 bg-[var(--status-failed-bg)]'
                : 'border-[var(--border-default)] bg-[var(--surface-raised)]',
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-sm font-semibold',
                  c.status === 'True'
                    ? 'text-[var(--status-running)]'
                    : c.status === 'False'
                      ? 'text-[var(--status-failed)]'
                      : 'text-[var(--text-secondary)]',
                )}
              >
                {c.status === 'True' ? '✓' : c.status === 'False' ? '✗' : '?'} {c.type}
              </span>
            </div>
            {c.lastTransitionTime && (
              <span className="text-[0.625rem] text-[var(--text-muted)] tabular-nums">
                {new Date(c.lastTransitionTime).toLocaleString()}
              </span>
            )}
          </div>
          {c.reason && (
            <div className="mt-1 text-xs text-[var(--text-secondary)]">Reason: {c.reason}</div>
          )}
          {c.message && (
            <div className="mt-0.5 text-xs text-[var(--text-muted)] break-words">{c.message}</div>
          )}
        </div>
      ))}
    </div>
  );
}
