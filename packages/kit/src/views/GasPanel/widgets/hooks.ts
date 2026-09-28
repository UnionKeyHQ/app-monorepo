import { useEffect } from 'react';

import { UnionKeyNetwork } from '@unionkeyhq/shared/src/config/networkIds';

import backgroundApiProxy from '../../../background/instance/backgroundApiProxy';
import { useAppSelector } from '../../../hooks';
import { supportedNetworks } from '../config';

export function useNetworkPrices(networkId?: string) {
  const networkPrices = useAppSelector((s) => s.discover.networkPrices);
  const activeNetwokId =
    networkId && supportedNetworks.includes(networkId)
      ? networkId
      : UnionKeyNetwork.eth;
  const price = networkPrices?.[activeNetwokId];
  useEffect(() => {
    backgroundApiProxy.serviceGas.refreshGasPrice({
      networkId: activeNetwokId,
    });
    const t = setInterval(
      () =>
        backgroundApiProxy.serviceGas.refreshGasPrice({
          networkId: activeNetwokId,
        }),
      60 * 1000,
    );
    return () => clearInterval(t);
  }, [activeNetwokId]);
  return price;
}
