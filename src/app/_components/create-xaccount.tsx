'use client';
import { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { useAccount, useSwitchChain } from 'wagmi';
import Avatar from '@/components/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PortSelect } from '@/app/_components/port-select';
import { CROSS_CHAIN_ENDPOINTS } from '@/config/cross-chain-endpoints';
import { AddressInput } from '@/components/address-input';
import { useDisconnectWallet } from '@/hooks/useDisconnectWallet';
import { getChainById } from '@/utils';

export const CreateXAccount = ({
  timeLockContractAddress,
  sourceChainId,
  targetChainId
}: {
  timeLockContractAddress: string;
  sourceChainId: string;
  targetChainId: string;
}) => {
  const [isSwitching, setIsSwitching] = useState(false);
  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [port, setPort] = useState(Object.keys(CROSS_CHAIN_ENDPOINTS)[0]);
  const [recoveryAccount, setRecoveryAccount] = useState<`0x${string}` | ''>('');
  const [recoveryAccountValid, setRecoveryAccountValid] = useState(false);
  const { disconnectWallet } = useDisconnectWallet();

  const disabled =
    !chainId ||
    !timeLockContractAddress ||
    !sourceChainId ||
    !targetChainId ||
    !recoveryAccountValid ||
    !port;

  const handleCreate = useCallback(async () => {
    if (chainId?.toString() !== sourceChainId) {
      console.log('switch chain');
      setIsSwitching(true);
      try {
        await switchChainAsync({ chainId: Number(sourceChainId) });
      } catch (error) {
        console.error('Failed to switch chain:', error);
      } finally {
        setIsSwitching(false);
      }
    }
  }, [chainId, sourceChainId, switchChainAsync]);

  const handleDisconnect = useCallback(() => {
    disconnectWallet(address);
  }, [address, disconnectWallet]);

  const getButtonText = useMemo(() => {
    if (
      typeof chainId !== 'undefined' &&
      !!sourceChainId &&
      chainId?.toString() !== sourceChainId
    ) {
      return `Switch to ${getChainById(Number(sourceChainId))?.name}`;
    }
    return 'Create';
  }, [chainId, sourceChainId]);

  return (
    <>
      <div className="flex flex-col gap-[20px]">
        <div className="flex w-full items-center gap-[12px] rounded-[8px] bg-[#262626] p-[20px]">
          <span className="inline-block h-[9px] w-[9px] flex-shrink-0 rounded-full bg-[#00C739]"></span>
          {address && <Avatar address={address} className="flex-shrink-0" />}
          <span className="break-all text-[18px] font-medium leading-[20px] text-[#F6F1E8]">
            {address}
          </span>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-[8px] bg-[#7838FF] p-[10px] text-[14px] text-sm font-medium leading-[150%] text-[#F6F1E8] hover:bg-[#7838FF]/80"
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        </div>

        <div className="space-y-2">
          <AddressInput
            value={recoveryAccount}
            onChange={setRecoveryAccount}
            placeholder="Input Recovery Account"
            label={
              <>
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
                      The recovery account can be used to recover your xaccount in case of an
                      emergency.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </>
            }
            onValidationChange={setRecoveryAccountValid}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold leading-[150%] text-[#F6F1E8]/70">Port</label>
          <PortSelect value={port} onValueChange={setPort} />
        </div>

        <div className="flex items-center justify-center">
          <Button
            variant="secondary"
            disabled={disabled || isSwitching}
            onClick={handleCreate}
            className="h-[50px] w-full max-w-[226px] rounded-[8px] bg-[#7838FF] text-sm font-medium leading-[150%] text-[#F6F1E8] hover:bg-[#7838FF]/80"
          >
            {isSwitching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSwitching ? 'Switching Chain...' : getButtonText}
          </Button>
        </div>
      </div>
    </>
  );
};
