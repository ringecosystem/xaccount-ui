import React from 'react';
import { Plus } from 'lucide-react';

import { State } from '@/store/chain';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BaseTransaction } from '@/types/transaction';
import { toShortAddress } from '@/utils';
import { Item } from '@/database/dapps-repository';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChainConfig } from '@/types/chains';

interface ActionContentProps {
  localChain?: ChainConfig;
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
            <h4 className=" font-bold capitalize">interact with</h4>
            <div className="text-sm text-muted-foreground">
              {remoteChain?.name} : {remoteChain?.safeAddress} ({dappItem?.name})
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold capitalize">data</h4>
            <ScrollArea className="max-h-60 break-all text-sm text-muted-foreground">
              {transactionInfo?.data}
            </ScrollArea>
          </div>
          <Accordion type="single" collapsible className="w-full" defaultValue="advanced">
            <AccordionItem value="advanced" className="border-none">
              <AccordionTrigger className="font-bold capitalize focus-visible:outline-none">
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
                    autoFocus={false}
                  />
                </div>
                <p className=" text-sm text-muted-foreground">
                  The native token amount you want to transfer from {localChain?.shortName}:
                  {toShortAddress(remoteChain?.moduleAddress || '')} to {remoteChain?.shortName}:
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
          className="w-full rounded-3xl"
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
