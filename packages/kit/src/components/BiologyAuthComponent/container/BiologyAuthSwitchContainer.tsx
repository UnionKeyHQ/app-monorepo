import { useCallback } from 'react';

import { useIntl } from 'react-intl';

import { Toast } from '@unionkeyhq/components';
import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import { useSettingsPersistAtom } from '@unionkeyhq/kit-bg/src/states/jotai/atoms';
import { usePasswordBiologyAuthInfoAtom } from '@unionkeyhq/kit-bg/src/states/jotai/atoms/password';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';
import { BIOLOGY_AUTH_CANCEL_ERROR } from '@unionkeyhq/shared/types/password';

import { useBiometricAuthInfo } from '../../../hooks/useBiometricAuthInfo';
import BiologyAuthSwitch from '../components/BiologyAuthSwitch';

interface IBiologyAuthSwitchContainerProps {
  skipAuth?: boolean; // only use for password setup
}

const BiologyAuthSwitchContainer = ({
  skipAuth,
}: IBiologyAuthSwitchContainerProps) => {
  const intl = useIntl();
  const { title } = useBiometricAuthInfo();
  const [{ isSupport }] = usePasswordBiologyAuthInfoAtom();
  const [settings] = useSettingsPersistAtom();
  const onChange = useCallback(
    async (checked: boolean) => {
      try {
        await backgroundApiProxy.servicePassword.setBiologyAuthEnable(
          checked,
          skipAuth,
        );
      } catch (e) {
        const error = e as { message?: string; name?: string };
        if (error?.name === BIOLOGY_AUTH_CANCEL_ERROR) {
          Toast.error({
            title: intl.formatMessage(
              {
                id: ETranslations.auth_biometric_cancel,
              },
              { biometric: title },
            ),
          });
          return;
        }
        Toast.error({
          title: intl.formatMessage({
            id: platformEnv.isDesktopWin
              ? ETranslations.global_windows_hello_set_error
              : ETranslations.global_touch_id_set_error,
          }),
        });
      }
    },
    [intl, skipAuth, title],
  );
  return (
    <BiologyAuthSwitch
      isSupport={isSupport}
      isBiologyAuthEnable={settings.isBiologyAuthSwitchOn}
      onChange={onChange}
    />
  );
};
export default BiologyAuthSwitchContainer;
