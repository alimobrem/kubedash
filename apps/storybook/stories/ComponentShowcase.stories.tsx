import type { Meta, StoryObj } from '@storybook/react';
import {
  Avatar,
  BreadcrumbTrail,
  CodeBlock,
  CostBadge,
  EmptyState,
  FilterChip,
  KBD,
  Label,
  RelativeTime,
  ResourceIcon,
  ResourceValue,
  Skeleton,
  Sparkline,
  Truncate,
} from '@kubedash/ui';
import { Inbox } from 'lucide-react';

const meta: Meta = {
  title: 'Overview/Component Showcase',
};

export default meta;
type Story = StoryObj;

export const AllPrimitives: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 640 }}>
      {/* Avatars */}
      <section>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: 8 }}>Avatar</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Avatar name="Alice Chen" size="sm" />
          <Avatar name="Platform Team" size="md" />
          <Avatar name="SRE" size="lg" />
        </div>
      </section>

      {/* Resource Icons */}
      <section>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: 8 }}>ResourceIcon</h3>
        <div style={{ display: 'flex', gap: 12, color: 'var(--text-primary)' }}>
          <ResourceIcon kind="pod" size={20} />
          <ResourceIcon kind="deployment" size={20} />
          <ResourceIcon kind="service" size={20} />
          <ResourceIcon kind="ingress" size={20} />
          <ResourceIcon kind="node" size={20} />
          <ResourceIcon kind="secret" size={20} />
          <ResourceIcon kind="configmap" size={20} />
          <ResourceIcon kind="pvc" size={20} />
        </div>
      </section>

      {/* Labels */}
      <section>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: 8 }}>Label</h3>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Label name="app" value="payment-api" />
          <Label name="version" value="v2.14.3" />
          <Label name="env" value="production" />
          <Label name="team" value="payments" onClick={() => {}} />
        </div>
      </section>

      {/* Filter Chips */}
      <section>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: 8 }}>FilterChip</h3>
        <div style={{ display: 'flex', gap: 6 }}>
          <FilterChip label="namespace" value="payments" onRemove={() => {}} />
          <FilterChip label="status" value="Running" onRemove={() => {}} />
        </div>
      </section>

      {/* KBD */}
      <section>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: 8 }}>KBD</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          <span>Press</span> <KBD>⌘</KBD><KBD>K</KBD> <span>to search</span>
        </div>
      </section>

      {/* ResourceValue */}
      <section>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: 8 }}>ResourceValue</h3>
        <div style={{ display: 'flex', gap: 16 }}>
          <ResourceValue value="250m" type="cpu" />
          <ResourceValue value="512Mi" type="memory" />
          <ResourceValue value="4" type="cpu" />
          <ResourceValue value="2Gi" type="memory" />
        </div>
      </section>

      {/* Sparkline */}
      <section>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: 8 }}>Sparkline</h3>
        <div style={{ display: 'flex', gap: 16 }}>
          <Sparkline data={[20, 35, 42, 38, 45, 52, 48, 55, 60, 58, 62, 65]} color="cpu" showRange />
          <Sparkline data={[60, 62, 58, 65, 70, 85, 92, 88, 80, 75, 72, 68]} color="memory" filled showRange />
        </div>
      </section>

      {/* CostBadge */}
      <section>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: 8 }}>CostBadge</h3>
        <div style={{ display: 'flex', gap: 16 }}>
          <CostBadge monthlyCost={142.30} trend="up" trendPercent={12} />
          <CostBadge monthlyCost={2400} trend="down" trendPercent={8} />
          <CostBadge monthlyCost={89.50} />
        </div>
      </section>

      {/* RelativeTime */}
      <section>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: 8 }}>RelativeTime</h3>
        <RelativeTime timestamp={new Date(Date.now() - 180000).toISOString()} />
      </section>

      {/* Truncate */}
      <section>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: 8 }}>Truncate</h3>
        <div style={{ color: 'var(--text-primary)', fontSize: '0.8rem' }}>
          <Truncate>payment-api-deployment-7f8b9c6d4a-x2k9p</Truncate>
        </div>
      </section>

      {/* BreadcrumbTrail */}
      <section>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: 8 }}>BreadcrumbTrail</h3>
        <BreadcrumbTrail
          items={[
            { label: 'prod-us-east-1', href: '/clusters/prod' },
            { label: 'payments', href: '/ns/payments' },
            { label: 'payment-api', href: '/deployments/payment-api' },
            { label: 'payment-api-7f8b9c' },
          ]}
          onNavigate={() => {}}
        />
      </section>

      {/* Skeleton */}
      <section>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: 8 }}>Skeleton</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 200 }}>
          <Skeleton width="full" height="md" />
          <Skeleton width="lg" height="sm" />
          <Skeleton width="md" height="xs" />
        </div>
      </section>

      {/* CodeBlock */}
      <section>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: 8 }}>CodeBlock</h3>
        <CodeBlock language="yaml">{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: payment-api
  namespace: payments
spec:
  replicas: 3
  selector:
    matchLabels:
      app: payment-api`}</CodeBlock>
      </section>

      {/* EmptyState */}
      <section>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: 8 }}>EmptyState</h3>
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 8 }}>
          <EmptyState
            icon={<Inbox />}
            title="No deployments found"
            description='No deployments in namespace "payments". Create one to get started.'
            actions={
              <button
                type="button"
                style={{
                  padding: '6px 16px',
                  borderRadius: 6,
                  backgroundColor: 'var(--interactive-primary)',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Create Deployment
              </button>
            }
          />
        </div>
      </section>
    </div>
  ),
};
