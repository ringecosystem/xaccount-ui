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
            <span className="text-[18px] font-medium leading-[130%] text-[#666]">Select Port</span>
          }
          className="text-[18px] font-medium leading-[130%] text-[#F6F1E8]/70"
        />
      </SelectTrigger>
      <SelectContent className="rounded-[8px] bg-[#1A1A1A]">
        {(Object.entries(CROSS_CHAIN_ENDPOINTS) as [string, string][]).map(
          ([portName, endpoint]) => {
            return (
              <SelectItem key={portName} value={portName}>
                <div className="flex h-[56px] items-center gap-[12px] p-[10px]">
                  <span className="text-[18px] font-medium leading-[130%] text-[#F6F1E8]">
                    {portName}
                  </span>
                  <span className="truncate text-[18px] font-medium leading-[130%] text-[#666]">
                    {endpoint}
                  </span>
                </div>
              </SelectItem>
            );
          }
        )}
      </SelectContent>
    </SelectPrimitive>
  );
};
