import { useCallback, useMemo } from 'react';

import backgroundApiProxy from '@unionkey/kit/src/background/instance/backgroundApiProxy';
import useAppNavigation from '@unionkey/kit/src/hooks/useAppNavigation';
import { useUserWalletProfile } from '@unionkey/kit/src/hooks/useUserWalletProfile';
import { useActiveAccount } from '@unionkey/kit/src/states/jotai/contexts/accountSelector';
import { useAllTokenListMapAtom } from '@unionkey/kit/src/states/jotai/contexts/tokenList';
import { useFiatCrypto } from '@unionkey/kit/src/views/FiatCrypto/hooks';
import { WALLET_TYPE_WATCHING } from '@unionkey/shared/src/consts/dbConsts';
import { defaultLogger } from '@unionkey/shared/src/logger/logger';
import platformEnv from '@unionkey/shared/src/platformEnv';
import {
  EModalFiatCryptoRoutes,
  EModalRoutes,
} from '@unionkey/shared/src/routes';
import accountUtils from '@unionkey/shared/src/utils/accountUtils';
import { openUrlExternal } from '@unionkey/shared/src/utils/openUrlUtils';
import type { INetworkAccount } from '@unionkey/shared/types/account';
import { EDeriveAddressActionType } from '@unionkey/shared/types/address';

import { RawActions } from './RawActions';

export function WalletActionBuy() {
  const {
    activeAccount: {
      network,
      account,
      wallet,
      deriveInfoItems,
      vaultSettings,
      indexedAccount,
    },
  } = useActiveAccount({ num: 0 });
  const navigation = useAppNavigation();
  const { isSupported, handleFiatCrypto } = useFiatCrypto({
    networkId: network?.id ?? '',
    accountId: account?.id ?? '',
    fiatCryptoType: 'buy',
  });

  const [map] = useAllTokenListMapAtom();

  const isBuyDisabled = useMemo(() => {
    // if (wallet?.type === WALLET_TYPE_WATCHING && !platformEnv.isDev) {
    //   return true;
    // }

    // if (!isSupported) {
    //   return true;
    // }zyf

    return true;//zyf
  }, [isSupported, wallet?.type]);

  const { isSoftwareWalletOnlyUser } = useUserWalletProfile();
  const handleBuyToken = useCallback(async () => {
    if (isBuyDisabled) return;

    if (
      await backgroundApiProxy.serviceAccount.checkIsWalletNotBackedUp({
        walletId: wallet?.id ?? '',
      })
    ) {
      return;
    }

    defaultLogger.wallet.walletActions.actionBuy({
      walletType: wallet?.type ?? '',
      networkId: network?.id ?? '',
      source: 'homePage',
      isSoftwareWalletOnlyUser,
    });

    if (vaultSettings?.isSingleToken) {
      const nativeToken = await backgroundApiProxy.serviceToken.getNativeToken({
        networkId: network?.id ?? '',
        accountId: account?.id ?? '',
      });

      if (
        network &&
        wallet &&
        nativeToken &&
        deriveInfoItems.length > 1 &&
        vaultSettings?.mergeDeriveAssetsEnabled &&
        !accountUtils.isOthersWallet({ walletId: wallet?.id ?? '' })
      ) {
        navigation.pushModal(EModalRoutes.FiatCryptoModal, {
          screen: EModalFiatCryptoRoutes.DeriveTypesAddress,
          params: {
            networkId: network.id,
            indexedAccountId: indexedAccount?.id ?? '',
            actionType: EDeriveAddressActionType.Select,
            token: nativeToken,
            tokenMap: map,
            onUnmounted: () => {},
            onSelected: async ({
              account: a,
            }: {
              account: INetworkAccount;
            }) => {
              defaultLogger.wallet.walletActions.buyStarted({
                tokenAddress: nativeToken.address,
                tokenSymbol: nativeToken.symbol,
                networkID: network?.id ?? '',
              });
              const { url } =
                await backgroundApiProxy.serviceFiatCrypto.generateWidgetUrl({
                  networkId: network?.id ?? '',
                  tokenAddress: nativeToken.address,
                  accountId: a.id,
                  type: 'buy',
                });
              openUrlExternal(url);
            },
          },
        });
        return;
      }
    }

    handleFiatCrypto();
  }, [
    isBuyDisabled,
    vaultSettings?.isSingleToken,
    vaultSettings?.mergeDeriveAssetsEnabled,
    handleFiatCrypto,
    network,
    account?.id,
    wallet,
    deriveInfoItems.length,
    navigation,
    indexedAccount?.id,
    map,
    isSoftwareWalletOnlyUser,
  ]);

  return (
    <RawActions.Buy
      onPress={handleBuyToken}
      disabled={isBuyDisabled}
      trackID="wallet-buy"
    />
  );
}
