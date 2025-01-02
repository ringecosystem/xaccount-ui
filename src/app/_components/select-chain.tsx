import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export const SelectChain = () => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold leading-[150%] text-[#F6F1E8]/70">Source Chain</label>
      <Select>
        <SelectTrigger className="h-[62px] rounded-[8px] bg-[#262626] p-[20px]">
          <SelectValue
            placeholder={
              <div className="flex items-center gap-[12px]">
                <div className="size-[36px] rounded-full bg-[#666]"></div>
                <span className="text-[18px] font-medium leading-[130%] text-[#666]">
                  Select Chain
                </span>
              </div>
            }
            className="text-[18px] font-medium leading-[130%] text-[#F6F1E8]/70"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ethereum">Ethereum</SelectItem>
          <SelectItem value="polygon">Polygon</SelectItem>
          <SelectItem value="bsc">BSC</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
