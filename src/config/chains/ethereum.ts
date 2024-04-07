import { mainnet } from 'wagmi/chains';
import type { ChainConfig } from '@/types/chains';

export const ethereum: ChainConfig = {
  ...mainnet,
  iconUrl: '/images/chains/ethereum.svg',
  shortName: 'eth',
  infuraUrl: 'https://mainnet.infura.io/v3/'
} as const satisfies ChainConfig;
