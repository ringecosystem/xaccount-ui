import { useEffect, useReducer, useRef, useMemo, useCallback } from 'react';
import { JsonRpcProvider } from 'ethers';
import { Config, readContract } from '@wagmi/core';
import { useShallow } from 'zustand/react/shallow';

import { config } from '@/config/wagmi';
import {
  abi as xAccountFactoryAbi,
  address as xAccountFactoryAddress
} from '@/config/abi/xAccountFactory';
import { getChainById } from '@/utils';
import { useXAccountsStore } from '@/store/xaccounts';

async function isSafeAddressExist(
  safeAddress: string,
  provider: JsonRpcProvider,
  retry: number = 1
): Promise<boolean> {
  for (let attempts = 0; attempts < retry; attempts++) {
    try {
      const code = await provider.getCode(safeAddress);
      if (code !== '0x') return true;
    } catch (error) {
      console.error(`Failed to check safe address on attempt ${attempts + 1}: ${error}`);
    }
  }
  return false;
}

interface State {
  safeAddress: `0x${string}`;
  moduleAddress: `0x${string}`;
  transactionHash?: `0x${string}`;
  status: 'created' | 'pending' | 'completed';
  loading: boolean;
}

type Action = { type: 'SET_STATE'; payload: Partial<State> };

const initialState: State = {
  safeAddress: '0x',
  moduleAddress: '0x',
  status: 'created',
  loading: false
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

interface UseRemoteChainAddressProps {
  fromChainId?: bigint;
  toChainId?: bigint;
  fromAddress?: `0x${string}`;
}

export function useRemoteChainAddress({
  fromChainId,
  toChainId,
  fromAddress
}: UseRemoteChainAddressProps): [state: State, dispatch: React.Dispatch<Action>] {
  const { addAccount, updateAccount, accounts } = useXAccountsStore(
    useShallow((state) => ({
      addAccount: state.addAccount,
      updateAccount: state.updateAccount,
      accounts: state.accounts
    }))
  );

  const storeAccount = useMemo(() => {
    if (fromChainId && fromAddress && toChainId) {
      return accounts[`${fromChainId}-${fromAddress.toLocaleLowerCase()}-${toChainId}`];
    }
    return undefined;
  }, [accounts, fromChainId, toChainId, fromAddress]);

  const fetchAddressCalled = useRef(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  const provider = useMemo(() => {
    const chain = getChainById(Number(toChainId));
    return chain ? new JsonRpcProvider(chain.rpcUrls.default.http[0]) : undefined;
  }, [toChainId]);

  const checkAndCompleteXAccount = useCallback(
    async (safeAddress: string, provider?: JsonRpcProvider) => {
      if (!fromAddress) return;

      const exist = provider ? await isSafeAddressExist(safeAddress, provider) : false;

      if (exist) {
        updateAccount(
          {
            localChainId: Number(fromChainId),
            localAddress: fromAddress,
            remoteChainId: Number(toChainId)
          },
          { status: 'completed' }
        );
        dispatch({ type: 'SET_STATE', payload: { status: 'completed' } });
      }
    },
    [fromChainId, toChainId, fromAddress, updateAccount]
  );

  useEffect(() => {
    const fetchAddress = async () => {
      // console.log('start fetchAddress', storeAccount);

      if (toChainId === 11155111n) {
        console.log('xAccountFactoryAddress', storeAccount, storeAccount?.status);
      }

      if (!fromChainId || !toChainId || !fromAddress) return;
      dispatch({ type: 'SET_STATE', payload: { loading: true } });

      try {
        const xAccountItem = storeAccount;
        if (xAccountItem) {
          dispatch({
            type: 'SET_STATE',
            payload: {
              safeAddress: xAccountItem.safeAddress,
              moduleAddress: xAccountItem.moduleAddress,
              status: xAccountItem.status,
              transactionHash: xAccountItem.transactionHash
            }
          });

          if (xAccountItem.status === 'created') {
            await checkAndCompleteXAccount(xAccountItem.safeAddress, provider);
          }
          return;
        }

        const result = await readContract(config as unknown as Config, {
          address: xAccountFactoryAddress,
          abi: xAccountFactoryAbi,
          functionName: 'xAccountOf',
          chainId: Number(toChainId),
          args: [fromChainId, toChainId, fromAddress]
        });

        if (result) {
          const [safeAddress, moduleAddress] = result as [`0x${string}`, `0x${string}`];
          await addAccount(
            {
              localChainId: Number(fromChainId),
              localAddress: fromAddress,
              remoteChainId: Number(toChainId)
            },
            {
              safeAddress,
              moduleAddress,
              status: 'created'
            }
          );

          dispatch({
            type: 'SET_STATE',
            payload: {
              safeAddress,
              moduleAddress,
              status: 'created'
            }
          });

          await checkAndCompleteXAccount(safeAddress, provider);
        }
      } catch (error) {
      } finally {
        dispatch({ type: 'SET_STATE', payload: { loading: false } });
      }
    };

    if (!fetchAddressCalled.current) {
      fetchAddressCalled.current = true;
      fetchAddress().finally(() => (fetchAddressCalled.current = false));
    }
    return () => {
      fetchAddressCalled.current = false;
    };
  }, [
    storeAccount,
    fromChainId,
    toChainId,
    fromAddress,
    checkAndCompleteXAccount,
    addAccount,
    provider
  ]);

  return [state, dispatch];
}
