import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components';
import type { IModalFirmwareUpdateParamList } from '@unionkeyhq/shared/src/routes';
import { EModalFirmwareUpdateRoutes } from '@unionkeyhq/shared/src/routes';

import { LazyLoadPage } from '../../../components/LazyLoadPage';

const PageFirmwareUpdateChangeLog = LazyLoadPage(
  () =>
    import(
      '@unionkeyhq/kit/src/views/FirmwareUpdate/pages/PageFirmwareUpdateChangeLog'
    ),
);

const PageFirmwareUpdateInstall = LazyLoadPage(
  () =>
    import(
      '@unionkeyhq/kit/src/views/FirmwareUpdate/pages/PageFirmwareUpdateInstall'
    ),
);

const PageFirmwareUpdateInstallV2 = LazyLoadPage(
  () =>
    import(
      '@unionkeyhq/kit/src/views/FirmwareUpdate/pages/PageFirmwareUpdateInstallV2'
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
