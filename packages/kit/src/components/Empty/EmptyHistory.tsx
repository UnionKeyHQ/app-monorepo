import { useIntl } from 'react-intl';

import { Empty } from '@unionkey/components';
import { ETranslations } from '@unionkey/shared/src/locale';

function EmptyHistory() {
  const intl = useIntl();

  return (
    <Empty
      testID="Wallet-No-History-Empty"
      icon="ClockTimeHistoryOutline"
      title={intl.formatMessage({ id: ETranslations.no_transaction_title })}
      description={intl.formatMessage({
        id: ETranslations.no_transaction_desc,
      })}
    />
  );
}

export { EmptyHistory };
