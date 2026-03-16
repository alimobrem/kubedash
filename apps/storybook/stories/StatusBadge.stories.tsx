import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from '@kubedash/ui';

const meta: Meta<typeof StatusBadge> = {
  title: 'Primitives/StatusBadge',
  component: StatusBadge,
  argTypes: {
    status: {
      control: 'select',
      options: ['running', 'pending', 'failed', 'creating', 'terminating', 'unknown'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['filled', 'outline'] },
    showShape: { control: 'boolean' },
    pulse: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Running: Story = { args: { status: 'running' } };
export const Pending: Story = { args: { status: 'pending' } };
export const Failed: Story = { args: { status: 'failed', pulse: true } };
export const Creating: Story = { args: { status: 'creating' } };
export const Terminating: Story = { args: { status: 'terminating' } };
export const Unknown: Story = { args: { status: 'unknown' } };

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <StatusBadge status="running" />
      <StatusBadge status="pending" />
      <StatusBadge status="failed" />
      <StatusBadge status="creating" />
      <StatusBadge status="terminating" />
      <StatusBadge status="unknown" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <StatusBadge status="running" size="sm" />
      <StatusBadge status="running" size="md" />
      <StatusBadge status="running" size="lg" />
    </div>
  ),
};

export const CustomLabel: Story = {
  args: { status: 'running', children: 'Healthy' },
};

export const WithoutShape: Story = {
  args: { status: 'failed', showShape: false },
};
