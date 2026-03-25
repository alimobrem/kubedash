import { HealthDot, MetricValue } from '@kubedash/ui';
import { AlertTriangle, Box, CheckCircle, Server, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { DetailSheet } from '../components/DetailSheet';
import { PulseInsightCard } from '../components/PulseInsightCard';
import { PulseText } from '../components/PulseText';
import { ServiceCard, type ServiceCardData } from '../components/ServiceCard';
import { ServiceDetail } from '../components/ServiceDetail';
import { mockServices } from '../mock-data';
import { usePulseStore } from '../stores/pulse';
import { generateServicesWelcomeInsight } from '../utils/pulse-templates';

const suggestedQueries = [
  'Show me services using >80% CPU',
  'Which service costs the most?',
  'What changed in the last hour?',
  'Compare costs to last month',
];

export function MyServicesPage() {
  const [selectedService, setSelectedService] = useState<ServiceCardData | null>(null);
  const [pulseInput, setPulseInput] = useState('');
  const { sendMessage } = usePulseStore();
  const services = mockServices;
  const healthy = services.filter(
    (s) => s.status === 'running' && s.replicas.ready === s.replicas.desired,
  );
  const degraded = services.filter(
    (s) => s.status !== 'running' || s.replicas.ready < s.replicas.desired,
  );
  const insight = generateServicesWelcomeInsight(services);

  const handlePulseSubmit = (query?: string) => {
    const msg = query ?? pulseInput.trim();
    if (!msg) return;
    sendMessage(msg);
    setPulseInput('');
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">My Services</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {services.length} services · team-payments
        </p>
      </div>

      {/* Pulse Welcome Card */}
      <div className="mb-6 rounded-xl border border-[var(--pulse-border)] bg-[var(--surface-raised)] p-5 shadow-[0_0_20px_var(--pulse-glow)]">
        <PulseInsightCard id="welcome-insight" severity={insight.severity} dismissible={false}>
          <PulseText text={insight.text} />
        </PulseInsightCard>

        {/* Inline ask input */}
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--surface-base)] px-3 py-2 focus-within:border-[var(--pulse-accent)] transition-colors">
          <Sparkles size={14} className="text-[var(--pulse-accent)] flex-shrink-0" />
          <input
            type="text"
            value={pulseInput}
            onChange={(e) => setPulseInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handlePulseSubmit();
              }
            }}
            placeholder="Ask about your services..."
            className="flex-1 bg-transparent text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
          />
          <kbd className="text-xs text-[var(--text-muted)] border border-[var(--border-default)] rounded px-1 py-0.5 font-mono">
            ⌘J
          </kbd>
        </div>

        {/* Suggested queries */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {suggestedQueries.map((query) => (
            <button
              key={query}
              type="button"
              onClick={() => handlePulseSubmit(query)}
              className="text-xs px-2.5 py-1 rounded-full border border-[var(--pulse-border)] text-[var(--pulse-accent)] hover:bg-[var(--pulse-accent-bg)] transition-colors"
            >
              {query}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] p-4 flex items-center gap-3">
          <Box size={20} className="text-[var(--interactive-primary)]" />
          <MetricValue value={services.length} label="Total" size="sm" />
        </div>
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] p-4 flex items-center gap-3">
          <CheckCircle size={20} className="text-[var(--status-running)]" />
          <MetricValue value={healthy.length} label="Healthy" size="sm" color="default" />
        </div>
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] p-4 flex items-center gap-3">
          <AlertTriangle size={20} className="text-[var(--status-pending)]" />
          <MetricValue value={degraded.length} label="Needs Attention" size="sm" />
        </div>
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] p-4 flex items-center gap-3">
          <Server size={20} className="text-[var(--text-secondary)]" />
          <MetricValue
            value={`$${services.reduce((sum, s) => sum + (s.cost?.monthly || 0), 0).toFixed(0)}`}
            label="Monthly Cost"
            size="sm"
          />
        </div>
      </div>

      {/* Degraded Services Alert */}
      {degraded.length > 0 && (
        <div className="mb-6 rounded-lg border border-[var(--status-failed)]/30 bg-[var(--status-failed-bg)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <HealthDot status="failed" pulse />
            <span className="text-sm font-semibold text-[var(--status-failed)]">
              {degraded.length} service{degraded.length > 1 ? 's' : ''} need attention
            </span>
          </div>
          <div className="flex gap-2">
            {degraded.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => setSelectedService(s)}
                className="text-xs text-[var(--text-primary)] bg-[var(--surface-raised)] rounded px-2 py-1 border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-colors cursor-pointer"
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Service Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {services.map((service) => (
          <ServiceCard
            key={service.name}
            service={service}
            onClick={() => setSelectedService(service)}
          />
        ))}
      </div>

      {/* Detail Sheet */}
      <DetailSheet
        open={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={
          selectedService ? (
            <div className="flex items-center gap-2">
              <HealthDot status={selectedService.status} />
              <span>{selectedService.name}</span>
            </div>
          ) : (
            ''
          )
        }
        subtitle={
          selectedService
            ? `${selectedService.version} · ${selectedService.owner} · ${selectedService.namespace}`
            : undefined
        }
        width={520}
      >
        {selectedService && <ServiceDetail service={selectedService} />}
      </DetailSheet>
    </div>
  );
}
