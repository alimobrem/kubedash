import {
  Box,
  CircleDot,
  Cog,
  Container,
  Database,
  Globe,
  HardDrive,
  Layers,
  Lock,
  Network,
  Server,
  Shield,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const iconMap = {
  pod: CircleDot,
  deployment: Layers,
  service: Network,
  ingress: Globe,
  node: Server,
  namespace: Box,
  configmap: Cog,
  secret: Lock,
  pv: HardDrive,
  pvc: Database,
  statefulset: Container,
  daemonset: Shield,
} as const;

export type K8sResourceKind = keyof typeof iconMap;

export interface ResourceIconProps {
  /** K8s resource kind */
  kind: K8sResourceKind;
  /** Icon size in pixels */
  size?: number;
  className?: string;
}

/** Per-resource-type SVG icon using Lucide */
export function ResourceIcon({ kind, size = 16, className }: ResourceIconProps) {
  const Icon = iconMap[kind];
  return <Icon size={size} className={cn('flex-shrink-0', className)} />;
}
