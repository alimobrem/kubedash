import { KBD, ResourceIcon, StatusBadge, cn, type K8sResourceKind, type K8sStatus } from '@kubedash/ui';
import { Command } from 'cmdk';
import {
  ArrowRight,
  FileText,
  Layers,
  RotateCcw,
  Scaling,
  Search,
  Server,
  Terminal,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface SearchResult {
  id: string;
  kind: K8sResourceKind;
  name: string;
  namespace: string;
  cluster: string;
  status: K8sStatus;
}

interface ActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  onSelect: () => void;
}

interface NavItem {
  id: string;
  label: string;
  path: string;
}

// Mock search results
const mockResources: SearchResult[] = [
  { id: '1', kind: 'deployment', name: 'payment-api', namespace: 'payments', cluster: 'prod-us-east-1', status: 'running' },
  { id: '2', kind: 'deployment', name: 'payment-worker', namespace: 'payments', cluster: 'prod-us-east-1', status: 'running' },
  { id: '3', kind: 'service', name: 'payment-api', namespace: 'payments', cluster: 'prod-us-east-1', status: 'running' },
  { id: '4', kind: 'pod', name: 'payment-api-7f8b9c', namespace: 'payments', cluster: 'prod-us-east-1', status: 'running' },
  { id: '5', kind: 'pod', name: 'payment-api-a3d4e1', namespace: 'payments', cluster: 'prod-us-east-1', status: 'running' },
  { id: '6', kind: 'pod', name: 'payment-worker-x2k9p', namespace: 'payments', cluster: 'prod-us-east-1', status: 'running' },
  { id: '7', kind: 'deployment', name: 'checkout-svc', namespace: 'payments', cluster: 'prod-us-east-1', status: 'failed' },
  { id: '8', kind: 'pod', name: 'checkout-svc-7f8b9c', namespace: 'payments', cluster: 'prod-us-east-1', status: 'failed' },
  { id: '9', kind: 'node', name: 'ip-10-0-42-17', namespace: '', cluster: 'prod-us-east-1', status: 'failed' },
  { id: '10', kind: 'ingress', name: 'payment-api', namespace: 'payments', cluster: 'prod-us-east-1', status: 'running' },
  { id: '11', kind: 'configmap', name: 'payment-api-config', namespace: 'payments', cluster: 'prod-us-east-1', status: 'running' },
  { id: '12', kind: 'secret', name: 'payment-api-secrets', namespace: 'payments', cluster: 'prod-us-east-1', status: 'running' },
  { id: '13', kind: 'deployment', name: 'user-service', namespace: 'identity', cluster: 'prod-us-east-1', status: 'running' },
  { id: '14', kind: 'deployment', name: 'order-processor', namespace: 'payments', cluster: 'prod-us-east-1', status: 'running' },
  { id: '15', kind: 'pvc', name: 'data-redis-0', namespace: 'cache', cluster: 'prod-us-east-1', status: 'pending' },
];

const actions: ActionItem[] = [
  { id: 'scale', label: 'Scale deployment...', icon: <Scaling size={16} />, shortcut: 'S', onSelect: () => {} },
  { id: 'rollback', label: 'Rollback deployment...', icon: <RotateCcw size={16} />, shortcut: 'R', onSelect: () => {} },
  { id: 'logs', label: 'View logs...', icon: <FileText size={16} />, shortcut: 'L', onSelect: () => {} },
  { id: 'exec', label: 'Exec into pod...', icon: <Terminal size={16} />, shortcut: 'E', onSelect: () => {} },
];

const navItems: NavItem[] = [
  { id: 'nav-services', label: 'Go to My Services', path: '/' },
  { id: 'nav-triage', label: 'Go to Triage', path: '/triage' },
  { id: 'nav-nodes', label: 'Go to Nodes', path: '/nodes' },
  { id: 'nav-topology', label: 'Go to Topology', path: '/topology' },
  { id: 'nav-cost', label: 'Go to Cost', path: '/cost' },
  { id: 'nav-overview', label: 'Go to Overview', path: '/overview' },
];

const kindLabel: Record<K8sResourceKind, string> = {
  pod: 'Pod',
  deployment: 'Deployment',
  service: 'Service',
  ingress: 'Ingress',
  node: 'Node',
  namespace: 'Namespace',
  configmap: 'ConfigMap',
  secret: 'Secret',
  pv: 'PV',
  pvc: 'PVC',
  statefulset: 'StatefulSet',
  daemonset: 'DaemonSet',
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  // Cmd+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = useCallback((value: string) => {
    // Handle navigation
    const nav = navItems.find((n) => n.id === value);
    if (nav) {
      window.location.href = nav.path;
      setOpen(false);
      return;
    }
    // Handle resource selection
    const resource = mockResources.find((r) => r.id === value);
    if (resource) {
      console.log('Selected resource:', resource);
      setOpen(false);
    }
    // Handle action
    const action = actions.find((a) => a.id === value);
    if (action) {
      action.onSelect();
      setOpen(false);
    }
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-command-palette)]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Palette */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-[640px]">
        <Command
          className={cn(
            'rounded-xl border border-[var(--border-strong)] bg-[var(--surface-floating)]',
            'shadow-[var(--shadow-modal)] overflow-hidden',
          )}
          label="Command palette"
        >
          {/* Search input */}
          <div className="flex items-center gap-2 px-4 border-b border-[var(--border-default)]">
            <Search size={16} className="text-[var(--text-muted)] flex-shrink-0" />
            <Command.Input
              placeholder="Search resources, actions, navigation..."
              className="flex-1 py-3 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
              autoFocus
            />
            <KBD>esc</KBD>
          </div>

          {/* Results */}
          <Command.List className="max-h-[360px] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-[var(--text-muted)]">
              No results found.
            </Command.Empty>

            {/* Resources */}
            <Command.Group
              heading={
                <span className="text-[0.625rem] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-2">
                  Resources
                </span>
              }
            >
              {mockResources.map((r) => (
                <Command.Item
                  key={r.id}
                  value={`${r.kind} ${r.name} ${r.namespace} ${r.cluster}`}
                  onSelect={() => handleSelect(r.id)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer data-[selected=true]:bg-[var(--surface-overlay)] transition-colors"
                >
                  <ResourceIcon kind={r.kind} size={16} className="text-[var(--text-secondary)] flex-shrink-0" />
                  <span className="text-[0.625rem] text-[var(--text-muted)] w-16 flex-shrink-0">
                    {kindLabel[r.kind]}
                  </span>
                  <span className="text-[var(--text-primary)] font-mono text-xs flex-1 truncate">
                    {r.name}
                  </span>
                  {r.namespace && (
                    <span className="text-[0.625rem] text-[var(--text-muted)]">{r.namespace}</span>
                  )}
                  <StatusBadge status={r.status} size="sm" showShape={false} />
                </Command.Item>
              ))}
            </Command.Group>

            {/* Actions */}
            <Command.Group
              heading={
                <span className="text-[0.625rem] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-2 mt-2">
                  Actions
                </span>
              }
            >
              {actions.map((a) => (
                <Command.Item
                  key={a.id}
                  value={a.label}
                  onSelect={() => handleSelect(a.id)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer data-[selected=true]:bg-[var(--surface-overlay)] transition-colors"
                >
                  <span className="text-[var(--text-secondary)]">{a.icon}</span>
                  <span className="text-[var(--text-primary)] flex-1">{a.label}</span>
                  {a.shortcut && <KBD>{a.shortcut}</KBD>}
                </Command.Item>
              ))}
            </Command.Group>

            {/* Navigation */}
            <Command.Group
              heading={
                <span className="text-[0.625rem] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-2 mt-2">
                  Navigation
                </span>
              }
            >
              {navItems.map((n) => (
                <Command.Item
                  key={n.id}
                  value={n.label}
                  onSelect={() => handleSelect(n.id)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer data-[selected=true]:bg-[var(--surface-overlay)] transition-colors"
                >
                  <ArrowRight size={16} className="text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-primary)]">{n.label}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>

          {/* Footer */}
          <div className="flex items-center gap-4 px-4 py-2 border-t border-[var(--border-default)] text-[0.625rem] text-[var(--text-muted)]">
            <span className="flex items-center gap-1">
              <KBD>↑↓</KBD> navigate
            </span>
            <span className="flex items-center gap-1">
              <KBD>↵</KBD> select
            </span>
            <span className="flex items-center gap-1">
              <KBD>esc</KBD> close
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}
