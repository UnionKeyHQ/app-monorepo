import type { CoreApi, LowLevelCoreApi } from '@unionkeyhq/hd-core';

export const importHardwareSDK = async () =>
  (await import('@unionkeyhq/hd-web-sdk')).default
    .HardwareWebSdk as unknown as Promise<CoreApi>;

export const importHardwareSDKLowLevel = async () =>
  (await import('@unionkeyhq/hd-web-sdk')).default
    .HardwareSDKLowLevel as unknown as Promise<LowLevelCoreApi>;
