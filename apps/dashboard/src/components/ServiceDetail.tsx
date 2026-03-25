import {
  ConditionList,
  CostBadge,
  HealthDot,
  type K8sCondition,
  Label,
  MetricValue,
  ProgressRing,
  RelativeTime,
  ScoreCard,
  StatusBadge,
} from '@kubedash/ui';
import { Play, RotateCcw, Scaling } from 'lucide-react';
import { useState } from 'react';
import { ExplainButton } from './ExplainButton';
import { RollbackDialog } from './RollbackDialog';
import { ScaleDialog } from './ScaleDialog';
import type { ServiceCardData } from './ServiceCard';
import { useToast } from './Toast';

interface ServiceDetailProps {
  service: ServiceCardData;
}

const mockPods = [
  {
    name: 'payment-api-7f8b9c',
    status: 'Running' as const,
    restarts: 0,
    age: '2d',
    cpu: 35,
    memory: 62,
    containers: '1/1',
  },
  {
    name: 'payment-api-a3d4e1',
    status: 'Running' as const,
    restarts: 0,
    age: '2d',
    cpu: 42,
    memory: 71,
    containers: '1/1',
  },
  {
    name: 'payment-api-c9e2f4',
    status: 'Running' as const,
    restarts: 2,
    age: '4h',
    cpu: 55,
    memory: 68,
    containers: '1/1',
  },
];

const mockConditions: K8sCondition[] = [
  {
    type: 'Available',
    status: 'True',
    reason: 'MinimumReplicasAvailable',
    lastTransitionTime: '2026-03-15T10:30:00Z',
  },
  {
    type: 'Progressing',
    status: 'True',
    reason: 'NewReplicaSetAvailable',
    lastTransitionTime: '2026-03-15T10:30:00Z',
  },
];

const mockEnvironments = [
  { env: 'dev', version: 'v2.15.0-rc1', status: 'running' as const, deployed: '2h ago' },
  { env: 'staging', version: 'v2.14.3', status: 'running' as const, deployed: '1d ago' },
  { env: 'prod', version: 'v2.14.3', status: 'running' as const, deployed: '1d ago' },
];

export function ServiceDetail({ service }: ServiceDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'pods' | 'events' | 'metrics'>(
    'overview',
  );
  const [scaleOpen, setScaleOpen] = useState(false);
  const [rollbackOpen, setRollbackOpen] = useState(false);
  const { toast } = useToast();

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'pods' as const, label: `Pods (${mockPods.length})` },
    { id: 'events' as const, label: 'Events' },
    { id: 'metrics' as const, label: 'Metrics' },
  ];

  return (
    <div className="space-y-4">
      {/* Pulse Insight (always visible) */}
      <ExplainButton service={service} />

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setScaleOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] transition-colors"
        >
          <Scaling size={14} /> Scale
        </button>
        <button
          type="button"
          onClick={() =>
            toast(`Rolling restart initiated for ${service.name}`, { variant: 'success' })
          }
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] transition-colors"
        >
          <RotateCcw size={14} /> Restart
        </button>
        <button
          type="button"
          onClick={() => setRollbackOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] transition-colors"
        >
          <Play size={14} /> Rollback
        </button>
      </div>

      {/* Dialogs */}
      <ScaleDialog
        open={scaleOpen}
        onClose={() => setScaleOpen(false)}
        serviceName={service.name}
        currentReplicas={service.replicas.desired}
      />
      <RollbackDialog
        open={rollbackOpen}
        onClose={() => setRollbackOpen(false)}
        serviceName={service.name}
      />

      {/* Tabs */}
      <div className="flex border-b border-[var(--border-default)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-[var(--interactive-primary)] text-[var(--text-primary)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Composition */}
          <section>
            <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">
              Composition
            </h3>
            <div className="space-y-1.5">
              {[
                {
                  kind: 'Deployment',
                  name: service.name,
                  detail: `${service.replicas.ready}/${service.replicas.desired} ready`,
                },
                { kind: 'Service', name: service.name, detail: 'ClusterIP' },
                { kind: 'Ingress', name: service.name, detail: `api.acme.com/${service.name}` },
                { kind: 'HPA', name: service.name, detail: '3-10 replicas' },
                { kind: 'PDB', name: service.name, detail: 'minAvailable: 2' },
              ].map((item) => (
                <div key={item.kind} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)] w-20">{item.kind}</span>
                    <span className="text-[var(--text-primary)] font-mono">{item.name}</span>
                  </div>
                  <span className="text-[var(--text-muted)]">{item.detail}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Scorecard */}
          {service.maturity && (
            <section>
              <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">
                Scorecard
              </h3>
              <ScoreCard
                score={service.maturity.score}
                total={service.maturity.total}
                items={[
                  { name: 'Resource limits', passed: true },
                  { name: 'Health checks', passed: true },
                  { name: 'HPA configured', passed: true },
                  { name: 'PDB configured', passed: true },
                  { name: 'Non-root', passed: true },
                  { name: 'NetworkPolicy', passed: true },
                  { name: 'Approved image', passed: true },
                  { name: 'Runbook linked', passed: true },
                  { name: 'SLO defined', passed: false },
                  { name: 'Tracing', passed: false },
                ]}
              />
            </section>
          )}

          {/* Environments */}
          <section>
            <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">
              Environments
            </h3>
            <div className="space-y-1.5">
              {mockEnvironments.map((env) => (
                <div key={env.env} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)] w-14">{env.env}</span>
                    <span className="font-mono text-[var(--text-primary)]">{env.version}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HealthDot status={env.status} size="sm" />
                    <span className="text-[var(--text-muted)]">{env.deployed}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Conditions */}
          <section>
            <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">
              Conditions
            </h3>
            <ConditionList conditions={mockConditions} compact />
          </section>

          {/* Labels */}
          <section>
            <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">
              Labels
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <Label name="app" value={service.name} />
              <Label name="version" value={service.version} />
              <Label name="team" value={service.owner} />
              <Label name="env" value="production" />
            </div>
          </section>
        </div>
      )}

      {activeTab === 'pods' && (
        <div className="rounded-lg border border-[var(--border-default)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-default)] bg-[var(--surface-overlay)]/50">
                <th className="text-left px-3 py-2 text-[0.625rem] font-semibold text-[var(--text-secondary)] uppercase">
                  Name
                </th>
                <th className="text-left px-3 py-2 text-[0.625rem] font-semibold text-[var(--text-secondary)] uppercase">
                  Status
                </th>
                <th className="text-left px-3 py-2 text-[0.625rem] font-semibold text-[var(--text-secondary)] uppercase">
                  Restarts
                </th>
                <th className="text-left px-3 py-2 text-[0.625rem] font-semibold text-[var(--text-secondary)] uppercase">
                  CPU
                </th>
                <th className="text-left px-3 py-2 text-[0.625rem] font-semibold text-[var(--text-secondary)] uppercase">
                  Mem
                </th>
                <th className="text-left px-3 py-2 text-[0.625rem] font-semibold text-[var(--text-secondary)] uppercase">
                  Age
                </th>
              </tr>
            </thead>
            <tbody>
              {mockPods.map((pod) => (
                <tr
                  key={pod.name}
                  className="border-b border-[var(--border-default)] last:border-b-0 hover:bg-[var(--surface-overlay)] transition-colors cursor-pointer"
                >
                  <td className="px-3 py-2 text-xs font-mono text-[var(--text-primary)]">
                    {pod.name}
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status="running" size="sm">
                      {pod.status}
                    </StatusBadge>
                  </td>
                  <td className="px-3 py-2 text-xs tabular-nums text-[var(--text-secondary)]">
                    {pod.restarts}
                  </td>
                  <td className="px-3 py-2">
                    <ProgressRing
                      value={pod.cpu}
                      size={28}
                      strokeWidth={3}
                      autoColor
                      showLabel={false}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <ProgressRing
                      value={pod.memory}
                      size={28}
                      strokeWidth={3}
                      autoColor
                      showLabel={false}
                    />
                  </td>
                  <td className="px-3 py-2 text-xs text-[var(--text-muted)] tabular-nums">
                    {pod.age}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="text-sm text-[var(--text-muted)] py-8 text-center">No recent events</div>
      )}

      {activeTab === 'metrics' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-base)] p-4">
            <MetricValue
              label="CPU Usage"
              value={service.cpu.current}
              unit="%"
              color="cpu"
              size="md"
            />
            <div className="mt-2 text-[0.625rem] text-[var(--text-muted)]">
              Request: 500m · Limit: 1000m
            </div>
          </div>
          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-base)] p-4">
            <MetricValue
              label="Memory Usage"
              value={service.memory.current}
              unit="%"
              color="memory"
              size="md"
            />
            <div className="mt-2 text-[0.625rem] text-[var(--text-muted)]">
              Request: 256Mi · Limit: 512Mi
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
