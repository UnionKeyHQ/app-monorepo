import type { ESwapCleanHistorySource } from '@unionkeyhq/shared/types/swap/types';

import { BaseScene } from '../../../base/baseScene';
import { LogToLocal, LogToServer } from '../../../base/decorators';

export class CleanSwapOrderScene extends BaseScene {
  @LogToServer({ level: 'info' })
  @LogToLocal({ level: 'info' })
  public cleanSwapOrder({ cleanFrom }: { cleanFrom: ESwapCleanHistorySource }) {
    return {
      cleanFrom,
    };
  }
}
