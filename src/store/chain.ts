import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getDefaultChain } from '@/utils';

import { ChainConfig } from '@/types/chains';

export type RemoteChain = ChainConfig & {
  safeAddress: `0x${string}`;
  moduleAddress: `0x${string}`;
};

export type State = {
  localChain: ChainConfig;
  remoteChain?: RemoteChain;
};

export type Action = {
  setLocalChain: (chain: ChainConfig) => void;
  setRemoteChain: (chain: RemoteChain) => void;
  removeRemoteChain: () => void;
};

const initialChainState: ChainConfig = getDefaultChain();

const useChainStore = create<State & Action>()(
  persist(
    (set) => ({
      localChain: initialChainState,
      remoteChain: undefined,
      setLocalChain: (chain) => set({ localChain: chain }),
      setRemoteChain: (chain) => set({ remoteChain: chain }),
      removeRemoteChain: () => set({ remoteChain: undefined })
    }),
    {
      name: 'chain-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ remoteChain: state.remoteChain })
    }
  )
);

export default useChainStore;
