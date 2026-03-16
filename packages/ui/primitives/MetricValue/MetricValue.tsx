import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

const colorMap = {
  cpu: 'text-[var(--metric-cpu)]',
  memory: 'text-[var(--metric-memory)]',
  storage: 'text-[var(--metric-storage)]',
  network: 'text-[var(--metric-network)]',
  default: 'text-[var(--text-primary)]',
} as const;

export interface MetricValueProps {
  /** Numeric value to display */
  value: number | string;
  /** Unit label (%, cores, GB, Mbps) */
  unit?: string;
  /** Optional label above the value */
  label?: string;
  /** Optional icon displayed before the label */
  icon?: ReactNode;
  /** Semantic color */
  color?: keyof typeof colorMap;
  /** Trend indicator */
  trend?: 'up' | 'down' | 'flat';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MetricValue({
  value,
  unit,
  label,
  icon,
  color = 'default',
  trend,
  size = 'md',
  className,
}: MetricValueProps) {
  const sizeClasses = {
    sm: { value: 'text-sm font-semibold', label: 'text-[0.625rem]', unit: 'text-[0.625rem]' },
    md: { value: 'text-xl font-bold', label: 'text-xs', unit: 'text-xs' },
    lg: { value: 'text-3xl font-bold', label: 'text-sm', unit: 'text-sm' },
  };

  const trendIcon = {
    up: '↑',
    down: '↓',
    flat: '→',
  };

  const trendColor = {
    up: 'text-[var(--status-failed)]',
    down: 'text-[var(--status-running)]',
    flat: 'text-[var(--text-muted)]',
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {(label || icon) && (
        <div
          className={cn(
            'flex items-center gap-1 mb-0.5',
            sizeClasses[size].label,
            'text-[var(--text-secondary)]',
          )}
        >
          {icon && <span className={cn(colorMap[color], 'flex-shrink-0')}>{icon}</span>}
          {label && <span className="font-medium">{label}</span>}
        </div>
      )}
      <div className="flex items-baseline gap-1">
        <span className={cn(sizeClasses[size].value, colorMap[color])}>{value}</span>
        {unit && (
          <span className={cn(sizeClasses[size].unit, 'text-[var(--text-muted)]')}>{unit}</span>
        )}
        {trend && (
          <span className={cn('text-xs font-medium', trendColor[trend])}>{trendIcon[trend]}</span>
        )}
      </div>
    </div>
  );
}
