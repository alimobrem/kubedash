import { type ReactNode, useEffect } from 'react';
import { usePulseStore } from '../stores/pulse';
import { CommandPalette } from './CommandPalette';
import { GlobalBar } from './GlobalBar';
import { PulsePanel } from './PulsePanel';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const togglePanel = usePulseStore((s) => s.togglePanel);

  // Cmd+J to toggle Pulse panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        togglePanel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [togglePanel]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <GlobalBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[var(--surface-base)]">{children}</main>
      </div>
      <CommandPalette />
      <PulsePanel />
    </div>
  );
}
