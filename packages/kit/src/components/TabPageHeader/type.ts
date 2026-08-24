import type { ReactNode } from 'react';

import type { ETabRoutes } from '@unionkeyhq/shared/src/routes';
import type { EAccountSelectorSceneName } from '@unionkeyhq/shared/types';

export interface ITabPageHeaderProp {
  children?: ReactNode;
  sceneName: EAccountSelectorSceneName;
  tabRoute: ETabRoutes;
  customHeaderRightItems?: ReactNode;
  customHeaderLeftItems?: ReactNode;
}
