import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

import { State } from '@/store/chain';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BaseTransaction } from '@/types/transaction';
import { toShortAddress } from '@/utils';
import { Item } from '@/database/dapps-repository';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ActionContentProps {
  remoteChain: State['remoteChain'];
  transactionInfo?: BaseTransaction;
  dappItem?: Item;
  localValue?: string;
  confirmLoading?: boolean;
  onSubmit: () => void;
}

const ActionContent: React.FC<ActionContentProps> = ({
  remoteChain,
  transactionInfo,
  dappItem,
  localValue,
  confirmLoading,
  onSubmit
}) => {
  const [advancedOpen, setAdvancedOpen] = useState(true);

  return (
    <div>
      <div className="grid gap-4 py-4">
        <div className="space-y-8">
          <div className="space-y-1">
            <h4 className=" font-bold uppercase">interact with</h4>
            <div className="text-muted-foreground">
              {remoteChain?.name}:{remoteChain?.address} ({dappItem?.name})
            </div>
          </div>
          <Separator />
          <div className="space-y-1">
            <h4 className="font-bold uppercase">data</h4>
            <ScrollArea className="max-h-80 break-all text-muted-foreground">
              {transactionInfo?.data}
            </ScrollArea>
          </div>
          <Separator />

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
        <Button
          type="submit"
          className="w-full"
          onClick={onSubmit}
          isLoading={confirmLoading}
          size="lg"
        >
          EXECUTE
        </Button>
        <p className="text-sm text-muted-foreground">
          this transaction will execute the remote call on {remoteChain?.name}
        </p>
      </DialogFooter>
    </div>
  );
};

export default ActionContent;
