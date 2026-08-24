import { EDeviceType } from '@onekeyfe/hd-shared';
import semver from 'semver';

import type { IBackgroundApi } from '@unionkeyhq/kit-bg/src/apis/IBackgroundApi';
import type { IDBDevice } from '@unionkeyhq/kit-bg/src/dbs/local/types';
import type { IHardwareUiState } from '@unionkeyhq/kit-bg/src/states/jotai/atoms';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { EHardwareUiStateAction } from '@unionkeyhq/kit-bg/src/states/jotai/atoms';

import {
  EFirmwareUpdateTipMessages,
  EFirmwareVerifyType,
  EUnionKeyDeviceMode,
} from '../../types/device';
import { CoreSDKLoader } from '../hardware/instance';
import platformEnv from '../platformEnv';

import { DeviceScannerUtils } from './DeviceScannerUtils';

import type {
  IAllDeviceVerifyVersions,
  IDeviceVerifyRawVersions,
  IDeviceVerifyVersions,
  IFetchFirmwareVerifyHashParams,
  IFirmwareVerifyInfo,
  IUnionKeyDeviceFeatures,
  IUnionKeyDeviceType,
} from '../../types/device';
import type {
  IDeviceType,
  KnownDevice,
  OnekeyFeatures as UnionKeyFeatures,
  SearchDevice,
} from '@onekeyfe/hd-core';

type IGetDeviceVersionParams = {
  device: SearchDevice | undefined;
  features: IUnionKeyDeviceFeatures | undefined;
};

// TODO move to db converter
function dbDeviceToSearchDevice(device: IDBDevice) {
  const result: SearchDevice = {
    ...device,
    connectId: device.connectId,
    uuid: device.uuid,
    deviceId: device.deviceId,
    deviceType: device.deviceType,
    name: device.name,
  };
  return result;
}

function getDeviceSerialNoFromFeatures(
  features: IUnionKeyDeviceFeatures | undefined,
) {
  return (
    features?.onekey_serial_no ?? features?.onekey_serial ?? features?.serial_no
  );
}

// web sdk return KnownDevice
// ble sdk return SearchDevice
// db return IDBDevice
async function getDeviceVersion(params: IGetDeviceVersionParams): Promise<{
  bleVersion: string;
  firmwareVersion: string;
  bootloaderVersion: string;
}> {
  const { getDeviceBootloaderVersion, getDeviceFirmwareVersion } =
    await CoreSDKLoader();
  const { device, features } = params;
  const knownDevice = device as KnownDevice | undefined;
  const dbDevice = device as IDBDevice | undefined;
  const usedFeatures =
    features || dbDevice?.featuresInfo || knownDevice?.features;

  const bootloaderVersion = usedFeatures
    ? (getDeviceBootloaderVersion(usedFeatures) || []).join('.') ||
      usedFeatures?.bootloader_version ||
      ''
    : '';

  const bleVersion =
    (knownDevice?.bleFirmwareVersion || []).join('.') ||
    usedFeatures?.ble_ver ||
    '';

  const firmwareVersion = usedFeatures
    ? (getDeviceFirmwareVersion(usedFeatures) || []).join('.') ||
      (knownDevice?.firmwareVersion || []).join('.') ||
      usedFeatures?.onekey_firmware_version ||
      ''
    : '';

  return {
    bleVersion,
    firmwareVersion,
    bootloaderVersion,
  };
}

async function getDeviceVersionStr(params: IGetDeviceVersionParams) {
  const { bleVersion, firmwareVersion, bootloaderVersion } =
    await getDeviceVersion(params);
  // keep empty if version not found
  return `${bootloaderVersion}--${bleVersion}--${firmwareVersion}`;
}

async function getDeviceTypeFromFeatures({
  features,
}: {
  features: IUnionKeyDeviceFeatures;
}): Promise<IDeviceType> {
  const { getDeviceType } = await CoreSDKLoader();
  return Promise.resolve(getDeviceType(features));
}

let scanner: DeviceScannerUtils | undefined;
function getDeviceScanner({
  backgroundApi,
}: {
  backgroundApi: IBackgroundApi;
}) {
  if (!scanner) {
    scanner = new DeviceScannerUtils({ backgroundApi });
  }
  return scanner;
}

async function getDeviceModeFromFeatures({
  features,
}: {
  features: IUnionKeyDeviceFeatures;
}): Promise<EUnionKeyDeviceMode> {
  // https://github.com/UnionKeyHQ/hardware-js-sdk/blob/main/packages/core/src/device/Device.ts#L503
  // if (features?.bootloader_mode) return EUnionKeyDeviceMode.bootloader;
  // if (!features?.initialized) return EUnionKeyDeviceMode.initialize;
  // if (features?.no_backup) return EUnionKeyDeviceMode.seedless;
  // return EUnionKeyDeviceMode.normal;

  if (features?.bootloader_mode) {
    // bootloader mode
    return EUnionKeyDeviceMode.bootloader;
  }
  if (!features?.initialized) {
    // not initialized
    return EUnionKeyDeviceMode.notInitialized;
  }

  if (features?.no_backup) {
    // backup mode
    return EUnionKeyDeviceMode.backupMode;
  }

  // normal mode
  return EUnionKeyDeviceMode.normal;
}

async function isBootloaderModeByFeatures({
  features,
}: {
  features: IUnionKeyDeviceFeatures;
}) {
  return (
    (await getDeviceModeFromFeatures({ features })) ===
    EUnionKeyDeviceMode.bootloader
  );
}

async function existsFirmwareByFeatures({
  features,
}: {
  features: IUnionKeyDeviceFeatures;
}) {
  return features?.firmware_present === true;
}

async function isBootloaderModeFromSearchDevice({
  device,
}: {
  device: { mode?: string };
}) {
  return device?.mode === 'bootloader';
}

async function existsFirmwareFromSearchDevice({
  device,
}: {
  device: { features?: { firmware_present?: boolean } };
}) {
  return device?.features?.firmware_present === true;
}

function isConfirmOnDeviceAction(state: IHardwareUiState | undefined) {
  return (
    state?.action === EHardwareUiStateAction.REQUEST_PIN ||
    state?.action === EHardwareUiStateAction.REQUEST_BUTTON ||
    state?.payload?.firmwareTipData?.message ===
      EFirmwareUpdateTipMessages.ConfirmOnDevice
  );
}

function getUpdatingConnectId({
  connectId,
}: {
  connectId: string | undefined;
}) {
  return platformEnv.isNative ? connectId : undefined;
}

async function buildDeviceLabel({
  features,
  buildModelName,
}: {
  features: IUnionKeyDeviceFeatures;
  buildModelName?: boolean;
}): Promise<string | ''> {
  if (features.label && !buildModelName) {
    return features.label;
  }
  const defaultLabelsByDeviceType: Record<IUnionKeyDeviceType, string> = {
    [EDeviceType.Classic]: 'UnionKey Classic',
    [EDeviceType.Classic1s]: 'UnionKey Classic 1S',
    [EDeviceType.ClassicPure]: 'UnionKey Classic 1S Pure',
    [EDeviceType.Mini]: 'UnionKey Mini',
    [EDeviceType.Touch]: 'UnionKey DEX',
    [EDeviceType.Pro]: 'UnionKey Pro',
    [EDeviceType.Unknown]: '',
  };
  const deviceType = await getDeviceTypeFromFeatures({
    features,
  });
  return defaultLabelsByDeviceType[deviceType] || '';
}

async function buildDeviceName({
  device,
  features,
}: {
  device?: SearchDevice;
  features: IUnionKeyDeviceFeatures;
}): Promise<string> {
  const label = await buildDeviceLabel({ features });
  if (label) {
    return label;
  }
  const { getDeviceUUID } = await CoreSDKLoader();
  const deviceUUID = device?.uuid || getDeviceUUID(features);
  return (
    features.label || features.ble_name || `UnionKey ${deviceUUID.slice(-4)}`
  );
}

function buildDeviceBleName({
  features,
}: {
  features: IUnionKeyDeviceFeatures | undefined;
}): string | undefined {
  if (!features) {
    return undefined;
  }
  return features.ble_name;
}

async function getDeviceVerifyVersionsFromFeatures({
  deviceType,
  features,
}: {
  deviceType?: IDeviceType;
  features: UnionKeyFeatures | IUnionKeyDeviceFeatures;
}): Promise<IFetchFirmwareVerifyHashParams | null> {
  let finalDeviceType = deviceType;
  if (!deviceType) {
    finalDeviceType = await getDeviceTypeFromFeatures({
      features: features as IUnionKeyDeviceFeatures,
    });
  }
  if (!finalDeviceType || finalDeviceType === 'unknown') {
    return null;
  }

  const {
    onekey_firmware_version: unionKeyFirmwareVersion,
    onekey_ble_version: unionKeyBleVersion,
    onekey_boot_version: unionKeyBootVersion,
  } = features;
  if (!unionKeyFirmwareVersion || !unionKeyBleVersion || !unionKeyBootVersion) {
    return null;
  }

  return {
    deviceType: finalDeviceType,
    firmwareVersion: unionKeyFirmwareVersion,
    bluetoothVersion: unionKeyBleVersion,
    bootloaderVersion: unionKeyBootVersion,
  };
}

function formatVersionWithHash(
  rawVersion: IDeviceVerifyRawVersions,
): IDeviceVerifyVersions {
  const { version, checksum, commitId, releaseUrl } = rawVersion;

  if (!version) {
    return {
      raw: { version, checksum, commitId },
      formatted: '',
    };
  }

  if (!checksum || !commitId) {
    return {
      raw: { version, checksum, commitId },
      formatted: '-',
    };
  }

  let validatedReleaseUrl: string | undefined;

  try {
    if (releaseUrl) {
      // eslint-disable-next-line no-new
      new URL(releaseUrl);
      validatedReleaseUrl = releaseUrl;
    }
  } catch {
    // ignore
  }

  return {
    raw: { version, checksum, commitId },
    releaseUrl: validatedReleaseUrl,
    formatted: `${version} (${commitId}-${checksum.slice(0, 7)})`,
  };
}

export function parseLocalDeviceVersions({
  onekeyFeatures,
}: {
  onekeyFeatures: UnionKeyFeatures;
}): IAllDeviceVerifyVersions {
  return {
    firmware: formatVersionWithHash({
      version: onekeyFeatures.onekey_firmware_version,
      checksum: onekeyFeatures.onekey_firmware_hash,
      commitId: onekeyFeatures.onekey_firmware_build_id,
    }),
    bluetooth: formatVersionWithHash({
      version: onekeyFeatures.onekey_ble_version,
      checksum: onekeyFeatures.onekey_ble_hash,
      commitId: onekeyFeatures.onekey_ble_build_id,
    }),
    bootloader: formatVersionWithHash({
      version: onekeyFeatures.onekey_boot_version,
      checksum: onekeyFeatures.onekey_boot_hash,
      commitId: onekeyFeatures.onekey_boot_build_id,
    }),
  };
}

export function parseServerVersionInfos({
  serverVerifyInfos,
}: {
  serverVerifyInfos: IFirmwareVerifyInfo[];
}): IAllDeviceVerifyVersions {
  const defaultVersion: IDeviceVerifyVersions = {
    raw: { version: '', checksum: '', commitId: '' },
    formatted: '',
  };

  const result: IAllDeviceVerifyVersions = {
    firmware: defaultVersion,
    bluetooth: defaultVersion,
    bootloader: defaultVersion,
  };

  // loop through server verify infos
  serverVerifyInfos.forEach((item) => {
    switch (item.type) {
      case EFirmwareVerifyType.System:
        result.firmware = formatVersionWithHash(item);
        break;
      case EFirmwareVerifyType.Bluetooth:
        result.bluetooth = formatVersionWithHash(item);
        break;
      case EFirmwareVerifyType.Bootloader:
        result.bootloader = formatVersionWithHash(item);
        break;
      default:
        break;
    }
  });

  return result;
}

export function compareDeviceVersions({
  local,
  remote,
}: {
  local: IDeviceVerifyRawVersions;
  remote: IDeviceVerifyRawVersions;
}): boolean {
  return (
    local.version === remote.version &&
    local.checksum === remote.checksum &&
    local.commitId === remote.commitId
  );
}

async function shouldUseV2FirmwareUpdateFlow({
  features,
}: {
  features: IUnionKeyDeviceFeatures | undefined;
}) {
  if (!features) {
    return false;
  }

  const { getDeviceBootloaderVersion, getDeviceType } = await CoreSDKLoader();
  const deviceType = getDeviceType(features);
  if (deviceType !== EDeviceType.Pro) {
    return false;
  }
  const bootloaderVersion = getDeviceBootloaderVersion(features)?.join('.');
  return !!(
    semver.valid(bootloaderVersion) &&
    // TODO: use constant
    semver.gte(bootloaderVersion, '2.8.0')
  );
}

function getRawDeviceId({
  device,
  features,
}: {
  device: SearchDevice;
  features: IUnionKeyDeviceFeatures;
}) {
  // SearchDevice.deviceId is undefined when BLE connecting
  // const rawDeviceId = device.deviceId || features.device_id || '';
  const rawDeviceId = device.deviceId || features.device_id || '';
  return rawDeviceId;
}

export default {
  dbDeviceToSearchDevice,
  getDeviceVersion,
  getDeviceSerialNoFromFeatures,
  getDeviceVersionStr,
  getDeviceTypeFromFeatures,
  getDeviceModeFromFeatures,
  isBootloaderModeByFeatures,
  isBootloaderModeFromSearchDevice,
  existsFirmwareByFeatures,
  existsFirmwareFromSearchDevice,
  getDeviceScanner,
  getUpdatingConnectId,
  isConfirmOnDeviceAction,
  buildDeviceLabel,
  buildDeviceName,
  buildDeviceBleName,
  getDeviceVerifyVersionsFromFeatures,
  formatVersionWithHash,
  parseLocalDeviceVersions,
  parseServerVersionInfos,
  compareDeviceVersions,
  shouldUseV2FirmwareUpdateFlow,
  getRawDeviceId,
};
