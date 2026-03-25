import { usePulseStore } from '../stores/pulse';

export function usePulseInsights(contextKey: string) {
  const { insights, dismissedInsights, dismissInsight } = usePulseStore();

  const activeInsights = insights.filter(
    (i) => i.contextKey === contextKey && !i.dismissed && !dismissedInsights[i.id],
  );

  return {
    insights: activeInsights,
    dismissInsight,
    hasInsights: activeInsights.length > 0,
  };
}
