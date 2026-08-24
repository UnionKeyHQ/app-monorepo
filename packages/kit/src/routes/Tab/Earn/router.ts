import type { ITabSubNavigatorConfig } from '@unionkeyhq/components';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import { ETabEarnRoutes } from '@unionkeyhq/shared/src/routes';

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
