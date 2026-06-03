import { useIntl } from 'react-intl';

import { Button } from '@unionkey/components';
import type { IButtonProps } from '@unionkey/components';
import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';
import { ETranslations } from '@unionkey/shared/src/locale';

function NotificationsTestButton({ ...rest }: IButtonProps) {
  const intl = useIntl();
  return (
    <Button
      onPress={() => {
        void backgroundApiProxy.serviceNotification.showNotification({
          title: intl.formatMessage({
            id: ETranslations.notifications_test_message_title,
          }),
          description: intl.formatMessage({
            id: ETranslations.notifications_test_message_desc,
          }),
        });
      }}
      {...rest}
    >
      {intl.formatMessage({ id: ETranslations.global_test })}
    </Button>
  );
}

export default NotificationsTestButton;
