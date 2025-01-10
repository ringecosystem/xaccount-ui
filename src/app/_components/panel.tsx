'use client';

import { Suspense, useMemo, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Tabs } from './tabs';
import { Select } from '@/components/select';
import { getChains } from '@/utils';
import { CreateXAccount } from './create-xaccount';
import { GenerateAction } from './generate-action';
import { AddressInput } from '@/components/address-input';
import { WalletGuard } from './wallet-guard';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { isAddress } from 'viem';

interface DaoPanelProps {
  className?: string;
}

const chains = getChains();

const chainOptions = chains.map((chain) => ({
  value: chain.id.toString(),
  label: chain.name,
  asset: chain.iconUrl as string
}));

function DaoPanelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<'create' | 'generate'>(
    () => (searchParams.get('tab') as 'create' | 'generate') || 'create'
  );

  const [timeLockContractAddress, setTimeLockContractAddress] = useLocalStorageState<
    `0x${string}` | ''
  >('timeLockContractAddress', '');

  const [sourceChainId, setSourceChainId] = useLocalStorageState(
    'sourceChainId',
    chains[0].id.toString()
  );
  const [targetChainId, setTargetChainId] = useLocalStorageState(
    'targetChainId',
    chains[1].id.toString()
  );

  const timeLockContractAddressValid = useMemo(() => {
    return !!timeLockContractAddress && isAddress(timeLockContractAddress);
  }, [timeLockContractAddress]);

  const handleSourceChainChange = (value: string) => {
    setSourceChainId(value);
    if (value === targetChainId) {
      const availableChain = chains.find((chain) => chain.id.toString() !== value);
      if (availableChain) {
        setTargetChainId(availableChain.id.toString());
      }
    }
  };

  const handleTargetChainChange = (value: string) => {
    setTargetChainId(value);
    if (value === sourceChainId) {
      const availableChain = chains.find((chain) => chain.id.toString() !== value);
      if (availableChain) {
        setSourceChainId(availableChain.id.toString());
      }
    }
  };

  const handleTabChange = (tab: 'create' | 'generate') => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    router.push(`?${params.toString()}`);
    setActiveTab(tab);
  };

  return (
    <>
      <div className="flex flex-col gap-[20px]">
        <div className="space-y-2">
          <label className="text-sm font-semibold leading-[150%] text-[#F6F1E8]/70">
            Source Chain DAO TimeLock Contract
          </label>
          <AddressInput
            value={timeLockContractAddress}
            onChange={setTimeLockContractAddress}
            placeholder="Input contract address"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold leading-[150%] text-[#F6F1E8]/70">
            Source Chain
          </label>
          <Select
            placeholder="Select Chain"
            options={chainOptions}
            value={sourceChainId}
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
            value={targetChainId}
            onValueChange={handleTargetChainChange}
          />
        </div>
      </div>

      <Tabs activeTab={activeTab} setActiveTab={handleTabChange}>
        {activeTab === 'create' ? (
          <WalletGuard>
            <CreateXAccount
              timeLockContractAddress={
                timeLockContractAddressValid && timeLockContractAddress
                  ? timeLockContractAddress
                  : ''
              }
              sourceChainId={sourceChainId}
              targetChainId={targetChainId}
            />
          </WalletGuard>
        ) : (
          <GenerateAction
            timeLockContractAddress={
              timeLockContractAddressValid && timeLockContractAddress ? timeLockContractAddress : ''
            }
            sourceChainId={sourceChainId}
            targetChainId={targetChainId}
          />
        )}
      </Tabs>
    </>
  );
}

export function DaoPanel({ className }: DaoPanelProps) {
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

      <Suspense
        fallback={
          <div className="animate-pulse space-y-4">
            <div className="h-10 rounded bg-neutral-800" />
            <div className="h-10 rounded bg-neutral-800" />
            <div className="h-10 rounded bg-neutral-800" />
          </div>
        }
      >
        <DaoPanelContent />
      </Suspense>
    </div>
  );
}
