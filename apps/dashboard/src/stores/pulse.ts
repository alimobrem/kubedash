import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PulseAction {
  label: string;
  type: 'navigate' | 'execute' | 'copy' | 'create-view';
  payload: string;
}

export interface PulseArtifact {
  type: 'view-config' | 'yaml' | 'table' | 'chart';
  data: unknown;
}

export interface PulseMessage {
  id: string;
  role: 'user' | 'pulse';
  content: string;
  timestamp: number;
  actions?: PulseAction[];
  artifacts?: PulseArtifact[];
}

export interface PulseInsight {
  id: string;
  contextKey: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  body: string;
  actions?: PulseAction[];
  dismissed: boolean;
}

interface PulseState {
  panelOpen: boolean;
  messages: PulseMessage[];
  insights: PulseInsight[];
  isProcessing: boolean;
  dismissedInsights: Record<string, number>;

  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  sendMessage: (content: string) => void;
  dismissInsight: (id: string) => void;
  clearConversation: () => void;
}

export const usePulseStore = create<PulseState>()(
  persist(
    (set) => ({
      panelOpen: false,
      messages: [],
      insights: [],
      isProcessing: false,
      dismissedInsights: {},

      togglePanel: () => set((s) => ({ panelOpen: !s.panelOpen })),
      openPanel: () => set({ panelOpen: true }),
      closePanel: () => set({ panelOpen: false }),

      sendMessage: (content: string) => {
        const userMsg: PulseMessage = {
          id: `${Date.now()}-user`,
          role: 'user',
          content,
          timestamp: Date.now(),
        };

        set((s) => ({
          messages: [...s.messages, userMsg],
          isProcessing: true,
          panelOpen: true,
        }));

        // Simulate a response (will be replaced by real LLM integration)
        setTimeout(() => {
          const pulseMsg: PulseMessage = {
            id: `${Date.now()}-pulse`,
            role: 'pulse',
            content: generateSimulatedResponse(content),
            timestamp: Date.now(),
            actions: [{ label: 'View details', type: 'navigate', payload: '/' }],
          };
          set((s) => ({
            messages: [...s.messages, pulseMsg],
            isProcessing: false,
          }));
        }, 800);
      },

      dismissInsight: (id: string) =>
        set((s) => ({
          dismissedInsights: { ...s.dismissedInsights, [id]: Date.now() },
        })),

      clearConversation: () => set({ messages: [] }),
    }),
    {
      name: 'kubedash-pulse',
      partialize: (state) => ({
        dismissedInsights: state.dismissedInsights,
      }),
    },
  ),
);

function generateSimulatedResponse(query: string): string {
  const lower = query.toLowerCase();
  if (lower.includes('cost'))
    return "Your total monthly spend is **$2,847**. The largest contributor is **order-processor** at $620/mo, which scaled from 3 to 8 replicas after last week's HPA change. Consider right-sizing the CPU request from 500m to 350m to save ~$180/mo.";
  if (lower.includes('fail') || lower.includes('crash') || lower.includes('down'))
    return '**checkout-svc** started crash-looping 8 minutes ago. The most likely cause is the config change deployed at 14:22 (commit `a3f8d2e`). The previous version `v2.14.2` was stable for 3 days. Consider rolling back.';
  if (lower.includes('cpu') || lower.includes('memory') || lower.includes('resource'))
    return '3 services are using >80% CPU: **payment-api** (75%), **order-processor** (82%), and **checkout-svc** (91%). checkout-svc is also showing high memory pressure at 88%.';
  if (lower.includes('health') || lower.includes('status'))
    return '5 of 6 services are healthy. **checkout-svc** is in CrashLoopBackOff with 0/3 replicas ready. All other services have full replica availability.';
  if (lower.includes('change') || lower.includes('deploy'))
    return 'In the last hour: 1 deployment (checkout-svc v2.14.3 at 14:22), 1 config change (checkout-svc-config at 14:20), and 1 HPA trigger (order-processor scaled to 8 replicas at 13:45).';
  return `I can help you investigate that. Here's what I found across your cluster:\n\n- **6 services** running across **2 namespaces**\n- **1 service** needs attention (checkout-svc)\n- Cluster CPU utilization at **67%** average\n\nWould you like me to dive deeper into any of these areas?`;
}
