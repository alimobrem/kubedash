import type { Meta, StoryObj } from '@storybook/react';
import { ScoreCard } from '@kubedash/ui';

const meta: Meta<typeof ScoreCard> = {
  title: 'Primitives/ScoreCard',
  component: ScoreCard,
};

export default meta;
type Story = StoryObj<typeof ScoreCard>;

export const HighScore: Story = {
  args: {
    score: 8,
    total: 10,
    items: [
      { name: 'Resource limits', passed: true },
      { name: 'Health checks', passed: true },
      { name: 'HPA configured', passed: true },
      { name: 'PDB configured', passed: true },
      { name: 'Non-root', passed: true },
      { name: 'NetworkPolicy', passed: true },
      { name: 'Approved image', passed: true },
      { name: 'Runbook linked', passed: true },
      { name: 'SLO defined', passed: false },
      { name: 'Tracing enabled', passed: false },
    ],
  },
};

export const LowScore: Story = {
  args: {
    score: 3,
    total: 10,
    items: [
      { name: 'Resource limits', passed: true },
      { name: 'Health checks', passed: false },
      { name: 'HPA configured', passed: false },
      { name: 'PDB configured', passed: false },
      { name: 'Non-root', passed: true },
      { name: 'NetworkPolicy', passed: false },
      { name: 'Approved image', passed: true },
      { name: 'Runbook linked', passed: false },
      { name: 'SLO defined', passed: false },
      { name: 'Tracing enabled', passed: false },
    ],
  },
};

export const Compact: Story = {
  args: { score: 7, total: 10, compact: true },
};
