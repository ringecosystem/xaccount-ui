import { Select } from '@/components/select';
import { blo } from 'blo';
import { useCallback, useEffect, useState } from 'react';
import { ActionPreview } from './action-preview';
import ConnectTabs from './connect-tabs';
import { ConnectURI } from './connect-uri';
import { ConnectIframe } from './connect-iframe';
import { useGetDeployed } from '@/hooks/useGetDeployed';
import { ContentSkeleton } from '@/components/content-skeletion';
import { AlertCircle } from 'lucide-react';

export const GenerateAction = ({
  timeLockContractAddress,
  sourceChainId,
  targetChainId
}: {
  timeLockContractAddress: string;
  sourceChainId: string;
  targetChainId: string;
}) => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'iframe'>('wallet');
  const [targetAccount, setTargetAccount] = useState('');
  const [value, setValue] = useState('');

  const {
    data: deployedXAccounts,
    isLoading: isDeployedXAccountsLoading,
    refetch
  } = useGetDeployed({
    fromChainId: sourceChainId ? BigInt(sourceChainId) : BigInt(0),
    targetChainId: Number(targetChainId),
    owner: timeLockContractAddress as `0x${string}`
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
    console.log('称呼； ， ');
  }, [refetch]);

  if (isDeployedXAccountsLoading) {
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
              <ConnectURI targetAccount={targetAccount} value={value} onValueChange={setValue} />
            )}
            {activeTab === 'iframe' && (
              <ConnectIframe targetAccount={targetAccount} value={value} onValueChange={setValue} />
            )}
          </ConnectTabs>
        </>
      }

      <ActionPreview />
    </div>
  );
};
