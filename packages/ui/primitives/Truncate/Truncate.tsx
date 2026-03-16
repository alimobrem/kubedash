import { Check, Copy } from 'lucide-react';
import { useCallback, useState } from 'react';
import { cn } from '../../utils/cn';

export interface TruncateProps {
  /** Full text content */
  children: string;
  /** Max characters before truncating */
  maxLength?: number;
  /** Show copy button on hover */
  copyable?: boolean;
  className?: string;
}

/** Smart text truncation with copy-on-click */
export function Truncate({ children, maxLength = 40, copyable = true, className }: TruncateProps) {
  const [copied, setCopied] = useState(false);
  const truncated = children.length > maxLength;
  const display = truncated ? `${children.slice(0, maxLength)}…` : children;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [children]);

  return (
    <span className={cn('inline-flex items-center gap-1 group', className)} title={children}>
      <span className="truncate">{display}</span>
      {copyable && (
        <button
          type="button"
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-[var(--surface-overlay)] text-[var(--text-muted)] flex-shrink-0"
          aria-label="Copy full text"
        >
          {copied ? (
            <Check size={12} className="text-[var(--status-running)]" />
          ) : (
            <Copy size={12} />
          )}
        </button>
      )}
    </span>
  );
}
