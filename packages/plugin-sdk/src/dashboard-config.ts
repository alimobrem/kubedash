import { z } from 'zod';

/** Tenancy model configuration */
const TenancyConfig = z.object({
  model: z.enum(['namespace-per-team', 'namespace-per-service', 'namespace-per-environment']),
  ownerLabel: z.string().default('team.company.io/owner'),
});

/** Persona sidebar configuration */
const PersonaConfig = z.object({
  sidebar: z.union([z.literal('all'), z.array(z.string())]),
  hiddenResources: z.array(z.string()).optional(),
});

/** Action guardrail configuration */
const ActionConfig = z.object({
  maxReplicas: z.number().optional(),
  requireApproval: z.boolean().default(false),
});

const ExecConfig = z.object({
  production: z.enum(['disabled', 'approval-required', 'allowed']).default('disabled'),
  staging: z.enum(['disabled', 'approval-required', 'allowed']).default('allowed'),
  development: z.enum(['disabled', 'approval-required', 'allowed']).default('allowed'),
  sessionRecording: z.boolean().default(true),
  maxDurationMinutes: z.number().default(30),
});

const DeleteConfig = z.object({
  requireNameConfirmation: z.boolean().default(true),
});

/** GitOps mode configuration */
const GitOpsConfig = z.object({
  mode: z.enum(['direct', 'gitops']).default('direct'),
  argocd: z.object({ url: z.string() }).optional(),
  flux: z.object({ url: z.string() }).optional(),
  repoUrl: z.string().optional(),
});

/** External tool integration */
const IntegrationsConfig = z.object({
  grafana: z
    .object({
      url: z.string(),
      logTemplate: z.string().optional(),
      dashboardTemplate: z.string().optional(),
    })
    .optional(),
  pagerduty: z
    .object({
      serviceMapTemplate: z.string().optional(),
    })
    .optional(),
  opsgenie: z
    .object({
      url: z.string().optional(),
    })
    .optional(),
  backstage: z
    .object({
      url: z.string(),
    })
    .optional(),
  costProvider: z.enum(['opencost', 'kubecost', 'none']).default('none'),
  prometheus: z
    .object({
      url: z.string().default('/api/prometheus'),
    })
    .optional(),
});

/** Well-known annotation keys */
const AnnotationKeys = z.object({
  owner: z.string().default('team.company.io/owner'),
  slackChannel: z.string().default('team.company.io/slack'),
  runbook: z.string().default('team.company.io/runbook'),
  tier: z.string().default('team.company.io/tier'),
  ciPipelineUrl: z.string().default('ci.pipeline/run-url'),
  commitSha: z.string().default('ci.pipeline/commit-sha'),
});

/** Branding configuration */
const BrandingConfig = z.object({
  logo: z.string().optional(),
  title: z.string().default('KubeDash'),
  primaryColor: z.string().optional(),
});

/** Complete DashboardConfig CRD schema */
export const DashboardConfig = z.object({
  apiVersion: z.literal('dashboard.io/v1'),
  kind: z.literal('DashboardConfig'),
  metadata: z.object({
    name: z.string(),
  }),
  spec: z.object({
    branding: BrandingConfig.optional(),
    tenancy: TenancyConfig,
    personas: z
      .object({
        appDeveloper: PersonaConfig.optional(),
        platformEngineer: PersonaConfig.optional(),
        onCall: PersonaConfig.optional(),
        leadership: PersonaConfig.optional(),
      })
      .optional(),
    actions: z
      .object({
        scale: ActionConfig.optional(),
        exec: ExecConfig.optional(),
        delete: DeleteConfig.optional(),
      })
      .optional(),
    gitops: GitOpsConfig.optional(),
    integrations: IntegrationsConfig.optional(),
    annotations: AnnotationKeys.optional(),
  }),
});

export type DashboardConfig = z.infer<typeof DashboardConfig>;
