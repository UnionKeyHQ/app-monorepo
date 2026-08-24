import { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { SearchBar, Shortcut, View, XStack } from '@unionkeyhq/components';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import { EModalRoutes } from '@unionkeyhq/shared/src/routes';
import { EUniversalSearchPages } from '@unionkeyhq/shared/src/routes/universalSearch';
import { EShortcutEvents } from '@unionkeyhq/shared/src/shortcuts/shortcuts.enum';

export function MarketHomeHeaderSearchBar() {
  const intl = useIntl();
  const navigation = useAppNavigation();
  const toUniversalSearchPage = useCallback(() => {
    navigation.pushModal(EModalRoutes.UniversalSearchModal, {
      screen: EUniversalSearchPages.UniversalSearch,
    });
  }, [navigation]);

  return (
    <XStack $gtSm={{ width: 184 }}>
      <SearchBar
        placeholder={intl.formatMessage({
          id: ETranslations.global_search,
        })}
        containerProps={{ w: '100%' }}
        $gtMd={{ size: 'small' }}
        key="MarketHomeSearchInput"
        addOns={[
          {
            label: <Shortcut shortcutKey={EShortcutEvents.UniversalSearch} />,
          },
        ]}
      />
      <View
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        onPress={toUniversalSearchPage}
      />
    </XStack>
  );
}
