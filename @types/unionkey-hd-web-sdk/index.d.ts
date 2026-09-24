declare module '@unionkeyhq/hd-web-sdk' {
  import type { CoreApi, LowLevelCoreApi } from '@unionkeyhq/hd-core';

  export const HardwareSDKTopLevel: CoreApi;

  const sdk: {
    HardwareSDKTopLevel: CoreApi;
    HardwareWebSdk: Promise<CoreApi>;
    HardwareSDKLowLevel: Promise<LowLevelCoreApi>;
  };

  export default sdk;
}
