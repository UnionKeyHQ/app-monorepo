import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components/src/layouts/Navigation/Navigator';
import LazyLoad from '@unionkeyhq/shared/src/lazyLoad';
import { ECloudBackupRoutes } from '@unionkeyhq/shared/src/routes';
import type { ICloudBackupParamList } from '@unionkeyhq/shared/src/routes';

const CloudBackupHome = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/CloudBackup/pages/Home'),
);

const CloudBackupList = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/CloudBackup/pages/List'),
);

const CloudBackupDetail = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/CloudBackup/pages/Detail'),
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
