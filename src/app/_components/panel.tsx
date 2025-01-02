'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Tabs } from './tabs';
interface DaoPanelProps {
  className?: string;
}

export function DaoPanel({ className }: DaoPanelProps) {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'generate'>('create');

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

        <div className="space-y-2">
          <label className="text-sm font-semibold leading-[150%] text-[#F6F1E8]/70">
            Target Chain
          </label>
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
      </div>

      <div className="space-y-[20px]">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex items-center justify-center">
          <Button
            variant="secondary"
            className="h-[50px] w-full max-w-[226px] rounded-[8px] bg-[#7838FF] text-sm font-medium leading-[150%] text-[#F6F1E8] hover:bg-[#7838FF]/80"
            onClick={() => setIsWalletConnected(true)}
          >
            Connect Wallet
          </Button>
        </div>
      </div>
    </div>
  );
}
