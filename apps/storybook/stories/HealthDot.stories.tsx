import { HealthDot } from '@kubedash/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof HealthDot> = {
  title: 'Primitives/HealthDot',
  component: HealthDot,
  argTypes: {
    status: {
      control: 'select',
      options: ['running', 'pending', 'failed', 'creating', 'terminating', 'unknown'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    pulse: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof HealthDot>;

export const Running: Story = { args: { status: 'running' } };
export const Failed: Story = { args: { status: 'failed', pulse: true } };

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <HealthDot status="running" label="Running" />
      <HealthDot status="pending" label="Pending" />
      <HealthDot status="failed" label="Failed" />
      <HealthDot status="creating" label="Creating" />
      <HealthDot status="terminating" label="Terminating" />
      <HealthDot status="unknown" label="Unknown" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <HealthDot status="running" size="sm" />
      <HealthDot status="running" size="md" />
      <HealthDot status="running" size="lg" />
    </div>
  ),
};
