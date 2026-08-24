import { UNIONKEY_APP_DEEP_LINK_NAME } from '@unionkeyhq/shared/src/consts/deeplinkConsts';
import { EQRCodeHandlerType } from '@unionkeyhq/shared/types/qrCode';

import type { IQRCodeHandler, IUrlValue } from '../type';

// unionkey-wallet://search/list?q=unionkey
const deeplink: IQRCodeHandler<IUrlValue> = async (value, options) => {
  const urlValue = options?.urlResult;
  if (urlValue) {
    if (
      [UNIONKEY_APP_DEEP_LINK_NAME].findIndex(
        (item) => item === urlValue.data.urlSchema,
      ) !== -1
    ) {
      return {
        type: EQRCodeHandlerType.DEEPLINK,
        data: urlValue.data,
      };
    }
  }
  return null;
};

export default deeplink;
