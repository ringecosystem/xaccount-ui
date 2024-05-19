import React, { useMemo } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { TransactionStatus } from '@/config/transaction';
import { countTransactionsByDays } from '@/utils';
import { MSGPORT_NAME, MSGPORT_URL } from '@/config/site';

import TransactionItem from './transaction';

interface Transaction {
  hash: `0x${string}`;
  status: TransactionStatus;
  createdAt: number;
}

interface Props {
  transactions: Transaction[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const TransactionsSheet: React.FC<Props> = ({ transactions, open, onOpenChange }) => {
  const groupedTransactionsByDays = useMemo(() => {
    const sortedTransactions = transactions.sort((a, b) => b.createdAt - a.createdAt);
    return countTransactionsByDays(sortedTransactions);
  }, [transactions]);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full space-y-4 sm:w-[450px] sm:max-w-[450px] md:w-[600px] md:max-w-[600px]">
          <SheetHeader>
            <SheetTitle>Transaction Details</SheetTitle>
            <SheetDescription className="text-left">
              View the status and progress of recent transactions. Note that the displayed data is a
              local snapshot and may not include all details. For full transaction data, visit{' '}
              <a href={MSGPORT_URL} target="_blank" rel="noreferrer" className=" text-blue-500">
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
                  {transactions.map((tx, index) => (
                    <TransactionItem
                      key={tx.hash}
                      status={tx.status}
                      hash={tx.hash}
                      index={index}
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
