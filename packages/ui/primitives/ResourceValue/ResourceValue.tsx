import { cn } from '../../utils/cn';
import { formatCpu, formatMemory } from '../../utils/k8s-formatters';

export interface ResourceValueProps {
  /** Raw K8s value: "250m", "128Mi", "2Gi", "4" */
  value: string;
  /** Resource type determines formatting */
  type: 'cpu' | 'memory';
  className?: string;
}

/** Formats K8s resource values: "250m" → "250m", "128Mi" → "128 MB" */
export function ResourceValue({ value, type, className }: ResourceValueProps) {
  const formatted = type === 'cpu' ? formatCpu(value).display : formatMemory(value).display;

  return (
    <span className={cn('font-mono text-sm text-[var(--text-primary)]', className)}>
      {formatted}
    </span>
  );
}
