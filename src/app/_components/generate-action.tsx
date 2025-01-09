import { Select } from '@/components/select';
import { blo } from 'blo';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { ActionPreview } from './action-preview';
import ConnectTabs from './connect-tabs';
import { ConnectURI } from './connect-uri';
import { ConnectIframe } from './connect-iframe';
import { useGetDeployed } from '@/hooks/useGetDeployed';
import { ContentSkeleton } from '@/components/content-skeletion';
import { AlertCircle } from 'lucide-react';
import useGenerateAction from '@/hooks/useGenerateAction';
import { useImpersonatorIframe } from '@/contexts/ImpersonatorIframeContext';
import { AnimatePresence, motion } from 'framer-motion';

export const GenerateAction = ({
  timeLockContractAddress,
  sourceChainId,
  targetChainId
}: {
  timeLockContractAddress: string;
  sourceChainId: string;
  targetChainId: string;
}) => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'iframe'>('iframe');
  const [targetAccount, setTargetAccount] = useState('');
  const [value, setValue] = useState('');
  const { latestTransaction } = useImpersonatorIframe();

  const {
    data: deployedXAccounts,
    isLoading: isDeployedXAccountsLoading,
    refetch,
    isRefetching: isRefetchingDeployedXAccounts
  } = useGetDeployed({
    fromChainId: sourceChainId ? BigInt(sourceChainId) : BigInt(0),
    targetChainId: Number(targetChainId),
    owner: timeLockContractAddress as `0x${string}`
  });

  const moduleAddress = useMemo(() => {
    if (!deployedXAccounts || deployedXAccounts.length < 2) return '';
    const [xAccounts, modules] = deployedXAccounts;
    const index = xAccounts.findIndex((account) => account === targetAccount);
    return index !== -1 ? modules[index] : '';
  }, [deployedXAccounts, targetAccount]);

  const { generateAction, sourcePort, actionState, reset, isLoading } = useGenerateAction({
    timeLockContractAddress: timeLockContractAddress as `0x${string}`,
    moduleAddress: moduleAddress as `0x${string}`,
    sourceChainId: Number(sourceChainId),
    targetChainId: Number(targetChainId)
  });

  const handleTabChange = useCallback((tab: 'wallet' | 'iframe') => {
    setValue('');
    setActiveTab(tab);
  }, []);

  useEffect(() => {
    if (deployedXAccounts && deployedXAccounts.length > 0) {
      setTargetAccount(deployedXAccounts[0][0]);
    } else {
      setTargetAccount('');
    }
    return () => {
      setTargetAccount('');
    };
  }, [deployedXAccounts]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!targetAccount) {
      reset();
      return;
    }
    if (activeTab === 'wallet') {
    } else {
      if (latestTransaction) {
        generateAction({
          transactionInfo: latestTransaction
        });
      }
    }
    return () => {
      reset();
    };
  }, [latestTransaction, targetAccount, activeTab, generateAction, reset]);

  if (isDeployedXAccountsLoading || isRefetchingDeployedXAccounts) {
    return <ContentSkeleton />;
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="space-y-2">
        <label className="text-sm font-semibold leading-[150%] text-[#F6F1E8]/70">
          Corresponding XAccounts
        </label>
        <Select
          placeholder="Select account on target chain"
          options={
            Array.isArray(deployedXAccounts?.[0]) && deployedXAccounts[0].length > 0
              ? deployedXAccounts[0]
                  .filter(([xAccount]) => xAccount)
                  .map((xAccount) => ({
                    value: xAccount,
                    label: xAccount,
                    asset: xAccount ? blo(xAccount) : undefined
                  }))
              : []
          }
          value={targetAccount}
          onValueChange={setTargetAccount}
          empty={
            <div className="flex items-center gap-2 p-4">
              <AlertCircle className="h-5 w-5 text-[#666] opacity-50" />
              <p className="text-[16px] font-medium text-[#666]">No accounts available</p>
            </div>
          }
        />
      </div>

      {
        <>
          <ConnectTabs activeTab={activeTab} onTabChange={handleTabChange}>
            {activeTab === 'wallet' && (
              <ConnectURI
                // targetAccount={targetAccount}
                targetAccount="0x3d6d656c1bf92f7028Ce4C352563E1C363C58ED5"
                targetChainId={targetChainId}
                value={value}
                onValueChange={setValue}
              />
            )}
            {activeTab === 'iframe' && (
              <ConnectIframe
                targetAccount={targetAccount}
                targetChainId={targetChainId}
                value={value}
                onValueChange={setValue}
              />
            )}
          </ConnectTabs>
        </>
      }

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-[8px] border border-neutral-800 bg-neutral-900/50 p-6"
          >
            <div className="flex w-full flex-col gap-[12px] rounded-[8px] bg-[#1A1A1A] p-[22px]">
              <header className="flex items-center justify-between">
                <div className="h-4 w-32 animate-pulse rounded bg-neutral-800" />
                <div className="h-[18px] w-[18px] animate-pulse rounded bg-neutral-800" />
              </header>
              <div className="space-y-3">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="h-4 w-full animate-pulse rounded bg-neutral-800"
                    style={{ width: `${Math.random() * 40 + 60}%` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          sourcePort &&
          actionState?.params &&
          actionState?.fee &&
          actionState?.message &&
          moduleAddress &&
          targetChainId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <ActionPreview
                sourcePort={sourcePort}
                targetChainId={Number(targetChainId)}
                moduleAddress={moduleAddress}
                message={actionState?.message}
                params={actionState?.params}
                fee={actionState?.fee}
              />
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};
