import { useCallback, useEffect } from 'react';

import { useIntl } from 'react-intl';

import { YStack } from '@unionkeyhq/components';
import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import { ListItem } from '@unionkeyhq/kit/src/components/ListItem';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import { usePromiseResult } from '@unionkeyhq/kit/src/hooks/usePromiseResult';
import { useShowAddressBook } from '@unionkeyhq/kit/src/hooks/useShowAddressBook';
import { useBackupEntryStatus } from '@unionkeyhq/kit/src/views/CloudBackup/components/useBackupEntryStatus';
import { usePasswordPersistAtom } from '@unionkeyhq/kit-bg/src/states/jotai/atoms';
import {
  EAppEventBusNames,
  appEventBus,
} from '@unionkeyhq/shared/src/eventBus/appEventBus';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import { defaultLogger } from '@unionkeyhq/shared/src/logger/logger';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import {
  ECloudBackupRoutes,
  EDAppConnectionModal,
  ELiteCardRoutes,
  EModalKeyTagRoutes,
  EModalRoutes,
} from '@unionkeyhq/shared/src/routes';

export const useOnLock = () => {
  const [passwordSetting] = usePasswordPersistAtom();
  const onLock = useCallback(async () => {
    if (passwordSetting.isPasswordSet) {
      await backgroundApiProxy.servicePassword.lockApp();
    } else {
      await backgroundApiProxy.servicePassword.promptPasswordVerify();
      await backgroundApiProxy.servicePassword.lockApp();
    }
    defaultLogger.setting.page.lockNow();
  }, [passwordSetting.isPasswordSet]);
  return onLock;
};

const AddressBookItem = () => {
  const intl = useIntl();
  const onPress = useShowAddressBook({
    useNewModal: false,
  });
  return (
    <ListItem
      icon="ContactsOutline"
      title={intl.formatMessage({ id: ETranslations.settings_address_book })}
      drillIn
      onPress={onPress}
      testID="setting-address-book"
    />
  );
};

const LockNowButton = () => {
  const intl = useIntl();
  const onLock = useOnLock();
  const navigation = useAppNavigation();
  const handlePress = useCallback(() => {
    void onLock();
    setTimeout(() => {
      navigation.popStack();
    }, 0);
  }, [navigation, onLock]);
  return (
    <ListItem
      icon="LockOutline"
      title={intl.formatMessage({ id: ETranslations.settings_lock_now })}
      onPress={handlePress}
    />
  );
};

const DefaultWalletSetting = () => {
  const intl = useIntl();
  const navigation = useAppNavigation();
  const { result, isLoading, run } = usePromiseResult(
    async () =>
      backgroundApiProxy.serviceContextMenu.getDefaultWalletSettingsWithIcon(),
    [],
    { checkIsFocused: false },
  );
  useEffect(() => {
    appEventBus.addListener(EAppEventBusNames.ExtensionContextMenuUpdate, run);
    return () => {
      appEventBus.removeListener(
        EAppEventBusNames.ExtensionContextMenuUpdate,
        run,
      );
    };
  }, [run]);
  return (
    <ListItem
      icon="ThumbtackOutline"
      title={intl.formatMessage({
        id: ETranslations.settings_default_wallet_settings,
      })}
      drillIn
      onPress={() => {
        navigation.pushModal(EModalRoutes.DAppConnectionModal, {
          screen: EDAppConnectionModal.DefaultWalletSettingsModal,
        });
      }}
    >
      {isLoading ? null : (
        <ListItem.Text
          primary={
            result?.isDefaultWallet
              ? intl.formatMessage({ id: ETranslations.global_on })
              : intl.formatMessage({ id: ETranslations.global_off })
          }
          align="right"
        />
      )}
    </ListItem>
  );
};

export const DefaultSection = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const intl = useIntl();
  const navigation = useAppNavigation();
  const backupEntryStatus = useBackupEntryStatus();
  return (
    <YStack>
      <LockNowButton />
      {platformEnv.isExtension ? <DefaultWalletSetting /> : null}
      <AddressBookItem />
      {platformEnv.isNative ? (
        <ListItem
          icon="RepeatOutline"
          title={intl.formatMessage({
            id: platformEnv.isNativeAndroid
              ? ETranslations.settings_google_drive_backup
              : ETranslations.settings_icloud_backup,
          })}
          drillIn
          onPress={async () => {
            await backupEntryStatus.check();
            defaultLogger.setting.page.enterBackup();
            navigation.pushModal(EModalRoutes.CloudBackupModal, {
              screen: ECloudBackupRoutes.CloudBackupHome,
            });
          }}
        />
      ) : null}
      {/* {platformEnv.isNative ? (
        <ListItem
          icon="UnionKeyLiteOutline"
          title={intl.formatMessage({ id: ETranslations.global_unionkey_lite })}
          drillIn
          onPress={() => {
            navigation.pushModal(EModalRoutes.LiteCardModal, {
              screen: ELiteCardRoutes.LiteCardHome,
            });
          }}
        />
      ) : null} */}
      <ListItem
        icon="UnionKeyKeytagOutline"
        title={intl.formatMessage({ id: ETranslations.global_unionkey_keytag })}
        drillIn
        onPress={() => {
          defaultLogger.setting.page.enterKeyTag();
          navigation.pushModal(EModalRoutes.KeyTagModal, {
            screen: EModalKeyTagRoutes.UserOptions,
          });
        }}
      />
    </YStack>
  );
};
