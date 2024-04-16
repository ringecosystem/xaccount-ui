import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { JsonRpcProvider } from 'ethers';
import {
  getXAccountByFromChainIdAndToChainIdAndFromAddress,
  addXAccount,
  updateXAccountStatusByFromChainIdAndToChainIdAndFromAddress
} from '@/database/xaccounts';
import { config } from '@/config/wagmi';
import { Config, readContract } from '@wagmi/core';
import {
  abi as xAccountFactoryAbi,
  address as xAccountFactoryAddress
} from '@/config/abi/xAccountFactory';
import { getChainById } from '@/utils';

async function isSafeAddressExist(
  safeAddress: string,
  provider: JsonRpcProvider,
  retry: number = 1
): Promise<boolean> {
  let exist = false;
  let attempts = 0;

  while (attempts < retry) {
    try {
      const code = await provider.getCode(safeAddress);
      console.log(`Attempt ${attempts + 1}: code fetched`, code);
      exist = code !== '0x';
      if (exist) break; // 如果找到代码，提前退出循环
    } catch (error) {
      console.error(`Failed to check safe address on attempt ${attempts + 1}: ${error}`);
    }
    attempts++;
  }

  return exist;
}

type State = {
  safeAddress: `0x${string}`;
  moduleAddress: `0x${string}`;
  loading: boolean;
  status: 'create' | 'completed';
};

type Action = {
  type: 'SET_ADDRESS' | 'SET_LOADING';
  payload:
    | {
        safeAddress: `0x${string}`;
        moduleAddress: `0x${string}`;
        status: 'create' | 'pending' | 'completed';
      }
    | boolean;
};

const initialState: State = {
  safeAddress: '0x',
  moduleAddress: '0x',
  status: 'create',
  loading: false
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_ADDRESS':
      if (typeof action.payload === 'boolean') {
        return state;
      }
      return {
        ...state,
        safeAddress: action.payload?.safeAddress,
        moduleAddress: action.payload?.moduleAddress,
        status: action.payload?.status as 'create' | 'completed'
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload as boolean };
    default:
      return state;
  }
};

type UseRemoteChainAddressType = {
  fromChainId?: bigint;
  toChainId?: bigint;
  fromAddress?: `0x${string}`;
};
export function useRemoteChainAddress({
  fromChainId,
  toChainId,
  fromAddress
}: UseRemoteChainAddressType) {
  console.log('fromChainId:', fromChainId);
  console.log('toChainId:', toChainId);

  const fetchAddressCalled = useRef(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  const provider = useMemo(() => {
    return toChainId
      ? new JsonRpcProvider(getChainById(Number(toChainId))?.rpcUrls?.default?.http?.[0])
      : null;
  }, [toChainId]);

  const checkAddressAndUpdateStatusIfNotExist = useCallback(
    async ({
      fromChainId,
      fromAddress,
      toChainId,
      safeAddress
    }: {
      fromChainId: bigint;
      fromAddress: `0x${string}`;
      toChainId: bigint;
      safeAddress: `0x${string}`;
    }): Promise<boolean> => {
      const exist = provider
        ? await isSafeAddressExist(safeAddress as `0x${string}`, provider as JsonRpcProvider, 10)
        : false;
      if (!exist) {
        await updateXAccountStatusByFromChainIdAndToChainIdAndFromAddress({
          fromChainId: Number(fromChainId),
          toChainId: Number(toChainId),
          fromAddress,
          status: 'create'
        });
      }

      return exist;
    },
    [provider]
  );

  useEffect(() => {
    const fetchAddress = async () => {
      if (!fromChainId || !toChainId || !fromAddress) {
        return;
      }
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        let xAccountItem = await getXAccountByFromChainIdAndToChainIdAndFromAddress({
          fromChainId: Number(fromChainId),
          toChainId: Number(toChainId),
          fromAddress
        });

        if (xAccountItem) {
          const safeAddress = xAccountItem.toSafeAddress as `0x${string}`;
          const moduleAddress = xAccountItem.toModuleAddress as `0x${string}`;

          switch (xAccountItem.status) {
            case 'completed':
              dispatch({
                type: 'SET_ADDRESS',
                payload: {
                  safeAddress,
                  moduleAddress,
                  status: 'completed'
                }
              });
              return;

            case 'pending':
              const exist = await checkAddressAndUpdateStatusIfNotExist({
                fromChainId,
                fromAddress,
                toChainId,
                safeAddress
              });
              if (exist) {
                await updateXAccountStatusByFromChainIdAndToChainIdAndFromAddress({
                  fromChainId: Number(fromChainId),
                  toChainId: Number(toChainId),
                  fromAddress,
                  status: 'completed'
                });
              }
              dispatch({
                type: 'SET_ADDRESS',
                payload: {
                  safeAddress,
                  moduleAddress,
                  status: exist ? 'completed' : 'create'
                }
              });
              return;

            case 'create':
              dispatch({
                type: 'SET_ADDRESS',
                payload: {
                  safeAddress: xAccountItem?.toSafeAddress,
                  moduleAddress: xAccountItem?.toModuleAddress,
                  status: 'create'
                }
              });
              break;
            default:
              break;
          }
        }

        const result = await readContract(config as unknown as Config, {
          abi: xAccountFactoryAbi,
          address: xAccountFactoryAddress,
          functionName: 'xAccountOf',
          chainId: Number(toChainId),
          args: [fromChainId, toChainId, fromAddress]
        });

        if (result) {
          await addXAccount({
            fromChainId: Number(fromChainId),
            toChainId: Number(toChainId),
            fromAddress,
            toSafeAddress: result?.[0] as `0x${string}`,
            toModuleAddress: result?.[1] as `0x${string}`,
            status: 'create'
          });
          const exist = provider
            ? await isSafeAddressExist(result?.[0] as `0x${string}`, provider as JsonRpcProvider)
            : false;

          if (exist) {
            await updateXAccountStatusByFromChainIdAndToChainIdAndFromAddress({
              fromChainId: Number(fromChainId),
              toChainId: Number(toChainId),
              fromAddress,
              status: 'completed'
            });
          }

          dispatch({
            type: 'SET_ADDRESS',
            payload: {
              safeAddress: result?.[0] as `0x${string}`,
              moduleAddress: result?.[1] as `0x${string}`,
              status: exist ? 'completed' : 'create'
            }
          });
        }
      } catch (error) {
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    if (!fetchAddressCalled.current) {
      fetchAddressCalled.current = true;
      fetchAddress()?.finally(() => {
        fetchAddressCalled.current = false;
      });
    }
    return () => {
      fetchAddressCalled.current = false;
    };
  }, [fromChainId, toChainId, fromAddress, provider, checkAddressAndUpdateStatusIfNotExist]);

  return state;
}
