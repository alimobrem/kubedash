import { MetricValue, cn, formatPercent } from '@kubedash/ui';
import { ArrowDown, ArrowUp, DollarSign, FileDown, Lightbulb, TrendingUp, Zap } from 'lucide-react';

interface TeamCost {
  team: string;
  monthly: number;
  budget?: number;
  trend: number;
}

interface ServiceCost {
  name: string;
  team: string;
  monthly: number;
  cpuReq: string;
  cpuUsed: string;
  efficiency: number;
}

const teamCosts: TeamCost[] = [
  { team: 'payments', monthly: 6200, budget: 5500, trend: 22 },
  { team: 'identity', monthly: 4100, trend: 5 },
  { team: 'platform', monthly: 3800, trend: -3 },
  { team: 'orders', monthly: 3200, trend: 8 },
  { team: 'data', monthly: 2900, trend: 15 },
  { team: 'frontend', monthly: 2100, trend: -2 },
  { team: 'ml-team', monthly: 2050, trend: 12 },
];

const serviceCosts: ServiceCost[] = [
  { name: 'order-processor', team: 'payments', monthly: 2800, cpuReq: '8 cores', cpuUsed: '3.2 cores', efficiency: 40 },
  { name: 'ml-pipeline', team: 'ml-team', monthly: 2050, cpuReq: '16 cores', cpuUsed: '12 cores', efficiency: 75 },
  { name: 'payment-worker', team: 'payments', monthly: 1900, cpuReq: '4 cores', cpuUsed: '0.5 cores', efficiency: 12 },
  { name: 'user-db', team: 'identity', monthly: 1700, cpuReq: '2 cores', cpuUsed: '1.8 cores', efficiency: 90 },
  { name: 'api-gateway', team: 'platform', monthly: 1500, cpuReq: '4 cores', cpuUsed: '2.1 cores', efficiency: 53 },
];

const totalSpend = teamCosts.reduce((s, t) => s + t.monthly, 0);
const maxTeamCost = Math.max(...teamCosts.map((t) => t.monthly));

export function CostPage() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">Cost Overview</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">March 2026 · All clusters</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-overlay)] transition-colors"
        >
          <FileDown size={14} /> Export
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-[var(--interactive-primary)]" />
            <span className="text-xs text-[var(--text-secondary)]">Total Spend</span>
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">
            ${(totalSpend / 1000).toFixed(1)}k
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-[var(--status-failed)]">
            <ArrowUp size={12} /> 8% vs Feb
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-[var(--text-secondary)]" />
            <span className="text-xs text-[var(--text-secondary)]">Projected</span>
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">$31.2k</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">month-end estimate</div>
        </div>
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-[var(--status-pending)]" />
            <span className="text-xs text-[var(--text-secondary)]">Efficiency</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-[var(--text-primary)]">72%</div>
            <div className="flex-1 h-2 bg-[var(--surface-overlay)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--status-pending)] rounded-full" style={{ width: '72%' }} />
            </div>
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-1">utilized vs allocated</div>
        </div>
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} className="text-[var(--status-pending)]" />
            <span className="text-xs text-[var(--text-secondary)]">Savings Opportunity</span>
          </div>
          <div className="text-2xl font-bold text-[var(--status-running)] tabular-nums">$2.8k</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">from right-sizing</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Cost by Team */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Cost by Team</h2>
          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] p-4 space-y-3">
            {teamCosts.map((t) => (
              <div key={t.team} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-primary)] font-medium">{t.team}</span>
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums text-[var(--text-primary)]">
                      ${(t.monthly / 1000).toFixed(1)}k
                    </span>
                    {t.budget && (
                      <span
                        className={cn(
                          'text-[0.625rem]',
                          t.monthly > t.budget
                            ? 'text-[var(--status-failed)]'
                            : 'text-[var(--text-muted)]',
                        )}
                      >
                        / ${(t.budget / 1000).toFixed(1)}k
                      </span>
                    )}
                    <span
                      className={cn(
                        'flex items-center gap-0.5 text-[0.625rem] tabular-nums',
                        t.trend > 0 ? 'text-[var(--status-failed)]' : 'text-[var(--status-running)]',
                      )}
                    >
                      {t.trend > 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                      {Math.abs(t.trend)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-[var(--surface-overlay)] rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      t.budget && t.monthly > t.budget
                        ? 'bg-[var(--status-failed)]'
                        : 'bg-[var(--interactive-primary)]',
                    )}
                    style={{ width: `${(t.monthly / maxTeamCost) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Services by Cost */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
            Top Services by Cost
          </h2>
          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--surface-overlay)]/50">
                  <th className="text-left px-4 py-2 text-[0.625rem] font-semibold text-[var(--text-secondary)] uppercase">Service</th>
                  <th className="text-left px-4 py-2 text-[0.625rem] font-semibold text-[var(--text-secondary)] uppercase">Team</th>
                  <th className="text-right px-4 py-2 text-[0.625rem] font-semibold text-[var(--text-secondary)] uppercase">Monthly</th>
                  <th className="text-left px-4 py-2 text-[0.625rem] font-semibold text-[var(--text-secondary)] uppercase">CPU Req</th>
                  <th className="text-left px-4 py-2 text-[0.625rem] font-semibold text-[var(--text-secondary)] uppercase">CPU Used</th>
                  <th className="text-right px-4 py-2 text-[0.625rem] font-semibold text-[var(--text-secondary)] uppercase">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {serviceCosts.map((s) => (
                  <tr key={s.name} className="border-b border-[var(--border-default)] last:border-b-0 hover:bg-[var(--surface-overlay)] transition-colors cursor-pointer">
                    <td className="px-4 py-2.5 text-xs font-mono text-[var(--text-primary)]">{s.name}</td>
                    <td className="px-4 py-2.5 text-xs text-[var(--text-secondary)]">{s.team}</td>
                    <td className="px-4 py-2.5 text-xs text-[var(--text-primary)] tabular-nums text-right font-medium">
                      ${s.monthly.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-[var(--text-secondary)] tabular-nums">{s.cpuReq}</td>
                    <td className="px-4 py-2.5 text-xs text-[var(--text-secondary)] tabular-nums">{s.cpuUsed}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span
                        className={cn(
                          'text-xs font-medium tabular-nums',
                          s.efficiency >= 70
                            ? 'text-[var(--status-running)]'
                            : s.efficiency >= 40
                              ? 'text-[var(--status-pending)]'
                              : 'text-[var(--status-failed)]',
                        )}
                      >
                        {s.efficiency}%
                        {s.efficiency < 30 && ' ▼▼'}
                        {s.efficiency >= 30 && s.efficiency < 50 && ' ▼'}
                        {s.efficiency >= 80 && ' ✓'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right-sizing suggestion */}
          <div className="mt-3 rounded-lg border border-[var(--status-pending)]/20 bg-[var(--status-pending-bg)] p-3 flex items-start gap-2">
            <Lightbulb size={14} className="text-[var(--status-pending)] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--text-primary)]">
              <strong>payment-worker</strong> is using 12% of requested CPU. Right-size to save ~<strong>$1,400/mo</strong>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
