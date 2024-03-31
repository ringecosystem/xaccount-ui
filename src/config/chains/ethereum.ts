import { mainnet } from 'wagmi/chains';
import type { Chain } from '@rainbow-me/rainbowkit';

export const ethereum: Chain = {
  ...mainnet,
  iconUrl: '/images/chains/ethereum.svg'
} as Chain;
