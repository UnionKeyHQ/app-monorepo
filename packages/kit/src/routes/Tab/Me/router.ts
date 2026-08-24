import type { ITabSubNavigatorConfig } from '@unionkeyhq/components';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import { ETabMeRoutes } from '@unionkeyhq/shared/src/routes/tabMe';

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
