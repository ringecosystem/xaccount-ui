import { Interface } from 'ethers';
import { abi as safeMsgportModuleAbi } from '@/config/abi/SafeMsgportModule';
import { useCallback, useState } from 'react';
import { Transaction } from '@/types/communicator';
import usePortAddress from './usePortAddress';

// ... existing code ...

interface GetActionDataParams {
  fromChainId: number;
  toChainId: number;
  fromAddress: string;
  toAddress: string;
  payload: string;
  refundAddress: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function fetchActionData({
  fromChainId,
  fromAddress,
  toChainId,
  toAddress,
  payload,
  refundAddress
}: Partial<GetActionDataParams>): Promise<{ fee: string; params: string }> {
  if (!fromChainId || !toChainId || !fromAddress || !toAddress || !payload || !refundAddress) {
    return Promise.reject('Invalid parameters');
  }

  try {
    const response = await fetch(`${apiUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fromChainId,
        fromAddress,
        toChainId,
        toAddress,
        message: payload,
        ormp: { refundAddress }
      }),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const fee = data.data.fee;
    const params = data.data.params;

    return { fee, params };
  } catch (error) {
    console.error('Error fetching action data:', error);
    return { fee: '0', params: '0x' };
  }
}

const iface = new Interface(safeMsgportModuleAbi);
const functionFragment = iface.getFunction('xExecute');

interface UseGenerateActionProps {
  timeLockContractAddress: `0x${string}`;
  moduleAddress: `0x${string}`;
  sourceChainId: number;
  targetChainId: number;
}

interface ActionState {
  params: string;
  fee: string;
  message: string;
}

const initialState: ActionState = {
  params: '',
  fee: '',
  message: ''
};

const useGenerateAction = ({
  timeLockContractAddress,
  moduleAddress,
  sourceChainId,
  targetChainId
}: UseGenerateActionProps) => {
  const [actionState, setActionState] = useState<ActionState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const sourcePort = usePortAddress({ moduleAddress, sourceChainId, targetChainId });

  const generateAction = useCallback(
    async ({ transactionInfo }: { transactionInfo: Transaction }) => {
      setIsLoading(true);
      try {
        const payload =
          functionFragment && transactionInfo?.to
            ? (iface.encodeFunctionData(functionFragment, [
                transactionInfo?.to,
                transactionInfo?.value,
                transactionInfo?.data,
                0
              ]) as `0x${string}`)
            : '0x';

        const { fee, params } = await fetchActionData({
          fromChainId: sourceChainId,
          toChainId: targetChainId,
          fromAddress: timeLockContractAddress,
          toAddress: moduleAddress,
          payload,
          refundAddress: timeLockContractAddress
        });

        setActionState({
          params,
          fee,
          message: payload
        });
      } finally {
        setIsLoading(false);
      }
    },
    [moduleAddress, sourceChainId, targetChainId, timeLockContractAddress]
  );

  const reset = useCallback(() => {
    setActionState(initialState);
    setIsLoading(false);
  }, []);

  return {
    generateAction,
    sourcePort,
    actionState,
    isLoading,
    reset
  };
};

export default useGenerateAction;
