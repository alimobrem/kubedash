import { cn, RelativeTime, StatusBadge } from '@kubedash/ui';
import { AlertTriangle, BookOpen, Clock, VolumeX, Zap } from 'lucide-react';
import { mockTimeline, mockTriageItems } from '../mock-data';

const severityStyles = {
  critical: {
    icon: '✖',
    color: 'text-[var(--status-failed)]',
    bg: 'bg-[var(--status-failed-bg)]',
    border: 'border-[var(--status-failed)]/20',
    label: 'CRITICAL',
  },
  warning: {
    icon: '▲',
    color: 'text-[var(--status-pending)]',
    bg: 'bg-[var(--status-pending-bg)]',
    border: 'border-[var(--status-pending)]/20',
    label: 'WARNING',
  },
  info: {
    icon: '●',
    color: 'text-[var(--status-creating)]',
    bg: 'bg-[var(--status-creating-bg)]',
    border: 'border-[var(--status-creating)]/20',
    label: 'INFO',
  },
};

const timelineTypeStyles: Record<string, string> = {
  deploy: 'text-[var(--status-creating)]',
  oom: 'text-[var(--status-failed)]',
  restart: 'text-[var(--status-pending)]',
  node: 'text-[var(--status-failed)]',
  evict: 'text-[var(--status-pending)]',
  hpa: 'text-[var(--status-creating)]',
  config: 'text-[var(--text-secondary)]',
};

export function TriagePage() {
  const items = mockTriageItems;
  const timeline = mockTimeline;
  const criticalCount = items.filter((i) => i.severity === 'critical').length;
  const warningCount = items.filter((i) => i.severity === 'warning').length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Zap size={20} className="text-[var(--status-failed)]" />
          <div>
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">
              Triage · {items.length} issues
            </h1>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {criticalCount} critical · {warningCount} warning · Last 30 minutes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-[var(--status-running)]">
            <span className="w-2 h-2 rounded-full bg-[var(--status-running)] animate-pulse" />
            Auto-refresh
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column: Unhealthy Resources */}
        <div className="xl:col-span-2 space-y-6">
          {/* Unhealthy Resources */}
          <section>
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <AlertTriangle size={14} />
              Unhealthy Resources
            </h2>
            <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] divide-y divide-[var(--border-default)]">
              {items.map((item) => {
                const style = severityStyles[item.severity];
                return (
                  <button
                    type="button"
                    key={`${item.kind}-${item.name}`}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-overlay)] transition-colors text-left cursor-pointer"
                  >
                    <span className={cn('text-sm font-bold w-5', style.color)}>{style.icon}</span>
                    <span
                      className={cn(
                        'text-[0.625rem] font-semibold uppercase px-1.5 py-0.5 rounded',
                        style.color,
                        style.bg,
                        'border',
                        style.border,
                      )}
                    >
                      {style.label}
                    </span>
                    <span className="text-xs font-mono text-[var(--text-secondary)]">
                      {item.kind.toLowerCase()}/{item.name}
                    </span>
                    {item.namespace && (
                      <span className="text-[0.625rem] text-[var(--text-muted)]">
                        {item.namespace}
                      </span>
                    )}
                    <span className="text-xs text-[var(--text-primary)] font-medium">
                      {item.reason}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] ml-auto flex-shrink-0">
                      {item.detail}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* What Changed? */}
          <section>
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Clock size={14} />
              What Changed? <span className="text-[var(--text-muted)] font-normal">(last 30 minutes)</span>
            </h2>
            <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] divide-y divide-[var(--border-default)]">
              {timeline.map((event, i) => (
                <div
                  key={`${event.timestamp}-${i}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface-overlay)] transition-colors"
                >
                  <span className="text-[0.625rem] text-[var(--text-muted)] tabular-nums w-12 flex-shrink-0">
                    {new Date(event.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className={cn('text-sm w-4 text-center', timelineTypeStyles[event.type])}>
                    {event.icon}
                  </span>
                  <span className="text-xs text-[var(--text-primary)]">{event.title}</span>
                  <span className="text-xs text-[var(--text-muted)] ml-auto">{event.detail}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right column: Alerts + Pressure */}
        <div className="space-y-6">
          {/* Active Alerts */}
          <section>
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Active Alerts</h2>
            <div className="space-y-2">
              <div className="rounded-lg border border-[var(--status-failed)]/20 bg-[var(--status-failed-bg)] p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[var(--status-failed)]">
                    🔴 CheckoutCrashLooping
                  </span>
                  <button
                    type="button"
                    className="text-[0.625rem] text-[var(--text-muted)] hover:text-[var(--text-secondary)] flex items-center gap-1"
                  >
                    <VolumeX size={10} /> Silence
                  </button>
                </div>
                <div className="text-[0.625rem] text-[var(--text-secondary)]">
                  firing 8m · <a href="#" className="text-[var(--text-link)] hover:underline flex-inline items-center gap-0.5"><BookOpen size={10} className="inline" /> runbook</a>
                </div>
              </div>
              <div className="rounded-lg border border-[var(--status-pending)]/20 bg-[var(--status-pending-bg)] p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[var(--status-pending)]">
                    🟡 HighMemoryPressure
                  </span>
                  <button
                    type="button"
                    className="text-[0.625rem] text-[var(--text-muted)] hover:text-[var(--text-secondary)] flex items-center gap-1"
                  >
                    <VolumeX size={10} /> Silence
                  </button>
                </div>
                <div className="text-[0.625rem] text-[var(--text-secondary)]">
                  firing 3m · node ip-10-0-42-17
                </div>
              </div>
            </div>
          </section>

          {/* Resource Pressure */}
          <section>
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Resource Pressure</h2>
            <div className="space-y-2">
              {[
                { node: 'ip-10-0-42-17', metric: 'CPU', value: 94, status: 'failed' as const },
                { node: 'ip-10-0-38-09', metric: 'MEM', value: 87, status: 'pending' as const },
                { node: 'ip-10-0-55-21', metric: 'DISK', value: 82, status: 'pending' as const },
              ].map((item) => (
                <div
                  key={item.node}
                  className="flex items-center justify-between rounded-md border border-[var(--border-default)] bg-[var(--surface-raised)] px-3 py-2"
                >
                  <span className="text-xs font-mono text-[var(--text-primary)]">{item.node}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[0.625rem] text-[var(--text-muted)]">{item.metric}:</span>
                    <StatusBadge
                      status={item.status}
                      size="sm"
                      showShape={false}
                    >
                      {item.value}%
                    </StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
