import type OffscreenApiAdaSdk from '../OffscreenApiAdaSdk';
import type OffscreenApiXmrSdk from '../OffscreenApiXmrSdk';
import type { LowLevelCoreApi } from '@unionkeyhq/hd-core';

export interface IOffscreenApi {
  hardwareSDKLowLevel: LowLevelCoreApi;
  adaSdk: OffscreenApiAdaSdk;
  xmrSdk: OffscreenApiXmrSdk;
}
