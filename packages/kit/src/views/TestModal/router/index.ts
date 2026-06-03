import type { IModalFlowNavigatorConfig } from '@unionkey/components';
import type { ITestModalPagesParam } from '@unionkey/shared/src/routes';
import { ETestModalPages } from '@unionkey/shared/src/routes';

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
