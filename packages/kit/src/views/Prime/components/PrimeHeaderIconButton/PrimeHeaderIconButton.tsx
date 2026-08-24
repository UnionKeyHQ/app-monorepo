import { useCallback, useMemo, useState } from 'react';

import { HeaderIconButton, Stack, Toast } from '@unionkeyhq/components';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import { useThemeVariant } from '@unionkeyhq/kit/src/hooks/useThemeVariant';
import { EModalRoutes } from '@unionkeyhq/shared/src/routes';
import { EPrimePages } from '@unionkeyhq/shared/src/routes/prime';

import { usePrimeAuthV2 } from '../../hooks/usePrimeAuthV2';

export function PrimeHeaderIconButton({
  onPress,
}: {
  onPress?: () => void | Promise<void>;
}) {
  const { isReady, user } = usePrimeAuthV2();
  const isPrime = user?.primeSubscription?.isActive;

  const navigation = useAppNavigation();
  const [isHover, setIsHover] = useState(false);
  const themeVariant = useThemeVariant();

  const icon = useMemo(() => {
    if (isPrime && user?.privyUserId) {
      return themeVariant === 'light'
        ? 'UnionKeyPrimeLightColored'
        : 'UnionKeyPrimeDarkColored';
    }
    return 'PrimeOutline';
  }, [isPrime, themeVariant, user?.privyUserId]);

  const onPrimeButtonPressed = useCallback(async () => {
    if (onPress) {
      await onPress();
    }

    navigation.pushFullModal(EModalRoutes.PrimeModal, {
      screen: EPrimePages.PrimeDashboard,
    });

    setIsHover(false);
  }, [onPress, navigation]);

  return (
    <Stack testID="headerRightPrimeButton">
      <HeaderIconButton
        onPointerEnter={() => setIsHover(true)}
        onPointerLeave={() => setIsHover(false)}
        title="Prime"
        icon={icon}
        tooltipProps={{
          open: isHover,
        }}
        onPress={onPrimeButtonPressed}
      />
    </Stack>
  );
}
