import {
  backgroundMethod,
  toastIfError,
} from '@unionkeyhq/shared/src/background/backgroundDecorators';
import { UnionKeyServerApiError } from '@unionkeyhq/shared/src/errors';
import { convertDeviceResponse } from '@unionkeyhq/shared/src/errors/utils/deviceErrorUtils';
import {
  EAppEventBusNames,
  appEventBus,
} from '@unionkeyhq/shared/src/eventBus/appEventBus';
import { defaultLogger } from '@unionkeyhq/shared/src/logger/logger';
import bufferUtils from '@unionkeyhq/shared/src/utils/bufferUtils';
import { memoizee } from '@unionkeyhq/shared/src/utils/cacheUtils';
import deviceUtils from '@unionkeyhq/shared/src/utils/deviceUtils';
import stringUtils from '@unionkeyhq/shared/src/utils/stringUtils';
import timerUtils from '@unionkeyhq/shared/src/utils/timerUtils';
import type {
  IDeviceVerifyVersionCompareResult,
  IFetchFirmwareVerifyHashParams,
  IFirmwareVerifyInfo,
  IUnionKeyDeviceFeatures,
} from '@unionkeyhq/shared/types/device';
import { EServiceEndpointEnum } from '@unionkeyhq/shared/types/endpoint';

import localDb from '../../dbs/local/localDb';
import { settingsPersistAtom } from '../../states/jotai/atoms';
import axios from 'axios'; 
import { ServiceHardwareManagerBase } from './ServiceHardwareManagerBase';

import type {
  IDBDevice,
  IDBUpdateFirmwareVerifiedParams,
} from '../../dbs/local/types';
import type {
  DeviceVerifySignature,
  IDeviceType,
  OnekeyFeatures as UnionKeyFeatures,
  SearchDevice,
} from '@onekeyfe/hd-core';

export type IShouldAuthenticateFirmwareParams = { device: SearchDevice };
export type IFirmwareAuthenticateParams = {
  device: SearchDevice | IDBDevice; // TODO split SearchDevice and IDBDevice
  skipDeviceCancel?: boolean;
};

const deviceCheckingCodes = [10_104, 10_105, 10_106, 10_107];

export class HardwareVerifyManager extends ServiceHardwareManagerBase {
  @backgroundMethod()
  async getDeviceCertWithSig({
    connectId,
    dataHex,
  }: {
    connectId: string;
    dataHex: string;
  }): Promise<DeviceVerifySignature> {
    const hardwareSDK = await this.getSDKInstance();
    return convertDeviceResponse(() =>
      hardwareSDK?.deviceVerify(connectId, { dataHex }),
    );
  }

  @backgroundMethod()
  async shouldAuthenticateFirmware({
    device,
  }: IShouldAuthenticateFirmwareParams) {
    const dbDevice: IDBDevice | undefined = await localDb.getExistingDevice({
      rawDeviceId: device.deviceId || '',
      uuid: device.uuid,
    });
    // const versionText = deviceUtils.getDeviceVersionStr(device);
    // return dbDevice?.verifiedAtVersion !== versionText;
    return !dbDevice?.verifiedAtVersion;
  }

  @backgroundMethod()
  async updateFirmwareVerified(params: IDBUpdateFirmwareVerifiedParams) {
    const result = await localDb.updateFirmwareVerified(params);
    appEventBus.emit(EAppEventBusNames.WalletUpdate, undefined);
    return result;
  }

  @backgroundMethod()
  @toastIfError()
  async firmwareAuthenticate({
    device,
    skipDeviceCancel,
  }: IFirmwareAuthenticateParams): Promise<{
    verified: boolean;
    device: SearchDevice | IDBDevice;
    payload: {
      deviceType: IDeviceType;
      data: string;
      cert: string;
      signature: string;
    };
    result:
      | {
          message?: string;
          data?: string;
          code?: number;
        }
      | undefined;
  }> {
    const { connectId, deviceType } = device;
    if (!connectId) {
      throw new Error(
        'firmwareAuthenticate ERROR: device connectId is undefined',
      );
    }
  
    return this.backgroundApi.serviceHardwareUI.withHardwareProcessing(
      async () => {
        const ts = Date.now();
        const settings = await settingsPersistAtom.get();
        const data = `${settings.instanceId}_${ts}_${stringUtils.randomString(12)}`;
        const dataHex = bufferUtils.textToHex(data, 'utf-8');
  
        // 调用设备 SDK 获取证书和签名
        const verifySig: DeviceVerifySignature = await this.getDeviceCertWithSig({
          connectId,
          dataHex,
        });
        const { cert, signature } = verifySig;
  
        // 关闭硬件弹窗（只是 UI）
        await this.backgroundApi.serviceHardwareUI.closeHardwareUiStateDialog({
          skipDeviceCancel: true,
          connectId,
        });
  
        appEventBus.emit(EAppEventBusNames.HardwareVerifyAfterDeviceConfirm, undefined);
  
        // --- 调用本地服务器 ---
        let result: { code?: number; message?: string; data?: string } = {};
        try {
          const resp = await fetch("https://api.unionkey.io/hardware/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              deviceType,
              data,
              cert: Buffer.from(cert).toString("base64"),
              signature: Buffer.from(signature).toString("base64"),
            }),
          });
  
          result = await resp.json();
        } catch (error) {
          console.error("firmwareAuthenticate local verify error:", error);
          throw error;
        }
  
        console.log("firmwareAuthenticate result:", result, connectId);
  
        const verified = result.code === 0;
  
        const dbDevice = device as IDBDevice;
        if (dbDevice?.id) {
          void this.updateFirmwareVerified({
            device: dbDevice,
            verifyResult: verified ? 'official' : 'unofficial',
          });
        }
  
        return {
          verified,
          device,
          payload: {
            deviceType,
            data,
            cert,
            signature,
          },
          result,
        };
      },
      {
        deviceParams: { dbDevice: device as any },
        hideCheckingDeviceLoading: true,
        skipDeviceCancel,
        debugMethodName: 'firmwareAuthenticate.verify',
      },
    );
  }
  

  @backgroundMethod()
  async shouldAuthenticateFirmwareByHash({
    features,
  }: {
    features: IUnionKeyDeviceFeatures | undefined;
  }) {
    // onekey_firmware_version
    // onekey_firmware_hash
    // onekey_ble_version
    // onekey_ble_hash
    // onekey_boot_version
    // onekey_boot_hash
    if (!features) {
      return false;
    }
    const verifyVersions =
      await deviceUtils.getDeviceVerifyVersionsFromFeatures({
        features,
      });
    if (!verifyVersions) {
      return false;
    }
    const result = await this.fetchFirmwareVerifyHash(verifyVersions);
    // server should return 3 firmware config
    if (!result || !Array.isArray(result) || result.length !== 3) {
      return false;
    }
    const isValid = result.every((firmware) => {
      if (
        firmware.type === 'system' &&
        firmware.version !== verifyVersions.firmwareVersion
      ) {
        console.log('System version mismatch:', {
          expected: verifyVersions.firmwareVersion,
          actual: firmware.version,
        });
        return false;
      }
      if (
        firmware.type === 'bluetooth' &&
        firmware.version !== verifyVersions.bluetoothVersion
      ) {
        console.log('Bluetooth version mismatch:', {
          expected: verifyVersions.bluetoothVersion,
          actual: firmware.version,
        });
        return false;
      }
      if (
        firmware.type === 'bootloader' &&
        firmware.version !== verifyVersions.bootloaderVersion
      ) {
        console.log('Bootloader version mismatch:', {
          expected: verifyVersions.bootloaderVersion,
          actual: firmware.version,
        });
        return false;
      }
      return true;
    });

    console.log('shouldAuthenticateFirmwareByHash isValid: ', isValid);
    return isValid;
  }

  @backgroundMethod()
  async fetchFirmwareVerifyHash(
    params: IFetchFirmwareVerifyHashParams,
  ): Promise<IFirmwareVerifyInfo[]> {
    try {
      return await this.fetchFirmwareVerifyHashWithCache(params);
    } catch {
      return [];
    }
  }

  fetchFirmwareVerifyHashWithCache = memoizee(  
    async (params: IFetchFirmwareVerifyHashParams) => {  
      const resp = await axios.get<{  
        data: {  
          firmwares: IFirmwareVerifyInfo[];  
        };  
      }>('https://api.unionkey.io/utility/v1/firmware/detail', {  
        params: {  
          deviceType: params.deviceType,  
          system: params.firmwareVersion,  
          bluetooth: params.bluetoothVersion,  
          bootloader: params.bootloaderVersion,  
        },  
      });  
      return resp.data.data.firmwares;  
    },  
    {  
      promise: true,  
      maxAge: timerUtils.getTimeDurationMs({ minute: 2 }),  
    },  
  );

  @backgroundMethod()
  async verifyFirmwareHash({
    deviceType,
    onekeyFeatures,
  }: {
    deviceType: IDeviceType;
    onekeyFeatures: UnionKeyFeatures | undefined;
  }): Promise<IDeviceVerifyVersionCompareResult> {
    const defaultResult = {
      certificate: {
        isMatch: true,
        format: onekeyFeatures?.onekey_serial_no ?? '',
      },
      firmware: { isMatch: false, format: '' },
      bluetooth: { isMatch: false, format: '' },
      bootloader: { isMatch: false, format: '' },
    };

    if (!onekeyFeatures) {
      return defaultResult;
    }

    const verifyVersions =
      await deviceUtils.getDeviceVerifyVersionsFromFeatures({
        features: onekeyFeatures,
        deviceType,
      });
    if (!verifyVersions) {
      return defaultResult;
    }

    const result = await this.fetchFirmwareVerifyHash(verifyVersions);
    if (!result || !Array.isArray(result)) {
      return defaultResult;
    }
    const serverVerifyInfos = deviceUtils.parseServerVersionInfos({
      serverVerifyInfos: result,
    });
    const localVerifyInfos = deviceUtils.parseLocalDeviceVersions({
      onekeyFeatures,
    });

    const firmwareMatch = deviceUtils.compareDeviceVersions({
      local: localVerifyInfos.firmware.raw,
      remote: serverVerifyInfos.firmware.raw,
    });
    const bluetoothMatch = deviceUtils.compareDeviceVersions({
      local: localVerifyInfos.bluetooth.raw,
      remote: serverVerifyInfos.bluetooth.raw,
    });
    const bootloaderMatch = deviceUtils.compareDeviceVersions({
      local: localVerifyInfos.bootloader.raw,
      remote: serverVerifyInfos.bootloader.raw,
    });

    if (!firmwareMatch || !bluetoothMatch || !bootloaderMatch) {
      defaultLogger.hardware.verify.verifyFailed({
        local: localVerifyInfos,
        server: serverVerifyInfos,
      });
    }

    return {
      certificate: {
        isMatch: true,
        format: onekeyFeatures?.onekey_serial_no ?? '',
      },
      firmware: {
        isMatch: firmwareMatch,
        format: serverVerifyInfos.firmware.formatted,
        releaseUrl: serverVerifyInfos.firmware.releaseUrl,
      },
      bluetooth: {
        isMatch: bluetoothMatch,
        format: serverVerifyInfos.bluetooth.formatted,
        releaseUrl: serverVerifyInfos.bluetooth.releaseUrl,
      },
      bootloader: {
        isMatch: bootloaderMatch,
        format: serverVerifyInfos.bootloader.formatted,
        releaseUrl: serverVerifyInfos.bootloader.releaseUrl,
      },
    };
  }
}
