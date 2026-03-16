/** Plugin extension point contracts */

/** A plugin registration manifest */
export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  permissions: PluginPermission[];
  extensionPoints: ExtensionPointRegistration[];
}

/** Permissions a plugin requests */
export type PluginPermission =
  | { type: 'read'; resources: string[] }
  | { type: 'action'; actions: string[] }
  | { type: 'navigation' };

/** Extension point registration */
export type ExtensionPointRegistration =
  | { type: 'sidebar-item'; config: SidebarItemExtension }
  | { type: 'detail-tab'; config: DetailTabExtension }
  | { type: 'overview-card'; config: OverviewCardExtension }
  | { type: 'action'; config: ActionExtension }
  | { type: 'table-column'; config: TableColumnExtension }
  | { type: 'resource-renderer'; config: ResourceRendererExtension };

export interface SidebarItemExtension {
  label: string;
  icon: string;
  path: string;
  section?: string;
  priority?: number;
}

export interface DetailTabExtension {
  label: string;
  resourceKinds: string[];
  priority?: number;
}

export interface OverviewCardExtension {
  title: string;
  priority?: number;
}

export interface ActionExtension {
  label: string;
  icon?: string;
  resourceKinds: string[];
  tier: 'read' | 'operate' | 'dangerous';
}

export interface TableColumnExtension {
  header: string;
  resourceKinds: string[];
  priority?: number;
}

export interface ResourceRendererExtension {
  apiVersion: string;
  kind: string;
}
