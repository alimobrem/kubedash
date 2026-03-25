import { MetricValue } from '@kubedash/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { Cpu, MemoryStick } from 'lucide-react';

const meta: Meta<typeof MetricValue> = {
  title: 'Primitives/MetricValue',
  component: MetricValue,
};

export default meta;
type Story = StoryObj<typeof MetricValue>;

export const CpuUsage: Story = {
  args: { label: 'CPU', value: 42, unit: '%', color: 'cpu', icon: <Cpu size={14} /> },
};

export const MemoryUsage: Story = {
  args: {
    label: 'Memory',
    value: 67,
    unit: '%',
    color: 'memory',
    icon: <MemoryStick size={14} />,
    trend: 'up',
  },
};

export const Large: Story = {
  args: { value: 187, unit: 'nodes', size: 'lg' },
};

export const Small: Story = {
  args: { label: 'Pods', value: 2341, size: 'sm' },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <MetricValue label="CPU" value={42} unit="%" color="cpu" size="sm" />
      <MetricValue label="CPU" value={42} unit="%" color="cpu" size="md" />
      <MetricValue label="CPU" value={42} unit="%" color="cpu" size="lg" />
    </div>
  ),
};
