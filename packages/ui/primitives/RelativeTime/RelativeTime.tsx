import { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import { formatAge } from '../../utils/k8s-formatters';

export interface RelativeTimeProps {
  /** ISO 8601 timestamp */
  timestamp: string;
  /** Update interval in ms (default: 30000 = 30s) */
  updateInterval?: number;
  className?: string;
}

/** Live-updating relative time: "3m ago" with absolute time tooltip */
export function RelativeTime({ timestamp, updateInterval = 30_000, className }: RelativeTimeProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval]);

  const absolute = new Date(timestamp).toLocaleString();
  const relative = formatAge(timestamp);

  return (
    <time
      dateTime={timestamp}
      title={absolute}
      className={cn('text-[var(--text-secondary)] tabular-nums cursor-default', className)}
    >
      {relative} ago
    </time>
  );
}
