import type { IOverviewAccountdefisResult } from '@unionkeyhq/kit-bg/src/services/ServiceOverview';

import { atom, createJotaiContext } from '../../store/jotai/createJotaiContext';

export const atomHomeOverviewDefiList = atom<
  Pick<IOverviewAccountdefisResult, 'defis' | 'defiKeys'>
>({
  defis: [],
  defiKeys: [],
});

export const atomHomeOverviewDefiValuesMap = atom<
  IOverviewAccountdefisResult['defiValuesMap']
>({});

const { withProvider: withProviderDefiList, useContextAtom: useAtomDefiList } =
  createJotaiContext();

export { withProviderDefiList, useAtomDefiList };
