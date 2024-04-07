import { create } from 'zustand';

import { getDefaultChain } from '@/utils';

import type { Chain } from '@rainbow-me/rainbowkit';

export type RemoteChain = Chain & { address: `0x${string}` };

export type State = {
  localChain: Chain;
  remoteChain?: RemoteChain;
};

export type Action = {
  setLocalChain: (chain: Chain) => void;
  setRemoteChain: (chain: RemoteChain) => void;
};

const initialChainState: Chain = getDefaultChain();

const useChainStore = create<State & Action>((set) => ({
  localChain: initialChainState,
  remoteChain: { ...initialChainState, address: '0x3d6d656c1bf92f7028Ce4C352563E1C363C58ED5' },
  setLocalChain: (chain) => set({ localChain: chain }),
  setRemoteChain: (chain) => set({ remoteChain: chain })
}));

export default useChainStore;
