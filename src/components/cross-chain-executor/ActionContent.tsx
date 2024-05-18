import React, { useMemo } from 'react';
import { Plus } from 'lucide-react';

import { State } from '@/store/chain';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BaseTransaction } from '@/types/transaction';
import { DappInfo } from '@/database/dapps';
import LoadingText from '@/components/loading-text';
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
  dappItem?: DappInfo;
  crossChainFeeData?: FeeApiResponse;
  isLoading?: boolean;
}

const ActionContent: React.FC<ActionContentProps> = ({
  remoteChain,
  transactionInfo,
  dappItem,
  crossChainFeeData,
  isLoading
}) => {
  const messageInfoList = useMemo(() => {
    if (!transactionInfo) return [];
    return [
      {
        key: 'Interact With',
        value: transactionInfo.to,
        extra: dappItem?.name
      },
      {
        key: 'Value',
        value: transactionInfo.value?.toString()
      },
      {
        key: 'Data',
        value: transactionInfo.data
      },
      {
        key: 'Operation',
        value: 'call'
      }
    ];
  }, [transactionInfo, dappItem?.name]);

  return (
    <div>
      <div className="grid gap-4 py-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-bold capitalize">To Chain</h4>
            <div className="text-sm uppercase text-muted-foreground">{remoteChain?.name}</div>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold capitalize">To xAccount</h4>
            <div className="text-sm text-muted-foreground">{remoteChain?.moduleAddress}</div>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold capitalize">Message</h4>
            <div className="space-y-2 pl-0 md:pl-4">
              {messageInfoList.map((messageInfo) => (
                <div
                  key={messageInfo.key}
                  className="flex flex-col items-start space-x-0 space-y-2 md:flex-row md:items-center md:space-x-4 md:space-y-0"
                >
                  <h4 className="w-24 shrink-0 text-sm font-bold capitalize">{messageInfo.key}</h4>
                  <div className="text-sm text-muted-foreground">
                    <span className=" break-all">{messageInfo.value}</span>
                    {messageInfo.extra && (
                      <span className="hidden md:inline">({messageInfo.extra})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className=" font-bold capitalize">fee</h4>
            <div className="text-sm text-muted-foreground">
              <LoadingText isLoading={isLoading} text={crossChainFeeData?.data?.fee || '0'} />
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
                    <LoadingText
                      isLoading={isLoading}
                      text={crossChainFeeData?.data?.params || '0x'}
                    />
                  </ScrollArea>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default ActionContent;
