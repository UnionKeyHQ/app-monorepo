import { backgroundMethod } from '@unionkey/shared/src/background/backgroundDecorators';
import type { IEarnAtomData } from '@unionkey/shared/types/staking';

import { SimpleDbEntityBase } from '../base/SimpleDbEntityBase';

export class SimpleDbEntityEarn extends SimpleDbEntityBase<IEarnAtomData> {
  entityName = 'earnData';

  override enableCache = false;

  @backgroundMethod()
  async getEarnData() {
    const data = await this.getRawData();
    return data ?? { availableAssets: [] };
  }
}
