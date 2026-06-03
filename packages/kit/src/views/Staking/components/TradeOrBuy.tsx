import { useCallback } from 'react';

import { useIntl } from 'react-intl';

import type { IPageNavigationProp } from '@unionkey/components';
import { Button, SizableText, XStack } from '@unionkey/components';
import { useUserWalletProfile } from '@unionkey/kit/src/hooks/useUserWalletProfile';
import { getNetworkIdsMap } from '@unionkey/shared/src/config/networkIds';
import { ETranslations } from '@unionkey/shared/src/locale';
import { defaultLogger } from '@unionkey/shared/src/logger/logger';
import type { IModalSwapParamList } from '@unionkey/shared/src/routes';
import { EModalRoutes } from '@unionkey/shared/src/routes/modal';
import { EModalSwapRoutes } from '@unionkey/shared/src/routes/swap';
import { getImportFromToken } from '@unionkey/shared/types/earn/earnProvider.constants';
import {
  ESwapSource,
  ESwapTabSwitchType,
} from '@unionkey/shared/types/swap/types';
import type { IToken } from '@unionkey/shared/types/token';

import backgroundApiProxy from '../../../background/instance/backgroundApiProxy';
import useAppNavigation from '../../../hooks/useAppNavigation';
import { useActiveAccount } from '../../../states/jotai/contexts/accountSelector';
import ActionBuy from '../../AssetDetails/pages/TokenDetails/ActionBuy';
import { HomeTokenListProviderMirror } from '../../Home/components/HomeTokenListProvider/HomeTokenListProviderMirror';

function BasicTradeOrBuy({
  token,
  accountId,
  networkId,
}: {
  token: IToken;
  accountId: string;
  networkId: string;
}) {
  const {
    activeAccount: { wallet },
  } = useActiveAccount({ num: 0 });
  const networkIdsMap = getNetworkIdsMap();
  const intl = useIntl();
  const navigation =
    useAppNavigation<IPageNavigationProp<IModalSwapParamList>>();

  const { isSoftwareWalletOnlyUser } = useUserWalletProfile();
  const handleOnSwap = useCallback(async () => {
    const { isSupportSwap } =
      await backgroundApiProxy.serviceSwap.checkSupportSwap({
        networkId,
      });
    const network = await backgroundApiProxy.serviceNetwork.getNetwork({
      networkId,
    });
    const { importFromToken, swapTabSwitchType } = getImportFromToken({
      networkId,
      isSupportSwap,
      tokenAddress: token.address,
    });
    defaultLogger.wallet.walletActions.actionTrade({
      walletType: wallet?.type ?? '',
      networkId,
      source: 'earn',
      tradeType: ESwapTabSwitchType.SWAP,
      isSoftwareWalletOnlyUser,
    });
    navigation.pushModal(EModalRoutes.SwapModal, {
      screen: EModalSwapRoutes.SwapMainLand,
      params: {
        importToToken: {
          ...token,
          contractAddress: token.address,
          networkId,
          networkLogoURI: network.logoURI,
        },
        importFromToken,
        swapTabSwitchType,
        swapSource: ESwapSource.EARN,
      },
    });
  }, [navigation, networkId, token, wallet?.type, isSoftwareWalletOnlyUser]);

  const isHiddenComponent = networkId === networkIdsMap.cosmoshub;

  if (isHiddenComponent) {
    return null;
  }

  return (
    <XStack ai="center" jc="space-between" pt="$5">
      <SizableText size="$bodyMd" color="$textSubdued">
        {intl.formatMessage(
          { id: ETranslations.earn_not_enough_token },
          { token: token.symbol },
        )}
      </SizableText>
      <XStack gap="$2">
        <Button size="small" onPress={handleOnSwap}>
          {intl.formatMessage({ id: ETranslations.global_trade })}
        </Button>
        <ActionBuy
          hiddenIfDisabled
          showButtonStyle
          size="small"
          networkId={networkId}
          accountId={accountId}
          walletType={wallet?.type}
          walletId={wallet?.id ?? ''}
          tokenAddress={token.address}
          tokenSymbol={token.symbol}
          source="earn"
        />
      </XStack>
    </XStack>
  );
}

export function TradeOrBuy({
  token,
  accountId,
  networkId,
}: {
  token: IToken;
  accountId: string;
  networkId: string;
}) {
  return (
    <HomeTokenListProviderMirror>
      <BasicTradeOrBuy
        token={token}
        accountId={accountId}
        networkId={networkId}
      />
    </HomeTokenListProviderMirror>
  );
}
