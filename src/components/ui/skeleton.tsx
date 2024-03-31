import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-skeleton/10 animate-pulse rounded-md', className)}
      style={{}}
      {...props}
    />
  );
}

export { Skeleton };
