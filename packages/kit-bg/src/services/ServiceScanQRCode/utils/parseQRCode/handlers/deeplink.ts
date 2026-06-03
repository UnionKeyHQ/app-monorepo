import { UNIONKEY_APP_DEEP_LINK_NAME } from '@unionkey/shared/src/consts/deeplinkConsts';
import { EQRCodeHandlerType } from '@unionkey/shared/types/qrCode';

import type { IQRCodeHandler, IUrlValue } from '../type';

// unionkey://search/list?q=unionkey
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
