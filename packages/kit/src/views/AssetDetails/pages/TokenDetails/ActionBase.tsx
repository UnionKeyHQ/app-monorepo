import { useCallback, useMemo, useState } from 'react';

import { Toast } from '@unionkey/components';
import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';
import { useUserWalletProfile } from '@unionkey/kit/src/hooks/useUserWalletProfile';
import { ActionItem } from '@unionkey/kit/src/views/Home/components/WalletActions/RawActions';
import { WALLET_TYPE_WATCHING } from '@unionkey/shared/src/consts/dbConsts';
import { defaultLogger } from '@unionkey/shared/src/logger/logger';
import platformEnv from '@unionkey/shared/src/platformEnv';
import { openUrlExternal } from '@unionkey/shared/src/utils/openUrlUtils';

import { useSupportToken } from '../../../FiatCrypto/hooks';

import type { IActionBaseProps } from './type';

export const ActionBase = ({
  walletId,
  networkId,
  tokenAddress,
  tokenSymbol,
  type,
  label,
  icon,
  accountId,
  walletType,
  disabled,
  hiddenIfDisabled,
  source,
  ...rest
}: IActionBaseProps) => {
  const [loading, setLoading] = useState(false);
  const { result: isSupported } = useSupportToken(
    networkId,
    tokenAddress,
    type,
  );

  const isDisabled = useMemo(() => {
    if (walletType === WALLET_TYPE_WATCHING && !platformEnv.isDev) {
      return true;
    }

    if (!isSupported) {
      return true;
    }

    return false;
  }, [isSupported, walletType]);

  const { isSoftwareWalletOnlyUser } = useUserWalletProfile();
  const handlePress = useCallback(async () => {
    if (
      await backgroundApiProxy.serviceAccount.checkIsWalletNotBackedUp({
        walletId,
      })
    ) {
      return;
    }

    setLoading(true);

    if (type === 'buy') {
      defaultLogger.wallet.walletActions.buyStarted({
        tokenAddress,
        tokenSymbol,
        networkID: networkId,
      });

      defaultLogger.wallet.walletActions.actionBuy({
        walletType: walletType ?? '',
        networkId: networkId ?? '',
        source,
        isSoftwareWalletOnlyUser,
      });
    } else if (type === 'sell') {
      defaultLogger.wallet.walletActions.actionSell({
        walletType: walletType ?? '',
        networkId: networkId ?? '',
        source,
        isSoftwareWalletOnlyUser,
      });
    }

    try {
      const { url } =
        await backgroundApiProxy.serviceFiatCrypto.generateWidgetUrl({
          networkId,
          tokenAddress,
          accountId,
          type,
        });
      if (!url) {
        Toast.error({ title: 'Failed to get widget url' });
        return;
      }
      openUrlExternal(url);
    } finally {
      setLoading(false);
    }
  }, [
    walletId,
    type,
    tokenAddress,
    tokenSymbol,
    networkId,
    walletType,
    source,
    isSoftwareWalletOnlyUser,
    accountId,
  ]);
  if (hiddenIfDisabled && isDisabled) {
    return null;
  }
  return (
    <ActionItem
      loading={loading}
      label={label}
      icon={icon}
      disabled={disabled || isDisabled}
      onPress={handlePress}
      {...rest}
    />
  );
};
