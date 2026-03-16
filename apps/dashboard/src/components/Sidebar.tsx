import { cn } from '@kubedash/ui';
import {
  Activity,
  Box,
  ChevronLeft,
  Cog,
  DollarSign,
  Globe,
  HardDrive,
  LayoutDashboard,
  Lock,
  Network,
  PanelLeft,
  Plus,
  ScrollText,
  Server,
  Shield,
  Star,
  Zap,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useLayoutStore, type Persona } from '../stores/layout';

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
  personas: Persona[];
  badge?: string;
}

const navItems: NavItem[] = [
  // Developer items
  { id: 'my-services', label: 'My Services', icon: <Star size={18} />, path: '/', personas: ['developer'] },
  { id: 'deploy', label: 'Deploy', icon: <Activity size={18} />, path: '/deploy', personas: ['developer'] },
  { id: 'logs', label: 'Logs', icon: <ScrollText size={18} />, path: '/logs', personas: ['developer', 'oncall'] },
  { id: 'new-service', label: 'New Service', icon: <Plus size={18} />, path: '/new-service', personas: ['developer'] },

  // On-Call items
  { id: 'triage', label: 'Triage', icon: <Zap size={18} />, path: '/triage', personas: ['oncall', 'platform'] },

  // Platform items
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} />, path: '/overview', personas: ['platform', 'oncall'] },
  { id: 'services', label: 'Services', icon: <Box size={18} />, path: '/services', personas: ['platform', 'oncall'] },
  { id: 'nodes', label: 'Nodes', icon: <Server size={18} />, path: '/nodes', personas: ['platform', 'oncall'] },
  { id: 'networking', label: 'Networking', icon: <Globe size={18} />, path: '/networking', personas: ['platform'] },
  { id: 'storage', label: 'Storage', icon: <HardDrive size={18} />, path: '/storage', personas: ['platform'] },
  { id: 'config', label: 'Configuration', icon: <Cog size={18} />, path: '/configuration', personas: ['platform'] },
  { id: 'security', label: 'Security', icon: <Shield size={18} />, path: '/security', personas: ['platform'] },
  { id: 'topology', label: 'Topology', icon: <Network size={18} />, path: '/topology', personas: ['platform'] },

  // Leadership items
  { id: 'cost', label: 'Cost', icon: <DollarSign size={18} />, path: '/cost', personas: ['leadership', 'platform'] },
  { id: 'reliability', label: 'Reliability', icon: <Activity size={18} />, path: '/reliability', personas: ['leadership'] },
  { id: 'maturity', label: 'Maturity', icon: <Lock size={18} />, path: '/maturity', personas: ['leadership'] },
];

export function Sidebar() {
  const { persona, sidebarCollapsed, toggleSidebar } = useLayoutStore();
  const filteredItems = navItems.filter((item) => item.personas.includes(persona));
  const currentPath = window.location.pathname;

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-[var(--border-default)] bg-[var(--surface-raised)] transition-all duration-200 flex-shrink-0',
        sidebarCollapsed ? 'w-12' : 'w-52',
      )}
    >
      {/* Nav Items */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <a
              key={item.id}
              href={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 mx-1 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-[var(--interactive-primary)]/10 text-[var(--interactive-primary)] font-medium'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-overlay)]',
                sidebarCollapsed && 'justify-center px-0',
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
              {!sidebarCollapsed && item.badge && (
                <span className="ml-auto text-[0.625rem] font-semibold bg-[var(--status-failed)] text-white rounded-full px-1.5 py-0.5">
                  {item.badge}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-[var(--border-default)] p-2">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full p-1.5 rounded-md hover:bg-[var(--surface-overlay)] text-[var(--text-muted)] transition-colors"
        >
          {sidebarCollapsed ? <PanelLeft size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
