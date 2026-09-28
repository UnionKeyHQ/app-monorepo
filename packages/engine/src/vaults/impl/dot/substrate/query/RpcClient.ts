import axios from 'axios';
import axiosRetry from 'axios-retry';

import { UnionKeyError } from '@unionkeyhq/engine/src/errors';
import { addHexPrefix } from '@unionkeyhq/engine/src/vaults/utils/hexUtils';

import { RPCBody } from './RPCBody';

import type { AxiosError, AxiosResponse } from 'axios';

const MAX_RETRIES = 3;

export abstract class JsonRpcClient {
  client = axios.create();

  constructor() {
    axiosRetry(this.client, { retries: MAX_RETRIES });
  }

  protected async sendRepeat(
    baseURL: string,
    method: string,
    params: any[],
  ): Promise<any> {
    return this.client
      .post(baseURL, new RPCBody(method, params.map(addHexPrefix)))
      .then((response: AxiosResponse<any>) => {
        const { data } = response;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (data.error) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          throw data.error;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return data.result;
      })
      .catch((error: AxiosError) => {
        if (typeof error === 'string') {
          throw new UnionKeyError(error);
        } else {
          throw new UnionKeyError(error.message);
        }
      });
  }
}
