import { useMemo } from 'react';

import type { Network } from '@unionkeyhq/engine/src/types/network';
import { OnekeyNetwork } from '@unionkeyhq/shared/src/config/networkIds';

import { useNetworks } from '../../../hooks/redux';

const ethNetwokId = OnekeyNetwork.eth;

export function useDefaultNetWork() {
  const networks = useNetworks();
  return useMemo(() => {
    const ethNetWork = networks.find((n) => n.id === ethNetwokId);
    return ethNetWork as Network;
  }, [networks]);
}
