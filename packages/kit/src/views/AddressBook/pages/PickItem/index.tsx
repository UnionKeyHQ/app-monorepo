import { useCallback } from 'react';

import { useRoute } from '@react-navigation/core';
import { useIntl } from 'react-intl';

import { IconButton, Page } from '@unionkeyhq/components';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import { IMPL_EVM } from '@unionkeyhq/shared/src/engine/engineConsts';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import { EModalAddressBookRoutes } from '@unionkeyhq/shared/src/routes/addressBook';
import type { IModalAddressBookParamList } from '@unionkeyhq/shared/src/routes/addressBook';
import networkUtils from '@unionkeyhq/shared/src/utils/networkUtils';

import { AddressBookListContent } from '../../components/AddressBookListContent';
import { ContentContainer } from '../../components/ContentContainer';
import { useAddressBookItems } from '../../hooks/useAddressBook';

import type { IAddressItem } from '../../type';
import type { RouteProp } from '@react-navigation/core';

const PickItemPage = () => {
  const intl = useIntl();
  const route =
    useRoute<
      RouteProp<
        IModalAddressBookParamList,
        EModalAddressBookRoutes.PickItemModal
      >
    >();
  const { onPick, networkId } = route.params;
  const { isLoading, result, run } = useAddressBookItems(
    networkId,
    !(networkUtils.getNetworkImpl({ networkId: networkId ?? '' }) === IMPL_EVM),
  );
  const navigation = useAppNavigation();

  const onPressItem = useCallback(
    async (item: IAddressItem) => {
      onPick?.(item);
      navigation.pop();
    },
    [onPick, navigation],
  );

  const onCreate = useCallback(() => {
    navigation.push(EModalAddressBookRoutes.EditItemModal, {
      networkId,
    });
  }, [navigation, networkId]);

  const renderHeaderRightComponent = useCallback(
    () => (
      <IconButton
        variant="tertiary"
        icon="AddPeopleOutline"
        onPress={onCreate}
        testID="address-book-add-icon"
      />
    ),
    [onCreate],
  );
  return (
    <Page>
      <Page.Header
        title={intl.formatMessage({
          id: ETranslations.address_book_select_title,
        })}
        headerRight={renderHeaderRightComponent}
      />
      <Page.Body>
        <ContentContainer
          loading={isLoading}
          error={Boolean(!isLoading && !result)}
          unsafe={Boolean(result && !result.isSafe)}
          onRefresh={run}
        >
          <AddressBookListContent
            onPressItem={onPressItem}
            items={result?.items ?? []}
            hideEmptyAddButton
          />
        </ContentContainer>
      </Page.Body>
    </Page>
  );
};

export default PickItemPage;
