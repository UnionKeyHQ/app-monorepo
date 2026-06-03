import { useCallback, useMemo, useRef, useState } from 'react';

import { useIntl } from 'react-intl';

import type { IPageNavigationProp } from '@unionkey/components';
import { Dialog, SizableText } from '@unionkey/components';
import { ETranslations } from '@unionkey/shared/src/locale';
import { defaultLogger } from '@unionkey/shared/src/logger/logger';
import {
  EModalStakingRoutes,
  type IModalSwapParamList,
} from '@unionkey/shared/src/routes';
import { EModalRoutes } from '@unionkey/shared/src/routes/modal';
import { EModalSwapRoutes } from '@unionkey/shared/src/routes/swap';
import { openUrlExternal } from '@unionkey/shared/src/utils/openUrlUtils';
import timerUtils from '@unionkey/shared/src/utils/timerUtils';
import {
  isSupportStaking,
  normalizeToEarnSymbol,
} from '@unionkey/shared/types/earn/earnProvider.constants';
import type { IFiatCryptoType } from '@unionkey/shared/types/fiatCrypto';
import type {
  IMarketDetailPlatformNetwork,
  IMarketTokenDetail,
} from '@unionkey/shared/types/market';
import { getNetworkIdBySymbol } from '@unionkey/shared/types/market/marketProvider.constants';
import {
  ESwapSource,
  ESwapTabSwitchType,
} from '@unionkey/shared/types/swap/types';

import backgroundApiProxy from '../../../background/instance/backgroundApiProxy';
import useAppNavigation from '../../../hooks/useAppNavigation';
import { useActiveAccount } from '../../../states/jotai/contexts/accountSelector';

export const useMarketTradeNetwork = (token: IMarketTokenDetail | null) => {
  const { detailPlatforms, platforms = {} } = token || {};
  const network = useMemo(() => {
    if (detailPlatforms) {
      const values = Object.values(detailPlatforms);
      const nativePlatform = values.find((i) => i.isNative);
      if (nativePlatform) {
        return nativePlatform;
      }

      const tokenAddress = Object.values(platforms)[0];
      const tokenAddressPlatform = values.find(
        (i) => i.tokenAddress === tokenAddress,
      );
      return tokenAddressPlatform ?? values[0];
    }
  }, [detailPlatforms, platforms]);
  return network;
};

export const useMarketTradeNetworkId = (
  network: IMarketDetailPlatformNetwork | null | undefined,
  symbol: string,
) =>
  useMemo(() => {
    const { unionkeyNetworkId } = network || {};
    return unionkeyNetworkId ?? getNetworkIdBySymbol(symbol);
  }, [network, symbol]);

export const useMarketTradeActions = (token: IMarketTokenDetail | null) => {
  const { symbol = '', name } = token || {};
  const intl = useIntl();
  const network = useMarketTradeNetwork(token);
  const networkId = useMarketTradeNetworkId(network, symbol);

  const navigation =
    useAppNavigation<IPageNavigationProp<IModalSwapParamList>>();

  const { activeAccount } = useActiveAccount({ num: 0 });

  const { isNative = false, tokenAddress: realContractAddress = '' } =
    network || {};

  const remindUnsupportedToken = useCallback(
    (action: 'buy' | 'sell' | 'trade', showDialog = true) => {
      defaultLogger.market.token.unsupportedToken({ name: symbol, action });
      if (showDialog) {
        Dialog.show({
          title: intl.formatMessage({
            id: ETranslations.earn_unsupported_token,
          }),
          tone: 'warning',
          icon: 'ErrorOutline',
          renderContent: (
            <SizableText size="$bodyLg">
              {intl.formatMessage({
                id: ETranslations.earn_unsupported_token_desc,
              })}
            </SizableText>
          ),
          onConfirmText: intl.formatMessage({
            id: ETranslations.explore_got_it,
          }),
        });
      }
    },
    [intl, symbol],
  );

  const createAccountIfNotExists = useCallback(
    async (
      { allowWatchAccount }: { allowWatchAccount: boolean } = {
        allowWatchAccount: false,
      },
    ) => {
      if (networkId) {
        return backgroundApiProxy.serviceAccount.createAddressIfNotExists(
          {
            walletId: activeAccount?.wallet?.id || '',
            networkId,
            accountId: activeAccount?.account?.id,
            indexedAccountId: activeAccount?.indexedAccount?.id,
          },
          {
            allowWatchAccount,
          },
        );
      }
      return undefined;
    },
    [activeAccount, networkId],
  );

  const handleBuyOrSell = useCallback(
    async (type: IFiatCryptoType) => {
      const networkAccount = await createAccountIfNotExists({
        allowWatchAccount: type === 'buy',
      });
      if (!networkAccount || !networkId) {
        return;
      }

      const isSupported =
        await backgroundApiProxy.serviceFiatCrypto.isTokenSupported({
          networkId,
          tokenAddress: realContractAddress,
          type,
        });

      if (!isSupported) {
        remindUnsupportedToken(type);
        return;
      }

      const { url, build } =
        await backgroundApiProxy.serviceFiatCrypto.generateWidgetUrl({
          networkId,
          tokenAddress: realContractAddress,
          accountId: networkAccount?.id,
          type,
        });
      if (!url || !build) {
        remindUnsupportedToken(type);
        return;
      }
      openUrlExternal(url);
    },
    [
      createAccountIfNotExists,
      networkId,
      realContractAddress,
      remindUnsupportedToken,
    ],
  );

  const handleSwap = useCallback(
    async (mode?: 'modal' | 'button') => {
      const navigateToSwapPage = (
        params: IModalSwapParamList[EModalSwapRoutes.SwapMainLand],
      ) => {
        params.swapSource = ESwapSource.MARKET;

        if (mode === 'modal') {
          navigation.replace(EModalSwapRoutes.SwapMainLand, params);
        } else {
          navigation.pushModal(EModalRoutes.SwapModal, {
            screen: EModalSwapRoutes.SwapMainLand,
            params,
          });
        }
      };
      if (!networkId) {
        remindUnsupportedToken('trade', false);
        navigateToSwapPage({
          importNetworkId: 'unknown',
        });
        return;
      }
      const networkAccount = await createAccountIfNotExists();
      if (!networkAccount) {
        if (mode === 'modal') {
          navigation.pop();
        }
        return;
      }
      if (!networkId) {
        return;
      }
      const { isSupportSwap, isSupportCrossChain } =
        await backgroundApiProxy.serviceSwap.checkSupportSwap({
          networkId,
        });

      if (!isSupportSwap && !isSupportCrossChain) {
        remindUnsupportedToken('trade', false);
        navigateToSwapPage({
          importNetworkId: networkId,
        });
        return;
      }
      const unionkeyNetwork = await backgroundApiProxy.serviceNetwork.getNetwork({
        networkId,
      });
      navigateToSwapPage({
        importFromToken: {
          ...unionkeyNetwork,
          logoURI: isNative ? unionkeyNetwork.logoURI : undefined,
          contractAddress: realContractAddress,
          networkId,
          isNative,
          networkLogoURI: unionkeyNetwork.logoURI,
          symbol: symbol.toUpperCase(),
          name,
        },
        swapTabSwitchType: isSupportSwap
          ? ESwapTabSwitchType.SWAP
          : ESwapTabSwitchType.BRIDGE,
      });
    },
    [
      createAccountIfNotExists,
      isNative,
      name,
      navigation,
      networkId,
      realContractAddress,
      remindUnsupportedToken,
      symbol,
    ],
  );

  const handleStaking = useCallback(async () => {
    const networkAccount = await createAccountIfNotExists();
    if (!networkAccount) {
      return;
    }
    const normalizedSymbol = normalizeToEarnSymbol(symbol);
    if (!normalizedSymbol) {
      return;
    }
    if (networkId && networkAccount && normalizedSymbol) {
      navigation.pushModal(EModalRoutes.StakingModal, {
        screen: EModalStakingRoutes.AssetProtocolList,
        params: {
          networkId,
          accountId: networkAccount.id,
          indexedAccountId: networkAccount.indexedAccountId,
          symbol: normalizedSymbol,
        },
      });
    }
  }, [createAccountIfNotExists, navigation, networkId, symbol]);
  const canStaking = useMemo(() => isSupportStaking(symbol), [symbol]);

  return useMemo(
    () => ({
      onSwap: handleSwap,
      onStaking: handleStaking,
      onBuy: () => {
        void handleBuyOrSell('buy');
      },
      onSell: () => {
        void handleBuyOrSell('sell');
      },
      createAccountIfNotExists,
      canStaking,
    }),
    [
      canStaking,
      createAccountIfNotExists,
      handleBuyOrSell,
      handleStaking,
      handleSwap,
    ],
  );
};

type IActionName = 'onSwap' | 'onStaking' | 'onBuy' | 'onSell';
export const useLazyMarketTradeActions = (coinGeckoId: string) => {
  const [token, setToken] = useState<null | IMarketTokenDetail>(null);
  const fetchMarketTokenDetail = useCallback(async () => {
    const response =
      await backgroundApiProxy.serviceMarket.fetchMarketTokenDetail(
        coinGeckoId,
      );
    setToken(response);
    return response;
  }, [coinGeckoId]);

  const actions = useMarketTradeActions(token);
  const actionsRef = useRef(actions);
  actionsRef.current = actions;
  const navigation =
    useAppNavigation<IPageNavigationProp<IModalSwapParamList>>();
  const compose = useCallback(
    (actionName: IActionName) => {
      const callback = async () => {
        await fetchMarketTokenDetail();
        // wait for token detail loaded and actionsRef updated
        await timerUtils.wait(80);
        await actionsRef.current[actionName]('modal');
      };
      void callback();
    },
    [fetchMarketTokenDetail],
  );

  const handleSwapLazyModal = useCallback(async () => {
    navigation.pushModal(EModalRoutes.SwapModal, {
      screen: EModalSwapRoutes.SwapLazyMarketModal,
      params: {
        coinGeckoId,
      },
    });
  }, [coinGeckoId, navigation]);

  return useMemo(
    () => ({
      onSwap: () => compose('onSwap'),
      onSwapLazyModal: handleSwapLazyModal,
      onStaking: () => compose('onStaking'),
      onBuy: () => compose('onBuy'),
      onSell: () => compose('onSell'),
    }),
    [compose, handleSwapLazyModal],
  );
};
