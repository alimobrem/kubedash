import { ScoreCard, cn } from '@kubedash/ui';
import { ChevronDown, ChevronRight, FileDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface ServiceScore {
  name: string;
  team: string;
  tier: 'critical' | 'standard' | 'best-effort';
  score: number;
  total: number;
  categories: {
    reliability: { score: number; total: number };
    observability: { score: number; total: number };
    security: { score: number; total: number };
    operations: { score: number; total: number };
  };
  items: { name: string; passed: boolean; category: string }[];
}

const mockScores: ServiceScore[] = [
  {
    name: 'order-processor', team: 'payments', tier: 'critical', score: 9, total: 10,
    categories: { reliability: { score: 5, total: 5 }, observability: { score: 4, total: 5 }, security: { score: 5, total: 5 }, operations: { score: 4, total: 5 } },
    items: [
      { name: 'Resource limits', passed: true, category: 'reliability' },
      { name: 'Health checks', passed: true, category: 'reliability' },
      { name: 'HPA configured', passed: true, category: 'reliability' },
      { name: 'PDB configured', passed: true, category: 'reliability' },
      { name: 'Pod anti-affinity', passed: true, category: 'reliability' },
      { name: 'Dashboards', passed: true, category: 'observability' },
      { name: 'Alerts defined', passed: true, category: 'observability' },
      { name: 'SLO defined', passed: true, category: 'observability' },
      { name: 'Tracing', passed: false, category: 'observability' },
      { name: 'NetworkPolicy', passed: true, category: 'security' },
    ],
  },
  {
    name: 'payment-api', team: 'payments', tier: 'critical', score: 8, total: 10,
    categories: { reliability: { score: 5, total: 5 }, observability: { score: 3, total: 5 }, security: { score: 4, total: 5 }, operations: { score: 4, total: 5 } },
    items: [
      { name: 'Resource limits', passed: true, category: 'reliability' },
      { name: 'Health checks', passed: true, category: 'reliability' },
      { name: 'SLO defined', passed: false, category: 'observability' },
      { name: 'Tracing', passed: false, category: 'observability' },
    ],
  },
  {
    name: 'user-service', team: 'identity', tier: 'standard', score: 7, total: 10,
    categories: { reliability: { score: 4, total: 5 }, observability: { score: 3, total: 5 }, security: { score: 4, total: 5 }, operations: { score: 3, total: 5 } },
    items: [
      { name: 'PDB configured', passed: false, category: 'reliability' },
      { name: 'SLO defined', passed: false, category: 'observability' },
      { name: 'Runbook linked', passed: false, category: 'operations' },
    ],
  },
  {
    name: 'checkout-svc', team: 'payments', tier: 'critical', score: 4, total: 10,
    categories: { reliability: { score: 1, total: 5 }, observability: { score: 1, total: 5 }, security: { score: 2, total: 5 }, operations: { score: 1, total: 5 } },
    items: [
      { name: 'Health checks', passed: false, category: 'reliability' },
      { name: 'HPA configured', passed: false, category: 'reliability' },
      { name: 'PDB configured', passed: false, category: 'reliability' },
      { name: 'Pod anti-affinity', passed: false, category: 'reliability' },
      { name: 'Image scanning', passed: false, category: 'security' },
      { name: 'Runbook linked', passed: false, category: 'operations' },
    ],
  },
  {
    name: 'analytics-worker', team: 'data', tier: 'best-effort', score: 3, total: 10,
    categories: { reliability: { score: 1, total: 5 }, observability: { score: 0, total: 5 }, security: { score: 1, total: 5 }, operations: { score: 1, total: 5 } },
    items: [
      { name: 'Resource limits', passed: true, category: 'reliability' },
      { name: 'Everything else', passed: false, category: 'reliability' },
    ],
  },
];

function ScoreLevel({ score, total }: { score: number; total: number }) {
  const ratio = score / total;
  if (ratio >= 0.8) return <span className="text-[0.625rem] font-semibold px-1.5 py-0.5 rounded bg-[var(--status-running-bg)] text-[var(--status-running)]">Gold</span>;
  if (ratio >= 0.6) return <span className="text-[0.625rem] font-semibold px-1.5 py-0.5 rounded bg-[var(--interactive-primary)]/10 text-[var(--interactive-primary)]">Silver</span>;
  if (ratio >= 0.4) return <span className="text-[0.625rem] font-semibold px-1.5 py-0.5 rounded bg-[var(--status-pending-bg)] text-[var(--status-pending)]">Bronze</span>;
  return <span className="text-[0.625rem] font-semibold px-1.5 py-0.5 rounded bg-[var(--status-failed-bg)] text-[var(--status-failed)]">Needs Work</span>;
}

export function MaturityPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const avgScore = mockScores.reduce((s, m) => s + m.score, 0) / mockScores.length;
  const gold = mockScores.filter((s) => s.score / s.total >= 0.8).length;
  const needsWork = mockScores.filter((s) => s.score / s.total < 0.4).length;

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">Service Maturity</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Scorecards across {mockScores.length} services</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-overlay)]"
        >
          <FileDown size={14} /> Export Report
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] p-4 text-center">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{avgScore.toFixed(1)}/10</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">Average Score</div>
        </div>
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] p-4 text-center">
          <div className="text-2xl font-bold text-[var(--status-running)]">{gold}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">Gold Services</div>
        </div>
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] p-4 text-center">
          <div className="text-2xl font-bold text-[var(--status-failed)]">{needsWork}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">Need Attention</div>
        </div>
      </div>

      {/* Scorecard table */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] overflow-hidden">
        {mockScores.map((s) => (
          <div key={s.name} className="border-b border-[var(--border-default)] last:border-b-0">
            <button
              type="button"
              onClick={() => setExpanded(expanded === s.name ? null : s.name)}
              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[var(--surface-overlay)] transition-colors text-left"
            >
              {expanded === s.name ? <ChevronDown size={14} className="text-[var(--text-muted)]" /> : <ChevronRight size={14} className="text-[var(--text-muted)]" />}
              <span className="text-sm font-medium text-[var(--text-primary)] w-40">{s.name}</span>
              <span className="text-xs text-[var(--text-muted)] w-24">{s.team}</span>
              <ScoreLevel score={s.score} total={s.total} />
              <div className="flex-1" />
              <ScoreCard score={s.score} total={s.total} compact />
            </button>

            {expanded === s.name && (
              <div className="px-4 pb-4 pt-1 ml-8">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {Object.entries(s.categories).map(([cat, val]) => (
                    <div key={cat} className="text-center">
                      <div className="text-xs text-[var(--text-muted)] capitalize mb-1">{cat}</div>
                      <ScoreCard score={val.score} total={val.total} compact />
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  {s.items.filter((i) => !i.passed).map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--status-failed)]">✗</span>
                        <span className="text-[var(--text-primary)]">{item.name}</span>
                      </div>
                      <button
                        type="button"
                        className="text-[var(--text-link)] hover:underline text-[0.625rem]"
                      >
                        Fix this →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
