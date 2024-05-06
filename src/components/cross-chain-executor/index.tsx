import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Item } from '@/database/dapps-repository';
import useChainStore from '@/store/chain';

import ActionContent from './ActionContent';

import type { BaseTransaction } from '@/types/transaction';
import type { FeeApiResponse } from '@/server/gaslimit';

interface CrossChainExecutorProps {
  confirmLoading?: boolean;
  dappItem?: Item;
  transactionInfo?: BaseTransaction;
  crossChainFeeData?: FeeApiResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}
const CrossChainExecutor = ({
  confirmLoading,
  dappItem,
  transactionInfo,
  crossChainFeeData,
  open,
  onOpenChange,
  onSubmit
}: CrossChainExecutorProps) => {
  const remoteChain = useChainStore((state) => state.remoteChain);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Cross-chain Call</DialogTitle>
        </DialogHeader>
        <ActionContent
          remoteChain={remoteChain}
          transactionInfo={transactionInfo}
          dappItem={dappItem}
          crossChainFeeData={crossChainFeeData}
          confirmLoading={confirmLoading}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CrossChainExecutor;
