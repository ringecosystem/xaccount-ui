// ethereum-sepolia

import { arbitrumSepolia as arbitrumSepoliaBase } from 'wagmi/chains';
import type { Chain } from '@rainbow-me/rainbowkit';

export const arbitrumSepolia: Chain = {
  ...arbitrumSepoliaBase,
  iconUrl: '/images/chains/arbitrum.svg'
} as Chain;
