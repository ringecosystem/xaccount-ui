import { client } from './client';
import { GET_MESSAGE_PORT } from './queries';

import type { MessagePortQueryParams, MessagePortResponse } from './type';

export async function fetchMessage(
  id: string
): Promise<MessagePortResponse['MessagePort']['0'] | null> {
  try {
    const response = await client.request<MessagePortResponse, MessagePortQueryParams>(
      GET_MESSAGE_PORT,
      {
        where: {
          _or: [
            {
              id: {
                _eq: id
              }
            },
            {
              sourceTransactionHash: {
                _eq: id
              }
            }
          ]
        }
      }
    );
    return response?.MessagePort?.[0] ?? null;
  } catch (error) {
    console.error('message request failed:', error);
    return null;
  }
}
