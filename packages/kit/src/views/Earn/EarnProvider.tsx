import { memo, useMemo } from 'react';

import { useJotaiContextRootStore } from '@unionkeyhq/kit/src/states/jotai/utils/useJotaiContextRootStore';
import { EJotaiContextStoreNames } from '@unionkeyhq/kit-bg/src/states/jotai/atoms';

import { ProviderJotaiContextEarn } from '../../states/jotai/contexts/earn';

export function useEarnContextStoreInitData(
  storeName: EJotaiContextStoreNames,
) {
  const data = useMemo(
    () => ({
      storeName,
    }),
    [storeName],
  );
  return data;
}

export const EarnProvider = memo(() => {
  const data = useEarnContextStoreInitData(EJotaiContextStoreNames.earn);
  const store = useJotaiContextRootStore(data);
  return <ProviderJotaiContextEarn store={store} />;
});
EarnProvider.displayName = 'EarnProvider';
