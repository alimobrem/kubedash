import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light';
export type Density = 'comfortable' | 'compact';
export type Persona = 'developer' | 'platform' | 'oncall' | 'leadership';

interface LayoutState {
  theme: Theme;
  density: Density;
  persona: Persona;
  sidebarCollapsed: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setDensity: (density: Density) => void;
  setPersona: (persona: Persona) => void;
  toggleSidebar: () => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      theme: 'dark',
      density: 'comfortable',
      persona: 'developer',
      sidebarCollapsed: false,
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        set({ theme });
      },
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', next);
          return { theme: next };
        }),
      setDensity: (density) => {
        document.documentElement.setAttribute('data-density', density);
        set({ density });
      },
      setPersona: (persona) => set({ persona }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    {
      name: 'kubedash-layout',
      onRehydrateStorage: () => (state) => {
        if (state) {
          document.documentElement.setAttribute('data-theme', state.theme);
          document.documentElement.setAttribute('data-density', state.density);
        }
      },
    },
  ),
);
