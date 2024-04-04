import { cookieStorage, createStorage } from 'wagmi';
import { getDefaultWallets, getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  talismanWallet,
  okxWallet,
  imTokenWallet,
  trustWallet,
  safeWallet
} from '@rainbow-me/rainbowkit/wallets';

import { APP_NAME } from '@/config/site';
import { getChains } from '@/utils/chain';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

const { wallets } = getDefaultWallets();

export const config = getDefaultConfig({
  appName: APP_NAME,
  projectId,
  wallets: [
    ...wallets,
    {
      groupName: 'More',
      wallets: [talismanWallet, okxWallet, imTokenWallet, trustWallet, safeWallet]
    }
  ],
  chains: getChains(),
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  })
});
