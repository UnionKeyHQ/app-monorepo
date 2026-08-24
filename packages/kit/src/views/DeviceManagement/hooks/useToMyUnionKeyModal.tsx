import { useCallback, useMemo } from 'react';

import { rootNavigationRef, useMedia } from '@unionkeyhq/components';
import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import {
  EModalDeviceManagementRoutes,
  EModalRoutes,
  EOnboardingPages,
  ERootRoutes,
} from '@unionkeyhq/shared/src/routes';

import useAppNavigation from '../../../hooks/useAppNavigation';

type IDeviceManagementDestination = {
  modalRoute: EModalRoutes;
  screen: EModalDeviceManagementRoutes | EOnboardingPages;
} | null;

async function getDeviceManagementDestination(): Promise<IDeviceManagementDestination> {
  try {
    const allHwQrWallet =
      await backgroundApiProxy.serviceAccount.getAllHwQrWalletWithDevice({
        filterHiddenWallet: true,
      });

    // determine the navigation target based on the query result
    if (Object.keys(allHwQrWallet).length > 0) {
      return {
        modalRoute: EModalRoutes.DeviceManagementModal,
        screen: EModalDeviceManagementRoutes.DeviceListModal,
      };
    }

    return {
      modalRoute: EModalRoutes.OnboardingModal,
      screen: EOnboardingPages.DeviceManagementGuide,
    };
  } catch (error) {
    console.error('Failed to handle device management:', error);
    return null;
  }
}

// use useAppNavigation to navigate
export function useToMyUnionKeyModal() {
  const navigation = useAppNavigation();

  return useCallback(async () => {
    const destination = await getDeviceManagementDestination();
    if (!destination) return;

    const { modalRoute, screen } = destination;
    navigation.pushModal(modalRoute, {
      // @ts-expect-error
      screen,
    });
  }, [navigation]);
}

export const isOpenedMyUnionKeyModal = () => {
  const routeState = rootNavigationRef.current?.getRootState();
  if (routeState?.routes) {
    return routeState.routes.find(
      // @ts-expect-error
      (route) => route.params?.screen === EModalRoutes.DeviceManagementModal,
    );
  }
  return false;
};

// use rootNavigationRef to navigate
export function useToMyUnionKeyModalByRootNavigation() {
  return useCallback(async () => {
    const destination = await getDeviceManagementDestination();
    if (!destination) return;

    const { modalRoute, screen } = destination;
    rootNavigationRef.current?.navigate(ERootRoutes.Modal, {
      screen: modalRoute,
      params: {
        screen,
      },
    });
  }, []);
}

export const useIsShowMyUnionKeyOnTabbar = () => {
  const { gtMd } = useMedia();
  return useMemo(() => gtMd && !platformEnv.isNative, [gtMd]);
};
