import {
  HARDWARE_SDK_IFRAME_SRC_UNIONKEY,
  HARDWARE_SDK_VERSION,
} from '@unionkeyhq/shared/src/config/appConfig';
import debugLogger from '@unionkeyhq/shared/src/logger/debugLogger';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import { memoizee } from '@unionkeyhq/shared/src/utils/cacheUtils';

import { importHardwareSDK, importHardwareSDKLowLevel } from './sdk-loader';

import type { EOnekeyDomain } from '../../types';
import type {
  ConnectSettings,
  CoreApi,
  LowLevelCoreApi,
} from '@unionkeyhq/hd-core';

// eslint-disable-next-line import/no-mutable-exports
let HardwareSDK: CoreApi;
let HardwareLowLevelSDK: LowLevelCoreApi;

export const generateConnectSrc = () =>
  `${HARDWARE_SDK_IFRAME_SRC_UNIONKEY}/${HARDWARE_SDK_VERSION}/`;

export const getHardwareSDKInstance = memoizee(
  async (params: {
    isPreRelease: boolean;
    hardwareConnectSrc?: EOnekeyDomain;
  }) =>
    // eslint-disable-next-line no-async-promise-executor
    new Promise<CoreApi>(async (resolve, reject) => {
      if (HardwareSDK) {
        resolve(HardwareSDK);
        return;
      }

      const settings: Partial<ConnectSettings> = {
        debug: platformEnv.isDev,
        fetchConfig: true,
      };

      HardwareSDK = await importHardwareSDK();

      if (!platformEnv.isNative) {
        let connectSrc = generateConnectSrc();
        if (platformEnv.isDesktop) {
          // @ts-expect-error
          const { sdkConnectSrc } = window.ONEKEY_DESKTOP_GLOBALS ?? {};
          if (sdkConnectSrc) {
            connectSrc = sdkConnectSrc;
          }
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
        debugLogger.hardwareSDK.info('HardwareSDK initialized success');
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

export const CoreSDKLoader = async () => import('@unionkeyhq/hd-core');

export { HardwareSDK };
