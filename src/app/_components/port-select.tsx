import {
  Select as SelectPrimitive,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { CROSS_CHAIN_ENDPOINTS } from '@/config/cross-chain-endpoints';

interface PortSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}
export const PortSelect = ({ value, onValueChange }: PortSelectProps) => {
  return (
    <SelectPrimitive value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-[62px] w-full rounded-[8px] bg-[#262626] p-[10px]">
        <SelectValue
          placeholder={
            <div className="flex items-center gap-[12px]">
              <div className="size-[36px] rounded-full bg-[#666]"></div>
              <span className="text-[18px] font-medium leading-[130%] text-[#666]">
                Select Port
              </span>
            </div>
          }
          className="text-[18px] font-medium leading-[130%] text-[#F6F1E8]/70"
        />
      </SelectTrigger>
      <SelectContent className="rounded-[8px] bg-[#1A1A1A]">
        {Object.entries(CROSS_CHAIN_ENDPOINTS).map(([key, value]) => (
          <SelectItem key={key} value={value}>
            <div className="flex h-[56px] items-center gap-[12px] p-[10px]">
              <span className="text-[18px] font-medium leading-[130%] text-[#F6F1E8]">{key}</span>
              <span className="truncate text-[18px] font-medium leading-[130%] text-[#666]">
                {value}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </SelectPrimitive>
  );
};
