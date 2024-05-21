import { useMemo } from 'react';

import { MSGPORT_URL } from '@/config/site';

import { useIsConnectedToSupportedChain } from './useIsConnectedToSupportedChain'; // 调整路径以匹配您的项目结构

function useHistoryLink() {
  const { isConnected, isChainSupported, address } = useIsConnectedToSupportedChain();

  const historyLink = useMemo(() => {
    if (isConnected && isChainSupported && address) {
      return `${MSGPORT_URL}/messages/sent_by/${address}`;
    }
    return '';
  }, [isConnected, isChainSupported, address]);

  return historyLink;
}

export default useHistoryLink;
