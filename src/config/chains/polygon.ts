import { polygon as polygonBase } from 'wagmi/chains';
import type { ChainConfig } from '@/types/chains';

export const polygon: ChainConfig = {
  ...polygonBase,
  iconUrl: '/images/chains/polygon.svg',
  shortName: 'matic',
  infuraUrl: 'https://polygon-mainnet.infura.io/v3/'
} as const satisfies ChainConfig;
