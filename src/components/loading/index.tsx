import { cn } from '@/lib/utils';
import './index.css';

interface LoadingProps {
  className?: string;
  itemClassName?: string;
}

const Loading = ({ className, itemClassName }: LoadingProps) => {
  return (
    <span
      className={cn(
        'loading inline-flex items-center gap-1 [--animation-duration:1s] [--dot-delay:0.33s;]',
        className
      )}
    >
      <span
        className={cn(
          'loading-item inline-block size-[0.8rem] rounded-full bg-primary opacity-80',
          itemClassName
        )}
      ></span>
      <span
        className={cn(
          'loading-item inline-block size-[0.8rem] rounded-full bg-primary opacity-80',
          itemClassName
        )}
      ></span>
      <span
        className={cn(
          'loading-item inline-block size-[0.8rem] rounded-full bg-primary opacity-80 ',
          itemClassName
        )}
      ></span>
    </span>
  );
};

export default Loading;
