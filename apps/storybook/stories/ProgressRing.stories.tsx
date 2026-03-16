import type { Meta, StoryObj } from '@storybook/react';
import { ProgressRing } from '@kubedash/ui';

const meta: Meta<typeof ProgressRing> = {
  title: 'Primitives/ProgressRing',
  component: ProgressRing,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    color: {
      control: 'select',
      options: ['cpu', 'memory', 'storage', 'network', 'success', 'warning', 'danger', 'default'],
    },
    autoColor: { control: 'boolean' },
    size: { control: { type: 'range', min: 24, max: 96, step: 4 } },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressRing>;

export const Default: Story = { args: { value: 42, color: 'cpu' } };
export const HighUsage: Story = { args: { value: 91, autoColor: true } };
export const MediumUsage: Story = { args: { value: 74, autoColor: true } };
export const LowUsage: Story = { args: { value: 35, autoColor: true } };

export const AutoColorRange: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <ProgressRing value={30} autoColor size={56} />
      <ProgressRing value={55} autoColor size={56} />
      <ProgressRing value={75} autoColor size={56} />
      <ProgressRing value={92} autoColor size={56} />
    </div>
  ),
};

export const MetricColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <ProgressRing value={42} color="cpu" size={56} />
      <ProgressRing value={67} color="memory" size={56} />
      <ProgressRing value={55} color="storage" size={56} />
      <ProgressRing value={38} color="network" size={56} />
    </div>
  ),
};
