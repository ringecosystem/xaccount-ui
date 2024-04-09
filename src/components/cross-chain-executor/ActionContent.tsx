import React, { useState } from 'react';
import { Plus } from 'lucide-react';

import { State } from '@/store/chain';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BaseTransaction } from '@/types/transaction';
import { toShortAddress } from '@/utils';
import { Item } from '@/database/dapps-repository';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface ActionContentProps {
  localChain: State['localChain'];
  remoteChain: State['remoteChain'];
  transactionInfo?: BaseTransaction;
  dappItem?: Item;
  localValue?: string;
  confirmLoading?: boolean;
  onSubmit: () => void;
}

const ActionContent: React.FC<ActionContentProps> = ({
  localChain,
  remoteChain,
  transactionInfo,
  dappItem,
  localValue,
  confirmLoading,
  onSubmit
}) => {
  return (
    <div>
      <div className="grid gap-4 py-4">
        <div className="space-y-6">
          <div className="space-y-1">
            <h4 className=" font-bold uppercase">interact with</h4>
            <div className="text-sm text-muted-foreground">
              {remoteChain?.name} : {remoteChain?.address} ({dappItem?.name})
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold uppercase">data</h4>
            <ScrollArea className="max-h-60 break-all text-sm text-muted-foreground">
              {transactionInfo?.data}
            </ScrollArea>
          </div>
          <Accordion type="single" collapsible className="w-full" defaultValue="advanced">
            <AccordionItem value="advanced" className="border-none">
              <AccordionTrigger className="font-bold uppercase">
                <h4 className="flex items-center gap-1">
                  <Plus width={18} height={18} />
                  Advanced
                </h4>
              </AccordionTrigger>
              <AccordionContent className="mt-1 flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <Label>value:</Label>
                  <Input
                    className="w-48"
                    type="number"
                    placeholder="0.0"
                    value={localValue}
                    // onChange={(e) => setLocalValue(e.target.value)}
                  />
                </div>
                <p className=" text-sm text-muted-foreground">
                  The native token amount you want to transfer from {localChain?.shortName}:
                  {toShortAddress(remoteChain?.address || '')} to {remoteChain?.shortName}:
                  {toShortAddress(transactionInfo?.to || '')}({dappItem?.name})
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
