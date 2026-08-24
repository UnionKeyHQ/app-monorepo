import {
  HARDWARE_SDK_IFRAME_SRC_UNIONKEY,
  HARDWARE_SDK_VERSION,
} from '@unionkeyhq/shared/src/config/appConfig';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import { memoizee } from '@unionkeyhq/shared/src/utils/cacheUtils';

import { EHardwareTransportType } from '../../types';

import { importHardwareSDK, importHardwareSDKLowLevel } from './sdk-loader';

import type { EUnionKeyDomain } from '../../types';
import type {
  ConnectSettings,
  CoreApi,
  LowLevelCoreApi,
} from '@onekeyfe/hd-core';

// eslint-disable-next-line import/no-mutable-exports
let HardwareSDK: CoreApi;
let HardwareLowLevelSDK: LowLevelCoreApi;

export const generateConnectSrc = () => {
  const connectSrc = HARDWARE_SDK_IFRAME_SRC_UNIONKEY.replace(/\/$/, '');
  return connectSrc ? `${connectSrc}/${HARDWARE_SDK_VERSION}/` : '';
};

export const getHardwareSDKInstance = memoizee(
  async (params: {
    isPreRelease: boolean;
    hardwareConnectSrc?: EUnionKeyDomain;
    debugMode?: boolean;
    hardwareTransportType?: EHardwareTransportType;
  }) =>
    // eslint-disable-next-line no-async-promise-executor
    new Promise<CoreApi>(async (resolve, reject) => {
      if (HardwareSDK) {
        resolve(HardwareSDK); // TODO cache conflict with memoizee?
        return;
      }

      const env =
        params.hardwareTransportType === EHardwareTransportType.WEBUSB
          ? ('webusb' as const)
          : undefined;

      const settings: Partial<ConnectSettings> = {
        debug: params.debugMode,
        fetchConfig: true,
        env,
      };

      HardwareSDK = await importHardwareSDK({
        hardwareTransportType: params.hardwareTransportType,
      });

      if (!platformEnv.isNative) {
        let connectSrc = generateConnectSrc();
        if (platformEnv.isDesktop) {
          const { sdkConnectSrc } = globalThis.UNIONKEY_DESKTOP_GLOBALS ?? {};
          if (sdkConnectSrc) {
            connectSrc = sdkConnectSrc;
          }
        }
        if (!connectSrc) {
          throw new Error(
            'HARDWARE_SDK_CONNECT_SRC must be configured for desktop, web, and extension builds',
          );
        }
        settings.connectSrc = connectSrc;
        HardwareLowLevelSDK = await importHardwareSDKLowLevel();
        if (platformEnv.isExtensionBackgroundServiceWorker) {
          // addHardwareGlobalEventListener in ext offscreen
        } else {
          HardwareLowLevelSDK?.addHardwareGlobalEventListener((eventParams) => {
            HardwareSDK.emit(eventParams.event, { ...eventParams });
          });
        }
      }

      settings.preRelease = params.isPreRelease;

      try {
        await HardwareSDK.init(settings, HardwareLowLevelSDK);
        // debugLogger.hardwareSDK.info('HardwareSDK initialized success');
        console.log('HardwareSDK initialized success');
        resolve(HardwareSDK);
      } catch (e) {
        reject(e);
      }
    }),
  {
    promise: true,
    max: 1,
  },
);

export const CoreSDKLoader = async () => import('@onekeyfe/hd-core');

export { HardwareSDK };
