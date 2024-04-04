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
  remoteChain: undefined,
  setLocalChain: (chain) => set({ localChain: chain }),
  setRemoteChain: (chain) => set({ remoteChain: chain })
}));

export default useChainStore;
