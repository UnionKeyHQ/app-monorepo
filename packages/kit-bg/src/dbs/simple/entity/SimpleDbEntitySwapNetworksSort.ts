import type { ISwapNetwork } from '@unionkey/shared/types/swap/types';

import { SimpleDbEntityBase } from '../base/SimpleDbEntityBase';

export interface ISwapNetworks {
  data: ISwapNetwork[];
}

export class SimpleDbEntitySwapNetworksSort extends SimpleDbEntityBase<ISwapNetworks> {
  entityName = 'swapNetworksSort';

  override enableCache = false;
}
