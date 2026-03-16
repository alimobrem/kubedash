import { cn } from '@kubedash/ui';
import { MessageSquareText, X } from 'lucide-react';
import { useState } from 'react';
import type { ServiceCardData } from './ServiceCard';

interface ExplainButtonProps {
  service: ServiceCardData;
  className?: string;
}

/** Template-based plain-English resource summary. No AI needed. */
function generateExplanation(s: ServiceCardData): string {
  const lines: string[] = [];

  // What it is
  lines.push(
    `**${s.name}** is a service running version **${s.version}** in the **${s.namespace}** namespace, owned by **${s.owner}**.`,
  );

  // Health
  if (s.status === 'running' && s.replicas.ready === s.replicas.desired) {
    lines.push(
      `It is **healthy** with all ${s.replicas.desired} replicas running.`,
    );
  } else if (s.status === 'failed') {
    lines.push(
      `It is **unhealthy** — only ${s.replicas.ready} of ${s.replicas.desired} replicas are ready.`,
    );
  } else if (s.status === 'pending') {
    lines.push(
      `It is **pending** — ${s.replicas.ready} of ${s.replicas.desired} replicas are ready.`,
    );
  } else {
    lines.push(
      `${s.replicas.ready} of ${s.replicas.desired} replicas are ready.`,
    );
  }

  // Resource usage
  const cpuLevel = s.cpu.current > 80 ? 'high' : s.cpu.current > 50 ? 'moderate' : 'low';
  const memLevel = s.memory.current > 80 ? 'high' : s.memory.current > 50 ? 'moderate' : 'low';
  lines.push(
    `CPU usage is **${cpuLevel}** at ${s.cpu.current}% and memory usage is **${memLevel}** at ${s.memory.current}%.`,
  );

  // Cost
  if (s.cost) {
    lines.push(`Monthly cost is approximately **$${s.cost.monthly.toFixed(0)}/mo**.`);
    if (s.cost.trend === 'up' && s.cost.trendPercent) {
      lines.push(`Cost has **increased ${s.cost.trendPercent}%** compared to last period.`);
    }
  }

  // Maturity
  if (s.maturity) {
    const level =
      s.maturity.score / s.maturity.total >= 0.8
        ? 'Gold'
        : s.maturity.score / s.maturity.total >= 0.5
          ? 'Silver'
          : 'Bronze';
    lines.push(
      `Maturity scorecard: **${s.maturity.score}/${s.maturity.total}** (${level}).`,
    );
  }

  // Last deploy
  if (s.lastDeploy) {
    const ago = Math.round((Date.now() - new Date(s.lastDeploy).getTime()) / 60000);
    const timeStr = ago < 60 ? `${ago} minutes` : ago < 1440 ? `${Math.round(ago / 60)} hours` : `${Math.round(ago / 1440)} days`;
    lines.push(`Last deployed **${timeStr} ago**.`);
  }

  return lines.join(' ');
}

export function ExplainButton({ service, className }: ExplainButtonProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const explanation = generateExplanation(service);

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setShowExplanation(!showExplanation)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] transition-colors"
      >
        <MessageSquareText size={14} />
        Explain
      </button>

      {showExplanation && (
        <div className="absolute top-full mt-2 left-0 right-0 min-w-[320px] z-[var(--z-dropdown)] rounded-lg border border-[var(--border-strong)] bg-[var(--surface-floating)] shadow-[var(--shadow-floating)] p-4">
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Explanation</span>
            <button
              type="button"
              onClick={() => setShowExplanation(false)}
              className="p-0.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            >
              <X size={12} />
            </button>
          </div>
          <p className="text-xs text-[var(--text-primary)] leading-relaxed">
            {explanation.split('**').map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="font-semibold text-[var(--interactive-primary)]">
                  {part}
                </strong>
              ) : (
                part
              ),
            )}
          </p>
        </div>
      )}
    </div>
  );
}
