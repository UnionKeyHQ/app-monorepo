import { useCallback } from 'react';

import { HeaderIconButton } from '@unionkeyhq/components/src/layouts/Navigation/Header';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import { EOnboardingPages } from '@unionkeyhq/shared/src/routes';
import { EModalDeviceManagementRoutes } from '@unionkeyhq/shared/src/routes/deviceManagement';

export function useBuyUnionKeyHeaderRightButton(
  params?:
    | {
        inDeviceManagementStack?: boolean;
      }
    | undefined,
) {
  const navigation = useAppNavigation();

  const toUnionKeyHardwareWalletPage = useCallback(() => {
    if (params?.inDeviceManagementStack) {
      navigation.push(EModalDeviceManagementRoutes.BuyUnionKeyHardwareWallet);
    } else {
      navigation.push(EOnboardingPages.UnionKeyHardwareWallet);
    }
  }, [params?.inDeviceManagementStack, navigation]);

  return {
    headerRight: () => (
      <HeaderIconButton
        icon="QuestionmarkOutline"
        onPress={toUnionKeyHardwareWalletPage}
      />
    ),
    toUnionKeyHardwareWalletPage,
  };
}
