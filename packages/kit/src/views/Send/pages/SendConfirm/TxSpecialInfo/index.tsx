import type { IUnsignedTx } from '@unionkey/core/src/types';
import { IMPL_TRON } from '@unionkey/shared/src/engine/engineConsts';

import { TronSpecialInfo } from './TronSpecialInfo';

export function getTxSpecialInfo({ impl }: { impl: string }) {
  let component:
    | ((props: {
        accountId: string;
        networkId: string;
        unsignedTxs: IUnsignedTx[];
      }) => JSX.Element | null)
    | undefined;
  switch (impl) {
    case IMPL_TRON:
      component = TronSpecialInfo;
      break;
    default:
      break;
  }

  return component;
}
