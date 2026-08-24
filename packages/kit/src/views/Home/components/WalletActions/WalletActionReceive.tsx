import { useCallback, useMemo } from 'react';

import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import { useReceiveToken } from '@unionkeyhq/kit/src/hooks/useReceiveToken';
import { useUserWalletProfile } from '@unionkeyhq/kit/src/hooks/useUserWalletProfile';
import { useActiveAccount } from '@unionkeyhq/kit/src/states/jotai/contexts/accountSelector';
import {
  useAllTokenListAtom,
  useAllTokenListMapAtom,
  useTokenListStateAtom,
} from '@unionkeyhq/kit/src/states/jotai/contexts/tokenList';
import { WALLET_TYPE_WATCHING } from '@unionkeyhq/shared/src/consts/dbConsts';
import { defaultLogger } from '@unionkeyhq/shared/src/logger/logger';

import { RawActions } from './RawActions';

function WalletActionReceive() {
  const {
    activeAccount: {
      network,
      account,
      wallet,
      deriveInfoItems,
      indexedAccount,
    },
  } = useActiveAccount({ num: 0 });

  const [allTokens] = useAllTokenListAtom();
  const [map] = useAllTokenListMapAtom();
  const [tokenListState] = useTokenListStateAtom();

  const isReceiveDisabled = useMemo(() => {
    if (wallet?.type === WALLET_TYPE_WATCHING) {
      return true;
    }
    return false;
  }, [wallet?.type]);

  const { handleOnReceive } = useReceiveToken({
    accountId: account?.id ?? '',
    networkId: network?.id ?? '',
    walletId: wallet?.id ?? '',
    indexedAccountId: indexedAccount?.id ?? '',
    tokens: {
      data: allTokens.tokens,
      keys: allTokens.keys,
      map,
    },
    tokenListState,
    isMultipleDerive: deriveInfoItems.length > 1,
  });

  const { isSoftwareWalletOnlyUser } = useUserWalletProfile();
  const handleReceiveOnPress = useCallback(async () => {
    if (
      await backgroundApiProxy.serviceAccount.checkIsWalletNotBackedUp({
        walletId: wallet?.id ?? '',
      })
    ) {
      return;
    }
    defaultLogger.wallet.walletActions.actionReceive({
      walletType: wallet?.type ?? '',
      networkId: network?.id ?? '',
      source: 'homePage',
      isSoftwareWalletOnlyUser,
    });
    handleOnReceive();
  }, [
    wallet?.type,
    wallet?.id,
    network?.id,
    isSoftwareWalletOnlyUser,
    handleOnReceive,
  ]);

  return (
    <RawActions.Receive
      disabled={isReceiveDisabled}
      onPress={handleReceiveOnPress}
      trackID="wallet-receive"
    />
  );
}

export { WalletActionReceive };
