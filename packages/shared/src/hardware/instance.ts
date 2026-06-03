import {
  HARDWARE_SDK_IFRAME_SRC_UNIONKEYSO,
  HARDWARE_SDK_VERSION,
} from '@unionkey/shared/src/config/appConfig';
import platformEnv from '@unionkey/shared/src/platformEnv';
import { memoizee } from '@unionkey/shared/src/utils/cacheUtils';

import { EHardwareTransportType } from '../../types';

import { importHardwareSDK, importHardwareSDKLowLevel } from './sdk-loader';

import type { EUnionkeyDomain } from '../../types';
import type {
  ConnectSettings,
  CoreApi,
  LowLevelCoreApi,
} from '@unionkeyfe/hd-core';

// eslint-disable-next-line import/no-mutable-exports
let HardwareSDK: CoreApi;
let HardwareLowLevelSDK: LowLevelCoreApi;

export const generateConnectSrc = () => {
  const connectSrc = `${HARDWARE_SDK_IFRAME_SRC_UNIONKEYSO}/${HARDWARE_SDK_VERSION}/`;
  return connectSrc;
};

export const getHardwareSDKInstance = memoizee(
  async (params: {
    isPreRelease: boolean;
    hardwareConnectSrc?: EUnionkeyDomain;
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
        fetchConfig: true,//zyfshr
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

export const CoreSDKLoader = async () => import('@unionkeyfe/hd-core');

export { HardwareSDK };
