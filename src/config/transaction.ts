// Constants for time calculations
export const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000; // Number of milliseconds in one day
export const CLEANUP_INTERVAL_DAYS = 7; // Interval in days after which to perform cleanup operations

// Enum for representing the processing status of a transaction on local and remote blockchains
export enum TransactionStatus {
  ProcessingOnLocal = 'localChainProcessing',
  FailureOnLocal = 'localChainFail',
  ProcessingOnRemote = 'remoteChainProcessing',
  SuccessOnRemote = 'remoteChainSuccess',
  FailureOnRemote = 'remoteChainFail'
}
export const TRANSACTION_REFETCH_INTERVAL = 2_000;

// Descriptions for each transaction status to enhance user interface readability
export const transactionStatusDescriptions: { [key in TransactionStatus]: string } = {
  [TransactionStatus.ProcessingOnLocal]: 'Local processing', // Currently processing on the local blockchain
  [TransactionStatus.FailureOnLocal]: 'Local failure', // Processing failed on the local blockchain
  [TransactionStatus.ProcessingOnRemote]: 'Remote processing', // Currently processing on the remote blockchain
  [TransactionStatus.SuccessOnRemote]: 'Remote success', // Successfully completed on the remote blockchain
  [TransactionStatus.FailureOnRemote]: 'Remote failure' // Processing failed on the remote blockchain
};

export const localTransactionStatuses = [
  TransactionStatus.ProcessingOnLocal,
  TransactionStatus.FailureOnLocal
];

export const remoteTransactionStatuses = [
  TransactionStatus.ProcessingOnRemote,
  TransactionStatus.SuccessOnRemote,
  TransactionStatus.FailureOnRemote
];
