import { memo } from 'react';

import { useIntl } from 'react-intl';

import { Alert, useNetInfo } from '@unionkey/components';
import { ETranslations } from '@unionkey/shared/src/locale';

function BasicNetworkAlert() {
  const { isInternetReachable } = useNetInfo();
  const intl = useIntl();
  return isInternetReachable ? null : (
    <Alert
      type="critical"
      icon="CloudOffOutline"
      title={intl.formatMessage({
        id: ETranslations.feedback_you_are_offline,
      })}
      closable={false}
      fullBleed
    />
  );
}

export const NetworkAlert = memo(BasicNetworkAlert);
