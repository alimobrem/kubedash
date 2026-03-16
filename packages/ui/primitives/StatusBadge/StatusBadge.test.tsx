import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('renders with default label for running status', () => {
    render(<StatusBadge status="running" />);
    const badge = screen.getByRole('status');
    expect(badge).toHaveTextContent('Running');
  });

  it('renders with default label for failed status', () => {
    render(<StatusBadge status="failed" />);
    const badge = screen.getByRole('status');
    expect(badge).toHaveTextContent('Failed');
  });

  it('renders custom children as label', () => {
    render(<StatusBadge status="running">Healthy</StatusBadge>);
    const badge = screen.getByRole('status');
    expect(badge).toHaveTextContent('Healthy');
  });

  it('has role="status" for accessibility', () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders shape icon by default', () => {
    const { container } = render(<StatusBadge status="running" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('hides shape icon when showShape is false', () => {
    const { container } = render(<StatusBadge status="running" showShape={false} />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<StatusBadge status="unknown" className="custom-class" />);
    expect(screen.getByRole('status')).toHaveClass('custom-class');
  });
});
