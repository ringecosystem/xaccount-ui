import { Select } from '@/components/select';
import { blo } from 'blo';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ActionPreview } from './action-preview';
import ConnectTabs from './connect-tabs';
import { APP_DESCRIPTION, APP_NAME } from '@/config/site';
import { WalletConnectManager } from '@/lib/walletConnect';
import Link from 'next/link';

const accountOptions = [
  {
    value: '0x3d6d656c1bf92f7028Ce4C352563E1C363C58ED5',
    label: '0x3d6d656c1bf92f7028Ce4C352563E1C363C58ED5',
    asset: blo('0x3d6d656c1bf92f7028Ce4C352563E1C363C58ED5')
  },
  {
    value: '0x11514D3FC3D75D3c6F600bac870B99656C5a5546',
    label: '0x11514D3FC3D75D3c6F600bac870B99656C5a5546',
    asset: blo('0x11514D3FC3D75D3c6F600bac870B99656C5a5546')
  }
];

const WC_CONFIG = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  metadata: {
    name: APP_NAME,
    description: APP_DESCRIPTION,
    url: 'xaccount.box',
    icons: ['https://xaccount.box/images/common/favicon.png']
  }
};

export const GenerateAction = () => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'iframe'>('wallet');
  const [targetAccount, setTargetAccount] = useState(accountOptions[0].value);
  const [value, setValue] = useState('');
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
    const initWalletConnect = async () => {
      try {
        const manager = new WalletConnectManager(
          WC_CONFIG,
          `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_TOKEN}`
        );
        await manager.initializeWallet();

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

    // Cleanup on unmount
    return () => {
      walletConnect?.destroy().catch(console.error);
    };
  }, [walletConnect]);

  // Add this effect to update the address when target account changes
  useEffect(() => {
    if (walletConnect && targetAccount) {
      walletConnect.setAddress(targetAccount).catch(console.error);
    }
  }, [walletConnect, targetAccount]);

  useEffect(() => {
    if (walletConnect) {
      const checkConnection = () => {
        const info = walletConnect.getConnectionInfo();
        console.log('Connection info:', info);
        if (info.isConnected && info.dappInfo) {
          setConnectionInfo(info.dappInfo);
          setIsConnecting(false);
        }
      };

      checkConnection();

      const interval = setInterval(checkConnection, 1000);

      return () => clearInterval(interval);
    }
  }, [walletConnect]);

  const handleConnect = async () => {
    if (!walletConnect || isConnecting) return;

    try {
      setError('');
      setIsConnecting(true);

      switch (activeTab) {
        case 'wallet':
          if (value) {
            await walletConnect.pair(value);
            await walletConnect.setAddress(targetAccount);
          }
          break;

        case 'iframe':
          // Handle iframe connection if needed
          break;
      }
    } catch (error) {
      console.error('Connection failed:', error);
      if (error instanceof Error && error.message.includes('Pairing already exists')) {
        setValue('');
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
      setValue('');
    } catch (error) {
      console.error('Disconnect failed:', error);
      setError('Disconnect failed, please try again');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="space-y-2">
        <label className="text-sm font-semibold leading-[150%] text-[#F6F1E8]/70">
          Corresponding XAccounts
        </label>
        <Select
          placeholder="Select account on target chain"
          options={accountOptions}
          value={targetAccount}
          onValueChange={setTargetAccount}
        />
      </div>

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

      {
        <>
          <ConnectTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            disabled={walletConnect?.getConnectionInfo().isConnected}
            value={value}
            onValueChange={setValue}
            errorMessage={error}
          />
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
        </>
      }

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
              <Link
                href={connectionInfo?.url || ''}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] font-semibold leading-[150%] text-[#F6F1E8]/70 hover:text-[#F6F1E8] hover:underline"
              >
                {connectionInfo?.url}
              </Link>
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

      <ActionPreview />
    </div>
  );
};
