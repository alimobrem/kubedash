import { z } from 'zod';

/** K8s resource reference within a PlatformType */
export const K8sResourceRef = z.object({
  apiVersion: z.string(),
  kind: z.string(),
});

/** Scorecard check definition */
export const ScorecardCheck = z.object({
  name: z.string(),
  check: z.string(),
  description: z.string().optional(),
  fixUrl: z.string().optional(),
});

/** Platform Type definition -- how raw K8s resources compose into services */
export const PlatformType = z.object({
  apiVersion: z.literal('dashboard.io/v1'),
  kind: z.literal('PlatformType'),
  metadata: z.object({
    name: z.string(),
  }),
  spec: z.object({
    displayName: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
    composedOf: z.array(K8sResourceRef),
    ownerLabel: z.string().default('team.company.io/owner'),
    groupByLabel: z.string().default('app.kubernetes.io/name'),
    actions: z.array(z.string()).default(['restart', 'scale', 'rollback', 'view-logs']),
    scorecard: z.array(ScorecardCheck).default([]),
  }),
});

export type PlatformType = z.infer<typeof PlatformType>;
export type K8sResourceRef = z.infer<typeof K8sResourceRef>;
export type ScorecardCheck = z.infer<typeof ScorecardCheck>;
