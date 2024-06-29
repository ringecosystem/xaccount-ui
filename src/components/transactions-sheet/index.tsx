import React, { useMemo } from 'react';
import { useAccount } from 'wagmi';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import useHistoryLink from '@/hooks/useHistoryLink';
import { countTransactionsByDays, getChainById, toShortAddress } from '@/utils';
import { MSGPORT_NAME } from '@/config/site';
import { Transaction } from '@/store/transaction';

import TransactionItem from './transaction';

interface Props {
  transactions: Transaction[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const TransactionsSheet: React.FC<Props> = ({ transactions, open, onOpenChange }) => {
  const { address, chainId } = useAccount();
  const chain = getChainById(chainId);
  const historyLink = useHistoryLink();
  const groupedTransactionsByDays = useMemo(() => {
    const sortedTransactions = transactions.sort((a, b) => b.createdAt - a.createdAt);
    return countTransactionsByDays(sortedTransactions);
  }, [transactions]);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full space-y-4 sm:w-[450px] sm:max-w-[450px] md:w-[550px] md:max-w-[550px]">
          <SheetHeader>
            <SheetTitle>Transaction Details</SheetTitle>
            <SheetDescription className="text-left text-sm">
              View recent transaction status and progress for the current address:{' '}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-pointer underline">
                    {(address && toShortAddress(address)) || 'not connected'}
                  </span>
                </TooltipTrigger>
                <TooltipContent>{address}</TooltipContent>
              </Tooltip>{' '}
              on the {chain?.name || 'unknown network'}. Local snapshot data may be incomplete. For
              comprehensive details, visit{' '}
              <a href={historyLink} target="_blank" rel="noreferrer" className="text-blue-500">
                {MSGPORT_NAME}
              </a>
              . Data older than seven days is not retained.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea
            className="pr-4"
            style={{
              height: 'calc(100vh - 160px)'
            }}
          >
            <div className="space-y-6">
              {Object.entries(groupedTransactionsByDays).map(([date, transactions]) => (
                <div key={date} className="space-y-4">
                  <div key={date} className="text-muted-foreground">
                    {date}
                  </div>
                  {transactions.map((tx) => (
                    <TransactionItem
                      key={tx.hash}
                      status={tx.status}
                      hash={tx.hash}
                      chainId={tx.chainId}
                    />
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default TransactionsSheet;
