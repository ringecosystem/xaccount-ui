import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle, AlertCircle, Loader } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { getTransactionStatusDescription } from '@/utils';
import { TransactionStatus } from '@/config/transaction';
import { MSGPORT_NAME, MSGPORT_URL } from '@/config/site';

const getStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.FailureOnLocal:
    case TransactionStatus.FailureOnRemote:
      return {
        indicator: 'bg-red-500',
        bg: 'bg-red-500/20'
      };
    case TransactionStatus.SuccessOnRemote:
      return {
        indicator: 'bg-green-500',
        bg: 'bg-green-500/20'
      };
    default:
      return {
        indicator: 'bg-blue-500',
        bg: 'bg-blue-500/20'
      };
  }
};

const getStatusIcon = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.ProcessingOnLocal:
    case TransactionStatus.ProcessingOnRemote:
      return <Loader size={16} className="animate-spin text-blue-500" />;
    case TransactionStatus.SuccessOnRemote:
      return <CheckCircle size={16} className="text-green-500" />;
    case TransactionStatus.FailureOnLocal:
    case TransactionStatus.FailureOnRemote:
      return <AlertCircle size={16} className="text-red-500" />;
    default:
      return <Loader size={16} />;
  }
};

const getProcess = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.FailureOnRemote:
      return 100;
    case TransactionStatus.SuccessOnRemote:
      return 100;
    case TransactionStatus.ProcessingOnLocal:
      return 33;
    case TransactionStatus.FailureOnLocal:
      return 50;
    case TransactionStatus.ProcessingOnRemote:
      return 66;
    default:
      return 1;
  }
};
interface TransactionItemProps {
  hash: `0x${string}`;
  status: TransactionStatus;
  index: number;
}
const TransactionItem: React.FC<TransactionItemProps> = ({ hash, status, index }) => {
  const statusText = getTransactionStatusDescription(status);
  const statusIcon = getStatusIcon(status);
  const { indicator, bg } = getStatusColor(status);

  const txHashUrl = `${MSGPORT_URL}/messages/${hash}`;
  const shortHash = hash.slice(0, 5) + '...' + hash.slice(-5);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={txHashUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink size={16} />
              {shortHash}
            </a>
          </TooltipTrigger>
          <TooltipContent>
            View transaction {hash} on {MSGPORT_NAME}
          </TooltipContent>
        </Tooltip>

        <div className="flex items-center gap-2">
          {statusIcon}
          <span>{statusText}</span>
        </div>
      </div>

      <Progress value={getProcess(status)} className={bg} indicatorClassName={indicator} />
    </motion.div>
  );
};

export default TransactionItem;
