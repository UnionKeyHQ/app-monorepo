import { useIntl } from 'react-intl';

import { Alert } from '@unionkeyhq/components';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';

export function FirmwareUpdateAlertInfoMessage() {
  const intl = useIntl();
  return (
    <Alert
      type="info"
      title={intl.formatMessage({
        id: platformEnv.isNative
          ? ETranslations.update_keep_bluetooth_connected_and_app_active
          : ETranslations.update_keep_usb_connected_and_app_active,
      })}
      icon="InfoCircleOutline"
    />
  );
}
