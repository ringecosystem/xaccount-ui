import { useCallback } from 'react';
import { useDisconnect } from 'wagmi';

import useReturnDashboard from './useReturnDashboard';

export const useDisconnectWallet = () => {
  const { disconnect } = useDisconnect();
  const returnDashboard = useReturnDashboard();

  const disconnectWallet = useCallback(
    async (address: `0x${string}`) => {
      if (typeof window !== 'undefined' && window?.ethereum?.request) {
        try {
          await window.ethereum.request({
            method: 'wallet_revokePermissions',
            params: [{ eth_accounts: address }]
          });
          console.log('Permissions revoked successfully');
        } catch (error) {
          console.error('Error revoking permissions:', error);
        }
      }

      disconnect();
      returnDashboard();
    },
    [disconnect, returnDashboard]
  );
  return { disconnectWallet };
};
