import { GraphQLClient } from 'graphql-request';

import { APP_BASE_API_URL } from '@/config/api';

export const client = new GraphQLClient(APP_BASE_API_URL);
