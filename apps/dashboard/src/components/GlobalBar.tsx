import { cn } from '@kubedash/ui';
import {
  Bell,
  ChevronDown,
  Columns2,
  Hexagon,
  Moon,
  Rows2,
  Search,
  Sun,
} from 'lucide-react';
import { useClusterStore } from '../stores/cluster';
import { useLayoutStore } from '../stores/layout';

export function GlobalBar() {
  const { theme, toggleTheme, density, setDensity } = useLayoutStore();
  const { activeCluster, clusters, activeNamespace } = useClusterStore();

  const currentCluster = clusters.find((c) => c.name === activeCluster);

  return (
    <header className="h-12 border-b border-[var(--border-default)] bg-[var(--surface-raised)] flex items-center px-4 gap-3 flex-shrink-0 z-[var(--z-sticky)]">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-2">
        <Hexagon size={20} className="text-[var(--interactive-primary)]" />
        <span className="font-semibold text-sm text-[var(--text-primary)]">KubeDash</span>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-[var(--border-default)]" />

      {/* Cluster Switcher */}
      <button
        type="button"
        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs hover:bg-[var(--surface-overlay)] transition-colors"
      >
        <span
          className={cn(
            'w-2 h-2 rounded-full',
            currentCluster?.status === 'connected'
              ? 'bg-[var(--status-running)]'
              : 'bg-[var(--status-pending)]',
          )}
        />
        <span className="text-[var(--text-primary)] font-medium">
          {activeCluster || 'No cluster'}
        </span>
        <ChevronDown size={12} className="text-[var(--text-muted)]" />
      </button>

      {/* Divider */}
      <div className="w-px h-5 bg-[var(--border-default)]" />

      {/* Namespace Picker */}
      <button
        type="button"
        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs hover:bg-[var(--surface-overlay)] transition-colors"
      >
        <span className="text-[var(--text-secondary)]">ns:</span>
        <span className="text-[var(--text-primary)] font-medium">{activeNamespace}</span>
        <ChevronDown size={12} className="text-[var(--text-muted)]" />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Command Palette Trigger */}
      <button
        type="button"
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--border-default)] bg-[var(--surface-base)] hover:bg-[var(--surface-overlay)] text-xs text-[var(--text-muted)] transition-colors min-w-[200px]"
      >
        <Search size={14} />
        <span>Search...</span>
        <div className="flex-1" />
        <kbd className="text-[0.625rem] text-[var(--text-muted)] border border-[var(--border-default)] rounded px-1 py-0.5 font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Density Toggle */}
      <button
        type="button"
        onClick={() => setDensity(density === 'comfortable' ? 'compact' : 'comfortable')}
        className="p-1.5 rounded-md hover:bg-[var(--surface-overlay)] text-[var(--text-secondary)] transition-colors"
        title={`Switch to ${density === 'comfortable' ? 'compact' : 'comfortable'} mode`}
      >
        {density === 'comfortable' ? <Rows2 size={16} /> : <Columns2 size={16} />}
      </button>

      {/* Theme Toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        className="p-1.5 rounded-md hover:bg-[var(--surface-overlay)] text-[var(--text-secondary)] transition-colors"
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Notifications */}
      <button
        type="button"
        className="p-1.5 rounded-md hover:bg-[var(--surface-overlay)] text-[var(--text-secondary)] transition-colors relative"
      >
        <Bell size={16} />
        <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[var(--status-failed)]" />
      </button>

      {/* User Avatar */}
      <button
        type="button"
        className="w-7 h-7 rounded-full bg-[var(--interactive-primary)] text-white text-xs font-semibold flex items-center justify-center"
      >
        AM
      </button>
    </header>
  );
}
