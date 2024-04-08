import { arbitrum as arbitrumChain } from 'wagmi/chains';
import { ChainId, type ChainConfig } from '@/types/chains';
import { getRpcUrl } from '../rpc-url';

export const arbitrum: ChainConfig = {
  ...arbitrumChain,
  iconUrl: '/images/chains/arbitrum.svg',
  shortName: 'arb1',
  rpcUrls: {
    default: {
      http: [getRpcUrl(ChainId.ARBITRUM)]
    }
  }
} as const satisfies ChainConfig;
