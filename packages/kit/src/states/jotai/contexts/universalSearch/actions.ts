import { useRef } from 'react';

import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';
import { ContextJotaiActionsBase } from '@unionkey/kit/src/states/jotai/utils/ContextJotaiActionsBase';
import { memoFn } from '@unionkey/shared/src/utils/cacheUtils';
import type {
  IIUniversalRecentSearchItem,
  IUniversalSearchAtomData,
} from '@unionkey/shared/types/search';

import { contextAtomMethod, universalSearchAtom } from './atoms';

export const homeResettingFlags: Record<string, number> = {};

const MAX_RECENT_SEARCH_SIZE = 20;
class ContextJotaiActionsRecentSearch extends ContextJotaiActionsBase {
  syncToDb = contextAtomMethod((_, set, payload: IUniversalSearchAtomData) => {
    set(universalSearchAtom(), payload);
    void backgroundApiProxy.simpleDb.universalSearch.setRawData(payload);
  });

  addIntoRecentSearchList = contextAtomMethod(
    (get, set, payload: IIUniversalRecentSearchItem) => {
      const prev = get(universalSearchAtom());
      const newItems = prev.recentSearch.filter(
        (recentSearchItem) => recentSearchItem.text !== payload.text,
      );
      const list = [payload, ...newItems].slice(0, MAX_RECENT_SEARCH_SIZE);
      this.syncToDb.call(set, {
        recentSearch: list,
      });
    },
  );

  clearAllRecentSearch = contextAtomMethod((_, set) => {
    this.syncToDb.call(set, {
      recentSearch: [],
    });
  });
}

const createActions = memoFn(() => new ContextJotaiActionsRecentSearch());

export function useUniversalSearchActions() {
  const actions = createActions();
  const addIntoRecentSearchList = actions.addIntoRecentSearchList.use();
  const clearAllRecentSearch = actions.clearAllRecentSearch.use();

  return useRef({
    addIntoRecentSearchList,
    clearAllRecentSearch,
  });
}
