import React, { useCallback, useEffect, useState, memo, useTransition, useMemo } from 'react';
import { useAccount } from 'wagmi';
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
  const { address, chainId } = useAccount();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { transactions, cleanUpOldTransactions, setTransactionStatus } = useTransactionStore(
    useShallow((state) => ({
      transactions: state.transactions,
      cleanUpOldTransactions: state.cleanUpOldTransactions,
      setTransactionStatus: state.setTransactionStatus
    }))
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      return transaction.address === address && transaction.chainId === chainId;
    });
  }, [transactions, address, chainId]);

  const pendingTransactions = filterPendingTransactions(filteredTransactions);

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
      // handle xaccount status
      updateAccountByTransactionHash(hash, {
        status: status === 'success' ? 'completed' : 'created'
      });

      // handle transaction status
      setTransactionStatus(
        hash,
        status === 'success' ? TransactionStatus.SuccessOnRemote : TransactionStatus.FailureOnRemote
      );
    },
    [updateAccountByTransactionHash, setTransactionStatus]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      cleanUpOldTransactions();
    }, 1000);
    return () => clearInterval(interval);
  }, [cleanUpOldTransactions]);

  return (
    <>
      {filteredTransactions?.length > 0 && (
        <PendingTransactionsIndicator
          pendingTransactions={pendingTransactions?.length}
          onClick={() => setSheetOpen(true)}
        />
      )}

      <TransactionsSheet
        transactions={filteredTransactions}
        open={sheetOpen}
        onOpenChange={handleOpenChange}
      />
      {filteredTransactions?.length ? (
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
