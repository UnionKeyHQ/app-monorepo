import type { IManageTokensListingResult } from '@unionkeyhq/kit-bg/src/services/ServiceToken';

import { atom, createJotaiContext } from '../../store/jotai/createJotaiContext';

export const atomMangeTokensLoading = atom<boolean>(false);
export const atomMangeTokensSearch = atom<string>('');
export const atomMangeTokensTS = atom<number>(Date.now());
export const atomMangeTokensList = atom<IManageTokensListingResult>([]);

const {
  withProvider: withProviderManageTokens,
  useContextAtom: useAtomManageTokens,
} = createJotaiContext();

export { useAtomManageTokens, withProviderManageTokens };
