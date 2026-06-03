import type { ITabSubNavigatorConfig } from '@unionkey/components';
import platformEnv from '@unionkey/shared/src/platformEnv';
import { ETabSwapRoutes } from '@unionkey/shared/src/routes';

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
