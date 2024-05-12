import React from 'react';
import { CheckCircle, Hourglass, XCircle } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

interface TransactionCardProps {
  status: 'completed' | 'pending' | 'failed';
  txHash: string;
  msgTxHash?: string;
  chainId: string | number;
}

const getExplorerUrl = (chainId: string | number): string => {
  const explorerUrls: { [key: string]: string } = {
    '1': 'https://etherscan.io/tx/',
    '56': 'https://bscscan.com/tx/'
  };
  return explorerUrls[chainId.toString()] || 'https://etherscan.io/tx/';
};

const TransactionCard: React.FC<TransactionCardProps> = ({
  status,
  txHash,
  msgTxHash,
  chainId
}) => {
  const explorerUrl = getExplorerUrl(chainId);

  const StatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'pending':
        return <Hourglass className="animate-rotate-pause-rotate h-6 w-6 text-blue" />;
      case 'failed':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card
      className="relative w-full [--height:108px] md:[--height:80px]"
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '0 var(--height)'
      }}
    >
      <CardContent className="flex flex-col gap-2 p-4 md:flex-row md:gap-0">
        <div className="mr-4 flex items-center justify-start">
          <StatusIcon />
          <time className="absolute right-4 top-1/2 hidden -translate-y-1/2 text-xs text-muted-foreground md:inline">
            Sep-17-2020 03:31:27 PM +UTC
          </time>
          <time className=" ml-4 text-xs text-muted-foreground md:hidden">
            2020-09-17, 15:31 UTC
          </time>
        </div>
        <div className="flex flex-1 flex-col space-y-2 text-sm md:flex-row  md:items-center  md:space-y-0 ">
          <div className="flex-1 space-y-1 text-sm md:space-y-2">
            <div>
              <span className="font-semibold">TX:</span>
              <a
                href={`${explorerUrl}${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                <span className="md:hidden">
                  View on {chainId === '56' ? 'BscScan' : 'Etherscan'}
                </span>
                <span className="hidden md:inline">
                  {explorerUrl}
                  {msgTxHash}
                </span>
              </a>
            </div>
            {msgTxHash && (
              <div>
                <span className="font-semibold">MSG:</span>
                <a
                  href={`${explorerUrl}${msgTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  <span className="md:hidden">
                    View on {chainId === '56' ? 'BscScan' : 'Etherscan'}
                  </span>
                  <span className="hidden md:inline">
                    {explorerUrl}
                    {msgTxHash}
                  </span>
                </a>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
