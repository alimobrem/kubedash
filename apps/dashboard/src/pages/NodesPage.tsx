import { cn, EmptyState, formatPercent, StatusBadge } from '@kubedash/ui';
import { Search, Server } from 'lucide-react';
import { useState } from 'react';
import { PulseInsightCard } from '../components/PulseInsightCard';
import { PulseText } from '../components/PulseText';
import { generateNodePressureInsight } from '../utils/pulse-templates';

interface MockNode {
  name: string;
  status: 'Ready' | 'NotReady' | 'Unknown';
  role: 'control-plane' | 'worker';
  cpu: number;
  memory: number;
  pods: number;
  podCapacity: number;
  age: string;
  zone: string;
  instanceType: string;
}

const mockNodes: MockNode[] = [
  {
    name: 'ip-10-0-42-17',
    status: 'NotReady',
    role: 'worker',
    cpu: 94,
    memory: 87,
    pods: 32,
    podCapacity: 110,
    age: '45d',
    zone: 'us-east-1a',
    instanceType: 'm5.xlarge',
  },
  {
    name: 'ip-10-0-38-09',
    status: 'Ready',
    role: 'control-plane',
    cpu: 62,
    memory: 71,
    pods: 28,
    podCapacity: 110,
    age: '120d',
    zone: 'us-east-1a',
    instanceType: 'm5.2xlarge',
  },
  {
    name: 'ip-10-0-55-21',
    status: 'Ready',
    role: 'worker',
    cpu: 58,
    memory: 82,
    pods: 45,
    podCapacity: 110,
    age: '90d',
    zone: 'us-east-1b',
    instanceType: 'm5.xlarge',
  },
  {
    name: 'ip-10-0-61-03',
    status: 'Ready',
    role: 'worker',
    cpu: 45,
    memory: 63,
    pods: 38,
    podCapacity: 110,
    age: '90d',
    zone: 'us-east-1b',
    instanceType: 'm5.xlarge',
  },
  {
    name: 'ip-10-0-77-14',
    status: 'Ready',
    role: 'worker',
    cpu: 38,
    memory: 55,
    pods: 29,
    podCapacity: 110,
    age: '60d',
    zone: 'us-east-1c',
    instanceType: 'm5.large',
  },
  {
    name: 'ip-10-0-82-07',
    status: 'Ready',
    role: 'control-plane',
    cpu: 41,
    memory: 48,
    pods: 24,
    podCapacity: 110,
    age: '120d',
    zone: 'us-east-1c',
    instanceType: 'm5.2xlarge',
  },
  {
    name: 'ip-10-0-93-22',
    status: 'Ready',
    role: 'worker',
    cpu: 33,
    memory: 42,
    pods: 21,
    podCapacity: 110,
    age: '30d',
    zone: 'us-east-1a',
    instanceType: 'm5.xlarge',
  },
  {
    name: 'ip-10-0-44-19',
    status: 'Ready',
    role: 'worker',
    cpu: 28,
    memory: 39,
    pods: 18,
    podCapacity: 110,
    age: '30d',
    zone: 'us-east-1b',
    instanceType: 'm5.large',
  },
];

function UtilBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 w-24">
      <div className="flex-1 h-1.5 bg-[var(--surface-overlay)] rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full', color)}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
      <span className="text-[0.6875rem] tabular-nums w-8 text-right text-[var(--text-secondary)]">
        {formatPercent(value)}
      </span>
    </div>
  );
}

export function NodesPage() {
  const [search, setSearch] = useState('');
  const filtered = mockNodes.filter((n) => n.name.toLowerCase().includes(search.toLowerCase()));
  const ready = mockNodes.filter((n) => n.status === 'Ready').length;
  const notReady = mockNodes.filter((n) => n.status !== 'Ready').length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">Nodes</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {mockNodes.length} nodes · {ready} Ready ·{' '}
            {notReady > 0 ? `${notReady} NotReady` : 'All healthy'}
          </p>
        </div>
      </div>

      {/* Pulse Node Pressure Insight */}
      {notReady > 0 && (
        <div className="mb-4">
          <PulseInsightCard
            id="node-pressure"
            severity="critical"
            actions={[
              {
                label: 'Cordon & drain',
                type: 'execute',
                payload: 'Cordon and drain node ip-10-0-42-17',
              },
            ]}
          >
            <PulseText text={generateNodePressureInsight()} />
          </PulseInsightCard>
        </div>
      )}

      {/* Search */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            type="text"
            placeholder="Search nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-md border border-[var(--border-default)] bg-[var(--surface-base)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)] w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-default)] bg-[var(--surface-overlay)]/50">
              <th className="text-left px-4 py-2.5 text-[0.6875rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                Name
              </th>
              <th className="text-left px-4 py-2.5 text-[0.6875rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                Status
              </th>
              <th className="text-left px-4 py-2.5 text-[0.6875rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                Role
              </th>
              <th className="text-left px-4 py-2.5 text-[0.6875rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                CPU
              </th>
              <th className="text-left px-4 py-2.5 text-[0.6875rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                Memory
              </th>
              <th className="text-left px-4 py-2.5 text-[0.6875rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                Pods
              </th>
              <th className="text-left px-4 py-2.5 text-[0.6875rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                Age
              </th>
              <th className="text-left px-4 py-2.5 text-[0.6875rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                Zone
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((node) => (
              <tr
                key={node.name}
                className={cn(
                  'border-b border-[var(--border-default)] last:border-b-0 hover:bg-[var(--surface-overlay)] transition-colors cursor-pointer',
                  node.status === 'NotReady' && 'bg-[var(--status-failed-bg)]',
                )}
              >
                <td className="px-4 py-2.5 text-xs font-mono text-[var(--text-primary)]">
                  {node.name}
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={node.status === 'Ready' ? 'running' : 'failed'} size="sm">
                    {node.status}
                  </StatusBadge>
                </td>
                <td className="px-4 py-2.5 text-xs text-[var(--text-secondary)]">
                  {node.role === 'control-plane' ? 'Control Plane' : 'Worker'}
                </td>
                <td className="px-4 py-2.5">
                  <UtilBar
                    value={node.cpu}
                    color={
                      node.cpu >= 85
                        ? 'bg-[var(--status-failed)]'
                        : node.cpu >= 70
                          ? 'bg-[var(--status-pending)]'
                          : 'bg-[var(--metric-cpu)]'
                    }
                  />
                </td>
                <td className="px-4 py-2.5">
                  <UtilBar
                    value={node.memory}
                    color={
                      node.memory >= 85
                        ? 'bg-[var(--status-failed)]'
                        : node.memory >= 70
                          ? 'bg-[var(--status-pending)]'
                          : 'bg-[var(--metric-memory)]'
                    }
                  />
                </td>
                <td className="px-4 py-2.5 text-xs text-[var(--text-secondary)] tabular-nums">
                  {node.pods}/{node.podCapacity}
                </td>
                <td className="px-4 py-2.5 text-xs text-[var(--text-muted)] tabular-nums">
                  {node.age}
                </td>
                <td className="px-4 py-2.5 text-xs text-[var(--text-muted)]">{node.zone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
