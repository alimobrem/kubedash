import { cn } from '../../utils/cn';

const colorMap = {
  cpu: 'var(--metric-cpu)',
  memory: 'var(--metric-memory)',
  storage: 'var(--metric-storage)',
  network: 'var(--metric-network)',
  success: 'var(--status-running)',
  warning: 'var(--status-pending)',
  danger: 'var(--status-failed)',
  default: 'var(--text-secondary)',
} as const;

export interface ProgressRingProps {
  /** Percentage value (0-100) */
  value: number;
  /** Ring size in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Color variant */
  color?: keyof typeof colorMap;
  /** Auto-color based on thresholds (green < 70, yellow 70-85, red > 85) */
  autoColor?: boolean;
  /** Show percentage label in center */
  showLabel?: boolean;
  className?: string;
}

/** SVG circular progress indicator for utilization metrics */
export function ProgressRing({
  value,
  size = 48,
  strokeWidth = 4,
  color = 'default',
  autoColor = false,
  showLabel = true,
  className,
}: ProgressRingProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  let resolvedColor = colorMap[color];
  if (autoColor) {
    if (clamped >= 85) resolvedColor = colorMap.danger;
    else if (clamped >= 70) resolvedColor = colorMap.warning;
    else resolvedColor = colorMap.success;
  }

  return (
    <div className={cn('inline-flex items-center justify-center relative', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${Math.round(clamped)}% utilization`}
      >
        <title>{`${Math.round(clamped)}%`}</title>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-overlay)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={resolvedColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>
      {showLabel && (
        <span
          className="absolute text-[0.625rem] font-semibold tabular-nums"
          style={{ color: resolvedColor }}
        >
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
