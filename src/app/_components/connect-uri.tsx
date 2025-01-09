import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { WalletConnectManager } from '@/lib/walletConnect';
import { APP_DESCRIPTION, APP_NAME } from '@/config/site';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { getRpcUrl } from '@/config/rpc-url';

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
  disabled
}: {
  targetAccount: string;
  targetChainId: string;
  value: string;
  onValueChange: (value: string) => void;
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
          // `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_TOKEN}`
          getRpcUrl(Number(targetChainId))
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
          console.log('New transaction:', transaction);
          // Handle transaction UI updates here
        });

        setWalletConnect(manager);
      } catch (error) {
        console.error('Failed to initialize WalletConnect:', error);
      }
    };

    initWalletConnect();
  }, [targetChainId]);

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

      // 首先建立配对连接
      await walletConnect.pair(value);

      // 等待连接完成后再更新地址
      // 添加短暂延迟以确保连接已完全建立
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 更新会话信息
      await walletConnect.updateSession({
        address: targetAccount,
        chainId: `eip155:${targetChainId}`
      });
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
  console.log('walletConnect', walletConnect);
  console.log('isConnecting', isConnecting);
  console.log('value', value);

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
              <a
                href={connectionInfo?.url || ''}
                // target={connectionInfo?.url || ''}
                className="text-[14px] font-semibold leading-[150%] text-[#F6F1E8]/70 hover:text-[#F6F1E8] hover:underline"
              >
                {connectionInfo?.url}
              </a>
            </div>
          )}
          <button
            onClick={handleDisconnect}
            className="h-[49px] max-w-[108px] rounded-[8px] bg-[#7838FF] px-[20px] hover:bg-[#7838FF]/80"
          >
            Disconnect
          </button>
        </div>
      )}
      {isConnecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-lg bg-[#1C1C1C] p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#7838FF]" />
              <p className="text-[#F6F1E8]">
                {walletConnect?.getConnectionInfo().isConnected
                  ? 'Disconnecting...'
                  : 'Connecting to wallet...'}
              </p>
              <button
                onClick={() => {
                  setIsConnecting(false);
                  if (!walletConnect?.getConnectionInfo().isConnected) {
                    walletConnect?.disconnect();
                  }
                }}
                className="rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
              >
                Cancel {walletConnect?.getConnectionInfo().isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
