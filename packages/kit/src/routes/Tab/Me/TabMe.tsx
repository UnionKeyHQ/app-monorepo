import { useCallback } from 'react';

import { Button, Page, YStack } from '@unionkey/components';
import type { IPageNavigationProp } from '@unionkey/components/src/layouts/Navigation';
import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';
import { useToOnBoardingPage } from '@unionkey/kit/src/views/Onboarding/hooks/useToOnBoardingPage';
import platformEnv from '@unionkey/shared/src/platformEnv';
import type { ITabMeParamList } from '@unionkey/shared/src/routes';
import {
  EDAppConnectionModal,
  EModalRoutes,
  EModalSettingRoutes,
  ETabRoutes,
} from '@unionkey/shared/src/routes';
import extUtils, { EXT_HTML_FILES } from '@unionkey/shared/src/utils/extUtils';

import useAppNavigation from '../../../hooks/useAppNavigation';
import { useV4MigrationActions } from '../../../views/Onboarding/pages/V4Migration/hooks/useV4MigrationActions';

const TabMe = () => {
  const navigation = useAppNavigation<IPageNavigationProp<ITabMeParamList>>();
  const onPress = useCallback(() => {
    navigation.pushModal(EModalRoutes.SettingModal, {
      screen: EModalSettingRoutes.SettingListModal,
    });
  }, [navigation]);
  const onExpand = useCallback(() => {
    extUtils.openUrlInTab(EXT_HTML_FILES.uiExpandTab).catch(console.error);
  }, []);
  const toOnBoardingPage = useToOnBoardingPage();
  const { navigateToV4MigrationPage } = useV4MigrationActions();

  return (
    <Page>
      <Page.Body>
        <YStack px="$2" gap="$2">
          <Button
            onPress={() => {
              navigation.switchTab(ETabRoutes.Home);
            }}
          >
            切换到首�?
          </Button>
          <Button
            onPress={() => {
              void toOnBoardingPage({ isFullModal: true });
            }}
          >
            Onboarding
          </Button>
          <Button onPress={onPress} testID="me-settings">
            设置
          </Button>
          {platformEnv.isExtensionUiPopup ? (
            <Button onPress={onExpand}>全屏</Button>
          ) : null}
          <Button
            onPress={() => {
              void backgroundApiProxy.servicePassword.clearCachedPassword();
            }}
          >
            清空缓存密码
          </Button>

          <Button
            onPress={() => {
              navigation.pushModal(EModalRoutes.DAppConnectionModal, {
                screen: EDAppConnectionModal.ConnectionList,
              });
            }}
          >
            DApp 连接管理
          </Button>

          <Button
            onPress={() => {
              void navigateToV4MigrationPage();
            }}
          >
            V4 迁移
          </Button>
          <Button
            onPress={() => {
              void navigateToV4MigrationPage({ isAutoStartOnMount: true });
            }}
          >
            V4 迁移（断点恢复模式）
          </Button>
        </YStack>
      </Page.Body>
    </Page>
  );
};

function TabMeContainer() {
  return <TabMe />;
}

export default TabMeContainer;
