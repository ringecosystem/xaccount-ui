import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { ImpersonatorIframe } from '@/components/ImpersonatorIframe';
import { getChainById, isValidUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

export const ConnectIframe = ({
  targetAccount,
  targetChainId,
  value,
  onValueChange
}: {
  targetAccount: string;
  targetChainId: string;
  value: string;
  onValueChange: (value: string) => void;
}) => {
  const [uri, setUri] = useState('');
  const targetChain = getChainById(Number(targetChainId));
  const handleConnect = useCallback(() => {
    if (!value || !isValidUrl(value)) {
      toast.error('Invalid URL');
      return;
    }

    if (!targetAccount) {
      toast.error('Address is not an ENS or Ethereum address');
      return;
    }

    setUri(value);
  }, [value, targetAccount]);

  const rpc = targetChain?.rpcUrls?.default?.http?.[0];

  return (
    <div className="space-y-[20px]">
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
      <div className="flex items-center justify-center">
        <Button
          variant="secondary"
          className="h-[50px] w-full max-w-[226px] rounded-[8px] bg-[#7838FF] text-sm font-medium leading-[150%] text-[#F6F1E8] hover:bg-[#7838FF]/80"
          disabled={!value || !isValidUrl(value)}
          onClick={handleConnect}
        >
          Connect
        </Button>
      </div>
      {uri && targetAccount && rpc && (
        <div className="relative flex h-[500px] justify-center">
          <div className="absolute left-1/2 -translate-x-1/2">
            <ImpersonatorIframe
              key={uri}
              targetChainId={targetChainId}
              width={'1000px'}
              height={'500px'}
              src={uri}
              address={targetAccount}
              rpcUrl={rpc}
            />
          </div>
        </div>
      )}
    </div>
  );
};
