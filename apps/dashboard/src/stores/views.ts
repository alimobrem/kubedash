import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CustomView {
  id: string;
  title: string;
  type: 'service-list' | 'node-list' | 'triage' | 'cost';
  filters: Record<string, string>;
  createdAt: number;
}

interface ViewsState {
  views: CustomView[];
  expanded: boolean;
  addView: (view: Omit<CustomView, 'id' | 'createdAt'>) => void;
  removeView: (id: string) => void;
  renameView: (id: string, title: string) => void;
  toggleExpanded: () => void;
}

export const useViewsStore = create<ViewsState>()(
  persist(
    (set) => ({
      views: [],
      expanded: true,
      addView: (view) =>
        set((s) => ({
          views: [...s.views, { ...view, id: `view-${Date.now()}`, createdAt: Date.now() }],
        })),
      removeView: (id) => set((s) => ({ views: s.views.filter((v) => v.id !== id) })),
      renameView: (id, title) =>
        set((s) => ({
          views: s.views.map((v) => (v.id === id ? { ...v, title } : v)),
        })),
      toggleExpanded: () => set((s) => ({ expanded: !s.expanded })),
    }),
    { name: 'kubedash-views' },
  ),
);
