import { useCallback, useState } from 'react';

import { useIntl } from 'react-intl';

import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';
import { AccountSelectorProviderMirror } from '@unionkey/kit/src/components/AccountSelector';
import { usePromiseResult } from '@unionkey/kit/src/hooks/usePromiseResult';
import { useWalletBoundReferralCode } from '@unionkey/kit/src/views/ReferFriends/hooks/useWalletBoundReferralCode';
import type { IDBWallet } from '@unionkey/kit-bg/src/dbs/local/types';
import { ETranslations } from '@unionkey/shared/src/locale';
import { EAccountSelectorSceneName } from '@unionkey/shared/types';

import { WalletOptionItem } from './WalletOptionItem';

function WalletBoundReferralCodeButtonView({
  wallet,
}: {
  wallet: IDBWallet | undefined;
}) {
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const { bindWalletInviteCode, getReferralCodeBondStatus } =
    useWalletBoundReferralCode({
      entry: 'modal',
    });

  const {
    result: displayReferralCodeButton,
    run: refreshDisplayReferralCodeButton,
  } = usePromiseResult(
    async () => {
      const referralCodeInfo =
        await backgroundApiProxy.serviceReferralCode.getWalletReferralCode({
          walletId: wallet?.id || '',
        });
      return referralCodeInfo?.walletId && !referralCodeInfo?.isBound;
    },
    [wallet?.id],
    {
      initResult: false,
    },
  );

  const handlePress = useCallback(async () => {
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      const shouldBound = await getReferralCodeBondStatus(wallet?.id);
      if (!shouldBound) {
        return;
      }
      bindWalletInviteCode({
        wallet,
        onSuccess: () =>
          setTimeout(() => refreshDisplayReferralCodeButton(), 200),
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    bindWalletInviteCode,
    getReferralCodeBondStatus,
    wallet,
    refreshDisplayReferralCodeButton,
    isLoading,
  ]);

  if (!displayReferralCodeButton) {
    return null;
  }

  // return (
  //   <WalletOptionItem
  //     testID="wallet-bound-referral-code-button"
  //     icon="GiftOutline"
  //     label={intl.formatMessage({
  //       id: ETranslations.referral_wallet_edit_code,
  //     })}
  //     onPress={handlePress}
  //     isLoading={isLoading}
  //   />
  // );zyfshr
}

export function WalletBoundReferralCodeButton({
  wallet,
}: {
  wallet: IDBWallet | undefined;
}) {
  return (
    <AccountSelectorProviderMirror
      config={{
        sceneName: EAccountSelectorSceneName.home,
      }}
      enabledNum={[0]}
    >
      <WalletBoundReferralCodeButtonView wallet={wallet} />
    </AccountSelectorProviderMirror>
  );
}
