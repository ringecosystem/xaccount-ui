'use client';
import Image from 'next/image';
import Avatar from '@/components/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PortSelect } from '@/app/_components/port-select';
import { useState } from 'react';
import { CROSS_CHAIN_ENDPOINTS } from '@/config/cross-chain-endpoints';

export const CreateXAccount = () => {
  const [port, setPort] = useState(Object.keys(CROSS_CHAIN_ENDPOINTS)[0]);

  return (
    <>
      {/* <div className="flex items-center justify-center">
          <Button
            variant="secondary"
            className="h-[50px] w-full max-w-[226px] rounded-[8px] bg-[#7838FF] text-sm font-medium leading-[150%] text-[#F6F1E8] hover:bg-[#7838FF]/80"
            onClick={() => setIsWalletConnected(true)}
          >
            Connect Wallet
          </Button>
        </div> */}
      <div className="flex flex-col gap-[20px]">
        {/* address */}
        <div className="flex w-full items-center gap-[12px] rounded-[8px] bg-[#262626] p-[20px]">
          <span className="inline-block h-[9px] w-[9px] flex-shrink-0 rounded-full bg-[#00C739]"></span>
          <Avatar address="0x0000000000000000000000000000000000000000" className="flex-shrink-0" />
          <span className="break-all text-[18px] font-medium leading-[20px] text-[#F6F1E8]">
            0x0E55c72781aCD923C4e3e7Ad9bB8363de15ef204
          </span>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-[8px] bg-[#7838FF] p-[10px] text-[14px] text-sm font-medium leading-[150%] text-[#F6F1E8] hover:bg-[#7838FF]/80"
          >
            Disconnect
          </Button>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-[5px] text-sm font-semibold leading-[150%] text-[#F6F1E8]/70">
            Recovery Account
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
                  The recovery account can be used to recover your xaccount in case of an emergency.
                </p>
              </TooltipContent>
            </Tooltip>
          </label>
          <Input
            type="text"
            placeholder="Input contract address"
            className="h-[62px] rounded-[8px] bg-[#262626] p-[20px] text-[18px] font-medium leading-[130%] text-[#F6F1E8]/70 placeholder:text-[18px] placeholder:text-[#666]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold leading-[150%] text-[#F6F1E8]/70">Port</label>
          <PortSelect value={port} onValueChange={setPort} />
        </div>

        <div className="flex items-center justify-center">
          <Button
            variant="secondary"
            className="h-[50px] w-full max-w-[226px] rounded-[8px] bg-[#7838FF] text-sm font-medium leading-[150%] text-[#F6F1E8] hover:bg-[#7838FF]/80"
          >
            Create
          </Button>
        </div>
      </div>
    </>
  );
};
