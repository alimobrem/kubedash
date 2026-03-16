/** Format K8s CPU value: "250m" -> "0.25 cores", "2" -> "2 cores" */
export function formatCpu(value: string): { display: string; cores: number } {
  if (value.endsWith('m')) {
    const millicores = Number.parseInt(value.slice(0, -1), 10);
    const cores = millicores / 1000;
    return {
      display: cores < 1 ? `${millicores}m` : `${cores} cores`,
      cores,
    };
  }
  const cores = Number.parseFloat(value);
  return { display: `${cores} cores`, cores };
}

/** Format K8s memory value: "128Mi" -> "128 MB", "2Gi" -> "2 GB" */
export function formatMemory(value: string): { display: string; bytes: number } {
  const units: Record<string, { multiplier: number; label: string }> = {
    Ki: { multiplier: 1024, label: 'KB' },
    Mi: { multiplier: 1024 ** 2, label: 'MB' },
    Gi: { multiplier: 1024 ** 3, label: 'GB' },
    Ti: { multiplier: 1024 ** 4, label: 'TB' },
  };

  for (const [suffix, { multiplier, label }] of Object.entries(units)) {
    if (value.endsWith(suffix)) {
      const num = Number.parseInt(value.slice(0, -suffix.length), 10);
      return { display: `${num} ${label}`, bytes: num * multiplier };
    }
  }

  const bytes = Number.parseInt(value, 10);
  if (bytes >= 1024 ** 3) return { display: `${(bytes / 1024 ** 3).toFixed(1)} GB`, bytes };
  if (bytes >= 1024 ** 2) return { display: `${(bytes / 1024 ** 2).toFixed(0)} MB`, bytes };
  return { display: `${bytes} B`, bytes };
}

/** Format K8s age from timestamp: "2024-01-15T10:30:00Z" -> "14d" */
export function formatAge(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

/** Format percentage with consistent precision */
export function formatPercent(value: number): string {
  if (value >= 100) return '100%';
  if (value >= 10) return `${Math.round(value)}%`;
  return `${value.toFixed(1)}%`;
}
