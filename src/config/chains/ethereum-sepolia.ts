// ethereum-sepolia

import { sepolia } from 'wagmi/chains';
import type { Chain } from '@rainbow-me/rainbowkit';

export const ethereumSepolia: Chain = {
  ...sepolia,
  iconUrl: '/images/chains/ethereum.svg'
} as Chain;
