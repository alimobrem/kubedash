import type { K8sStatus } from '@kubedash/ui';
import type { ServiceCardData } from './components/ServiceCard';

function sparkline(base: number, variance: number, points = 12): number[] {
  return Array.from({ length: points }, () =>
    Math.max(0, Math.min(100, base + (Math.random() - 0.5) * variance)),
  );
}

export const mockServices: ServiceCardData[] = [
  {
    name: 'payment-api',
    version: 'v2.14.3',
    status: 'running',
    owner: 'team-payments',
    namespace: 'payments',
    replicas: { ready: 3, desired: 3 },
    cpu: { current: 42, history: sparkline(42, 20) },
    memory: { current: 67, history: sparkline(67, 15) },
    cost: { monthly: 142.3, trend: 'up', trendPercent: 12 },
    maturity: { score: 8, total: 10 },
    lastDeploy: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: 'user-service',
    version: 'v1.8.0',
    status: 'running',
    owner: 'team-identity',
    namespace: 'identity',
    replicas: { ready: 3, desired: 3 },
    cpu: { current: 18, history: sparkline(18, 10) },
    memory: { current: 52, history: sparkline(52, 12) },
    cost: { monthly: 89.5 },
    maturity: { score: 7, total: 10 },
    lastDeploy: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: 'checkout-svc',
    version: 'v3.2.1',
    status: 'failed',
    owner: 'team-payments',
    namespace: 'payments',
    replicas: { ready: 2, desired: 4 },
    cpu: { current: 78, history: sparkline(78, 30) },
    memory: { current: 91, history: sparkline(85, 15) },
    cost: { monthly: 67.8, trend: 'up', trendPercent: 45 },
    maturity: { score: 4, total: 10 },
    lastDeploy: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    name: 'order-processor',
    version: 'v1.4.0',
    status: 'running',
    owner: 'team-payments',
    namespace: 'payments',
    replicas: { ready: 6, desired: 6 },
    cpu: { current: 22, history: sparkline(22, 8) },
    memory: { current: 58, history: sparkline(58, 10) },
    cost: { monthly: 203.1 },
    maturity: { score: 9, total: 10 },
    lastDeploy: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: 'notification-svc',
    version: 'v2.1.0',
    status: 'running',
    owner: 'team-platform',
    namespace: 'platform',
    replicas: { ready: 2, desired: 2 },
    cpu: { current: 12, history: sparkline(12, 8) },
    memory: { current: 34, history: sparkline(34, 10) },
    cost: { monthly: 45.2, trend: 'down', trendPercent: 5 },
    maturity: { score: 6, total: 10 },
    lastDeploy: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: 'analytics-worker',
    version: 'v0.9.2',
    status: 'pending',
    owner: 'team-data',
    namespace: 'data',
    replicas: { ready: 1, desired: 3 },
    cpu: { current: 55, history: sparkline(55, 25) },
    memory: { current: 72, history: sparkline(72, 20) },
    cost: { monthly: 312.0, trend: 'up', trendPercent: 22 },
    maturity: { score: 3, total: 10 },
    lastDeploy: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

export interface TriageItem {
  severity: 'critical' | 'warning' | 'info';
  kind: string;
  name: string;
  namespace: string;
  reason: string;
  detail: string;
  timestamp: string;
}

export const mockTriageItems: TriageItem[] = [
  {
    severity: 'critical',
    kind: 'Pod',
    name: 'checkout-svc-7f8b9c',
    namespace: 'payments',
    reason: 'CrashLoopBackOff',
    detail: '12 restarts, exit code 137 (OOMKilled)',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    severity: 'critical',
    kind: 'Pod',
    name: 'checkout-svc-a3d4e1',
    namespace: 'payments',
    reason: 'CrashLoopBackOff',
    detail: '9 restarts, exit code 137 (OOMKilled)',
    timestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
  },
  {
    severity: 'warning',
    kind: 'Node',
    name: 'ip-10-0-42-17',
    namespace: '',
    reason: 'NotReady',
    detail: 'KubeletNotReady: PLEG is not healthy',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
  {
    severity: 'warning',
    kind: 'PVC',
    name: 'data-redis-0',
    namespace: 'cache',
    reason: 'Pending',
    detail: 'No persistent volume found matching claim',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    severity: 'info',
    kind: 'Service',
    name: 'payment-api',
    namespace: 'payments',
    reason: 'Degraded',
    detail: '3/5 endpoints ready',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
];

export interface TimelineEvent {
  timestamp: string;
  type: 'deploy' | 'oom' | 'restart' | 'node' | 'evict' | 'hpa' | 'config';
  icon: string;
  title: string;
  detail: string;
}

export const mockTimeline: TimelineEvent[] = [
  {
    timestamp: new Date(Date.now() - 16 * 60 * 1000).toISOString(),
    type: 'deploy',
    icon: '↗',
    title: 'DEPLOY checkout-svc v3.2.0 → v3.2.1',
    detail: 'by: alice@acme.com',
  },
  {
    timestamp: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
    type: 'oom',
    icon: '⚠',
    title: 'OOM checkout-svc-7f8b9c killed',
    detail: 'exit code: 137, memory limit: 512Mi',
  },
  {
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    type: 'restart',
    icon: '↻',
    title: 'RESTART checkout-svc-7f8b9c',
    detail: 'attempt 1/5',
  },
  {
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    type: 'oom',
    icon: '⚠',
    title: 'OOM checkout-svc-7f8b9c killed',
    detail: 'exit code: 137, memory limit: 512Mi',
  },
  {
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    type: 'node',
    icon: '✖',
    title: 'NODE ip-10-0-42-17 NotReady',
    detail: 'reason: KubeletNotReady',
  },
  {
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    type: 'evict',
    icon: '⇢',
    title: 'EVICT 8 pods from ip-10-0-42-17',
    detail: '',
  },
  {
    timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    type: 'hpa',
    icon: '↗',
    title: 'HPA payment-api scaled 3 → 5',
    detail: 'cpu above 80% threshold',
  },
];
