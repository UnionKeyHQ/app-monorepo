import type { ITabSubNavigatorConfig } from '@unionkey/components';
import {
  LazyLoadPage,
  LazyLoadRootTabPage,
} from '@unionkey/kit/src/components/LazyLoadPage';
import { ETabDeveloperRoutes } from '@unionkey/shared/src/routes';

import { galleryScreenList } from './pages/Gallery';

const TabDeveloper = LazyLoadRootTabPage(() => import('./pages/TabDeveloper'));
const DevHome = LazyLoadPage(() => import('./pages/DevHome'));
const DevHomeStack1 = LazyLoadPage(() => import('./pages/DevHomeStack1'));
const DevHomeStack2 = LazyLoadPage(() => import('./pages/DevHomeStack2'));
const SignatureRecord = LazyLoadPage(() => import('./pages/SignatureRecord'));
const NetworkLogger = LazyLoadPage(() => import('./pages/NetworkLogger'));

export const developerRouters: ITabSubNavigatorConfig<any, any>[] = [
  {
    name: ETabDeveloperRoutes.TabDeveloper,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    component: TabDeveloper,
    rewrite: '/',
  },
  ...galleryScreenList,
  {
    name: ETabDeveloperRoutes.DevHome,
    component: DevHome,
  },
  {
    name: ETabDeveloperRoutes.DevHomeStack1,
    component: DevHomeStack1,
  },
  {
    name: ETabDeveloperRoutes.DevHomeStack2,
    component: DevHomeStack2,
  },
  {
    name: ETabDeveloperRoutes.SignatureRecord,
    component: SignatureRecord,
  },
  {
    name: ETabDeveloperRoutes.NetworkLogger,
    component: NetworkLogger,
  },
];
