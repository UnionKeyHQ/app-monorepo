import { useCallback } from 'react';

import { useIntl } from 'react-intl';
import { ImageBackground } from 'react-native';

import {
  Button,
  Icon,
  Page,
  SizableText,
  Stack,
  YStack,
  useMedia,
} from '@unionkey/components';
import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';
import { ListItem } from '@unionkey/kit/src/components/ListItem';
import useAppNavigation from '@unionkey/kit/src/hooks/useAppNavigation';
import { UNIONKEY_KEY_TAG_PURCHASE_URL } from '@unionkey/shared/src/config/appConfig';
import { ETranslations } from '@unionkey/shared/src/locale';
import { defaultLogger } from '@unionkey/shared/src/logger/logger';
import platformEnv from '@unionkey/shared/src/platformEnv';
import {
  EModalKeyTagRoutes,
  EModalRoutes,
  EOnboardingPages,
} from '@unionkey/shared/src/routes';
import { openUrlExternal } from '@unionkey/shared/src/utils/openUrlUtils';

const UserOptions = () => {
  const md = useMedia();
  const intl = useIntl();
  const navigation = useAppNavigation();
  const onBackup = useCallback(() => {
    navigation.pushModal(EModalRoutes.KeyTagModal, {
      screen: EModalKeyTagRoutes.BackupWallet,
    });
  }, [navigation]);
  const onImport = useCallback(async () => {
    await backgroundApiProxy.servicePassword.promptPasswordVerify();
    defaultLogger.setting.page.keyTagImport();
    navigation.pushModal(EModalRoutes.OnboardingModal, {
      screen: EOnboardingPages.ImportKeyTag,
    });
  }, [navigation]);
  const onGetOne = useCallback(() => {
    openUrlExternal(UNIONKEY_KEY_TAG_PURCHASE_URL);
  }, []);
  return (
    <Page>
      <Page.Header title="UnionKey KeyTag" />
      <Page.Body>
        <Stack mx="$5" mt="$2" mb="$5" borderRadius="$3">
          <Stack borderRadius={12} overflow="hidden">
            <ImageBackground
              resizeMode="stretch"
              source={
                md.md
                  ? require('@unionkey/kit/assets/keytag/keytag_banner1.png')
                  : require('@unionkey/kit/assets/keytag/keytag_banner0.png')
              }
            >
              <Stack px="$5" pt="$9" pb="$6">
                <SizableText size="$headingXl" color="rgba(0, 0, 0, 0.95)">
                  {intl.formatMessage({
                    id: ETranslations.global_unionkey_keytag,
                  })}
                </SizableText>
                <SizableText size="$bodyMd" color="rgba(0, 0, 0, 0.6)" pr={130}>
                  {intl.formatMessage({
                    id: ETranslations.settings_unionkey_keytag_desc,
                  })}
                </SizableText>
                <Button
                  bg="rgba(0, 0, 0, 0.95)"
                  mt="$6"
                  alignSelf="flex-start"
                  size="small"
                  color="white"
                  iconAfter="OpenOutline"
                  iconColor="white"
                  focusVisibleStyle={{ bg: 'rgba(0, 0, 0, 0.75)' }}
                  hoverStyle={{ bg: 'rgba(0, 0, 0, 0.75)' }}
                  onPress={onGetOne}
                >
                  {intl.formatMessage({ id: ETranslations.global_get_one })}
                </Button>
              </Stack>
            </ImageBackground>
          </Stack>
        </Stack>
        {!platformEnv.isWebDappMode ? (
          <YStack>
            <ListItem
              icon="FolderUploadOutline"
              title={intl.formatMessage({ id: ETranslations.global_backup })}
              subtitle={intl.formatMessage({
                id: ETranslations.settings_backup_recovery_phrase_to_unionkey_keytag,
              })}
              drillIn
              onPress={onBackup}
              renderIcon={
                <Stack bg="$bgStrong" p="$2" borderRadius="$3">
                  <Icon name="FolderUploadOutline" size="$6" color="$icon" />
                </Stack>
              }
            />
            <ListItem
              icon="FolderDownloadOutline"
              title={intl.formatMessage({ id: ETranslations.global_import })}
              subtitle={intl.formatMessage({
                id: ETranslations.settings_import_recovery_phrase_from_unionkey_keytag,
              })}
              drillIn
              onPress={onImport}
              renderIcon={
                <Stack bg="$bgStrong" p="$2" borderRadius="$3">
                  <Icon name="FolderDownloadOutline" size="$6" color="$icon" />
                </Stack>
              }
            />
          </YStack>
        ) : null}
      </Page.Body>
    </Page>
  );
};

export default UserOptions;
