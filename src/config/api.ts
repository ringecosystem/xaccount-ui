import { DEPLOY_ENV } from '@/types/env';

export const APP_BASE_API_URL_MAP = {
  [DEPLOY_ENV.MAINNET]: 'https://indexer.bigdevenergy.link/ed7db02/v1/graphql',
  [DEPLOY_ENV.TESTNET]: 'https://indexer.bigdevenergy.link/ed7db02/v1/graphql'
};

export const APP_BASE_API_URL =
  APP_BASE_API_URL_MAP[process.env.NEXT_PUBLIC_DEPLOYMENT_MODE as DEPLOY_ENV];
