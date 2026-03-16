import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ClusterContext {
  name: string;
  apiUrl: string;
  status: 'connected' | 'degraded' | 'disconnected';
}

interface ClusterState {
  clusters: ClusterContext[];
  activeCluster: string | null;
  activeNamespace: string;
  setActiveCluster: (name: string) => void;
  setActiveNamespace: (ns: string) => void;
  setClusters: (clusters: ClusterContext[]) => void;
}

export const useClusterStore = create<ClusterState>()(
  persist(
    (set) => ({
      clusters: [
        { name: 'prod-us-east-1', apiUrl: '/api/clusters/prod-us-east-1', status: 'connected' },
      ],
      activeCluster: 'prod-us-east-1',
      activeNamespace: 'default',
      setActiveCluster: (name) => set({ activeCluster: name }),
      setActiveNamespace: (ns) => set({ activeNamespace: ns }),
      setClusters: (clusters) => set({ clusters }),
    }),
    { name: 'kubedash-cluster' },
  ),
);
