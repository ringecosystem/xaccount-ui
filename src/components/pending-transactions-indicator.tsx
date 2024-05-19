// src/components/PendingTransactionsIndicator.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';

interface Props {
  pendingTransactions: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const PendingTransactionsIndicator: React.FC<Props> = ({ pendingTransactions, onClick }) => {
  return (
    <div
      className="fixed bottom-14 right-5 flex cursor-pointer items-center justify-center"
      onClick={onClick}
    >
      {
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="relative"
        >
          <motion.div
            className="rounded-full bg-blue-500 p-2 text-white"
            whileHover={{ scale: 1.1 }}
          >
            <History size={24} />
          </motion.div>
          {pendingTransactions > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 rounded-full bg-red-500 px-2 py-1 text-xs"
            >
              {pendingTransactions}
            </motion.span>
          )}
        </motion.div>
      }
    </div>
  );
};

export default PendingTransactionsIndicator;
