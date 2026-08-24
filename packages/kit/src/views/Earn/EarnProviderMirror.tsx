import { type PropsWithChildren, memo } from 'react';

import { jotaiContextStore } from '@unionkeyhq/kit/src/states/jotai/utils/jotaiContextStore';
import { JotaiContextStoreMirrorTracker } from '@unionkeyhq/kit/src/states/jotai/utils/JotaiContextStoreMirrorTracker';
import type { EJotaiContextStoreNames } from '@unionkeyhq/kit-bg/src/states/jotai/atoms';

import { ProviderJotaiContextEarn } from '../../states/jotai/contexts/earn';

import { useEarnContextStoreInitData } from './EarnProvider';

export const EarnProviderMirror = memo(
  (props: PropsWithChildren & { storeName: EJotaiContextStoreNames }) => {
    const { children, storeName } = props;

    const data = useEarnContextStoreInitData(storeName);
    const store = jotaiContextStore.getOrCreateStore(data);

    return (
      <>
        <JotaiContextStoreMirrorTracker {...data} />
        <ProviderJotaiContextEarn store={store}>
          {children}
        </ProviderJotaiContextEarn>
      </>
    );
  },
);
EarnProviderMirror.displayName = 'EarnProviderMirror';
