'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Tabs } from './tabs';
import { Select } from '@/components/select';
import { getChains } from '@/utils';
import { CreateXAccount } from './create-xaccount';
import { GenerateAction } from './generate-action';
interface DaoPanelProps {
  className?: string;
}

const chains = getChains();
export function DaoPanel({ className }: DaoPanelProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'generate'>('create');
  const [sourceChain, setSourceChain] = useState(chains[0].id.toString());
  const [targetChain, setTargetChain] = useState(chains[1].id.toString());
  const handleSourceChainChange = (value: string) => {
    setSourceChain(value);
    if (value === targetChain) {
      const availableChain = chains.find((chain) => chain.id.toString() !== value);
      if (availableChain) {
        setTargetChain(availableChain.id.toString());
      }
    }
  };

  const handleTargetChainChange = (value: string) => {
    setTargetChain(value);
    if (value === sourceChain) {
      const availableChain = chains.find((chain) => chain.id.toString() !== value);
      if (availableChain) {
        setSourceChain(availableChain.id.toString());
      }
    }
  };

  const chainOptions = chains.map((chain) => ({
    value: chain.id.toString(),
    label: chain.name,
    asset: chain.iconUrl as string
  }));

  return (
    <div
      className={cn(
        'relative flex w-full max-w-[540px] flex-col gap-[20px] rounded-[12px] border border-[#262626] p-[20px]',
        className
      )}
    >
      <header className="flex flex-col gap-[20px]">
        <div className="flex w-full items-center justify-end">
          <Image
            src="/images/common/logo.svg"
            alt="XAccount Logo"
            width={114.773}
            height={22}
            className=""
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[24px] font-semibold leading-[120%] text-[#F6F1E8]">DAO TOOL</h1>
          <h2 className="text-[34px] font-semibold leading-[120%] text-[#F6F1E8]">
            Generating Cross-chain Action
          </h2>
        </div>
      </header>

      <div className="flex flex-col gap-[20px]">
        <div className="space-y-2">
          <label className="text-sm font-semibold leading-[150%] text-[#F6F1E8]/70">
            Source Chain DAO TimeLock Contract
          </label>
          <Input
            type="text"
            placeholder="Input contract address"
            className="h-[62px] rounded-[8px] bg-[#262626] p-[20px] text-[18px] font-medium leading-[130%] text-[#F6F1E8]/70 placeholder:text-[18px] placeholder:text-[#666]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold leading-[150%] text-[#F6F1E8]/70">
            Source Chain
          </label>
          <Select
            placeholder="Select Chain"
            options={chainOptions}
            value={sourceChain}
            onValueChange={handleSourceChainChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold leading-[150%] text-[#F6F1E8]/70">
            Target Chain
          </label>
          <Select
            placeholder="Select Chain"
            options={chainOptions}
            value={targetChain}
            onValueChange={handleTargetChainChange}
          />
        </div>
      </div>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
        {/* <CreateXAccount /> */}
        <GenerateAction />
      </Tabs>
    </div>
  );
}
