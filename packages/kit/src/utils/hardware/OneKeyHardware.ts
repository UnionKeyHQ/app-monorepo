import { getDeviceTypeByDeviceId as getDeviceTypeByDeviceIdUtil } from '@unionkeyhq/hd-core';

import type { IOneKeyDeviceFeatures } from '@unionkeyhq/shared/types';

import type { IDeviceType, IVersionArray } from '@unionkeyhq/hd-core';

export const getDeviceTypeByDeviceId = (deviceId?: string): IDeviceType =>
  getDeviceTypeByDeviceIdUtil(deviceId);

export const isHwClassic = (deviceType: string | undefined): boolean =>
  deviceType === 'classic';

export const getDeviceFirmwareVersion = (
  features: IOneKeyDeviceFeatures | undefined,
): IVersionArray => {
  if (!features) return [0, 0, 0];

  if (features.onekey_version) {
    return features.onekey_version.split('.') as unknown as IVersionArray;
  }
  return [
    features.major_version,
    features.minor_version,
    features.patch_version,
  ];
};
