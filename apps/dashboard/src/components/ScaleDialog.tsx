import { cn } from '@kubedash/ui';
import { Minus, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useToast } from './Toast';

interface ScaleDialogProps {
  open: boolean;
  onClose: () => void;
  serviceName: string;
  currentReplicas: number;
  minReplicas?: number;
  maxReplicas?: number;
}

export function ScaleDialog({
  open,
  onClose,
  serviceName,
  currentReplicas,
  minReplicas = 1,
  maxReplicas = 20,
}: ScaleDialogProps) {
  const [replicas, setReplicas] = useState(currentReplicas);
  const { toast } = useToast();

  if (!open) return null;

  const handleScale = () => {
    const prev = currentReplicas;
    toast(`Scaled ${serviceName} from ${prev} to ${replicas} replicas`, {
      variant: 'success',
      action: {
        label: 'Undo',
        onClick: () => toast(`Reverted ${serviceName} to ${prev} replicas`, { variant: 'info' }),
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[var(--z-modal)]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm">
        <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-floating)] shadow-[var(--shadow-modal)] p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Scale {serviceName}
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

          {/* Slider */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[var(--text-secondary)]">Replicas</span>
              <span className="text-xs text-[var(--text-muted)]">Current: {currentReplicas}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setReplicas(Math.max(minReplicas, replicas - 1))}
                className="p-1.5 rounded-md border border-[var(--border-default)] hover:bg-[var(--surface-overlay)] text-[var(--text-secondary)]"
                disabled={replicas <= minReplicas}
              >
                <Minus size={14} />
              </button>

              <input
                type="range"
                min={minReplicas}
                max={maxReplicas}
                value={replicas}
                onChange={(e) => setReplicas(Number(e.target.value))}
                className="flex-1 accent-[var(--interactive-primary)]"
              />

              <button
                type="button"
                onClick={() => setReplicas(Math.min(maxReplicas, replicas + 1))}
                className="p-1.5 rounded-md border border-[var(--border-default)] hover:bg-[var(--surface-overlay)] text-[var(--text-secondary)]"
                disabled={replicas >= maxReplicas}
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-[0.625rem] text-[var(--text-muted)]">min: {minReplicas}</span>
              <span className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">
                {replicas}
              </span>
              <span className="text-[0.625rem] text-[var(--text-muted)]">max: {maxReplicas}</span>
            </div>
          </div>

          {/* Change indicator */}
          {replicas !== currentReplicas && (
            <div className="mb-4 rounded-md bg-[var(--surface-base)] border border-[var(--border-default)] p-3 text-xs text-[var(--text-secondary)]">
              {replicas > currentReplicas ? (
                <span>
                  Scaling <strong className="text-[var(--text-primary)]">up</strong> by{' '}
                  {replicas - currentReplicas} replica{replicas - currentReplicas > 1 ? 's' : ''}
                </span>
              ) : (
                <span>
                  Scaling <strong className="text-[var(--text-primary)]">down</strong> by{' '}
                  {currentReplicas - replicas} replica{currentReplicas - replicas > 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-overlay)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleScale}
              disabled={replicas === currentReplicas}
              className={cn(
                'px-4 py-1.5 text-xs font-semibold rounded-md transition-colors',
                replicas === currentReplicas
                  ? 'bg-[var(--surface-overlay)] text-[var(--text-muted)] cursor-not-allowed'
                  : 'bg-[var(--interactive-primary)] text-white hover:bg-[var(--interactive-primary-hover)]',
              )}
            >
              Scale to {replicas}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
