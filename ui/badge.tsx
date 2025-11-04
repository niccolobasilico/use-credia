import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium uppercase tracking-wide',
        variant === 'default' ? 'border-transparent bg-white/10 text-white' : 'border-white/40 text-white/90',
        className,
      )}
    >
      {children}
    </span>
  );
}
