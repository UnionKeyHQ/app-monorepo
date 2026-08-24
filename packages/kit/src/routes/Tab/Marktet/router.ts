import type { ITabSubNavigatorConfig } from '@unionkeyhq/components';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import { ETabMarketRoutes } from '@unionkeyhq/shared/src/routes';

import {
  LazyLoadPage,
  LazyLoadRootTabPage,
} from '../../../components/LazyLoadPage';

const MarketHome = LazyLoadRootTabPage(
  () => import('../../../views/Market/MarketHome'),
);

const MarketDetail = LazyLoadPage(
  () => import('../../../views/Market/MarketDetail'),
);

export const marketRouters: ITabSubNavigatorConfig<any, any>[] = [
  {
    rewrite: '/',
    name: ETabMarketRoutes.TabMarket,
    headerShown: !platformEnv.isNative,
    component: MarketHome,
  },
  {
    name: ETabMarketRoutes.MarketDetail,
    component: MarketDetail,
    rewrite: '/tokens/:token',
  },
];
