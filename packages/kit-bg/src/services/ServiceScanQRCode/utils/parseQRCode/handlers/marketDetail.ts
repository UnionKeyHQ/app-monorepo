import {
  WEB_APP_URL,
  WEB_APP_URL_DEV,
} from '@unionkeyhq/shared/src/config/appConfig';
import { EQRCodeHandlerType } from '@unionkeyhq/shared/types/qrCode';

import type { IMarketDetailValue, IQRCodeHandler } from '../type';

/*
https://app.api.unionkey.io/market/tokens/bitcoin
*/
const marketDetail: IQRCodeHandler<IMarketDetailValue> = async (
  value,
  options,
) => {
  const urlValue = options?.urlResult;
  if (urlValue?.data?.urlParamList) {
    const origin = urlValue?.data?.origin;
    if (
      [WEB_APP_URL, WEB_APP_URL_DEV].includes(origin) &&
      urlValue?.data?.pathname.startsWith('/market/tokens/')
    ) {
      const coinGeckoId = urlValue?.data?.pathname
        .split('/market/tokens/')
        .pop();
      return {
        type: EQRCodeHandlerType.MARKET_DETAIL,
        data: {
          origin,
          coinGeckoId,
        },
      };
    }
  }
  return null;
};

export default marketDetail;
