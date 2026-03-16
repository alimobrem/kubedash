import type { ReactNode } from 'react';
import { CommandPalette } from './CommandPalette';
import { GlobalBar } from './GlobalBar';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <GlobalBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[var(--surface-base)]">{children}</main>
      </div>
      <CommandPalette />
    </div>
  );
}
