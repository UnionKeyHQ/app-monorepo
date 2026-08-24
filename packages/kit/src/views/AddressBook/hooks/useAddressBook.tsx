import { useCallback } from 'react';

import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import { usePromiseResult } from '@unionkeyhq/kit/src/hooks/usePromiseResult';
import { useAddressBookPersistAtom } from '@unionkeyhq/kit-bg/src/states/jotai/atoms/addressBooks';
import {
  EModalAddressBookRoutes,
  EModalRoutes,
} from '@unionkeyhq/shared/src/routes';
import { noopObject } from '@unionkeyhq/shared/src/utils/miscUtils';

import type { IAddressItem } from '../type';

export const useAddressBookItems = (networkId?: string, exact?: boolean) => {
  const [{ updateTimestamp }] = useAddressBookPersistAtom();
  return usePromiseResult(
    async () => {
      const { password } =
        await backgroundApiProxy.servicePassword.promptPasswordVerify();
      if (!password) {
        return {
          isSafe: false,
          items: [],
        };
      }
      noopObject(updateTimestamp);
      noopObject(networkId);
      return backgroundApiProxy.serviceAddressBook.getSafeItems({
        networkId,
        exact,
        password,
      });
    },
    [updateTimestamp, networkId, exact],
    { watchLoading: true },
  );
};

export const useAddressBookPick = () => {
  const navigation = useAppNavigation();
  return useCallback(
    async (params: {
      onPick?: (item: IAddressItem) => void;
      networkId?: string;
    }) => {
      navigation.pushModal(EModalRoutes.AddressBookModal, {
        screen: EModalAddressBookRoutes.PickItemModal,
        params,
      });
    },
    [navigation],
  );
};
