import { cn, RelativeTime, StatusBadge } from '@kubedash/ui';
import { GitCommit, X } from 'lucide-react';
import { useState } from 'react';
import { useToast } from './Toast';

interface Revision {
  number: number;
  image: string;
  timestamp: string;
  author: string;
  commitSha: string;
  current: boolean;
}

interface RollbackDialogProps {
  open: boolean;
  onClose: () => void;
  serviceName: string;
}

const mockRevisions: Revision[] = [
  {
    number: 5,
    image: 'payment-api:v2.14.3',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    author: 'alice@acme.com',
    commitSha: 'a3f8c21',
    current: true,
  },
  {
    number: 4,
    image: 'payment-api:v2.14.2',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    author: 'bob@acme.com',
    commitSha: 'e7d2b15',
    current: false,
  },
  {
    number: 3,
    image: 'payment-api:v2.14.1',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    author: 'alice@acme.com',
    commitSha: 'c1f9a08',
    current: false,
  },
  {
    number: 2,
    image: 'payment-api:v2.13.0',
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    author: 'charlie@acme.com',
    commitSha: '9b4e3d7',
    current: false,
  },
];

export function RollbackDialog({ open, onClose, serviceName }: RollbackDialogProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const { toast } = useToast();

  if (!open) return null;

  const handleRollback = () => {
    const rev = mockRevisions.find((r) => r.number === selected);
    if (!rev) return;
    toast(`Rolling back ${serviceName} to revision ${rev.number} (${rev.image})`, {
      variant: 'success',
      action: {
        label: 'Undo',
        onClick: () => toast('Rollback cancelled', { variant: 'info' }),
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[var(--z-modal)]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg">
        <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-floating)] shadow-[var(--shadow-modal)] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-default)]">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Rollback {serviceName}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Revision list */}
          <div className="max-h-[320px] overflow-y-auto divide-y divide-[var(--border-default)]">
            {mockRevisions.map((rev) => (
              <button
                key={rev.number}
                type="button"
                disabled={rev.current}
                onClick={() => setSelected(rev.number)}
                className={cn(
                  'w-full flex items-center gap-3 px-5 py-3 text-left transition-colors',
                  rev.current
                    ? 'bg-[var(--interactive-primary)]/5 cursor-default'
                    : selected === rev.number
                      ? 'bg-[var(--surface-overlay)]'
                      : 'hover:bg-[var(--surface-overlay)] cursor-pointer',
                )}
              >
                {/* Radio */}
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                    rev.current
                      ? 'border-[var(--interactive-primary)] bg-[var(--interactive-primary)]'
                      : selected === rev.number
                        ? 'border-[var(--interactive-primary)]'
                        : 'border-[var(--border-strong)]',
                  )}
                >
                  {(rev.current || selected === rev.number) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      Rev {rev.number}
                    </span>
                    <span className="font-mono text-xs text-[var(--text-secondary)]">
                      {rev.image}
                    </span>
                    {rev.current && (
                      <StatusBadge status="running" size="sm">
                        Current
                      </StatusBadge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[0.625rem] text-[var(--text-muted)]">
                    <GitCommit size={10} />
                    <span className="font-mono">{rev.commitSha}</span>
                    <span>·</span>
                    <span>{rev.author}</span>
                    <span>·</span>
                    <RelativeTime timestamp={rev.timestamp} />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-5 py-3 border-t border-[var(--border-default)]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-overlay)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRollback}
              disabled={!selected}
              className={cn(
                'px-4 py-1.5 text-xs font-semibold rounded-md transition-colors',
                !selected
                  ? 'bg-[var(--surface-overlay)] text-[var(--text-muted)] cursor-not-allowed'
                  : 'bg-[var(--interactive-primary)] text-white hover:bg-[var(--interactive-primary-hover)]',
              )}
            >
              Rollback to Rev {selected}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
