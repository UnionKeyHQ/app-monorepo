import type { ITabSubNavigatorConfig } from '@unionkey/components';
import { ETranslations } from '@unionkey/shared/src/locale';
import { ETabMeRoutes } from '@unionkey/shared/src/routes/tabMe';

import { LazyLoadRootTabPage } from '../../../components/LazyLoadPage';

const TabMe = LazyLoadRootTabPage(() => import('./TabMe'));

export const meRouters: ITabSubNavigatorConfig<any, any>[] = [
  {
    rewrite: '/',
    name: ETabMeRoutes.TabMe,
    component: TabMe,
    translationId: ETranslations.global_more,
  },
];
