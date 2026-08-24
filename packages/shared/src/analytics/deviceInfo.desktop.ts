/* eslint-disable unicorn/prefer-global-this */
import { generateUUID } from '@unionkeyhq/shared/src/utils/miscUtils';

import type { IDeviceInfo, IGetDeviceInfo } from './type';

const deviceInfo = {
  deviceId: generateUUID(),
  arch: globalThis.desktopApi?.arch || 'unknown',
  os: globalThis.desktopApi?.platform || 'browser',
  osVersion: globalThis.desktopApi?.systemVersion || 'unknown',
  screenHeight: typeof window !== 'undefined' ? window.innerHeight : undefined,
  screenWidth: typeof window !== 'undefined' ? window.innerWidth : undefined,
} as IDeviceInfo;

if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('resize', () => {
    deviceInfo.screenHeight = window.innerHeight;
    deviceInfo.screenWidth = window.innerWidth;
  });
}

export const getDeviceInfo: IGetDeviceInfo = () => Promise.resolve(deviceInfo);
