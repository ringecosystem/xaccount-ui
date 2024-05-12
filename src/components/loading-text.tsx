import React from 'react';

import Spin from '@/components/ui/spin';
import { cn } from '@/lib/utils';

type LoadingTextProps = {
  text: string;
  isLoading?: boolean;
  spinClassName?: string;
};

const LoadingText: React.FC<LoadingTextProps> = ({ isLoading, text, spinClassName }) => {
  return <>{isLoading ? <Spin className={cn('mr-2 size-[0.875rem]', spinClassName)} /> : text}</>;
};

export default LoadingText;
