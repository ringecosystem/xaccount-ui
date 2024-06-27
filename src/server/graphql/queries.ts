import { gql } from 'graphql-request';

export const GET_MESSAGE_PORT = gql`
  query GetMessagePort(
    $distinctOn: [MessagePort_select_column!]
    $limit: Int
    $offset: Int
    $orderBy: [MessagePort_order_by!]
    $where: MessagePort_bool_exp
  ) {
    MessagePort(
      distinct_on: $distinctOn
      limit: $limit
      offset: $offset
      order_by: $orderBy
      where: $where
    ) {
      id
      sourceChainId
      sourceTransactionHash
      status
      targetChainId
      targetTransactionHash
    }
  }
`;
