import { useEffect, useState } from 'react';
import { RequestId } from '@safe-global/safe-apps-sdk';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Item } from '@/database/dapps-repository';
import useChainStore from '@/store/chain';

import ActionContent from './ActionContent';

import type { BaseTransaction } from '@/types/transaction';
import { useAccount } from 'wagmi';
import { getChainById } from '@/utils';

interface CrossChainExecutorProps {
  confirmLoading?: boolean;
  requestId?: RequestId;
  dappItem?: Item;
  transactionInfo?: BaseTransaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}
const CrossChainExecutor = ({
  confirmLoading,
  dappItem,
  transactionInfo,
  open,
  onOpenChange,
  onSubmit
}: CrossChainExecutorProps) => {
  const { chainId } = useAccount();
  const localChain = getChainById(chainId);
  const remoteChain = useChainStore((state) => state.remoteChain);

  const [localValue, setLocalValue] = useState<string>('0.0');

  useEffect(() => {
    if (transactionInfo) {
      setLocalValue(transactionInfo.value.toString());
    }
  }, [transactionInfo]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl uppercase">Execute transaction</DialogTitle>
        </DialogHeader>
        <ActionContent
          localChain={localChain}
          remoteChain={remoteChain}
          transactionInfo={transactionInfo}
          dappItem={dappItem}
          localValue={localValue}
          confirmLoading={confirmLoading}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CrossChainExecutor;
