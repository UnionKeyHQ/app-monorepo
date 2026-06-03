import { useIntl } from 'react-intl';

import { Alert } from '@unionkey/components';
import { ETranslations } from '@unionkey/shared/src/locale';
import platformEnv from '@unionkey/shared/src/platformEnv';

export function FirmwareUpdateWarningMessage() {
  const intl = useIntl();
  return (
    <Alert
      type="warning"
      title={intl.formatMessage({
        id: platformEnv.isNative
          ? ETranslations.update_keep_bluetooth_connected_and_app_active
          : ETranslations.update_keep_usb_connected_and_app_active,
      })}
      fullBleed
      mx="$-5"
    />
  );
}
