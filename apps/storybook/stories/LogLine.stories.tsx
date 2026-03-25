import { LogLine } from '@kubedash/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof LogLine> = {
  title: 'Primitives/LogLine',
  component: LogLine,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof LogLine>;

export const InfoLog: Story = {
  args: {
    lineNumber: 142,
    timestamp: '14:32:15.234',
    level: 'info',
    message: 'Server started on port 8080',
  },
};

export const ErrorLog: Story = {
  args: {
    lineNumber: 143,
    timestamp: '14:32:15.567',
    level: 'error',
    message: 'Connection refused: dial tcp 10.0.42.17:5432: connect: connection refused',
    highlighted: true,
  },
};

export const LogStream: Story = {
  render: () => (
    <div style={{ width: '100%', fontFamily: 'var(--font-mono)' }}>
      <LogLine
        lineNumber={140}
        timestamp="14:32:15.001"
        level="info"
        message="Starting payment-api v2.14.3"
      />
      <LogLine
        lineNumber={141}
        timestamp="14:32:15.123"
        level="debug"
        message="Loading configuration from /etc/config/app.yaml"
      />
      <LogLine
        lineNumber={142}
        timestamp="14:32:15.234"
        level="info"
        message="Connected to database payments-db:5432"
      />
      <LogLine
        lineNumber={143}
        timestamp="14:32:15.567"
        level="warn"
        message="Slow query detected: SELECT * FROM orders took 2.3s"
      />
      <LogLine
        lineNumber={144}
        timestamp="14:32:16.890"
        level="error"
        message="OOMKilled: container exceeded memory limit of 512Mi"
        highlighted
      />
      <LogLine
        lineNumber={145}
        timestamp="14:32:17.001"
        level="info"
        message="Graceful shutdown initiated"
      />
    </div>
  ),
};
