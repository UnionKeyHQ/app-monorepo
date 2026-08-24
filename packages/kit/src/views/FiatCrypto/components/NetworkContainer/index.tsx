import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo } from 'react';

import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import { usePromiseResult } from '@unionkeyhq/kit/src/hooks/usePromiseResult';
import type { IServerNetwork } from '@unionkeyhq/shared/types';

const NetworkContainerContext = createContext<Record<string, IServerNetwork>>(
  {},
);

export const useGetNetwork = ({
  networkId,
}: {
  networkId: string;
}): IServerNetwork | undefined => {
  const networkMap = useContext(NetworkContainerContext);
  return networkMap[networkId];
};

export const NetworkContainer = ({
  networkIds,
  children,
}: PropsWithChildren<{
  networkIds: string[];
}>) => {
  const {
    result: { networks },
  } = usePromiseResult(
    () => backgroundApiProxy.serviceNetwork.getNetworksByIds({ networkIds }),
    [networkIds],
    {
      initResult: { networks: [] },
    },
  );
  const context = useMemo(
    () =>
      networks.reduce((result, item) => {
        result[item.id] = item;
        return result;
      }, {} as Record<string, IServerNetwork>),
    [networks],
  );
  return (
    <NetworkContainerContext.Provider value={context}>
      {children}
    </NetworkContainerContext.Provider>
  );
};
