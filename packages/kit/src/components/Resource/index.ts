import type { IDialogShowProps } from '@unionkey/components';
import { IMPL_TRON } from '@unionkey/shared/src/engine/engineConsts';
import networkUtils from '@unionkey/shared/src/utils/networkUtils';

import { showTronResourceDetailsDialog } from './TronResource';

export const showResourceDetailsDialog = (
  props: IDialogShowProps & {
    accountId: string;
    networkId: string;
  },
) => {
  const { networkId } = props;

  const impl = networkUtils.getNetworkImpl({ networkId });

  switch (impl) {
    case IMPL_TRON:
      return showTronResourceDetailsDialog(props);
    default:
      return null;
  }
};
