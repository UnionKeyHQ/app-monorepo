import type { IModalFlowNavigatorConfig } from '@unionkey/components/src/layouts/Navigation/Navigator';
import LazyLoad from '@unionkey/shared/src/lazyLoad';
import { ECloudBackupRoutes } from '@unionkey/shared/src/routes';
import type { ICloudBackupParamList } from '@unionkey/shared/src/routes';

const CloudBackupHome = LazyLoad(
  () => import('@unionkey/kit/src/views/CloudBackup/pages/Home'),
);

const CloudBackupList = LazyLoad(
  () => import('@unionkey/kit/src/views/CloudBackup/pages/List'),
);

const CloudBackupDetail = LazyLoad(
  () => import('@unionkey/kit/src/views/CloudBackup/pages/Detail'),
);

export const CloudBackupPages: IModalFlowNavigatorConfig<
  ECloudBackupRoutes,
  ICloudBackupParamList
>[] = [
  {
    name: ECloudBackupRoutes.CloudBackupHome,
    component: CloudBackupHome,
  },
  {
    name: ECloudBackupRoutes.CloudBackupList,
    component: CloudBackupList,
  },
  {
    name: ECloudBackupRoutes.CloudBackupDetail,
    component: CloudBackupDetail,
  },
];
