import Image from 'next/image';
import { Select } from '@/components/select';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { blo } from 'blo';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ActionPreview } from './action-preview';
import ConnectTabs from './connect-tabs';

export const GenerateAction = () => {
  const accountOptions = [
    {
      value: '0x0000000000000000000000000000000000000001',
      label: '0x0000000000000000000000000000000000000001',
      asset: blo('0x0000000000000000000000000000000000000001')
    },
    {
      value: '0x0000000000000000000000000000000000000000',
      label: '0x0000000000000000000000000000000000000000',
      asset: blo('0x0000000000000000000000000000000000000000')
    }
  ];
  const [targetAccount, setTargetAccount] = useState(accountOptions[0].value);
  return (
    <div className="flex flex-col gap-[20px]">
      <div className="space-y-2">
        <label className="text-sm font-semibold leading-[150%] text-[#F6F1E8]/70">
          Corresponding XAccounts
        </label>
        <Select
          placeholder="Select account on target chain"
          options={accountOptions}
          value={targetAccount}
          onValueChange={setTargetAccount}
        />
      </div>

      <ConnectTabs />

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
          className="h-[62px] rounded-[8px] bg-[#262626] p-[20px] text-[18px] font-medium leading-[130%] text-[#F6F1E8]/70 placeholder:text-[18px] placeholder:text-[#666]"
        />
      </div>

      <div className="flex items-center justify-center">
        <Button
          variant="secondary"
          className="h-[50px] w-full max-w-[226px] rounded-[8px] bg-[#7838FF] text-sm font-medium leading-[150%] text-[#F6F1E8] hover:bg-[#7838FF]/80"
          disabled
        >
          Connect
        </Button>
      </div>

      <ActionPreview />
    </div>
  );
};
