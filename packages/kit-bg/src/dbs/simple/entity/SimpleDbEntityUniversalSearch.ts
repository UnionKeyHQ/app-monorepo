import { backgroundMethod } from '@unionkey/shared/src/background/backgroundDecorators';
import type { IUniversalSearchAtomData } from '@unionkey/shared/types/search';

import { SimpleDbEntityBase } from '../base/SimpleDbEntityBase';

export class SimpleDbEntityUniversalSearch extends SimpleDbEntityBase<IUniversalSearchAtomData> {
  entityName = 'universalSearch';

  override enableCache = false;

  @backgroundMethod()
  async getData() {
    const data = await this.getRawData();
    return data ?? { recentSearch: [] };
  }
}
