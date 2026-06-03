import type { ReactNode } from 'react';

import type { ETabRoutes } from '@unionkey/shared/src/routes';
import type { EAccountSelectorSceneName } from '@unionkey/shared/types';

export interface ITabPageHeaderProp {
  children?: ReactNode;
  sceneName: EAccountSelectorSceneName;
  tabRoute: ETabRoutes;
  customHeaderRightItems?: ReactNode;
  customHeaderLeftItems?: ReactNode;
}
