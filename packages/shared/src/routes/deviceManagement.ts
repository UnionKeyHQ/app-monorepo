import type { IHwQrWalletWithDevice } from '../../types/account';

export enum EModalDeviceManagementRoutes {
  GuideModal = 'GuideModal',
  DeviceListModal = 'DeviceListModal',
  DeviceDetailModal = 'DeviceDetailModal',
  BuyUnionKeyHardwareWallet = 'BuyUnionKeyHardwareWallet',
  HardwareTroubleshootingModal = 'HardwareTroubleshootingModal',
}

export type IModalDeviceManagementParamList = {
  [EModalDeviceManagementRoutes.GuideModal]: undefined;
  [EModalDeviceManagementRoutes.DeviceListModal]: undefined;
  [EModalDeviceManagementRoutes.DeviceDetailModal]: {
    walletId: string;
  };
  [EModalDeviceManagementRoutes.BuyUnionKeyHardwareWallet]: undefined;
  [EModalDeviceManagementRoutes.HardwareTroubleshootingModal]: {
    walletWithDevice: IHwQrWalletWithDevice;
  };
};
