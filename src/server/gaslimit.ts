import axios from 'axios';

// 定义返回数据的接口
interface FeeApiResponse {
  code: number;
  data: {
    fee: string;
    params: string;
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
export async function getCrossChainFee({
  fromChainId,
  toChainId,
  fromAddress,
  toAddress,
  payload,
  refundAddress
}: Partial<GetCrossChainFeeParams>): Promise<FeeApiResponse> {
  if (!fromChainId || !toChainId || !fromAddress || !toAddress || !payload || !refundAddress) {
    return Promise.reject('Invalid parameters');
  }

  const response = await axios.get<FeeApiResponse>(
    `https://msgport-api.darwinia.network/ormp/fee`,
    {
      params: {
        from_chain_id: fromChainId,
        to_chain_id: toChainId,
        from_address: fromAddress,
        to_address: toAddress,
        payload: payload,
        refund_address: refundAddress
      }
    }
  );

  return response?.data;
}
