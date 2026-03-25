import { cn } from '@kubedash/ui';
import { Sparkles, X } from 'lucide-react';
import type { PulseAction } from '../stores/pulse';
import { usePulseStore } from '../stores/pulse';

interface PulseInsightCardProps {
  id: string;
  severity?: 'info' | 'warning' | 'critical';
  children: React.ReactNode;
  actions?: PulseAction[];
  dismissible?: boolean;
  className?: string;
}

const severityBorder: Record<string, string> = {
  info: 'border-l-[var(--pulse-accent)]',
  warning: 'border-l-[var(--status-pending)]',
  critical: 'border-l-[var(--status-failed)]',
};

export function PulseInsightCard({
  id,
  severity = 'info',
  children,
  actions,
  dismissible = true,
  className,
}: PulseInsightCardProps) {
  const { dismissInsight, dismissedInsights, openPanel, sendMessage } = usePulseStore();

  if (dismissedInsights[id]) return null;

  const handleAction = (action: PulseAction) => {
    if (action.type === 'navigate') {
      window.location.href = action.payload;
    } else if (action.type === 'execute') {
      sendMessage(action.payload);
    }
  };

  return (
    <div
      className={cn(
        'rounded-lg border border-[var(--border-default)] border-l-[3px] bg-[var(--surface-raised)] p-3',
        severityBorder[severity],
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <Sparkles size={12} className="text-[var(--pulse-accent)] mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold text-[var(--pulse-accent)] uppercase tracking-wider">
            Pulse
          </span>
          <div className="text-xs text-[var(--text-primary)] leading-relaxed mt-1">{children}</div>
          {actions && actions.length > 0 && (
            <div className="flex items-center gap-3 mt-2">
              {actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => handleAction(action)}
                  className="text-xs font-semibold text-[var(--pulse-accent)] hover:underline"
                >
                  {action.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  openPanel();
                }}
                className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline"
              >
                Ask more...
              </button>
            </div>
          )}
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={() => dismissInsight(id)}
            className="p-0.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)] flex-shrink-0"
            aria-label="Dismiss insight"
          >
            <X size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
