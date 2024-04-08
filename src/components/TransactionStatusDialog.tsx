import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { getChainById } from '@/utils';

interface TransactionStatusDialogProps {
  transactionStatus: 'success' | 'failure';
  data?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionStatusDialog({
  transactionStatus,
  data,
  open,
  onOpenChange
}: TransactionStatusDialogProps) {
  const chain = getChainById(data?.chainId);

  const getTitle = () => {
    switch (transactionStatus) {
      case 'success':
        return 'Transaction Successful';
      case 'failure':
        return 'Transaction Failed';
      default:
        return 'Processing Transaction';
    }
  };

  const getDescription = () => {
    switch (transactionStatus) {
      case 'success':
        return 'Your transaction has been successfully processed.';
      case 'failure':
        return 'There was a problem processing your transaction. Please try again.';
      default:
        return 'Your transaction is being processed. Please wait.';
    }
  };

  const getActionText = () => {
    switch (transactionStatus) {
      case 'success':
      case 'failure':
        return 'Close';
      default:
        return 'Cancel';
    }
  };

  const getIcon = () => {
    switch (transactionStatus) {
      case 'success':
        return <CheckCircle color="green" size={24} />;
      case 'failure':
        return <XCircle color="red" size={24} />;
      default:
        return <Loader color="gray" size={24} />;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            {getIcon()}
            <AlertDialogTitle>{getTitle()}</AlertDialogTitle>
          </div>

          <AlertDialogDescription className="flex flex-col">
            <span>{getDescription()}</span>
            <span>
              <a
                target="_blank"
                rel="noopener"
                className="break-all text-primary hover:underline"
                href={`${chain?.blockExplorers?.default?.url}tx/${data?.transactionHash}`}
              >
                View on {chain?.blockExplorers?.default?.name}
              </a>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>{getActionText()}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
