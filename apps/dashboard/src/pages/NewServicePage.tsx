import { cn } from '@kubedash/ui';
import { Check, ChevronRight, Info } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../components/Toast';

type Step = 'template' | 'configure' | 'resources' | 'review';

const steps: { id: Step; label: string }[] = [
  { id: 'template', label: 'Template' },
  { id: 'configure', label: 'Configure' },
  { id: 'resources', label: 'Resources' },
  { id: 'review', label: 'Review' },
];

const templates = [
  { id: 'rest-api', name: 'REST API', desc: 'HTTP service with health checks, HPA, and ingress', icon: '🌐' },
  { id: 'worker', name: 'Background Worker', desc: 'Queue consumer with autoscaling', icon: '⚙️' },
  { id: 'grpc', name: 'gRPC Service', desc: 'gRPC service with mTLS', icon: '🔗' },
  { id: 'cron', name: 'CronJob', desc: 'Scheduled batch job', icon: '⏰' },
];

export function NewServicePage() {
  const [currentStep, setCurrentStep] = useState<Step>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [config, setConfig] = useState({
    name: '',
    namespace: 'payments',
    port: '8080',
    healthPath: '/healthz',
    owner: 'team-payments',
    slack: '#payments-oncall',
    tier: 'standard' as 'critical' | 'standard' | 'best-effort',
  });
  const { toast } = useToast();

  const stepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleCreate = () => {
    toast(`Creating PR for ${config.name} (${selectedTemplate} template)...`, {
      variant: 'success',
      action: {
        label: 'View PR',
        onClick: () => toast('Opening PR in new tab', { variant: 'info' }),
      },
      duration: 8000,
    });
    // Reset
    setCurrentStep('template');
    setSelectedTemplate(null);
    setConfig({ ...config, name: '' });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">New Service</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Golden path wizard · generates GitOps PR</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((step, i) => {
          const isCompleted = i < stepIndex;
          const isActive = step.id === currentStep;
          return (
            <div key={step.id} className="flex items-center gap-2">
              {i > 0 && <div className="w-8 h-px bg-[var(--border-default)]" />}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold',
                    isCompleted
                      ? 'bg-[var(--status-running)] text-white'
                      : isActive
                        ? 'bg-[var(--interactive-primary)] text-white'
                        : 'bg-[var(--surface-overlay)] text-[var(--text-muted)]',
                  )}
                >
                  {isCompleted ? <Check size={12} /> : i + 1}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium',
                    isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]',
                  )}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-6">
        {currentStep === 'template' && (
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Choose a template</h2>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTemplate(t.id)}
                  className={cn(
                    'text-left p-4 rounded-lg border transition-all',
                    selectedTemplate === t.id
                      ? 'border-[var(--interactive-primary)] bg-[var(--interactive-primary)]/5'
                      : 'border-[var(--border-default)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-overlay)]',
                  )}
                >
                  <div className="text-xl mb-2">{t.icon}</div>
                  <div className="text-sm font-medium text-[var(--text-primary)]">{t.name}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'configure' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Configure Your Service</h2>
            {[
              { label: 'Service Name', key: 'name' as const, placeholder: 'my-service', hint: 'lowercase, alphanumeric, max 63 chars' },
              { label: 'Namespace', key: 'namespace' as const, placeholder: 'default' },
              { label: 'Port', key: 'port' as const, placeholder: '8080', hint: 'default for REST API' },
              { label: 'Health Check Path', key: 'healthPath' as const, placeholder: '/healthz' },
              { label: 'Owner Team', key: 'owner' as const, placeholder: 'team-platform' },
              { label: 'Slack Channel', key: 'slack' as const, placeholder: '#my-team-oncall' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={config[field.key]}
                  onChange={(e) => setConfig({ ...config, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--surface-base)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)]"
                />
                {field.hint && <p className="text-[0.625rem] text-[var(--text-muted)] mt-1">{field.hint}</p>}
              </div>
            ))}

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Service Tier</label>
              <div className="flex gap-3">
                {(['critical', 'standard', 'best-effort'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setConfig({ ...config, tier })}
                    className={cn(
                      'px-4 py-2 rounded-md border text-xs font-medium transition-all capitalize',
                      config.tier === tier
                        ? 'border-[var(--interactive-primary)] bg-[var(--interactive-primary)]/10 text-[var(--interactive-primary)]'
                        : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-overlay)]',
                    )}
                  >
                    {tier.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Golden path defaults info */}
            <div className="rounded-lg border border-[var(--interactive-primary)]/20 bg-[var(--interactive-primary)]/5 p-4 flex gap-3">
              <Info size={16} className="text-[var(--interactive-primary)] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[var(--text-primary)] space-y-1">
                <p className="font-medium">Based on your template and tier, we will:</p>
                <ul className="list-disc pl-4 text-[var(--text-secondary)] space-y-0.5">
                  <li>Set resource limits to 500m CPU / 512Mi memory</li>
                  <li>Configure HPA (min: 2, max: 10, target CPU: 70%)</li>
                  <li>Add PodDisruptionBudget (minAvailable: 1)</li>
                  <li>Enable liveness + readiness probes</li>
                  <li>Add NetworkPolicy (ingress from gateway only)</li>
                </ul>
                <p className="text-[var(--text-muted)]">You can customize these in the next step.</p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'resources' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Resource Configuration</h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Pre-filled with golden path defaults for a <strong>{config.tier}</strong> {selectedTemplate} service.
            </p>
            {[
              { label: 'CPU Request', value: '250m', hint: 'Recommended based on template' },
              { label: 'CPU Limit', value: '500m' },
              { label: 'Memory Request', value: '256Mi' },
              { label: 'Memory Limit', value: '512Mi' },
              { label: 'Min Replicas', value: config.tier === 'critical' ? '3' : '2' },
              { label: 'Max Replicas', value: '10' },
            ].map((field) => (
              <div key={field.label} className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-[var(--text-secondary)]">{field.label}</span>
                  {field.hint && <p className="text-[0.625rem] text-[var(--text-muted)]">{field.hint}</p>}
                </div>
                <input
                  type="text"
                  defaultValue={field.value}
                  className="w-24 px-2 py-1.5 rounded-md border border-[var(--border-default)] bg-[var(--surface-base)] text-xs text-[var(--text-primary)] text-right font-mono focus:outline-none focus:border-[var(--border-focus)]"
                />
              </div>
            ))}
          </div>
        )}

        {currentStep === 'review' && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Review & Create</h2>
            <div className="space-y-2 text-xs">
              {[
                ['Template', templates.find((t) => t.id === selectedTemplate)?.name || ''],
                ['Service Name', config.name || '(not set)'],
                ['Namespace', config.namespace],
                ['Port', config.port],
                ['Health Check', config.healthPath],
                ['Owner', config.owner],
                ['Tier', config.tier],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-[var(--border-default)]">
                  <span className="text-[var(--text-secondary)]">{label}</span>
                  <span className="text-[var(--text-primary)] font-medium">{value}</span>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-[var(--surface-base)] border border-[var(--border-default)] p-3">
              <p className="text-xs text-[var(--text-secondary)]">
                This will create a <strong className="text-[var(--text-primary)]">Pull Request</strong> in your GitOps
                repository with the Deployment, Service, Ingress, HPA, PDB, and NetworkPolicy manifests.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => setCurrentStep(steps[stepIndex - 1].id)}
          disabled={stepIndex === 0}
          className={cn(
            'px-4 py-2 text-xs font-medium rounded-md border transition-colors',
            stepIndex === 0
              ? 'border-transparent text-transparent cursor-default'
              : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-overlay)]',
          )}
        >
          ← Back
        </button>

        {currentStep === 'review' ? (
          <button
            type="button"
            onClick={handleCreate}
            className="px-6 py-2 text-xs font-semibold rounded-md bg-[var(--interactive-primary)] text-white hover:bg-[var(--interactive-primary-hover)] transition-colors"
          >
            Create PR →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentStep(steps[stepIndex + 1].id)}
            disabled={currentStep === 'template' && !selectedTemplate}
            className={cn(
              'px-4 py-2 text-xs font-semibold rounded-md transition-colors',
              currentStep === 'template' && !selectedTemplate
                ? 'bg-[var(--surface-overlay)] text-[var(--text-muted)] cursor-not-allowed'
                : 'bg-[var(--interactive-primary)] text-white hover:bg-[var(--interactive-primary-hover)]',
            )}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
