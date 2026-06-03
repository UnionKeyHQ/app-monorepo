import { Suspense, useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { Dialog } from '@unionkey/components';
import type { IPageNavigationProp } from '@unionkey/components/src/layouts/Navigation';
import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';
import { UniversalContainerWithSuspense } from '@unionkey/kit/src/components/BiologyAuthComponent/container/UniversalContainer';
import { ListItem } from '@unionkey/kit/src/components/ListItem';
import PasswordUpdateContainer from '@unionkey/kit/src/components/Password/container/PasswordUpdateContainer';
import { Section } from '@unionkey/kit/src/components/Section';
import useAppNavigation from '@unionkey/kit/src/hooks/useAppNavigation';
import { useBiometricAuthInfo } from '@unionkey/kit/src/hooks/useBiometricAuthInfo';
import {
  usePasswordBiologyAuthInfoAtom,
  usePasswordPersistAtom,
  usePasswordWebAuthInfoAtom,
} from '@unionkey/kit-bg/src/states/jotai/atoms/password';
import { ETranslations } from '@unionkey/shared/src/locale';
import platformEnv from '@unionkey/shared/src/platformEnv';
import type { IModalSettingParamList } from '@unionkey/shared/src/routes';
import {
  EDAppConnectionModal,
  EModalRoutes,
  EModalSettingRoutes,
} from '@unionkey/shared/src/routes';
import { EReasonForNeedPassword } from '@unionkey/shared/types/setting';

import { useOptions } from '../../AppAutoLock/useOptions';

import { CleanDataItem } from './CleanDataItem';

const AppAutoLockItem = () => {
  const [{ isPasswordSet, appLockDuration }] = usePasswordPersistAtom();
  const navigation =
    useAppNavigation<IPageNavigationProp<IModalSettingParamList>>();
  const onPress = useCallback(() => {
    navigation.push(EModalSettingRoutes.SettingAppAutoLockModal);
  }, [navigation]);
  const intl = useIntl();
  const options = useOptions();
  const text = useMemo(() => {
    const option = options.find(
      (item) => item.value === String(appLockDuration),
    );
    return option?.title ?? '';
  }, [options, appLockDuration]);
  return isPasswordSet ? (
    <ListItem
      onPress={onPress}
      icon="ClockTimeHistoryOutline"
      title={intl.formatMessage({ id: ETranslations.settings_auto_lock })}
      drillIn
    >
      <ListItem.Text primary={text} align="right" />
    </ListItem>
  ) : null;
};

const SetPasswordItem = () => {
  const intl = useIntl();
  return (
    <ListItem
      testID="setting-set-password"
      onPress={() => {
        void backgroundApiProxy.servicePassword.promptPasswordVerify();
      }}
      icon="KeyOutline"
      title={intl.formatMessage({ id: ETranslations.global_set_passcode })}
      drillIn
    />
  );
};

const ChangePasswordItem = () => {
  const intl = useIntl();
  const onPress = useCallback(async () => {
    const oldEncodedPassword =
      await backgroundApiProxy.servicePassword.promptPasswordVerify({
        reason: EReasonForNeedPassword.Security,
      });
    const dialog = Dialog.show({
      title: intl.formatMessage({ id: ETranslations.global_change_passcode }),
      renderContent: (
        <PasswordUpdateContainer
          oldEncodedPassword={oldEncodedPassword.password}
          onUpdateRes={async (data) => {
            if (data) {
              await dialog.close();
            }
          }}
        />
      ),
      showFooter: false,
    });
  }, [intl]);
  return (
    <ListItem
      onPress={onPress}
      icon="KeyOutline"
      title={intl.formatMessage({ id: ETranslations.global_change_passcode })}
      drillIn
    />
  );
};

const PasswordItem = () => {
  const [{ isPasswordSet }] = usePasswordPersistAtom();
  return isPasswordSet ? <ChangePasswordItem /> : <SetPasswordItem />;
};

const FaceIdItem = () => {
  const [{ isPasswordSet }] = usePasswordPersistAtom();
  const [{ isSupport: biologyAuthIsSupport }] =
    usePasswordBiologyAuthInfoAtom();
  const [{ isSupport: webAuthIsSupport }] = usePasswordWebAuthInfoAtom();
  const { title, icon } = useBiometricAuthInfo();

  return isPasswordSet && (biologyAuthIsSupport || webAuthIsSupport) ? (
    <ListItem icon={icon} title={title}>
      <UniversalContainerWithSuspense />
    </ListItem>
  ) : null;
};

const ProtectionItem = () => {
  const intl = useIntl();
  const navigation =
    useAppNavigation<IPageNavigationProp<IModalSettingParamList>>();
  const onPress = useCallback(() => {
    navigation.push(EModalSettingRoutes.SettingProtectModal);
  }, [navigation]);
  return (
    <ListItem
      onPress={onPress}
      icon="ShieldCheckDoneOutline"
      title={intl.formatMessage({ id: ETranslations.settings_protection })}
      drillIn
    />
  );
};

const ConnectedSitesItem = () => {
  const intl = useIntl();
  const navigation =
    useAppNavigation<IPageNavigationProp<IModalSettingParamList>>();
  const onPress = useCallback(() => {
    navigation.pushModal(EModalRoutes.DAppConnectionModal, {
      screen: EDAppConnectionModal.ConnectionList,
    });
  }, [navigation]);
  return (
    <ListItem
      title={intl.formatMessage({ id: ETranslations.settings_connected_sites })}
      icon="LinkOutline"
      drillIn
      onPress={onPress}
    />
  );
};

const SignatureRecordItem = () => {
  const intl = useIntl();
  const navigation =
    useAppNavigation<IPageNavigationProp<IModalSettingParamList>>();
  const onPress = useCallback(() => {
    navigation.push(EModalSettingRoutes.SettingSignatureRecordModal);
  }, [navigation]);
  return (
    <ListItem
      onPress={onPress}
      icon="NoteOutline"
      title={intl.formatMessage({
        id: ETranslations.settings_signature_record,
      })}
      drillIn
    />
  );
};

function FloatingIcon() {
  const intl = useIntl();
  const navigation =
    useAppNavigation<IPageNavigationProp<IModalSettingParamList>>();
  const onPress = useCallback(() => {
    navigation.push(EModalSettingRoutes.SettingFloatingIconModal);
  }, [navigation]);
  return (
    <ListItem
      onPress={onPress}
      icon="MenuCircleHorOutline"
      title={intl.formatMessage({ id: ETranslations.setting_floating_icon })}
      drillIn
    />
  );
}

export function SecuritySection() {
  const intl = useIntl();
  return (
    <Section title={intl.formatMessage({ id: ETranslations.global_security })}>
      <Suspense fallback={null}>
        <FaceIdItem />
      </Suspense>
      <AppAutoLockItem />
      <PasswordItem />
      {!platformEnv.isWebDappMode ? <ConnectedSitesItem /> : null}
      {platformEnv.isExtension ? <FloatingIcon /> : null}
      <SignatureRecordItem />
      <ProtectionItem />
      <CleanDataItem />
    </Section>
  );
}
