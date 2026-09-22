// getNetworkImplFromNetworkId
// getImplFromNetworkId
import { SEPERATOR } from '@unionkeyhq/shared/src/engine/engineConsts';

export function getNetworkImpl(networkId: string) {
  const [impl] = networkId.split(SEPERATOR);
  return impl;
}
