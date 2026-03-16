import { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';

const colorMap = {
  cpu: 'var(--metric-cpu)',
  memory: 'var(--metric-memory)',
  storage: 'var(--metric-storage)',
  network: 'var(--metric-network)',
  default: 'var(--text-secondary)',
} as const;

export interface SparklineProps {
  /** Array of numeric values */
  data: number[];
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Color variant */
  color?: keyof typeof colorMap;
  /** Show min/max endpoint labels (designer review: sparklines need context) */
  showRange?: boolean;
  /** Fill area under the line */
  filled?: boolean;
  className?: string;
}

/** Canvas-based inline micro-chart with optional min/max labels */
export function Sparkline({
  data,
  width = 80,
  height = 24,
  color = 'default',
  showRange = false,
  filled = false,
  className,
}: SparklineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 2;

    const points: [number, number][] = data.map((v, i) => [
      (i / (data.length - 1)) * (width - padding * 2) + padding,
      height - padding - ((v - min) / range) * (height - padding * 2),
    ]);

    // Resolve CSS variable to actual color
    const computedColor = getComputedStyle(canvas).getPropertyValue(
      colorMap[color].replace('var(', '').replace(')', ''),
    );
    const strokeColor = computedColor.trim() || '#6366f1';

    // Draw filled area
    if (filled) {
      ctx.beginPath();
      ctx.moveTo(points[0][0], height);
      for (const [x, y] of points) {
        ctx.lineTo(x, y);
      }
      ctx.lineTo(points[points.length - 1][0], height);
      ctx.closePath();
      ctx.fillStyle = `${strokeColor}20`;
      ctx.fill();
    }

    // Draw line
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
  }, [data, width, height, color, filled]);

  const min = data.length > 0 ? Math.min(...data) : 0;
  const max = data.length > 0 ? Math.max(...data) : 0;

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      {showRange && (
        <span className="text-[0.5rem] text-[var(--text-muted)] tabular-nums w-5 text-right">
          {Math.round(min)}
        </span>
      )}
      <canvas
        ref={canvasRef}
        style={{ width, height }}
        aria-label={`Sparkline chart: min ${Math.round(min)}, max ${Math.round(max)}`}
        role="img"
      />
      {showRange && (
        <span className="text-[0.5rem] text-[var(--text-muted)] tabular-nums w-5">
          {Math.round(max)}
        </span>
      )}
    </div>
  );
}
