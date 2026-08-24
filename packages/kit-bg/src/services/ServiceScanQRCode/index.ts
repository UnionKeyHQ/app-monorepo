import { resetAnimationQrcodeScan } from '@unionkeyhq/kit-bg/src/services/ServiceScanQRCode/utils/parseQRCode/handlers/animation';
import {
  backgroundClass,
  backgroundMethod,
} from '@unionkeyhq/shared/src/background/backgroundDecorators';

import ServiceBase from '../ServiceBase';

import { parseQRCode } from './utils/parseQRCode';

import type { IQRCodeHandlerParseOptions } from './utils/parseQRCode/type';

@backgroundClass()
class ServiceScanQRCode extends ServiceBase {
  constructor({ backgroundApi }: { backgroundApi: any }) {
    super({ backgroundApi });
  }

  @backgroundMethod()
  public parse(value: string, options?: IQRCodeHandlerParseOptions) {
    return parseQRCode(value, {
      ...options,
      handlers: options?.handlers ?? [],
      backgroundApi: this.backgroundApi,
    });
  }

  @backgroundMethod()
  public async resetAnimationData() {
    resetAnimationQrcodeScan();
  }
}

export default ServiceScanQRCode;
