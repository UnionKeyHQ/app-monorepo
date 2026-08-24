import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components';
import type { IPrimeParamList } from '@unionkeyhq/shared/src/routes/prime';
import { EPrimePages } from '@unionkeyhq/shared/src/routes/prime';

import { LazyLoadPage } from '../../../components/LazyLoadPage';

const PrimeDashboard = LazyLoadPage(() => import('../pages/PrimeDashboard'));
const PrimeDeviceLimit = LazyLoadPage(
  () => import('../pages/PrimeDeviceLimit'),
);
const PrimeCloudSync = LazyLoadPage(() => import('../pages/PrimeCloudSync'));
const PrimeCloudSyncDebug = LazyLoadPage(
  () => import('../pages/PrimeCloudSync/PagePrimeCloudSyncDebug'),
);

export const PrimeRouter: IModalFlowNavigatorConfig<
  EPrimePages,
  IPrimeParamList
>[] = [
  {
    name: EPrimePages.PrimeDashboard,
    component: PrimeDashboard,
  },
  {
    name: EPrimePages.PrimeDeviceLimit,
    component: PrimeDeviceLimit,
  },
  {
    name: EPrimePages.PrimeCloudSync,
    component: PrimeCloudSync,
  },
  {
    name: EPrimePages.PrimeCloudSyncDebug,
    component: PrimeCloudSyncDebug,
  },
];
