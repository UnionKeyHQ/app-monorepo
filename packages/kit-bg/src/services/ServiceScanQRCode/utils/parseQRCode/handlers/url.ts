import { parseUrl } from '@unionkeyhq/shared/src/utils/uriUtils';
import { EQRCodeHandlerType } from '@unionkeyhq/shared/types/qrCode';

import type { IQRCodeHandler, IUrlValue } from '../type';

// https://www.google.com/search?q=unionkey
const url: IQRCodeHandler<IUrlValue> = async (value) => {
  const urlValue = parseUrl(value);
  if (urlValue) {
    return {
      type: /^https?/i.test(urlValue.urlSchema)
        ? EQRCodeHandlerType.URL
        : EQRCodeHandlerType.UNKNOWN,
      data: urlValue,
    };
  }
  return null;
};

export default url;
