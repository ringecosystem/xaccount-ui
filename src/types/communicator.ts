import { BaseTransaction } from './transaction';

export enum Methods {
  sendTransactions = 'sendTransactions',
  rpcCall = 'rpcCall',
  getChainInfo = 'getChainInfo',
  getSafeInfo = 'getSafeInfo',
  getTxBySafeTxHash = 'getTxBySafeTxHash',
  getSafeBalances = 'getSafeBalances',
  signMessage = 'signMessage',
  signTypedMessage = 'signTypedMessage',
  getEnvironmentInfo = 'getEnvironmentInfo',
  getOffChainSignature = 'getOffChainSignature',
  requestAddressBook = 'requestAddressBook',
  wallet_getPermissions = 'wallet_getPermissions',
  wallet_requestPermissions = 'wallet_requestPermissions'
}

export type RequestId = string;

export const RPC_CALLS = {
  eth_call: 'eth_call',
  eth_gasPrice: 'eth_gasPrice',
  eth_getLogs: 'eth_getLogs',
  eth_getBalance: 'eth_getBalance',
  eth_getCode: 'eth_getCode',
  eth_getBlockByHash: 'eth_getBlockByHash',
  eth_getBlockByNumber: 'eth_getBlockByNumber',
  eth_getStorageAt: 'eth_getStorageAt',
  eth_getTransactionByHash: 'eth_getTransactionByHash',
  eth_getTransactionReceipt: 'eth_getTransactionReceipt',
  eth_getTransactionCount: 'eth_getTransactionCount',
  eth_estimateGas: 'eth_estimateGas',
  safe_setSettings: 'safe_setSettings'
} as const;
export interface TypedDataDomain {
  name?: string;
  version?: string;
  chainId?: string | number | bigint | { toNumber: () => number };
  verifyingContract?: string;
  salt?: string;
}

export interface TypedDataTypes {
  name: string;
  type: string;
}

export type TypedMessageTypes = { [key: string]: TypedDataTypes[] };

export type RpcCallNames = keyof typeof RPC_CALLS;
export type EIP712TypedData = {
  domain: TypedDataDomain;
  types: TypedMessageTypes;
  message: Record<string, any>;
  primaryType?: string;
};
export type RPCPayload<P = unknown[]> = {
  call: RpcCallNames;
  params: P | unknown[];
};

export interface SendTransactionRequestParams {
  safeTxGas?: number;
}

export interface SendTransactionsParams {
  txs: BaseTransaction[];
  params?: SendTransactionRequestParams;
}

export type SignTypedMessageParams = {
  typedData: EIP712TypedData;
};

export type GetTxBySafeTxHashParams = {
  safeTxHash: string;
};

export type EnvironmentInfo = {
  origin: string;
};
export type ErrorResponse = {
  id: RequestId;
  success: false;
  error: string;
  version?: string;
};
