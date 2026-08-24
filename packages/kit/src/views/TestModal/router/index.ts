import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components';
import type { ITestModalPagesParam } from '@unionkeyhq/shared/src/routes';
import { ETestModalPages } from '@unionkeyhq/shared/src/routes';

import { TestSimpleModal } from '../pages/TestSimpleModal';

export const TestModalRouter: IModalFlowNavigatorConfig<
  ETestModalPages,
  ITestModalPagesParam
>[] = [
  {
    name: ETestModalPages.TestSimpleModal,
    component: TestSimpleModal,
  },
];
