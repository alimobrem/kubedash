import { cn } from '@kubedash/ui';
import { generateServiceExplanation } from '../utils/pulse-templates';
import { PulseInsightCard } from './PulseInsightCard';
import { PulseText } from './PulseText';
import type { ServiceCardData } from './ServiceCard';

interface PulseExplainProps {
  service: ServiceCardData;
  className?: string;
}

export function ExplainButton({ service, className }: PulseExplainProps) {
  const explanation = generateServiceExplanation(service);

  return (
    <div className={cn('w-full', className)}>
      <PulseInsightCard
        id={`service-explain-${service.name}`}
        severity={
          service.status === 'failed'
            ? 'critical'
            : service.status === 'pending'
              ? 'warning'
              : 'info'
        }
        actions={[{ label: 'View logs', type: 'navigate', payload: '/logs' }]}
      >
        <PulseText text={explanation} />
      </PulseInsightCard>
    </div>
  );
}
