import {
  CostBadge,
  cn,
  HealthDot,
  type K8sStatus,
  RelativeTime,
  ScoreCard,
  Sparkline,
  StatusBadge,
} from '@kubedash/ui';

export interface ServiceCardData {
  name: string;
  version: string;
  status: K8sStatus;
  owner: string;
  namespace: string;
  replicas: { ready: number; desired: number };
  cpu: { current: number; history: number[] };
  memory: { current: number; history: number[] };
  cost?: { monthly: number; trend?: 'up' | 'down' | 'flat'; trendPercent?: number };
  maturity?: { score: number; total: number };
  lastDeploy?: string;
}

interface ServiceCardProps {
  service: ServiceCardData;
  onClick?: () => void;
  className?: string;
}

export function ServiceCard({ service, onClick, className }: ServiceCardProps) {
  const isHealthy =
    service.status === 'running' && service.replicas.ready === service.replicas.desired;
  const isDegraded =
    service.status === 'running' && service.replicas.ready < service.replicas.desired;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-left rounded-lg border transition-all duration-200',
        'bg-[var(--surface-raised)] hover:bg-[var(--surface-overlay)]',
        'border-[var(--border-default)] hover:border-[var(--border-strong)]',
        'hover:shadow-[var(--shadow-raised)]',
        'p-4 group cursor-pointer',
        // Glow on status transition
        service.status === 'failed' && 'shadow-[0_0_12px_var(--glow-danger)]',
        className,
      )}
    >
      {/* Header: name + status + version */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <HealthDot status={service.status} size="md" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {service.name}
          </h3>
        </div>
        <span className="text-[0.6875rem] font-mono text-[var(--text-muted)] flex-shrink-0 ml-2">
          {service.version}
        </span>
      </div>

      {/* Status badges */}
      <div className="flex items-center gap-1.5 mb-3">
        <StatusBadge status={service.status} size="sm" />
        {isDegraded && (
          <StatusBadge status="pending" size="sm">
            {service.replicas.ready}/{service.replicas.desired} ready
          </StatusBadge>
        )}
        {isHealthy && (
          <span className="text-[0.625rem] text-[var(--text-muted)]">
            {service.replicas.ready}/{service.replicas.desired} rdy
          </span>
        )}
      </div>

      {/* Owner + Cost */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[var(--text-secondary)]">{service.owner}</span>
        {service.cost && (
          <CostBadge
            monthlyCost={service.cost.monthly}
            trend={service.cost.trend}
            trendPercent={service.cost.trendPercent}
          />
        )}
      </div>

      {/* Metrics: CPU + Memory sparklines */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[0.625rem] text-[var(--text-muted)]">CPU</span>
            <span className="text-xs font-semibold text-[var(--metric-cpu)] tabular-nums">
              {service.cpu.current}%
            </span>
          </div>
          <Sparkline data={service.cpu.history} color="cpu" width={100} height={20} filled />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[0.625rem] text-[var(--text-muted)]">MEM</span>
            <span className="text-xs font-semibold text-[var(--metric-memory)] tabular-nums">
              {service.memory.current}%
            </span>
          </div>
          <Sparkline data={service.memory.history} color="memory" width={100} height={20} filled />
        </div>
      </div>

      {/* Footer: maturity + last deploy */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-default)]">
        {service.maturity && (
          <ScoreCard score={service.maturity.score} total={service.maturity.total} compact />
        )}
        {service.lastDeploy && (
          <div className="text-[0.625rem] text-[var(--text-muted)]">
            Deployed <RelativeTime timestamp={service.lastDeploy} />
          </div>
        )}
      </div>
    </button>
  );
}
