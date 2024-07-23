interface TimestampComparisonExp {
  _eq?: Date;
  _gt?: Date;
  _gte?: Date;
  _in?: Date[];
  _is_null?: boolean;
  _lt?: Date;
  _lte?: Date;
  _neq?: Date;
  _nin?: Date[];
}

interface StringComparisonExp {
  _eq?: string;
  _gt?: string;
  _gte?: string;
  _ilike?: string;
  _in?: string[];
  _iregex?: string;
  _is_null?: boolean;
  _like?: string;
  _lt?: string;
  _lte?: string;
  _neq?: string;
  _nilike?: string;
  _nin?: string[];
  _niregex?: string;
  _nlike?: string;
  _nregex?: string;
  _nsimilar?: string;
  _regex?: string;
  _similar?: string;
}

interface NumericComparisonExp {
  _eq?: number;
  _gt?: number;
  _gte?: number;
  _in?: number[];
  _is_null?: boolean;
  _lt?: number;
  _lte?: number;
  _neq?: number;
  _nin?: number[];
}

interface IntComparisonExp {
  _eq?: number;
  _gt?: number;
  _gte?: number;
  _in?: number[];
  _is_null?: boolean;
  _lt?: number;
  _lte?: number;
  _neq?: number;
  _nin?: number[];
}
export interface MessagePortBoolExp {
  _and?: MessagePortBoolExp[];
  _not?: MessagePortBoolExp;
  _or?: MessagePortBoolExp[];
  db_write_timestamp?: TimestampComparisonExp;
  id?: StringComparisonExp;
  params?: StringComparisonExp;
  payload?: StringComparisonExp;
  protocol?: StringComparisonExp;
  sourceBlockNumber?: NumericComparisonExp;
  sourceBlockTimestamp?: NumericComparisonExp;
  sourceChainId?: NumericComparisonExp;
  sourceDappAddress?: StringComparisonExp;
  sourceLogIndex?: IntComparisonExp;
  sourcePortAddress?: StringComparisonExp;
  sourceTransactionHash?: StringComparisonExp;
  sourceTransactionIndex?: IntComparisonExp;
  status?: IntComparisonExp;
  targetBlockNumber?: NumericComparisonExp;
  targetBlockTimestamp?: NumericComparisonExp;
  targetChainId?: NumericComparisonExp;
  targetDappAddress?: StringComparisonExp;
  targetLogIndex?: IntComparisonExp;
  targetPortAddress?: StringComparisonExp;
  targetTransactionHash?: StringComparisonExp;
  targetTransactionIndex?: IntComparisonExp;
}

enum MessagePortSelectColumn {
  DbWriteTimestamp = 'db_write_timestamp',
  Id = 'id',
  Params = 'params',
  Payload = 'payload',
  Protocol = 'protocol',
  SourceBlockNumber = 'sourceBlockNumber',
  SourceBlockTimestamp = 'sourceBlockTimestamp',
  SourceChainId = 'sourceChainId',
  SourceDappAddress = 'sourceDappAddress',
  SourceLogIndex = 'sourceLogIndex',
  SourcePortAddress = 'sourcePortAddress',
  SourceTransactionHash = 'sourceTransactionHash',
  SourceTransactionIndex = 'sourceTransactionIndex',
  Status = 'status',
  TargetBlockNumber = 'targetBlockNumber',
  TargetBlockTimestamp = 'targetBlockTimestamp',
  TargetChainId = 'targetChainId',
  TargetDappAddress = 'targetDappAddress',
  TargetLogIndex = 'targetLogIndex',
  TargetPortAddress = 'targetPortAddress',
  TargetTransactionHash = 'targetTransactionHash',
  TargetTransactionIndex = 'targetTransactionIndex'
}

export enum OrderBy {
  Asc = 'asc',
  AscNullsFirst = 'asc_nulls_first',
  AscNullsLast = 'asc_nulls_last',
  Desc = 'desc',
  DescNullsFirst = 'desc_nulls_first',
  DescNullsLast = 'desc_nulls_last'
}

interface MessagePortOrderBy {
  db_write_timestamp?: OrderBy;
  id?: OrderBy;
  params?: OrderBy;
  payload?: OrderBy;
  protocol?: OrderBy;
  sourceBlockNumber?: OrderBy;
  sourceBlockTimestamp?: OrderBy;
  sourceChainId?: OrderBy;
  sourceDappAddress?: OrderBy;
  sourceLogIndex?: OrderBy;
  sourcePortAddress?: OrderBy;
  sourceTransactionHash?: OrderBy;
  sourceTransactionIndex?: OrderBy;
  status?: OrderBy;
  targetBlockNumber?: OrderBy;
  targetBlockTimestamp?: OrderBy;
  targetChainId?: OrderBy;
  targetDappAddress?: OrderBy;
  targetLogIndex?: OrderBy;
  targetPortAddress?: OrderBy;
  targetTransactionHash?: OrderBy;
  targetTransactionIndex?: OrderBy;
}

export interface ORMPMessageAccepted {
  blockNumber: number;
  blockTimestamp: number;
  channel: string;
  db_write_timestamp: Date;
  encoded: string;
  eventsSummary: string;
  from: string;
  fromChainId: number;
  gasLimit: number;
  id: string;
  index: number;
  msgHash: string;
  oracle: string | null;
  oracleAssigned: boolean;
  oracleAssignedFee: number;
  relayer: string;
  relayerAssigned: boolean;
  relayerAssignedFee: number;
  to: string;
  toChainId: number;
  transactionHash: string;
}
export interface MessagePort {
  db_write_timestamp?: Date;
  id: string;
  ormp?: ORMPMessageAccepted;
  ormp_id?: string;
  params?: string;
  payload?: string;
  protocol: string;
  sourceBlockNumber?: number;
  sourceBlockTimestamp?: number;
  sourceChainId?: number;
  sourceDappAddress?: string;
  sourceLogIndex?: number;
  sourcePortAddress?: string;
  sourceTransactionHash?: string;
  sourceTransactionIndex?: number;
  status: number;
  targetBlockNumber?: number;
  targetBlockTimestamp?: number;
  targetChainId?: number;
  targetDappAddress?: string;
  targetLogIndex?: number;
  targetPortAddress?: string;
  targetTransactionHash?: string;
  targetTransactionIndex?: number;
}
export interface MessagePortResponse {
  MessagePort: MessagePort[];
}

export interface MessagePortQueryParams {
  distinctOn?: MessagePortSelectColumn[];
  limit?: number;
  offset?: number;
  orderBy?: MessagePortOrderBy[];
  where?: MessagePortBoolExp;
}
