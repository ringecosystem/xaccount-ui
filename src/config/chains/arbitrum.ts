import { arbitrum as arbitrumChain } from 'wagmi/chains';
import type { Chain } from '@rainbow-me/rainbowkit';

export const arbitrum: Chain = {
  ...arbitrumChain,
  iconUrl: '/images/chains/arbitrum.svg'
} as Chain;
