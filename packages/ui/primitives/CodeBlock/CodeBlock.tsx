import { Check, Copy } from 'lucide-react';
import { useCallback, useState } from 'react';
import { cn } from '../../utils/cn';

export interface CodeBlockProps {
  /** Code content */
  children: string;
  /** Language for display label */
  language?: 'yaml' | 'json' | 'shell' | 'text';
  /** Show copy button */
  copyable?: boolean;
  /** Max height before scrolling */
  maxHeight?: number;
  className?: string;
}

/** YAML/JSON code block with copy button */
export function CodeBlock({
  children,
  language = 'yaml',
  copyable = true,
  maxHeight = 400,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [children]);

  return (
    <div
      className={cn(
        'relative rounded-md border border-[var(--border-default)] bg-[var(--surface-base)]',
        className,
      )}
    >
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--border-default)]">
        <span className="text-[0.625rem] uppercase tracking-wide text-[var(--text-muted)] font-medium">
          {language}
        </span>
        {copyable && (
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded hover:bg-[var(--surface-overlay)] text-[var(--text-secondary)] transition-colors"
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <Check size={14} className="text-[var(--status-running)]" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        )}
      </div>
      <pre
        className="overflow-auto p-3 text-[0.75rem] leading-5 font-mono text-[var(--text-primary)]"
        style={{ maxHeight }}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}
