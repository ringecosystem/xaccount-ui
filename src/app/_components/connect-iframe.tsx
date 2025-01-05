import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export const ConnectIframe = ({
  value,
  onValueChange
}: {
  value: string;
  onValueChange: (value: string) => void;
}) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-[5px] text-sm font-semibold leading-[150%] text-[#F6F1E8]/70">
        Dapp URL
        <Tooltip>
          <TooltipTrigger asChild>
            <Image
              src="/images/common/info.svg"
              alt="info"
              width={16}
              height={16}
              className="inline-block cursor-pointer"
            />
          </TooltipTrigger>
          <TooltipContent className="max-w-[280px] bg-[#1A1A1A]">
            <p className="text-[12px] font-normal leading-normal text-[#F6F1E8]">
              Paste the URL of the DApp you wish to connect to. If that DApp is not supported,
              please use WalletConnect.
            </p>
          </TooltipContent>
        </Tooltip>
      </label>
      <Input
        type="text"
        placeholder="https://app.uniswap.org/"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="h-[62px] rounded-[8px] bg-[#262626] p-[20px] !text-[18px] font-medium leading-[130%] text-[#F6F1E8] placeholder:text-[18px] placeholder:text-[#666]"
      />
    </div>
  );
};
