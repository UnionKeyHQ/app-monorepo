import type { ITabSubNavigatorConfig } from '@unionkeyhq/components';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import { ETabSwapRoutes } from '@unionkeyhq/shared/src/routes';

import { LazyLoadRootTabPage } from '../../../components/LazyLoadPage';

const Swap = LazyLoadRootTabPage(() => import('../../../views/Swap'));

export const swapRouters: ITabSubNavigatorConfig<any, any>[] = [
  {
    name: ETabSwapRoutes.TabSwap,
    component: Swap,
    rewrite: '/',
    headerShown: !platformEnv.isNative,
    // translationId: ETranslations.global_swap,
  },
];
