import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components';
import type { ITestModalPagesParam } from '@unionkeyhq/shared/src/routes';
import { EUniversalSearchPages } from '@unionkeyhq/shared/src/routes/universalSearch';

import { LazyLoadPage } from '../../../components/LazyLoadPage';

const UniversalSearchPage = LazyLoadPage(
  () => import('../pages/UniversalSearch'),
);

export const UniversalSearchRouter: IModalFlowNavigatorConfig<
  EUniversalSearchPages,
  ITestModalPagesParam
>[] = [
  {
    name: EUniversalSearchPages.UniversalSearch,
    component: UniversalSearchPage,
  },
];
