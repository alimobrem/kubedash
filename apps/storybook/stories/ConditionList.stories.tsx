import { ConditionList } from '@kubedash/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ConditionList> = {
  title: 'Primitives/ConditionList',
  component: ConditionList,
};

export default meta;
type Story = StoryObj<typeof ConditionList>;

const nodeConditions = [
  {
    type: 'Ready',
    status: 'True' as const,
    reason: 'KubeletReady',
    message: 'kubelet is posting ready status',
    lastTransitionTime: '2025-03-15T10:30:00Z',
  },
  {
    type: 'MemoryPressure',
    status: 'False' as const,
    reason: 'KubeletHasSufficientMemory',
    lastTransitionTime: '2025-03-10T08:00:00Z',
  },
  {
    type: 'DiskPressure',
    status: 'False' as const,
    reason: 'KubeletHasNoDiskPressure',
    lastTransitionTime: '2025-03-10T08:00:00Z',
  },
  {
    type: 'PIDPressure',
    status: 'False' as const,
    reason: 'KubeletHasSufficientPID',
    lastTransitionTime: '2025-03-10T08:00:00Z',
  },
];

const podConditions = [
  { type: 'PodScheduled', status: 'True' as const },
  { type: 'Initialized', status: 'True' as const },
  {
    type: 'ContainersReady',
    status: 'False' as const,
    reason: 'ContainersNotReady',
    message: 'containers with unready status: [api]',
  },
  { type: 'Ready', status: 'False' as const, reason: 'ContainersNotReady' },
];

export const NodeConditions: Story = {
  args: { conditions: nodeConditions },
};

export const PodConditionsFailing: Story = {
  args: { conditions: podConditions },
};

export const CompactMode: Story = {
  args: { conditions: nodeConditions, compact: true },
};
