import React, { useCallback, useEffect, useState, memo, useTransition } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Transaction, useTransactionStore } from '@/store/transaction';
import { useXAccountsStore } from '@/store/xaccounts';
import PendingTransactionsIndicator from '@/components/pending-transactions-indicator';
import TransactionsSheet from '@/components/transactions-sheet';
import {
  TransactionStatus,
  localTransactionStatuses,
  remoteTransactionStatuses
} from '@/config/transaction';

import TransactionLocalStatus from './local-status';
import TransactionRemoteStatus from './remote-status';

/**
 * Filters pending transactions that are currently processing on either local or remote blockchains.
 * @param transactions An array of transactions to filter.
 * @returns An array of transactions that are either processing on local or remote blockchains.
 */
const filterPendingTransactions = (transactions: Transaction[]): Transaction[] => {
  return transactions.filter(
    (transaction) =>
      transaction.status === TransactionStatus.ProcessingOnLocal ||
      transaction.status === TransactionStatus.ProcessingOnRemote
  );
};

const TransactionManager = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { transactions, cleanUpOldTransactions } = useTransactionStore(
    useShallow((state) => ({
      transactions: state.transactions,
      cleanUpOldTransactions: state.cleanUpOldTransactions
    }))
  );

  const pendingTransactions = filterPendingTransactions(transactions);

  const updateAccountByTransactionHash = useXAccountsStore(
    (state) => state.updateAccountByTransactionHash
  );

  const localPendingTransactions = pendingTransactions?.filter((transaction) =>
    localTransactionStatuses.includes(transaction.status)
  );
  const remotePendingTransactions = pendingTransactions?.filter((transaction) =>
    remoteTransactionStatuses.includes(transaction.status)
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      startTransition(() => {
        setSheetOpen(open);
      });
    },
    [startTransition]
  );

  const handleResolved = useCallback(
    (status: 'success' | 'failed', hash: `0x${string}`) => {
      updateAccountByTransactionHash(hash, {
        status: status === 'success' ? 'completed' : 'created'
      });
    },
    [updateAccountByTransactionHash]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      cleanUpOldTransactions();
    }, 1000);
    return () => clearInterval(interval);
  }, [cleanUpOldTransactions]);

  console.log('pendingTransactions', pending);

  return (
    <>
      {transactions?.length > 0 && (
        <PendingTransactionsIndicator
          pendingTransactions={pendingTransactions?.length}
          onClick={() => setSheetOpen(true)}
        />
      )}

      <TransactionsSheet
        transactions={transactions}
        open={sheetOpen}
        onOpenChange={handleOpenChange}
      />
      {transactions?.length ? (
        <>
          {localPendingTransactions.map((transaction) => (
            <TransactionLocalStatus key={transaction.hash} hash={transaction.hash} />
          ))}
          {remotePendingTransactions.map((transaction) => (
            <TransactionRemoteStatus
              key={transaction.hash}
              hash={transaction.hash}
              chainId={transaction.chainId}
              targetChainId={transaction.targetChainId}
              onResolved={(status) => handleResolved(status, transaction.hash)}
            />
          ))}
        </>
      ) : null}
    </>
  );
};

export default memo(TransactionManager);
