import { polygon as polygonBase } from 'wagmi/chains';
import type { Chain } from '@rainbow-me/rainbowkit';

export const polygon: Chain = {
  ...polygonBase,
  iconUrl: '/images/chains/polygon.svg'
} as Chain;
