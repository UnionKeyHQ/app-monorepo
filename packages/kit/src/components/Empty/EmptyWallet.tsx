import { useIntl } from 'react-intl';

import { Empty } from '@unionkey/components';
import { useToOnBoardingPage } from '@unionkey/kit/src/views/Onboarding/hooks/useToOnBoardingPage';
import { ETranslations } from '@unionkey/shared/src/locale';

function EmptyWallet() {
  const intl = useIntl();
  const toOnBoardingPage = useToOnBoardingPage();
  return (
    <Empty
      testID="Wallet-No-Wallet-Empty"
      icon="WalletCryptoOutline"
      title={intl.formatMessage({ id: ETranslations.global_no_wallet })}
      description={intl.formatMessage({
        id: ETranslations.global_no_wallet_desc,
      })}
      buttonProps={{
        children: intl.formatMessage({
          id: ETranslations.global_create_wallet,
        }),
        onPress: () => {
          void toOnBoardingPage();
        },
      }}
    />
  );
}

export { EmptyWallet };
