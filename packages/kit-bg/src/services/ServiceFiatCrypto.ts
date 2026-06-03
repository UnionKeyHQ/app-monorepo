import {
  backgroundClass,
  backgroundMethod,
} from '@unionkey/shared/src/background/backgroundDecorators';
import { defaultLogger } from '@unionkey/shared/src/logger/logger';
import accountUtils from '@unionkey/shared/src/utils/accountUtils';
import { memoizee } from '@unionkey/shared/src/utils/cacheUtils';
import networkUtils from '@unionkey/shared/src/utils/networkUtils';
import timerUtils from '@unionkey/shared/src/utils/timerUtils';
import { EServiceEndpointEnum } from '@unionkey/shared/types/endpoint';
import type {
  IFiatCryptoToken,
  IFiatCryptoType,
  IGenerateWidgetUrl,
  IGenerateWidgetUrlResponse,
  IGenerateWidgetUrlWithAccountId,
  IGetTokensListParams,
} from '@unionkey/shared/types/fiatCrypto';

import ServiceBase from './ServiceBase';

@backgroundClass()
class ServiceFiatCrypto extends ServiceBase {
  constructor({ backgroundApi }: { backgroundApi: any }) {
    super({ backgroundApi });
  }

  _buildUriForFiatToken = memoizee(
    async ({ networkId, tokenAddress, address, type }: IGenerateWidgetUrl) => {
      // 你想跳转的地址
      const baseUrl = 'https://app.uniswap.org';
      const url = `${baseUrl}?asset=${type}&network=${networkId}&token=${tokenAddress}&address=${address}`;
      return { url, build: true };
    },
    {
      promise: true,
      maxAge: timerUtils.getTimeDurationMs({ minute: 5 }),
    },
  );

  @backgroundMethod()
  public async generateWidgetUrl(
    params: IGenerateWidgetUrlWithAccountId,
  ): Promise<IGenerateWidgetUrlResponse> {
    const { accountId, ...rest } = params;
    let address: string | undefined;
    if (accountId) {
      try {
        address =
          await this.backgroundApi.serviceAccount.getAccountAddressForApi({
            networkId: rest.networkId,
            accountId,
          });
      } catch (e) {
        console.error('generateWidgetUrl', e);
      }
    }
    return this._buildUriForFiatToken({ ...rest, address });
  }

  _getTokensList = memoizee(
    async (params: {
      networkId: string;
      type: IFiatCryptoType;
      address?: string;
    }) => {
      const client = await this.getClient(EServiceEndpointEnum.Wallet);
      const resp = await client.get<{
        data: IFiatCryptoToken[];
      }>('/wallet/v1/fiat-pay/list', {
        params,
      });
      return resp.data.data;
    },
    {
      promise: true,
      maxAge: timerUtils.getTimeDurationMs({ seconds: 5 }),
    },
  );

  @backgroundMethod()
  public async getTokensList(
    params: IGetTokensListParams,
  ): Promise<IFiatCryptoToken[]> {
    const { networkId, accountId } = params;
    let address: string | undefined;
    const walletId = accountId
      ? accountUtils.getWalletIdFromAccountId({ accountId })
      : undefined;
    if (accountId && !networkUtils.isAllNetwork({ networkId })) {
      address = await this.backgroundApi.serviceAccount.getAccountAddressForApi(
        {
          networkId,
          accountId,
        },
      );
    }
    let result = await this._getTokensList({
      networkId,
      address,
      type: params.type,
    });
    defaultLogger.fiatCrypto.request.getTokensList({ params, result });
    if (walletId) {
      const { networkIdsIncompatible } =
        await this.backgroundApi.serviceNetwork.getNetworkIdsCompatibleWithWalletId(
          { walletId },
        );
      if (networkIdsIncompatible.length > 0) {
        const incompatibleSet = new Set(networkIdsIncompatible);
        result = result.filter((o) => !incompatibleSet.has(o.networkId));
      }
    }
    return result;
  }

  @backgroundMethod()
  public async isNetworkSupported(params: IGetTokensListParams) {
    const tokens = await this.getTokensList(params);
    return tokens.length > 0;
  }

  @backgroundMethod()
  public async isTokenSupported(
    params: IGetTokensListParams & { tokenAddress: string },
  ): Promise<boolean> {
    const res = await this.generateWidgetUrl(params);
    const isSupported = Boolean(res.url && res.build);
    return isSupported;
  }
}

export default ServiceFiatCrypto;
