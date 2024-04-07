// ethereum-sepolia

import { sepolia } from 'wagmi/chains';
import type { ChainConfig } from '@/types/chains';

export const ethereumSepolia: ChainConfig = {
  ...sepolia,
  iconUrl: '/images/chains/ethereum.svg',
  shortName: 'sep',
  infuraUrl: 'https://sepolia.infura.io/v3/'
} as const satisfies ChainConfig;
