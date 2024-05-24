'use client';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

interface Props {
  title: string;
  message: string;
  buttonText: string;
  action: () => void;
}

const ErrorDisplay = ({ buttonText, action, title, message }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-[3.12rem] md:flex-row">
      <Image
        width={230}
        height={200}
        alt={title}
        src="/images/common/error.png"
        className="h-[12.5rem] w-[14.36225rem] shrink-0"
      />

      <div className="flex flex-col items-start justify-start gap-[1.25rem]">
        <h5 className="w-full text-center text-[3.125rem] font-bold capitalize text-white md:w-auto md:text-left">
          {title}
        </h5>
        <span className="text-center text-sm font-bold  text-white md:text-left">{message}</span>
        {buttonText && action && (
          <Button onClick={action} aria-label={buttonText}>
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
