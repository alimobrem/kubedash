import type { ServiceCardData } from '../components/ServiceCard';

export function generateServiceExplanation(s: ServiceCardData): string {
  const lines: string[] = [];

  lines.push(
    `**${s.name}** is running version **${s.version}** in the **${s.namespace}** namespace, owned by **${s.owner}**.`,
  );

  if (s.status === 'running' && s.replicas.ready === s.replicas.desired) {
    lines.push(`It is **healthy** with all ${s.replicas.desired} replicas running.`);
  } else if (s.status === 'failed') {
    lines.push(
      `It is **unhealthy** — only ${s.replicas.ready} of ${s.replicas.desired} replicas are ready.`,
    );
  } else if (s.status === 'pending') {
    lines.push(
      `It is **pending** — ${s.replicas.ready} of ${s.replicas.desired} replicas are ready.`,
    );
  } else {
    lines.push(`${s.replicas.ready} of ${s.replicas.desired} replicas are ready.`);
  }

  const cpuLevel = s.cpu.current > 80 ? 'high' : s.cpu.current > 50 ? 'moderate' : 'low';
  const memLevel = s.memory.current > 80 ? 'high' : s.memory.current > 50 ? 'moderate' : 'low';
  lines.push(
    `CPU usage is **${cpuLevel}** at ${s.cpu.current}% and memory usage is **${memLevel}** at ${s.memory.current}%.`,
  );

  if (s.cost) {
    lines.push(`Monthly cost is approximately **$${s.cost.monthly.toFixed(0)}/mo**.`);
  }

  if (s.maturity) {
    const level =
      s.maturity.score / s.maturity.total >= 0.8
        ? 'Gold'
        : s.maturity.score / s.maturity.total >= 0.5
          ? 'Silver'
          : 'Bronze';
    lines.push(`Maturity scorecard: **${s.maturity.score}/${s.maturity.total}** (${level}).`);
  }

  return lines.join(' ');
}

export function generateServicesWelcomeInsight(services: ServiceCardData[]): {
  severity: 'info' | 'warning' | 'critical';
  text: string;
} {
  const degraded = services.filter(
    (s) => s.status !== 'running' || s.replicas.ready < s.replicas.desired,
  );
  const totalCost = services.reduce((sum, s) => sum + (s.cost?.monthly || 0), 0);
  const highCpu = services.filter((s) => s.cpu.current > 80);

  if (degraded.length > 0) {
    const names = degraded.map((s) => `**${s.name}**`).join(', ');
    return {
      severity: 'critical',
      text: `${degraded.length} service${degraded.length > 1 ? 's' : ''} need attention: ${names}. ${degraded[0].status === 'failed' ? `${degraded[0].name} has only ${degraded[0].replicas.ready} of ${degraded[0].replicas.desired} replicas ready.` : ''} Check the triage view for root cause analysis.`,
    };
  }

  if (highCpu.length > 0) {
    return {
      severity: 'warning',
      text: `All ${services.length} services are healthy, but ${highCpu.length} ${highCpu.length === 1 ? 'is' : 'are'} running high CPU (${highCpu.map((s) => `**${s.name}** at ${s.cpu.current}%`).join(', ')}). Total monthly cost: **$${totalCost.toFixed(0)}**.`,
    };
  }

  return {
    severity: 'info',
    text: `All **${services.length} services** are healthy with full replica availability. Total monthly cost is **$${totalCost.toFixed(0)}**. Your cluster is in good shape.`,
  };
}

export function generateTriageSummary(): string {
  return '3 issues detected. Node **ip-10-0-42-17** at 94% CPU is likely causing pod evictions in the payments namespace. **checkout-svc** CrashLoopBackOff started after the latest deploy at 14:22. The config change to **checkout-svc-config** 2 minutes prior is the probable trigger.';
}

export function generateCostInsight(): string {
  return 'Spend increased **8% vs February**. Largest contributor: **payments** team at $6.2k (22% over budget). **payment-worker** is using only 12% of requested CPU — right-sizing could save **$1,400/mo**.';
}

export function generateNodePressureInsight(): string {
  return 'Node **ip-10-0-42-17** has been above 90% CPU for 15 minutes and is in NotReady state. 3 pods on this node are at risk of eviction. Consider cordoning and draining to rebalance workloads.';
}
