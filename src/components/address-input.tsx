'use client';
import { useState, useEffect, ReactNode } from 'react';
import { isAddress } from 'viem';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AddressInputProps {
  value: `0x${string}` | '';
  onChange: (value: `0x${string}` | '') => void;
  placeholder?: string;
  label?: ReactNode;
  customError?: string;
  disabled?: boolean;
  className?: string;
  onValidationChange?: (isValid: boolean) => void;
}

export const AddressInput = ({
  value,
  onChange,
  placeholder = 'Input Ethereum Address',
  label,
  customError,
  disabled,
  className,
  onValidationChange
}: AddressInputProps) => {
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!value) {
      setError('');
      onValidationChange?.(true);
      return;
    }

    if (!isAddress(value)) {
      setError('It must be a valid Ethereum account address.');
      onValidationChange?.(false);
      return;
    }

    if (customError) {
      setError(customError);
      onValidationChange?.(false);
      return;
    }

    setError('');
    onValidationChange?.(true);
  }, [value, customError, onValidationChange]);

  return (
    <div className="flex flex-col gap-[5px]">
      {label && (
        <label className="flex items-center gap-[5px] text-sm font-semibold leading-[150%] text-[#F6F1E8]/70">
          {label}
        </label>
      )}
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value as `0x${string}` | '')}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'h-[62px] rounded-[8px] bg-[#262626] p-[20px] font-mono !text-[18px] font-medium leading-[130%] text-[#F6F1E8] placeholder:text-[18px] placeholder:text-[#666]',
          'disabled:cursor-not-allowed disabled:bg-[#262626] disabled:text-[#F6F1E8]/70',
          error &&
            'border-[#FF0000]/20 bg-[#FF0000]/20 text-[#FF0000] placeholder:text-[#FF0000]/50',
          className
        )}
      />
      {error && (
        <p className="text-[16px] font-normal leading-[100%] tracking-[0.32px] text-[#FF0000]">
          {error}
        </p>
      )}
    </div>
  );
};
