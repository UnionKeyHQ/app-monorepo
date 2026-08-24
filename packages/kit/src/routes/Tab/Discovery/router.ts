import type { ITabSubNavigatorConfig } from '@unionkeyhq/components';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import { ETabDiscoveryRoutes } from '@unionkeyhq/shared/src/routes';

import { LazyLoadRootTabPage } from '../../../components/LazyLoadPage';

const Browser = LazyLoadRootTabPage(
  () => import('../../../views/Discovery/pages/Browser/Browser'),
);
const DiscoveryDashboard = LazyLoadRootTabPage(
  () => import('../../../views/Discovery/pages/Dashboard/DashboardContainer'),
);

export const discoveryRouters: ITabSubNavigatorConfig<any, any>[] = [
  {
    name: ETabDiscoveryRoutes.TabDiscovery,
    rewrite: '/',
    headerShown: !platformEnv.isNative,
    component:
      platformEnv.isNative && !platformEnv.isNativeIOSPad
        ? Browser
        : DiscoveryDashboard,
    // translationId: 'title__explore',
  },
];
