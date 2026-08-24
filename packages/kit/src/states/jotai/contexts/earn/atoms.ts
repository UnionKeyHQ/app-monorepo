import memoizee from 'memoizee';

import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import {
  atom,
  createJotaiContext,
} from '@unionkeyhq/kit/src/states/jotai/utils/createJotaiContext';
import type { IEarnPermitCache } from '@unionkeyhq/shared/types/earn';
import type { IEarnAtomData } from '@unionkeyhq/shared/types/staking';

const {
  Provider: ProviderJotaiContextEarn,
  contextAtom,
  contextAtomMethod,
} = createJotaiContext();
export { ProviderJotaiContextEarn, contextAtomMethod };

export const { atom: basicEarnAtom, useContextAtom } =
  contextAtom<IEarnAtomData>({ earnAccount: {}, availableAssets: [] });

export const { atom: earnStorageReadyAtom, use: useEarnStorageReadyAtom } =
  contextAtom<boolean>(false);

const INIT = Symbol('INIT');
export const earnAtom = memoizee(() =>
  atom(
    (get) => ({
      ...get(basicEarnAtom()),
      isMounted: get(earnStorageReadyAtom()),
    }),
    (get, set, arg: any) => {
      if (arg === INIT) {
        void backgroundApiProxy.simpleDb.earn.getEarnData().then((data) => {
          set(basicEarnAtom(), {
            ...data,
            earnAccount: data.earnAccount || {},
          });
          set(earnStorageReadyAtom(), true);
        });
      } else {
        set(basicEarnAtom(), arg);
      }
    },
  ),
);

earnAtom().onMount = (setAtom) => {
  setAtom(INIT);
};

export const { atom: earnPermitCacheAtom, use: useEarnPermitCacheAtom } =
  contextAtom<Record<string, IEarnPermitCache>>({});

export const useEarnAtom = () => useContextAtom(earnAtom());
