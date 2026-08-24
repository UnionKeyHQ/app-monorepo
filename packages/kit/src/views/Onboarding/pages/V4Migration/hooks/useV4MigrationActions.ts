import { useCallback, useRef } from 'react';

import { useThrottledCallback } from 'use-debounce';

import { useClipboard, useShare } from '@unionkeyhq/components';
import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import { useV4migrationAtom } from '@unionkeyhq/kit-bg/src/states/jotai/atoms';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import {
  EModalRoutes,
  EOnboardingPages,
  ERootRoutes,
} from '@unionkeyhq/shared/src/routes';
import { stableStringify } from '@unionkeyhq/shared/src/utils/stringUtils';
import timerUtils from '@unionkeyhq/shared/src/utils/timerUtils';

export function useV4MigrationActions() {
  const navigation = useAppNavigation();
  const { copyText } = useClipboard();
  const { shareText } = useShare();

  const [migrationState] = useV4migrationAtom();

  const migrationStateRef = useRef(migrationState);
  migrationStateRef.current = migrationState;

  const openV4MigrationOfExtension = useThrottledCallback(
    async () =>
      backgroundApiProxy.serviceApp.openExtensionExpandTab({
        routes: [
          ERootRoutes.Modal,
          EModalRoutes.OnboardingModal,
          EOnboardingPages.V4MigrationGetStarted,
        ],
        // params,
      }),
    1000,
    {
      leading: true,
      trailing: false,
    },
  );

  const navigateToV4MigrationPage = useCallback(
    async ({ isAutoStartOnMount }: { isAutoStartOnMount?: boolean } = {}) => {
      if (platformEnv.isExtensionUiPopup) {
        await openV4MigrationOfExtension();
        await timerUtils.wait(300);
        window.close();
        return;
      }
      if (await backgroundApiProxy.serviceV4Migration.isAtMigrationPage()) {
        return;
      }
      // TODO navigation.pushFullModal
      navigation.navigate(ERootRoutes.Modal, {
        screen: EModalRoutes.OnboardingModal,
        params: {
          screen: EOnboardingPages.V4MigrationGetStarted,
          params: {
            isAutoStartOnMount,
          },
        },
      });
    },
    [navigation, openV4MigrationOfExtension],
  );

  const copyV4MigrationLogs = useCallback(async () => {
    const logs =
      await backgroundApiProxy.serviceV4Migration.getV4MigrationLogs();
    console.log('getV4MigrationLogs', logs);

    const text = stableStringify(logs);
    try {
      copyText(text);
    } catch (error) {
      //
    }
    try {
      await shareText(text);
    } catch (error) {
      //
    }
  }, [copyText, shareText]);
  // return useMemo(
  //   () => ({
  //     navigateToV4MigrationPage,
  //     openV4MigrationOfExtension,
  //     copyV4MigrationLogs,
  //   }),
  //   [
  //     copyV4MigrationLogs,
  //     navigateToV4MigrationPage,
  //     openV4MigrationOfExtension,
  //   ],
  // );

  return useRef({
    navigateToV4MigrationPage,
    openV4MigrationOfExtension,
    copyV4MigrationLogs,
  }).current;
}
