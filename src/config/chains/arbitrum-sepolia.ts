// ethereum-sepolia

import { arbitrumSepolia as arbitrumSepoliaBase } from 'wagmi/chains';
import type { ChainConfig } from '@/types/chains';

export const arbitrumSepolia: ChainConfig = {
  ...arbitrumSepoliaBase,
  iconUrl: '/images/chains/arbitrum.svg',
  shortName: 'arb-sep',
  infuraUrl: 'https://arbitrum-sepolia.infura.io/v3/'
} as const satisfies ChainConfig;
