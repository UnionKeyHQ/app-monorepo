import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';
import { createJotaiContext } from '@unionkey/kit/src/states/jotai/utils/createJotaiContext';
import type { IUniversalSearchAtomData } from '@unionkey/shared/types/search';

const {
  Provider: ProviderJotaiContextUniversalSearch,
  contextAtom,
  contextAtomMethod,
} = createJotaiContext();
export { ProviderJotaiContextUniversalSearch, contextAtomMethod };

export const { atom: universalSearchAtom, use: useUniversalSearchAtom } =
  contextAtom<IUniversalSearchAtomData>({ recentSearch: [] });

universalSearchAtom().onMount = (set) => {
  void backgroundApiProxy.simpleDb.universalSearch
    .getData()
    .then((data) => set(data));
};
