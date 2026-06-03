import type { ITabSubNavigatorConfig } from '@unionkey/components';
import platformEnv from '@unionkey/shared/src/platformEnv';
import { ETabEarnRoutes } from '@unionkey/shared/src/routes';

import { LazyLoadRootTabPage } from '../../../components/LazyLoadPage';

const EarnHome = LazyLoadRootTabPage(
  () => import('../../../views/Earn/EarnHome'),
);

export const earnRouters: ITabSubNavigatorConfig<any, any>[] = [
  {
    rewrite: '/',
    name: ETabEarnRoutes.EarnHome,
    component: EarnHome,
    headerShown: !platformEnv.isNative,
  },
];
