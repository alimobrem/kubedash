import { HealthDot, StatusBadge, cn, type K8sStatus } from '@kubedash/ui';
import { ArrowRight, GitPullRequest } from 'lucide-react';
import { useToast } from '../components/Toast';

interface EnvVersion {
  version: string;
  status: K8sStatus;
  deployedAgo: string;
  commitSha: string;
}

interface ServiceEnvRow {
  name: string;
  owner: string;
  environments: {
    dev: EnvVersion;
    staging: EnvVersion;
    prod: EnvVersion;
  };
}

const mockMatrix: ServiceEnvRow[] = [
  {
    name: 'payment-api',
    owner: 'team-payments',
    environments: {
      dev: { version: 'v2.15.0-rc1', status: 'running', deployedAgo: '2h', commitSha: 'f3a8c21' },
      staging: { version: 'v2.14.3', status: 'running', deployedAgo: '1d', commitSha: 'a3f8c21' },
      prod: { version: 'v2.14.3', status: 'running', deployedAgo: '1d', commitSha: 'a3f8c21' },
    },
  },
  {
    name: 'user-service',
    owner: 'team-identity',
    environments: {
      dev: { version: 'v1.9.0-rc2', status: 'running', deployedAgo: '6h', commitSha: 'b7e2d15' },
      staging: { version: 'v1.8.0', status: 'running', deployedAgo: '3d', commitSha: 'e7d2b15' },
      prod: { version: 'v1.8.0', status: 'running', deployedAgo: '5d', commitSha: 'e7d2b15' },
    },
  },
  {
    name: 'checkout-svc',
    owner: 'team-payments',
    environments: {
      dev: { version: 'v3.3.0-rc1', status: 'running', deployedAgo: '1h', commitSha: 'd2c9f08' },
      staging: { version: 'v3.2.1', status: 'failed', deployedAgo: '15m', commitSha: 'c1f9a08' },
      prod: { version: 'v3.2.0', status: 'running', deployedAgo: '7d', commitSha: '9b4e3d7' },
    },
  },
  {
    name: 'order-processor',
    owner: 'team-payments',
    environments: {
      dev: { version: 'v1.4.0', status: 'running', deployedAgo: '3d', commitSha: '4e5f1a2' },
      staging: { version: 'v1.4.0', status: 'running', deployedAgo: '3d', commitSha: '4e5f1a2' },
      prod: { version: 'v1.4.0', status: 'running', deployedAgo: '5d', commitSha: '4e5f1a2' },
    },
  },
  {
    name: 'notification-svc',
    owner: 'team-platform',
    environments: {
      dev: { version: 'v2.2.0-rc1', status: 'running', deployedAgo: '12h', commitSha: '8c3b7d9' },
      staging: { version: 'v2.1.0', status: 'running', deployedAgo: '2d', commitSha: '6a1e4f2' },
      prod: { version: 'v2.1.0', status: 'running', deployedAgo: '7d', commitSha: '6a1e4f2' },
    },
  },
];

function EnvCell({ env, nextEnv, serviceName }: { env: EnvVersion; nextEnv?: EnvVersion; serviceName: string }) {
  const { toast } = useToast();
  const canPromote = nextEnv && env.version !== nextEnv.version;

  return (
    <td className="px-4 py-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <HealthDot status={env.status} size="sm" />
          <span className="font-mono text-xs text-[var(--text-primary)]">{env.version}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[0.625rem] text-[var(--text-muted)]">{env.deployedAgo} ago</span>
          <span className="text-[0.625rem] font-mono text-[var(--text-muted)]">{env.commitSha}</span>
        </div>
      </div>
    </td>
  );
}

export function EnvironmentMatrixPage() {
  const { toast } = useToast();

  const handlePromote = (service: string, from: string, to: string, version: string) => {
    toast(`Creating PR to promote ${service} ${version} from ${from} → ${to}`, {
      variant: 'success',
      action: {
        label: 'View PR',
        onClick: () => toast('Opening PR in new tab...', { variant: 'info' }),
      },
      duration: 8000,
    });
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">Environment Matrix</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Service versions across environments · GitOps promote
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-[0.625rem] text-[var(--text-muted)]">
        <span className="flex items-center gap-1">
          <HealthDot status="running" size="sm" /> Healthy
        </span>
        <span className="flex items-center gap-1">
          <HealthDot status="failed" size="sm" /> Degraded
        </span>
        <span className="flex items-center gap-1">
          <GitPullRequest size={10} /> Promote = creates GitOps PR
        </span>
      </div>

      {/* Matrix table */}
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-default)] bg-[var(--surface-overlay)]/50">
              <th className="text-left px-4 py-3 text-[0.6875rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide w-48">
                Service
              </th>
              <th className="text-left px-4 py-3 text-[0.6875rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                Dev
              </th>
              <th className="w-10" />
              <th className="text-left px-4 py-3 text-[0.6875rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                Staging
              </th>
              <th className="w-10" />
              <th className="text-left px-4 py-3 text-[0.6875rem] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                Production
              </th>
            </tr>
          </thead>
          <tbody>
            {mockMatrix.map((row) => {
              const stagingDiffers = row.environments.staging.version !== row.environments.prod.version;
              const devDiffers = row.environments.dev.version !== row.environments.staging.version;
              return (
                <tr
                  key={row.name}
                  className="border-b border-[var(--border-default)] last:border-b-0 hover:bg-[var(--surface-overlay)]/30 transition-colors"
                >
                  {/* Service name */}
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-[var(--text-primary)]">{row.name}</div>
                    <div className="text-[0.625rem] text-[var(--text-muted)]">{row.owner}</div>
                  </td>

                  {/* Dev */}
                  <EnvCell env={row.environments.dev} nextEnv={row.environments.staging} serviceName={row.name} />

                  {/* Dev → Staging promote */}
                  <td className="text-center">
                    {devDiffers ? (
                      <button
                        type="button"
                        onClick={() =>
                          handlePromote(row.name, 'dev', 'staging', row.environments.dev.version)
                        }
                        className="p-1 rounded-md text-[var(--interactive-primary)] hover:bg-[var(--interactive-primary)]/10 transition-colors"
                        title={`Promote ${row.environments.dev.version} to staging`}
                      >
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <span className="text-[0.625rem] text-[var(--text-muted)]">—</span>
                    )}
                  </td>

                  {/* Staging */}
                  <EnvCell env={row.environments.staging} nextEnv={row.environments.prod} serviceName={row.name} />

                  {/* Staging → Prod promote */}
                  <td className="text-center">
                    {stagingDiffers ? (
                      <button
                        type="button"
                        onClick={() =>
                          handlePromote(row.name, 'staging', 'prod', row.environments.staging.version)
                        }
                        className="p-1 rounded-md text-[var(--interactive-primary)] hover:bg-[var(--interactive-primary)]/10 transition-colors"
                        title={`Promote ${row.environments.staging.version} to production`}
                      >
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <span className="text-[0.625rem] text-[var(--text-muted)]">—</span>
                    )}
                  </td>

                  {/* Prod */}
                  <EnvCell env={row.environments.prod} serviceName={row.name} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
