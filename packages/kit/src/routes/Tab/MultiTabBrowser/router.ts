import type { ITabSubNavigatorConfig } from '@unionkeyhq/components';
import { EMultiTabBrowserRoutes } from '@unionkeyhq/shared/src/routes';

import { LazyLoadRootTabPage } from '../../../components/LazyLoadPage';

const MultiTabBrowser = LazyLoadRootTabPage(
  () => import('../../../views/Discovery/pages/Browser/Browser'),
);

export const multiTabBrowserRouters: ITabSubNavigatorConfig<any, any>[] = [
  {
    name: EMultiTabBrowserRoutes.MultiTabBrowser,
    component: MultiTabBrowser,
  },
];
