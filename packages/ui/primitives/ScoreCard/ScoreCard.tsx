import { cn } from '../../utils/cn';

export interface ScoreItem {
  name: string;
  passed: boolean;
}

export interface ScoreCardProps {
  /** Score out of total */
  score: number;
  total: number;
  /** Individual check items */
  items?: ScoreItem[];
  /** Compact mode shows only the score */
  compact?: boolean;
  className?: string;
}

/** Resource maturity scorecard: "8/10" with pass/warn/fail items */
export function ScoreCard({ score, total, items, compact = false, className }: ScoreCardProps) {
  const ratio = total > 0 ? score / total : 0;
  const colorClass =
    ratio >= 0.8
      ? 'text-[var(--scorecard-pass)]'
      : ratio >= 0.5
        ? 'text-[var(--scorecard-warn)]'
        : 'text-[var(--scorecard-fail)]';

  const barColor =
    ratio >= 0.8
      ? 'bg-[var(--scorecard-pass)]'
      : ratio >= 0.5
        ? 'bg-[var(--scorecard-warn)]'
        : 'bg-[var(--scorecard-fail)]';

  if (compact) {
    return (
      <span className={cn('font-semibold text-sm tabular-nums', colorClass, className)}>
        {score}/{total}
      </span>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        <span className={cn('text-lg font-bold tabular-nums', colorClass)}>
          {score}/{total}
        </span>
        <div className="flex-1 h-1.5 bg-[var(--surface-overlay)] rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', barColor)}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
      </div>
      {items && items.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {items.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 text-xs">
              <span
                className={
                  item.passed ? 'text-[var(--scorecard-pass)]' : 'text-[var(--scorecard-fail)]'
                }
              >
                {item.passed ? '✓' : '✗'}
              </span>
              <span
                className={
                  item.passed ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'
                }
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
