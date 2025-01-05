import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useImpersonatorIframe } from '@/contexts/ImpersonatorIframeContext';
import { ImpersonatorIframe } from '@/components/ImpersonatorIframe';
import { isValidUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react';

export const ConnectIframe = ({
  targetAccount,
  value,
  onValueChange
}: {
  targetAccount: string;
  value: string;
  onValueChange: (value: string) => void;
}) => {
  const { latestTransaction } = useImpersonatorIframe();
  const [uri, setUri] = useState('');

  const handleConnect = useCallback(() => {
    if (!value || !isValidUrl(value)) {
      return;
    }
    setUri(value);
  }, [value]);

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
      {uri && (
        <div className="relative flex h-[500px] justify-center">
          <div className="absolute left-1/2 -translate-x-1/2">
            <ImpersonatorIframe
              width={'1000px'}
              height={'500px'}
              src={uri}
              address={targetAccount}
              rpcUrl="https://eth.llamarpc.com"
            />
          </div>
        </div>
      )}
      <div>
        <h1>Latest transaction</h1>
        <pre>{JSON.stringify(latestTransaction, null, 2)}</pre>
      </div>
    </div>
  );
};
