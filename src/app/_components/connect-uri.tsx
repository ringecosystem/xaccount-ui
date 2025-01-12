import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { WalletConnectManager } from '@/lib/walletConnect';
import { APP_DESCRIPTION, APP_NAME } from '@/config/site';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import type { TransactionWithId } from '@/contexts/ImpersonatorIframeContext';

const WC_CONFIG = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  metadata: {
    name: APP_NAME,
    description: APP_DESCRIPTION,
    url: 'xaccount.box',
    icons: ['https://xaccount.box/images/common/favicon.png']
  }
};

export const ConnectURI = ({
  targetAccount,
  targetChainId,
  value,
  onValueChange,
  onChangeTransaction,
  moduleAddress,
  disabled
}: {
  targetAccount: string;
  targetChainId: string;
  value: string;
  onValueChange: (value: string) => void;
  onChangeTransaction: (transaction: TransactionWithId) => void;
  moduleAddress?: string;
  disabled?: boolean;
}) => {
  const [walletConnect, setWalletConnect] = useState<WalletConnectManager | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<{
    name?: string;
    url?: string;
    icon?: string;
    description?: string;
  }>({});
  const [error, setError] = useState<string>('');
  // Initialize WalletConnect
  useEffect(() => {
    console.log('Effect triggered with targetChainId:', targetChainId);

    const initWalletConnect = async () => {
      if (!targetChainId) return;
      try {
        const manager = new WalletConnectManager(
          WC_CONFIG,
          `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_TOKEN}`
        );
        await manager.initializeWallet();

        // Set up connection status callback
        manager.onConnectionStatusChange((info) => {
          if (info.isConnected && info.dappInfo) {
            setConnectionInfo(info.dappInfo);
            setIsConnecting(false);
          }
        });

        // Set up transaction callback
        manager.setTransactionCallback((transaction) => {
          console.log('New transaction:', transaction, moduleAddress);
          if (transaction && moduleAddress) {
            onChangeTransaction?.(transaction);
          }
          // Handle transaction UI updates here
        });

        setWalletConnect(manager);
      } catch (error) {
        console.error('Failed to initialize WalletConnect:', error);
      }
    };

    initWalletConnect();
  }, [targetChainId, onChangeTransaction, moduleAddress]);

  // Update this effect to use updateSession when target account changes
  useEffect(() => {
    if (walletConnect && targetAccount) {
      walletConnect.setAddress(targetAccount).catch(console.error);
      // Add updateSession call for connected sessions
      if (walletConnect.getConnectionInfo().isConnected) {
        walletConnect.updateSession({ address: targetAccount }).catch(console.error);
      }
    }
  }, [walletConnect, targetAccount]);

  // Add new effect to handle chain ID changes
  useEffect(() => {
    if (walletConnect && walletConnect.getConnectionInfo().isConnected) {
      walletConnect.updateSession({ chainId: `eip155:${targetChainId}` }).catch(console.error);
    }
  }, [walletConnect, targetChainId]);

  const handleConnect = async () => {
    if (!walletConnect || isConnecting) return;
    if (!value) {
      toast.error('Invalid URI');
      return;
    }
    if (!targetAccount) {
      toast.error('Address is not an ENS or Ethereum address');
      return;
    }

    try {
      setError('');
      setIsConnecting(true);

      await walletConnect.setAddress(targetAccount);

      await walletConnect.pair(value);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const connectionInfo = walletConnect.getConnectionInfo();
      if (connectionInfo.isConnected) {
        await walletConnect.updateSession({
          address: targetAccount,
          chainId: `eip155:${targetChainId}`
        });
      }
    } catch (error) {
      console.error('Connection failed:', error);
      if (error instanceof Error && error.message.includes('Pairing already exists')) {
        onValueChange('');
        setError('This connection is invalid. Please get a new QR code or link from the dApp');
      } else {
        setError('Connection failed, please try again');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!walletConnect) return;

    try {
      setIsConnecting(true);
      await walletConnect.disconnect();
      onValueChange('');
    } catch (error) {
      console.error('Disconnect failed:', error);
      setError('Disconnect failed, please try again');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-[5px] text-sm font-semibold leading-[150%] text-[#F6F1E8]/70">
        Wallet Connect URI
        <Tooltip>
          <TooltipTrigger asChild>
            <Image
              src="/images/common/info.svg"
              alt="info"
              width={16}
              height={16}
              className="inline-block cursor-pointer"
            />
          </TooltipTrigger>
          <TooltipContent className="max-w-[280px] bg-[#1A1A1A]">
            <p className="text-[12px] font-normal leading-normal text-[#F6F1E8]">
              Visit any dapp and select WalletConnect, then click &quot;Copy to clipboard&quot;
              beneath the QR code and paste it here.
            </p>
          </TooltipContent>
        </Tooltip>
      </label>
      <Input
        type="text"
        placeholder="wc:xyz123"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="h-[62px] rounded-[8px] bg-[#262626] p-[20px] !text-[18px] font-medium leading-[130%] text-[#F6F1E8] placeholder:text-[18px] placeholder:text-[#666]"
        disabled={disabled}
      />
      {error && <p className="text-red-500">{error}</p>}
      {!walletConnect?.getConnectionInfo().isConnected && (
        <div className="flex items-center justify-center">
          <Button
            variant="secondary"
            isLoading={isConnecting}
            className="h-[50px] w-full max-w-[226px] rounded-[8px] bg-[#7838FF] text-sm font-medium leading-[150%] text-[#F6F1E8] hover:bg-[#7838FF]/80"
            disabled={!walletConnect || isConnecting || !value}
            onClick={handleConnect}
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        </div>
      )}
      {walletConnect?.getConnectionInfo().isConnected && (
        <div className="flex flex-col items-center justify-center gap-[20px]">
          <h3 className="text-center text-[14px] font-extrabold leading-normal text-[#F6F1E8]">
            Connected To
          </h3>
          {connectionInfo && (
            <div className="flex flex-col items-center gap-[5px]">
              {connectionInfo?.icon && (
                <Image
                  src={connectionInfo?.icon}
                  alt={`${connectionInfo?.name || 'Dapp'} icon`}
                  className="object-cover"
                  width={56}
                  height={56}
                  sizes="56px"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <span className="text-[14px] font-extrabold leading-normal text-[#F6F1E8]">
                {connectionInfo?.name}
              </span>
              <span className="line-clamp-3 text-[14px] font-semibold leading-[150%] text-[#F6F1E8]/70">
                {connectionInfo?.description}
              </span>

              <span className="text-[14px] font-semibold leading-[150%] text-[#F6F1E8]/70">
                Go back to the dapp to make your call
              </span>
            </div>
          )}
          <Button
            onClick={handleDisconnect}
            variant="secondary"
            isLoading={isConnecting}
            className="h-[49px] rounded-[8px] bg-[#7838FF] p-[20px] hover:bg-[#7838FF]/80"
          >
            {isConnecting ? 'Disconnecting...' : 'Disconnect'}
          </Button>
        </div>
      )}
    </div>
  );
};
