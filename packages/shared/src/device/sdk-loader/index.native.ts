import type { CoreApi } from '@unionkeyhq/hd-core';

export const importHardwareSDK = async () =>
  (await import('@unionkeyhq/hd-ble-sdk')).default as unknown as Promise<CoreApi>;

export const importHardwareSDKLowLevel = async () => Promise.resolve(undefined);
