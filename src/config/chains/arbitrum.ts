import { arbitrum as arbitrumChain } from 'wagmi/chains';
import type { ChainConfig } from '@/types/chains';

export const arbitrum: ChainConfig = {
  ...arbitrumChain,
  iconUrl: '/images/chains/arbitrum.svg',
  shortName: 'arb1',
  infuraUrl: 'https://arbitrum-mainnet.infura.io/v3/'
} as const satisfies ChainConfig;
