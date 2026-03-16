import { cn } from '../../utils/cn';

export interface CostBadgeProps {
  /** Monthly cost in dollars */
  monthlyCost: number;
  /** Trend vs previous period */
  trend?: 'up' | 'down' | 'flat';
  /** Trend percentage */
  trendPercent?: number;
  className?: string;
}

/** Contextual cost badge: "$147/mo ↑12%" */
export function CostBadge({ monthlyCost, trend, trendPercent, className }: CostBadgeProps) {
  const formatted =
    monthlyCost >= 1000
      ? `$${(monthlyCost / 1000).toFixed(1)}k`
      : `$${monthlyCost.toFixed(monthlyCost < 10 ? 2 : 0)}`;

  const trendColor = {
    up: 'text-[var(--status-failed)]',
    down: 'text-[var(--status-running)]',
    flat: 'text-[var(--text-muted)]',
  };

  const trendArrow = { up: '↑', down: '↓', flat: '→' };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs text-[var(--text-secondary)]',
        className,
      )}
    >
      <span className="font-medium tabular-nums">{formatted}/mo</span>
      {trend && trendPercent !== undefined && (
        <span className={cn('text-[0.625rem] tabular-nums', trendColor[trend])}>
          {trendArrow[trend]}
          {trendPercent}%
        </span>
      )}
    </span>
  );
}
