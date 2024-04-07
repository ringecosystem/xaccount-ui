import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { RequestId } from '@safe-global/safe-apps-sdk';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BaseTransaction } from '@/types/transaction';
import { Item } from '@/database/dapps-repository';
import useChainStore from '@/store/chain';
import { toShortAddress } from '@/utils';

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
  const remoteChain = useChainStore((state) => state.remoteChain);
  const [localValue, setLocalValue] = useState<string>('0.0');
  const [advancedOpen, setAdvancedOpen] = useState(true);

  useEffect(() => {
    if (transactionInfo) {
      setLocalValue(transactionInfo.value.toString());
    }
  }, [transactionInfo]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className=" text-2xl">Execute transaction</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-8">
            <div className="space-y-1">
              <h4 className=" font-bold uppercase">interact with</h4>
              <div className="text-muted-foreground">
                {remoteChain?.name}:{remoteChain?.address} ({dappItem?.name})
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold uppercase">data</h4>
              <ScrollArea className="scroll-fade-bottom h-80 break-all text-muted-foreground">
                {transactionInfo?.data}
              </ScrollArea>
            </div>

            <div className="space-y-1">
              <h4
                className="flex cursor-pointer items-center gap-1 text-sm font-bold uppercase"
                onClick={() => setAdvancedOpen(!advancedOpen)}
              >
                {advancedOpen ? (
                  <Plus width={18} height={18} strokeWidth={1} />
                ) : (
                  <Minus width={18} height={18} strokeWidth={1} />
                )}
                Advanced
              </h4>
              {advancedOpen && (
                <div className=" space-y-2">
                  <div className="flex items-center gap-2">
                    <div>value :</div>
                    <div className="text-muted-foreground">{localValue}</div>
                    {/* <Input
                  className="w-48"
                  type="number"
                  placeholder="0.0"
                  value={localValue}
                  onChange={(e) => setLocalValue(e.target.value)}
                /> */}
                  </div>
                  <p className=" text-sm text-muted-foreground">
                    The native token amount you want to transfer from arb:
                    {toShortAddress(remoteChain?.address || '')} to arb:
                    {toShortAddress(transactionInfo?.to || '')}({dappItem?.name})
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="flex !flex-col items-center justify-center gap-2">
          <Button type="submit" className="w-full" onClick={onSubmit} isLoading={confirmLoading}>
            execute
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
