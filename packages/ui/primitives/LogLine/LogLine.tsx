import { cn } from '../../utils/cn';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';

const levelColors: Record<LogLevel, string> = {
  error: 'text-[var(--status-failed)]',
  warn: 'text-[var(--status-pending)]',
  info: 'text-[var(--status-creating)]',
  debug: 'text-[var(--text-secondary)]',
  trace: 'text-[var(--text-muted)]',
};

const levelBgColors: Record<LogLevel, string> = {
  error: 'bg-[var(--status-failed)]/5',
  warn: 'bg-[var(--status-pending)]/5',
  info: '',
  debug: '',
  trace: '',
};

export interface LogLineProps {
  /** Timestamp string */
  timestamp?: string;
  /** Log level */
  level?: LogLevel;
  /** Log message content */
  message: string;
  /** Line number */
  lineNumber?: number;
  /** Highlight this line */
  highlighted?: boolean;
  className?: string;
}

/** Single log entry with timestamp, level coloring, and line number */
export function LogLine({
  timestamp,
  level = 'info',
  message,
  lineNumber,
  highlighted = false,
  className,
}: LogLineProps) {
  return (
    <div
      className={cn(
        'flex gap-2 px-3 py-0.5 font-mono text-[0.6875rem] leading-5',
        'hover:bg-[var(--surface-overlay)]/50',
        levelBgColors[level],
        highlighted && 'bg-[var(--status-pending)]/10 border-l-2 border-[var(--status-pending)]',
        className,
      )}
    >
      {lineNumber !== undefined && (
        <span className="text-[var(--text-muted)] select-none w-8 text-right tabular-nums flex-shrink-0">
          {lineNumber}
        </span>
      )}
      {timestamp && (
        <span className="text-[var(--text-muted)] flex-shrink-0 tabular-nums">{timestamp}</span>
      )}
      {level && (
        <span className={cn('uppercase w-7 flex-shrink-0 font-semibold', levelColors[level])}>
          {level.slice(0, 4)}
        </span>
      )}
      <span className="text-[var(--text-primary)] break-all whitespace-pre-wrap">{message}</span>
    </div>
  );
}
