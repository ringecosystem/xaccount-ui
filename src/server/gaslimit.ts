import axios from 'axios';

export interface FeeApiResponse {
  code: number;
  data: {
    fee: string;
    params: `0x${string}`;
    gas: {
      gasForMessagingLayer: number;
      gasForMsgport: number;
      multiplier: number;
      total: number;
    };
  };
}

interface GetCrossChainFeeParams {
  fromChainId: number;
  toChainId: number;
  fromAddress: string;
  toAddress: string;
  payload: string;
  refundAddress: string;
}
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getCrossChainFee({
  fromChainId,
  fromAddress,
  toChainId,
  toAddress,
  payload,
  refundAddress
}: Partial<GetCrossChainFeeParams>): Promise<FeeApiResponse> {
  if (!fromChainId || !toChainId || !fromAddress || !toAddress || !payload || !refundAddress) {
    return Promise.reject('Invalid parameters');
  }

  const response = await axios.post<FeeApiResponse>(`${apiUrl}`, {
    fromChainId: fromChainId,
    fromAddress: fromAddress,
    toChainId: toChainId,
    toAddress: toAddress,
    message: payload,
    ormp: {
      refundAddress: refundAddress
    }
  });

  return response?.data;
}
