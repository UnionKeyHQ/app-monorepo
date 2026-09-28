import { UnionKeyNetwork } from '@unionkeyhq/shared/src/config/networkIds';

import { HardwareDisabledInfo, XmrDisabledInfo } from './XmrDisabledInfo';

export function NetWorkDisabledInfo({
  networkId,
}: {
  networkId?: string;
  accountId?: string;
}) {
  if (networkId === UnionKeyNetwork.xmr) {
    return <XmrDisabledInfo />;
  }

  if (
    networkId &&
    [UnionKeyNetwork.lightning, UnionKeyNetwork.tlightning].includes(networkId)
  ) {
    return <HardwareDisabledInfo networkId={networkId} />;
  }

  return null;
}
