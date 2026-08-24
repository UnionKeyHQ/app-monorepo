import { useMemo } from 'react';

import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import type { IOnboardingParamList } from '@unionkeyhq/shared/src/routes';
import {
  EModalRoutes,
  EOnboardingPages,
  ERootRoutes,
} from '@unionkeyhq/shared/src/routes';

export const isOnboardingFromExtensionUrl = () => {
  // eslint-disable-next-line unicorn/prefer-global-this
  if (platformEnv.isExtension && typeof window !== 'undefined') {
    return globalThis.location.hash.includes('fromExt=true');
  }
  return false;
};

export const useToOnBoardingPage = () => {
  const navigation = useAppNavigation();

  return useMemo(
    () =>
      async ({
        isFullModal = false,
        params,
      }: {
        isFullModal?: boolean;
        params?: IOnboardingParamList[EOnboardingPages.GetStarted];
      } = {}) => {
        if (
          platformEnv.isExtensionUiPopup ||
          platformEnv.isExtensionUiSidePanel
        ) {
          await backgroundApiProxy.serviceApp.openExtensionExpandTab({
            routes: [
              isFullModal ? ERootRoutes.iOSFullScreen : ERootRoutes.Modal,
              EModalRoutes.OnboardingModal,
              EOnboardingPages.GetStarted,
            ],
            params: {
              ...params,
              isFullModal,
              fromExt: true,
            },
          });
          if (platformEnv.isExtensionUiSidePanel) {
            window.close();
          }
        } else {
          navigation[isFullModal ? 'pushFullModal' : 'pushModal'](
            EModalRoutes.OnboardingModal,
            {
              screen: EOnboardingPages.GetStarted,
              params: {
                ...params,
                isFullModal,
              },
            },
          );
        }
      },
    [navigation],
  );
};
