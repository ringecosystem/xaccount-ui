import React from 'react';
import { Plus } from 'lucide-react';

import { State } from '@/store/chain';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BaseTransaction } from '@/types/transaction';
import { Item } from '@/database/dapps-repository';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import type { FeeApiResponse } from '@/server/gaslimit';

interface ActionContentProps {
  remoteChain: State['remoteChain'];
  transactionInfo?: BaseTransaction;
  dappItem?: Item;
  crossChainFeeData?: FeeApiResponse;
  confirmLoading?: boolean;
  onSubmit: () => void;
}

const ActionContent: React.FC<ActionContentProps> = ({
  remoteChain,
  transactionInfo,
  dappItem,
  crossChainFeeData,
  confirmLoading,
  onSubmit
}) => {
  return (
    <div>
      <div className="grid gap-4 py-4">
        <div className="space-y-6">
          <div className="space-y-1">
            <h4 className=" font-bold capitalize">To Chain</h4>
            <div className="text-sm uppercase text-muted-foreground">{remoteChain?.name}</div>
          </div>
          <div className="space-y-1">
            <h4 className=" font-bold capitalize">To xAccount</h4>
            <div className="text-sm text-muted-foreground">{remoteChain?.moduleAddress}</div>
          </div>
          <div className="space-y-1">
            <h4 className=" font-bold capitalize">Message</h4>
            <div className=" space-y-2">
              <div className="flex items-center space-x-2">
                <h4 className="w-24 text-sm font-bold capitalize">Interact With:</h4>
                <div className="text-sm text-muted-foreground">
                  {transactionInfo?.to}({dappItem?.name})
                </div>
              </div>
              <div className="flex items-center space-x-2 ">
                <h4 className="w-24 text-sm font-bold capitalize">Value:</h4>
                <div className="text-sm text-muted-foreground">
                  {transactionInfo?.value?.toString()}
                </div>
              </div>

              <div className="flex items-center space-x-2 ">
                <h4 className="w-24 text-sm  font-bold capitalize">data:</h4>
                <ScrollArea className="max-h-60 break-all text-sm text-muted-foreground">
                  {transactionInfo?.data}
                </ScrollArea>
              </div>
              <div className="flex items-center space-x-2 ">
                <h4 className="w-24 text-sm font-bold capitalize">Operation:</h4>
                <div className="text-sm text-muted-foreground">call</div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <h4 className=" font-bold capitalize">fee</h4>
            <div className="text-sm text-muted-foreground">
              {crossChainFeeData?.data?.fee || '0'}
            </div>
          </div>
          <Accordion type="single" collapsible className="!mt-0 w-full" defaultValue="">
            <AccordionItem value="advanced" className="border-none">
              <AccordionTrigger className="font-bold capitalize focus-visible:outline-none">
                <h4 className="flex items-center gap-1">
                  <Plus width={18} height={18} />
                  Advanced
                </h4>
              </AccordionTrigger>
              <AccordionContent className="mt-1 flex flex-col gap-2">
                <div className="space-y-1 pl-4">
                  <h4 className=" font-bold capitalize">params</h4>
                  <ScrollArea className="max-h-60 break-all text-sm text-muted-foreground">
                    {crossChainFeeData?.data?.params || '0x'}
                  </ScrollArea>
                </div>
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
