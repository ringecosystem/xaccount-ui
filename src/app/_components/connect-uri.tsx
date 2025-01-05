import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export const ConnectURI = ({
  value,
  onValueChange,
  disabled,
  errorMessage
}: {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  errorMessage?: string;
}) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-[5px] text-sm font-semibold leading-[150%] text-[#F6F1E8]/70">
        Wallet Connect URI
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
              Visit any dapp and select WalletConnect, then click &quot;Copy to clipboard&quot;
              beneath the QR code and paste it here.
            </p>
          </TooltipContent>
        </Tooltip>
      </label>
      <Input
        type="text"
        placeholder="wc:xyz123"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="h-[62px] rounded-[8px] bg-[#262626] p-[20px] !text-[18px] font-medium leading-[130%] text-[#F6F1E8] placeholder:text-[18px] placeholder:text-[#666]"
        disabled={disabled}
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};
