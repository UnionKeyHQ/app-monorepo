import { EDeviceType } from '@unionkeyhq/hd-shared';

import type { IOneKeyDeviceFeatures } from '@unionkeyhq/shared/types';

import type { IDeviceType, IVersionArray } from '@unionkeyhq/hd-core';

// Device IDs no longer encode a reliable model in the current SDK. Callers use
// this only for presentation, so return the explicit unknown model until device
// features are available instead of guessing from an opaque identifier.
export const getDeviceTypeByDeviceId = (_deviceId?: string): IDeviceType =>
  EDeviceType.Unknown;

export const isHwClassic = (deviceType: string | undefined): boolean =>
  deviceType === EDeviceType.Classic;

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
