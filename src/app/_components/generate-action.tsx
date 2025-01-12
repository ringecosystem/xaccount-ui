'use client';

import { Suspense } from 'react';
import { Select } from '@/components/select';
import { blo } from 'blo';
import { useCallback, useEffect, useState, useMemo } from 'react';
import ConnectTabs from './connect-tabs';
import { ConnectURI } from './connect-uri';
import { ConnectIframe } from './connect-iframe';
import { useGetDeployed } from '@/hooks/useGetDeployed';
import { ContentSkeleton } from '@/components/content-skeletion';
import { AlertCircle } from 'lucide-react';
import useGenerateAction from '@/hooks/useGenerateAction';
import { TransactionWithId, useImpersonatorIframe } from '@/contexts/ImpersonatorIframeContext';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import { useRouter, useSearchParams } from 'next/navigation';
import { ActionPreview } from '@/components/action-preview';
import { AnimatePresence, motion } from 'framer-motion';

function GenerateActionContent({
  timeLockContractAddress,
  sourceChainId,
  targetChainId
}: {
  timeLockContractAddress: string;
  sourceChainId: string;
  targetChainId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get('connectType') as 'wallet' | 'iframe') || 'wallet';
  const [targetAccount, setTargetAccount] = useState('');
  const [isIframeLoading, setIsIframeLoading] = useState(false);
  const [walletConnectUri, setWalletConnectUri] = useState<string>('');
  const [iframeConnectUri, setIframeConnectUri] = useLocalStorageState<string>(
    'iframeConnectUri',
    ''
  );
  const { latestTransaction, iframeRef } = useImpersonatorIframe();

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

  const handleIframeLoad = useCallback(() => {
    if (iframeRef.current) {
      const yOffset =
        iframeRef.current.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2;
      window.scrollTo({
        top: yOffset,
        behavior: 'smooth'
      });
    }
  }, [iframeRef]);

  const handleTabChange = useCallback(
    (tab: 'wallet' | 'iframe') => {
      const params = new URLSearchParams(searchParams);
      params.set('connectType', tab);
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleNewWalletTransaction = useCallback(
    (transaction: TransactionWithId) => {
      console.log('New transaction received, current moduleAddress:', moduleAddress);
      if (!moduleAddress) {
        console.warn('No module address available');
        return;
      }
      generateAction({
        transactionInfo: transaction
      });
    },
    [moduleAddress, generateAction]
  );

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
    if (sourceChainId && timeLockContractAddress) {
      refetch();
    }
  }, [refetch, sourceChainId, timeLockContractAddress]);

  useEffect(() => {
    if (!targetAccount || !walletConnectUri || !iframeConnectUri) {
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
  }, [
    walletConnectUri,
    iframeConnectUri,
    latestTransaction,
    targetAccount,
    activeTab,
    generateAction,
    reset
  ]);

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

      <ConnectTabs activeTab={activeTab} onTabChange={handleTabChange}>
        <AnimatePresence mode="wait">
          {activeTab === 'wallet' ? (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <ConnectURI
                targetAccount={targetAccount}
                targetChainId={targetChainId}
                value={walletConnectUri}
                onValueChange={setWalletConnectUri}
                onChangeTransaction={handleNewWalletTransaction}
                moduleAddress={moduleAddress}
              />
            </motion.div>
          ) : (
            <motion.div
              key="iframe"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <ConnectIframe
                targetAccount={targetAccount}
                targetChainId={targetChainId}
                value={iframeConnectUri}
                onValueChange={setIframeConnectUri}
                onIframeLoad={handleIframeLoad}
                isIframeLoading={isIframeLoading}
                setIsIframeLoading={setIsIframeLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </ConnectTabs>

      <ActionPreview
        isLoading={isLoading}
        sourcePort={sourcePort}
        targetChainId={Number(targetChainId)}
        moduleAddress={moduleAddress}
        message={actionState?.message}
        params={actionState?.params}
        fee={actionState?.fee}
      />
    </div>
  );
}

export function GenerateAction({
  timeLockContractAddress,
  sourceChainId,
  targetChainId
}: {
  timeLockContractAddress: string;
  sourceChainId: string;
  targetChainId: string;
}) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <GenerateActionContent
        timeLockContractAddress={timeLockContractAddress}
        sourceChainId={sourceChainId}
        targetChainId={targetChainId}
      />
    </Suspense>
  );
}
