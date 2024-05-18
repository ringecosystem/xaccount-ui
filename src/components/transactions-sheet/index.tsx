import React from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { TransactionStatus } from '@/config/transaction';

import TransactionItem from './transaction';

interface Transaction {
  hash: `0x${string}`;
  status: TransactionStatus;
}

interface Props {
  transactions: Transaction[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const TransactionsSheet: React.FC<Props> = ({ transactions, open, onOpenChange }) => {
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full space-y-4 sm:w-[450px] sm:max-w-[450px] md:w-[600px] md:max-w-[600px]">
          <SheetHeader>
            <SheetTitle>Transaction Details</SheetTitle>
            <SheetDescription className="text-left">
              View the status and progress of recent transactions. Note that the displayed data is a
              local snapshot and may not include all details. For full transaction data, visit{' '}
              <a href="https://msgport.com/" target="_blank" rel="noreferrer">
                MSGPORT
              </a>
              . Data older than seven days is not retained.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-76 pr-4">
            <div className="space-y-6">
              {transactions.map((tx, index) => (
                <TransactionItem key={tx.hash} status={tx.status} hash={tx.hash} index={index} />
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default TransactionsSheet;
