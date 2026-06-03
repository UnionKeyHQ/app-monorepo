import type { IModalFlowNavigatorConfig } from '@unionkey/components';
import type { ITestModalPagesParam } from '@unionkey/shared/src/routes';
import { EUniversalSearchPages } from '@unionkey/shared/src/routes/universalSearch';

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
