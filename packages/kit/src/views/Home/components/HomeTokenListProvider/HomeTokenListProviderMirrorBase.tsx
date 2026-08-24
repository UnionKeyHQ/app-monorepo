import { memo } from 'react';
import type { PropsWithChildren } from 'react';

import { ProviderJotaiContextTokenList } from '@unionkeyhq/kit/src/states/jotai/contexts/tokenList/atoms';
import { jotaiContextStore } from '@unionkeyhq/kit/src/states/jotai/utils/jotaiContextStore';
import { JotaiContextStoreMirrorTracker } from '@unionkeyhq/kit/src/states/jotai/utils/JotaiContextStoreMirrorTracker';

export const HomeTokenListProviderMirrorBase = memo(
  (
    props: PropsWithChildren<{
      data: any;
    }>,
  ) => {
    const { children } = props;

    const store = jotaiContextStore.getOrCreateStore(props.data);

    return (
      <>
        <JotaiContextStoreMirrorTracker {...props.data} />
        <ProviderJotaiContextTokenList store={store}>
          {children}
        </ProviderJotaiContextTokenList>
      </>
    );
  },
);
HomeTokenListProviderMirrorBase.displayName = 'HomeTokenListProviderMirrorBase';
