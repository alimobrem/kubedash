/** K8s status categories */
export type K8sStatus = 'running' | 'pending' | 'failed' | 'creating' | 'terminating' | 'unknown';

/** Map K8s node condition to status */
export function nodeConditionToStatus(condition: string): K8sStatus {
  switch (condition) {
    case 'Ready':
      return 'running';
    case 'NotReady':
      return 'failed';
    default:
      return 'unknown';
  }
}

/** Map K8s pod phase to status */
export function podPhaseToStatus(phase: string): K8sStatus {
  const lower = phase.toLowerCase();
  if (['running', 'succeeded', 'completed'].includes(lower)) return 'running';
  if (['pending'].includes(lower)) return 'pending';
  if (['containercreating', 'podinitializing', 'init'].includes(lower)) return 'creating';
  if (['terminating'].includes(lower)) return 'terminating';
  if (['failed', 'error', 'crashloopbackoff', 'imagepullbackoff', 'oomkilled'].includes(lower))
    return 'failed';
  return 'unknown';
}

/** Human-readable status label */
export function statusLabel(status: K8sStatus): string {
  switch (status) {
    case 'running':
      return 'Running';
    case 'pending':
      return 'Pending';
    case 'failed':
      return 'Failed';
    case 'creating':
      return 'Creating';
    case 'terminating':
      return 'Terminating';
    case 'unknown':
      return 'Unknown';
  }
}
