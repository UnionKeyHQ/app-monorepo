import type { CoreApi, LowLevelCoreApi } from '@unionkeyhq/hd-core';

export const importHardwareSDK = async () => {
  const sdkLib = await import('@unionkeyhq/hd-web-sdk');
  const sdk =
    // @ts-ignore
    (sdkLib.HardwareSDKTopLevel as CoreApi) ||
    sdkLib.default.HardwareSDKTopLevel;
  return sdk;
};

export const importHardwareSDKLowLevel = async () =>
  (await import('@unionkeyhq/kit-bg/src/offscreens/instance/offscreenApiProxy'))
    .default.hardwareSDKLowLevel as unknown as Promise<LowLevelCoreApi>;
