import { useCallback } from 'react';

import { HeaderIconButton } from '@unionkeyhq/components/src/layouts/Navigation/Header';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import {
  EDiscoveryModalRoutes,
  EModalRoutes,
} from '@unionkeyhq/shared/src/routes';

export function HistoryIconButton() {
  const navigation = useAppNavigation();

  const handlePress = useCallback(() => {
    navigation.pushModal(EModalRoutes.DiscoveryModal, {
      screen: EDiscoveryModalRoutes.HistoryListModal,
    });
  }, [navigation]);

  return (
    <HeaderIconButton
      icon="ClockTimeHistoryOutline"
      titlePlacement="bottom"
      onPress={handlePress}
      testID="browser-history-button"
    />
  );
}

export default HistoryIconButton;
