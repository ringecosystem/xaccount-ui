import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { DappInfo } from '@/database/dapps';
import useChainStore from '@/store/chain';
import { Button } from '@/components/ui/button';

import ActionContent from './ActionContent';

import type { BaseTransaction } from '@/types/transaction';
import type { FeeApiResponse } from '@/server/gaslimit';

interface CrossChainExecutorProps {
  confirmLoading?: boolean;
  dappItem?: DappInfo;
  transactionInfo?: BaseTransaction;
  crossChainFeeData?: FeeApiResponse;
  isLoading?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}
const CrossChainExecutor = ({
  confirmLoading,
  dappItem,
  transactionInfo,
  crossChainFeeData,
  isLoading,
  open,
  onOpenChange,
  onSubmit
}: CrossChainExecutorProps) => {
  const remoteChain = useChainStore((state) => state.remoteChain);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="text-xl uppercase">Cross-chain Call</DialogTitle>
        </DialogHeader>
        <ActionContent
          remoteChain={remoteChain}
          transactionInfo={transactionInfo}
          dappItem={dappItem}
          isLoading={isLoading}
          crossChainFeeData={crossChainFeeData}
        />
        <DialogFooter className="flex !flex-col items-center justify-center gap-2">
          <Button
            type="submit"
            className="w-full rounded-xl"
            onClick={onSubmit}
            isLoading={confirmLoading}
            disabled={
              isLoading || !crossChainFeeData?.data?.fee || !crossChainFeeData?.data?.params
            }
            size="lg"
          >
            {isLoading ? <span className="animate-pulse">EXECUTE</span> : 'EXECUTE'}
          </Button>
          <p className="text-sm text-muted-foreground">
            this transaction will execute the remote call on {remoteChain?.name}
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CrossChainExecutor;
