import { useIsVerticalLayout } from '@unionkeyhq/components';
import type { IUnionKeyDeviceType } from '@unionkeyhq/shared/types';

import UnionKeyDeviceWalletName from '../../../views/Hardware/UnionKey/UnionKeyDeviceWalletName';
import UnionKeyHardwareConfirm from '../../../views/Hardware/UnionKey/UnionKeyHardwareConfirm';
import UnionKeyHardwareConnect from '../../../views/Hardware/UnionKey/UnionKeyHardwareConnect';
import UnionKeyHardwareDetails from '../../../views/Hardware/UnionKey/UnionKeyHardwareDetails';
import UnionKeyHardwareDeviceName from '../../../views/Hardware/UnionKey/UnionKeyHardwareDeviceName';
import UnionKeyHardwareHomescreen from '../../../views/Hardware/UnionKey/UnionKeyHardwareHomescreen';
import UnionKeyHardwarePinCode from '../../../views/Hardware/UnionKey/UnionKeyHardwarePinCode';
import UnionKeyHardwareVerify from '../../../views/Hardware/UnionKey/UnionKeyHardwareVerify';
import { UnionKeyHardwareModalRoutes } from '../../routesEnum';

import { buildModalStackNavigatorOptions } from './buildModalStackNavigatorOptions';
import createStackNavigator from './createStackNavigator';

export type UnionKeyHardwareRoutesParams = {
  [UnionKeyHardwareModalRoutes.UnionKeyHardwareDetailsModal]: {
    walletId: string;
  };
  [UnionKeyHardwareModalRoutes.UnionKeyHardwareVerifyModal]: {
    walletId: string;
  };
  [UnionKeyHardwareModalRoutes.UnionKeyHardwareConnectModal]: {
    deviceId?: string;
    connectId?: string;
    onHandler?: () => Promise<any>;
  };
  [UnionKeyHardwareModalRoutes.UnionKeyHardwarePinCodeModal]: {
    type: string | null | undefined;
  };
  [UnionKeyHardwareModalRoutes.UnionKeyHardwareConfirmModal]: {
    type: string | null | undefined;
  };
  [UnionKeyHardwareModalRoutes.UnionKeyHardwareDeviceNameModal]: {
    walletId: string;
    deviceName: string;
  };
  [UnionKeyHardwareModalRoutes.UnionKeyDeviceWalletNameModal]: {
    walletId: string;
  };
  [UnionKeyHardwareModalRoutes.UnionKeyHardwareHomeScreenModal]: {
    walletId: string;
    deviceType: IUnionKeyDeviceType;
  };
};

const UnionKeyHardwareNavigator =
  createStackNavigator<UnionKeyHardwareRoutesParams>();

const modalRoutes = [
  {
    name: UnionKeyHardwareModalRoutes.UnionKeyHardwareDetailsModal,
    component: UnionKeyHardwareDetails,
  },
  {
    name: UnionKeyHardwareModalRoutes.UnionKeyHardwareVerifyModal,
    component: UnionKeyHardwareVerify,
  },
  {
    name: UnionKeyHardwareModalRoutes.UnionKeyHardwareConnectModal,
    component: UnionKeyHardwareConnect,
  },
  {
    name: UnionKeyHardwareModalRoutes.UnionKeyHardwarePinCodeModal,
    component: UnionKeyHardwarePinCode,
  },
  {
    name: UnionKeyHardwareModalRoutes.UnionKeyHardwareConfirmModal,
    component: UnionKeyHardwareConfirm,
  },
  {
    name: UnionKeyHardwareModalRoutes.UnionKeyHardwareDeviceNameModal,
    component: UnionKeyHardwareDeviceName,
  },
  {
    name: UnionKeyHardwareModalRoutes.UnionKeyHardwareHomeScreenModal,
    component: UnionKeyHardwareHomescreen,
  },
  {
    name: UnionKeyHardwareModalRoutes.UnionKeyDeviceWalletNameModal,
    component: UnionKeyDeviceWalletName,
  },
];

const UnionKeyHardwareModalStack = () => {
  const isVerticalLayout = useIsVerticalLayout();
  return (
    <UnionKeyHardwareNavigator.Navigator
      screenOptions={(navInfo) => ({
        headerShown: false,
        ...buildModalStackNavigatorOptions({ isVerticalLayout, navInfo }),
      })}
    >
      {modalRoutes.map((route) => (
        <UnionKeyHardwareNavigator.Screen
          key={route.name}
          name={route.name}
          component={route.component}
        />
      ))}
    </UnionKeyHardwareNavigator.Navigator>
  );
};

export default UnionKeyHardwareModalStack;
