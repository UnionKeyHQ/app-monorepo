import { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { SearchBar, Shortcut, View, XStack } from '@unionkey/components';
import useAppNavigation from '@unionkey/kit/src/hooks/useAppNavigation';
import { ETranslations } from '@unionkey/shared/src/locale';
import { EModalRoutes } from '@unionkey/shared/src/routes';
import { EUniversalSearchPages } from '@unionkey/shared/src/routes/universalSearch';
import { EShortcutEvents } from '@unionkey/shared/src/shortcuts/shortcuts.enum';

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
