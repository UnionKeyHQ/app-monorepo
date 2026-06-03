import { useIntl } from 'react-intl';

import { ActionList } from '@unionkey/components';
import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';
import type {
  IDBAccount,
  IDBIndexedAccount,
} from '@unionkey/kit-bg/src/dbs/local/types';
import { ETranslations } from '@unionkey/shared/src/locale';

export function AccountMoveToTopButton({
  indexedAccount,
  firstIndexedAccount,
  account,
  firstAccount,
  onClose,
}: {
  indexedAccount?: IDBIndexedAccount;
  firstIndexedAccount?: IDBIndexedAccount;
  account?: IDBAccount;
  firstAccount?: IDBAccount;
  onClose: () => void;
}) {
  const intl = useIntl();
  if (
    (indexedAccount?.id && firstIndexedAccount?.id === indexedAccount?.id) ||
    (account?.id && firstAccount?.id === account?.id)
  ) {
    return null;
  }
  return (
    <ActionList.Item
      icon="AlignTopOutline"
      label={intl.formatMessage({ id: ETranslations.market_move_to_top })}
      onClose={onClose}
      onPress={async () => {
        if (indexedAccount) {
          await backgroundApiProxy.serviceAccount.insertIndexedAccountOrder({
            targetIndexedAccountId: indexedAccount?.id,
            startIndexedAccountId: undefined,
            endIndexedAccountId: firstIndexedAccount?.id,
            emitEvent: true,
          });
        } else if (account) {
          await backgroundApiProxy.serviceAccount.insertAccountOrder({
            targetAccountId: account?.id,
            startAccountId: undefined,
            endAccountId: firstAccount?.id,
            emitEvent: true,
          });
        }
      }}
    />
  );
}
