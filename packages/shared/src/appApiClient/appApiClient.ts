import axios from 'axios';

import { memoizee } from '@unionkey/shared/src/utils/cacheUtils';

import { EServiceEndpointEnum } from '../../types/endpoint';
import { UnionKeyError } from '../errors';
import platformEnv from '../platformEnv';
import timerUtils from '../utils/timerUtils';

import type { IEndpointInfo } from '../../types/endpoint';
import type { AxiosInstance, AxiosResponse } from 'axios';

const clients: Record<EServiceEndpointEnum, AxiosInstance | null> = {
  [EServiceEndpointEnum.Wallet]: null,
  [EServiceEndpointEnum.Swap]: null,
  [EServiceEndpointEnum.Utility]: null,
  [EServiceEndpointEnum.Lightning]: null,
  [EServiceEndpointEnum.Earn]: null,
  [EServiceEndpointEnum.Notification]: null,
  [EServiceEndpointEnum.NotificationWebSocket]: null,
  [EServiceEndpointEnum.Prime]: null,
  [EServiceEndpointEnum.Rebate]: null,
};

const rawDataClients: Record<EServiceEndpointEnum, AxiosInstance | null> = {
  [EServiceEndpointEnum.Wallet]: null,
  [EServiceEndpointEnum.Swap]: null,
  [EServiceEndpointEnum.Utility]: null,
  [EServiceEndpointEnum.Lightning]: null,
  [EServiceEndpointEnum.Earn]: null,
  [EServiceEndpointEnum.Notification]: null,
  [EServiceEndpointEnum.NotificationWebSocket]: null,
  [EServiceEndpointEnum.Prime]: null,
  [EServiceEndpointEnum.Rebate]: null,
};

const unionKeyIdAuthClients: Record<
  EServiceEndpointEnum,
  AxiosInstance | null
> = {
  [EServiceEndpointEnum.Prime]: null,
  [EServiceEndpointEnum.Rebate]: null,
  [EServiceEndpointEnum.Wallet]: null,
  [EServiceEndpointEnum.Swap]: null,
  [EServiceEndpointEnum.Utility]: null,
  [EServiceEndpointEnum.Lightning]: null,
  [EServiceEndpointEnum.Earn]: null,
  [EServiceEndpointEnum.Notification]: null,
  [EServiceEndpointEnum.NotificationWebSocket]: null,
};

const getBasicClient = async ({
  endpoint,
  name,
  autoHandleError = true,
}: IEndpointInfo) => {
  if (!endpoint || !name) {
    throw new UnionKeyError('Invalid endpoint name.');
  }
  const isLocalDevEndpoint =
    platformEnv.isDev &&
    /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?($|\/)/.test(endpoint);
  if (!endpoint.startsWith('https://') && !isLocalDevEndpoint) {
    throw new UnionKeyError('Invalid endpoint, https only');
  }

  const timeout = 30 * 1000;
  const options =
    platformEnv.isDev && (process.env.UNIONKEY_PROXY || isLocalDevEndpoint)
      ? {
          baseURL: platformEnv.isExtension ? 'http://localhost:3180' : '/',
          timeout,
          headers: {
            'X-UnionKey-Dev-Proxy': endpoint,
          },
          autoHandleError,
        }
      : {
          baseURL: endpoint,
          timeout,
          autoHandleError,
        };
  const client = axios.create(options);
  return client;
};

const getClient = memoizee(
  async (params: IEndpointInfo) => {
    const existingClient = clients[params.name];
    if (existingClient) {
      return existingClient;
    }
    clients[params.name] = await getBasicClient(params);
    return clients[params.name] as AxiosInstance;
  },
  {
    promise: true,
    primitive: true,
    maxAge: timerUtils.getTimeDurationMs({ minute: 10 }),
    max: 2,
  },
);

const getUnionKeyIdAuthClient = memoizee(
  async (params: IEndpointInfo) => {
    const existingClient = unionKeyIdAuthClients[params.name];
    if (existingClient) {
      return existingClient;
    }
    unionKeyIdAuthClients[params.name] = await getBasicClient(params);
    return unionKeyIdAuthClients[params.name] as AxiosInstance;
  },
  {
    promise: true,
    primitive: true,
    maxAge: timerUtils.getTimeDurationMs({ minute: 10 }),
    max: 2,
  },
);

const getRawDataClient = memoizee(
  async (params: IEndpointInfo) => {
    const existingClient = rawDataClients[params.name];
    if (existingClient) {
      return existingClient;
    }
    rawDataClients[params.name] = await getBasicClient({
      ...params,
      autoHandleError: false,
    });
    return rawDataClients[params.name] as AxiosInstance;
  },
  {
    promise: true,
    primitive: true,
    maxAge: timerUtils.getTimeDurationMs({ minute: 10 }),
    max: 2,
  },
);

const appApiClient = {
  getBasicClient,
  getClient,
  getRawDataClient,
  getUnionKeyIdAuthClient,
};
export { appApiClient };

export interface IAxiosResponse<T> extends AxiosResponse<T> {
  $requestId?: string;
}
