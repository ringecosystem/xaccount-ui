import Image from 'next/image';

interface TransactionStatusProps {
  message: string;
  transactionHash: `0x${string}`;
  chainName?: string;
  explorerUrl?: string;
}

export function TransactionStatus({
  message,
  transactionHash,
  chainName,
  explorerUrl
}: TransactionStatusProps) {
  return (
    <div className="py-[4px]">
      <p>
        {message} on {chainName}
      </p>
      <div>
        <a
          href={`${explorerUrl}/tx/${transactionHash}`}
          className="flex items-center gap-[10px] text-[12px] font-normal tabular-nums leading-normal text-[#FFF]"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tx:{transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}
          <Image src="/images/common/link.svg" alt="link" width={8} height={8} />
        </a>
      </div>
    </div>
  );
}
