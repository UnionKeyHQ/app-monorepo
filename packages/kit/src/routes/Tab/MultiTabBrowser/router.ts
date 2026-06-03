import type { ITabSubNavigatorConfig } from '@unionkey/components';
import { EMultiTabBrowserRoutes } from '@unionkey/shared/src/routes';

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
