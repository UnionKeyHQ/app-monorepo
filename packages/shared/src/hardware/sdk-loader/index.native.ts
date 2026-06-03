import type { CoreApi } from '@unionkeyfe/hd-core';

export const importHardwareSDK = async () =>
  (await import('@unionkeyfe/hd-ble-sdk')).default as unknown as Promise<CoreApi>;

export const importHardwareSDKLowLevel = async () => Promise.resolve(undefined);
