import { cn } from '../../utils/cn';

export interface LabelProps {
  /** Label key */
  name: string;
  /** Label value */
  value: string;
  /** Click handler for filter-by-label */
  onClick?: () => void;
  className?: string;
}

/** K8s label pill: `app: payment-api` */
export function Label({ name, value, onClick, className }: LabelProps) {
  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-sm border px-1.5 py-0.5',
        'font-mono text-[0.625rem] leading-tight',
        'border-[var(--border-default)] bg-[var(--surface-raised)]',
        onClick &&
          'cursor-pointer hover:bg-[var(--surface-overlay)] hover:border-[var(--border-strong)] transition-colors',
        className,
      )}
    >
      <span className="text-[var(--text-secondary)]">{name}:</span>
      <span className="text-[var(--text-primary)] ml-1">{value}</span>
    </Component>
  );
}
