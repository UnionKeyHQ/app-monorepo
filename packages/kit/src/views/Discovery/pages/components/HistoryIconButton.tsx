import { useCallback } from 'react';

import { HeaderIconButton } from '@unionkey/components/src/layouts/Navigation/Header';
import useAppNavigation from '@unionkey/kit/src/hooks/useAppNavigation';
import {
  EDiscoveryModalRoutes,
  EModalRoutes,
} from '@unionkey/shared/src/routes';

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
