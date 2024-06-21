import axios from 'axios';

interface Signature {
  signer: string;
  signature: string;
}

export interface MessageResponse {
  id: number;
  index: number;
  msg_hash: string;
  root: string;
  channel: string;
  from_chain_id: number;
  from: string;
  to_chain_id: number;
  to: string;
  block_number: number;
  block_timestamp: string;
  transaction_hash: string;
  status: string;
  encoded: string;
  dispatch_transaction_hash: string;
  dispatch_block_number: number;
  dispatch_block_timestamp: string;
  proof: string[];
  gas_limit: number;
  msgport_payload: string;
  msgport_from: string;
  msgport_to: string;
  signatures: Signature[];
  latest_signatures_updated_at: string;
  created_at: string;
  updated_at: string;
}

const scanUrl = process.env.NEXT_PUBLIC_SCAN_URL;

export async function fetchMessageDetails(
  sourceTransactionHash?: `0x${string}`
): Promise<MessageResponse> {
  if (!sourceTransactionHash) throw new Error('No source transaction hash provided');
  const url = `${scanUrl}/messages/${sourceTransactionHash}.json`;
  try {
    const response = await axios.get<MessageResponse>(url);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch message details: ${error}`);
  }
}
