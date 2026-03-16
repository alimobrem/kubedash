import { cn } from '../../utils/cn';

export interface AvatarProps {
  /** Display name (used for initials fallback) */
  name: string;
  /** Image URL */
  src?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(/[\s-]+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function hashColor(name: string): string {
  let hash = 0;
  for (const char of name) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `oklch(0.65 0.15 ${hue})`;
}

/** User/team/cluster avatar with initials fallback */
export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 text-[0.5rem]',
    md: 'h-8 w-8 text-xs',
    lg: 'h-10 w-10 text-sm',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover', sizeClasses[size], className)}
      />
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold text-white',
        sizeClasses[size],
        className,
      )}
      style={{ backgroundColor: hashColor(name) }}
      title={name}
    >
      {getInitials(name)}
    </span>
  );
}
