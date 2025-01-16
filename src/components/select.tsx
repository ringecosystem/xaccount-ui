import Image from 'next/image';
import {
  Select as SelectPrimitive,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface SelectProps {
  placeholder: string;
  options: {
    value: string;
    label: string;
    asset?: string;
  }[];
  value: string;
  onValueChange: (value: string) => void;
  empty?: React.ReactNode;
}

export const Select = ({
  placeholder,
  options,
  value,
  onValueChange,
  empty = (
    <div className="flex h-[56px] items-center justify-center p-[10px] text-[16px] text-[#666]">
      No options available
    </div>
  )
}: SelectProps) => {
  return (
    <SelectPrimitive value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-[62px] w-full rounded-[8px] bg-[#262626] p-[10px]">
        <SelectValue
          placeholder={
            <div className="flex items-center gap-[12px]">
              <div className="size-[36px] rounded-full bg-[#666]"></div>
              <span className="text-[18px] font-medium leading-[130%] text-[#666]">
                {placeholder}
              </span>
            </div>
          }
          className="text-[18px] font-medium leading-[130%] text-[#F6F1E8]/70"
        />
      </SelectTrigger>
      <SelectContent className="rounded-[8px] bg-[#1A1A1A]">
        {options.length === 0
          ? empty
          : options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex h-[56px] items-center gap-[10px] p-[10px] text-[18px] font-medium leading-[130%] text-[#F6F1E8]">
                  {option.asset && (
                    <Image
                      src={option.asset}
                      alt={option.label}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  )}
                  <span className="truncate font-mono">{option.label}</span>
                </div>
              </SelectItem>
            ))}
      </SelectContent>
    </SelectPrimitive>
  );
};
