import type { IModalFlowNavigatorConfig } from '@unionkey/components';
import type { IModalFirmwareUpdateParamList } from '@unionkey/shared/src/routes';
import { EModalFirmwareUpdateRoutes } from '@unionkey/shared/src/routes';

import { LazyLoadPage } from '../../../components/LazyLoadPage';

const PageFirmwareUpdateChangeLog = LazyLoadPage(
  () =>
    import(
      '@unionkey/kit/src/views/FirmwareUpdate/pages/PageFirmwareUpdateChangeLog'
    ),
);

const PageFirmwareUpdateInstall = LazyLoadPage(
  () =>
    import(
      '@unionkey/kit/src/views/FirmwareUpdate/pages/PageFirmwareUpdateInstall'
    ),
);

const PageFirmwareUpdateInstallV2 = LazyLoadPage(
  () =>
    import(
      '@unionkey/kit/src/views/FirmwareUpdate/pages/PageFirmwareUpdateInstallV2'
    ),
);
export const ModalFirmwareUpdateStack: IModalFlowNavigatorConfig<
  EModalFirmwareUpdateRoutes,
  IModalFirmwareUpdateParamList
>[] = [
  {
    name: EModalFirmwareUpdateRoutes.ChangeLog,
    component: PageFirmwareUpdateChangeLog,
  },
  {
    name: EModalFirmwareUpdateRoutes.Install,
    component: PageFirmwareUpdateInstall,
  },
  {
    name: EModalFirmwareUpdateRoutes.InstallV2,
    component: PageFirmwareUpdateInstallV2,
  },
];
