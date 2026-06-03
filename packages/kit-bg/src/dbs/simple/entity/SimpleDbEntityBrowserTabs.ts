import type { IWebTab } from '@unionkey/kit/src/views/Discovery/types';

import { SimpleDbEntityBase } from '../base/SimpleDbEntityBase';

export interface IBrowserTabs {
  tabs: IWebTab[];
}

export class SimpleDbEntityBrowserTabs extends SimpleDbEntityBase<IBrowserTabs> {
  entityName = 'browserTabs';

  override enableCache = true;
}
