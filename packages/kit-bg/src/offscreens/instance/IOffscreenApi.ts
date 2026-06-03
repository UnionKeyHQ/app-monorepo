import type OffscreenApiAdaSdk from '../OffscreenApiAdaSdk';
import type OffscreenApiKaspaSdk from '../OffscreenApiKaspaSdk';
import type { LowLevelCoreApi } from '@unionkeyfe/hd-core';

export interface IOffscreenApi {
  hardwareSDKLowLevel: LowLevelCoreApi;
  adaSdk: OffscreenApiAdaSdk;
  kaspaSdk: OffscreenApiKaspaSdk;
}
