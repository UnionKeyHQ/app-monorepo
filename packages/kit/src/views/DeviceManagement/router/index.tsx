import type { IModalFlowNavigatorConfig } from '@unionkey/components';
import { LazyLoadPage } from '@unionkey/kit/src/components/LazyLoadPage';
import type { IModalDeviceManagementParamList } from '@unionkey/shared/src/routes';
import { EModalDeviceManagementRoutes } from '@unionkey/shared/src/routes/deviceManagement';

const DeviceGuideModal = LazyLoadPage(
  () => import('../pages/DeviceGuideModal'),
);

const DeviceListModal = LazyLoadPage(
  () => import('../pages/DeviceManagementListModal'),
);

const DeviceDetailModal = LazyLoadPage(
  () => import('../pages/DeviceDetailsModal'),
);

const BuyUnionKeyHardwareWallet = LazyLoadPage(
  () =>
    import(
      '@unionkey/kit/src/views/Onboarding/pages/ConnectHardwareWallet/UnionKeyHardwareWallet'
    ),
);

const HardwareTroubleshootingModal = LazyLoadPage(
  () => import('../pages/HardwareTroubleshootingModal'),
);

export const DeviceManagementStacks: IModalFlowNavigatorConfig<
  EModalDeviceManagementRoutes,
  IModalDeviceManagementParamList
>[] = [
  {
    name: EModalDeviceManagementRoutes.GuideModal,
    component: DeviceGuideModal,
  },
  {
    name: EModalDeviceManagementRoutes.DeviceListModal,
    component: DeviceListModal,
  },
  {
    name: EModalDeviceManagementRoutes.DeviceDetailModal,
    component: DeviceDetailModal,
  },
  {
    name: EModalDeviceManagementRoutes.BuyUnionKeyHardwareWallet,
    component: BuyUnionKeyHardwareWallet,
    options: {
      headerShown: false,
    },
  },
  {
    name: EModalDeviceManagementRoutes.HardwareTroubleshootingModal,
    component: HardwareTroubleshootingModal,
  },
];
