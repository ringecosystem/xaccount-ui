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
