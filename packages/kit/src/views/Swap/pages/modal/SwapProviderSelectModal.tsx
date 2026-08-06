import { useCallback, useMemo, useState } from 'react';

import { useRoute } from '@react-navigation/core';
import { useIntl } from 'react-intl';

import type { IKeyOfIcons, IPageNavigationProp } from '@onekeyhq/components';
import {
  Button,
  Icon,
  IconButton,
  Page,
  Popover,
  SectionList,
  Select,
  SizableText,
  Stack,
  XStack,
} from '@onekeyhq/components';
import useAppNavigation from '@onekeyhq/kit/src/hooks/useAppNavigation';
import {
  useSwapFromTokenAmountAtom,
  useSwapManualSelectQuoteProvidersAtom,
  useSwapProviderSortAtom,
  useSwapQuoteCurrentSelectAtom,
  useSwapSelectFromTokenAtom,
  useSwapSelectToTokenAtom,
  useSwapSortedQuoteListAtom,
} from '@onekeyhq/kit/src/states/jotai/contexts/swap';
import { useSettingsPersistAtom } from '@onekeyhq/kit-bg/src/states/jotai/atoms';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import { defaultLogger } from '@onekeyhq/shared/src/logger/logger';
import type {
  EModalSwapRoutes,
  IModalSwapParamList,
} from '@onekeyhq/shared/src/routes/swap';
import {
  canCompareSwapQuoteNetCost,
  getLowestCostSwapQuote,
  isSameSwapQuote,
  isSwapQuoteAvailable,
} from '@onekeyhq/shared/src/utils/unionKeySwapQuoteUtils';
import { ESwapProviderSort } from '@onekeyhq/shared/types/swap/SwapProvider.constants';
import {
  ESwapQuoteKind,
  type IFetchQuoteResult,
} from '@onekeyhq/shared/types/swap/types';

import SwapProviderListItem from '../../components/SwapProviderListItem';
import { SwapProviderMirror } from '../SwapProviderMirror';

import type { RouteProp } from '@react-navigation/core';

enum ESwapProviderStatus {
  AVAILABLE = 'Available',
  UNAVAILABLE = 'Unavailable',
}

const InformationItem = ({
  icon,
  content,
}: {
  icon: IKeyOfIcons;
  content: string;
}) => (
  <XStack alignItems="flex-start" gap="$2">
    <Icon flexShrink={0} color="$iconSubdued" size="$5" name={icon} />
    <SizableText size="$bodyMd" color="$textSubdued" flex={1}>
      {content}
    </SizableText>
  </XStack>
);

const SwapProviderSelectModal = () => {
  const navigation =
    useAppNavigation<IPageNavigationProp<IModalSwapParamList>>();
  const intl = useIntl();
  const [swapSortedList] = useSwapSortedQuoteListAtom();
  const [fromTokenAmount] = useSwapFromTokenAmountAtom();
  const [fromToken] = useSwapSelectFromTokenAtom();
  const [toToken] = useSwapSelectToTokenAtom();
  const [, setSwapManualSelect] = useSwapManualSelectQuoteProvidersAtom();
  const [providerSort, setProviderSort] = useSwapProviderSortAtom();
  const [settingsPersist] = useSettingsPersistAtom();
  const [currentSelectQuote] = useSwapQuoteCurrentSelectAtom();
  const [pendingSelectQuote, setPendingSelectQuote] =
    useState<IFetchQuoteResult>();

  const onSelectSortChange = useCallback(
    (value: ESwapProviderSort) => {
      setProviderSort(value);
    },
    [setProviderSort],
  );

  const swapProviderSortSelectItems = useMemo(
    () => [
      {
        label: intl.formatMessage({ id: ETranslations.provider_recommend }),
        value: ESwapProviderSort.RECOMMENDED,
      },
      {
        label: intl.formatMessage({ id: ETranslations.provider_sort_item_gas }),
        value: ESwapProviderSort.GAS_FEE,
      },
      {
        label: intl.formatMessage({
          id: ETranslations.provider_sort_item_swap_duration,
        }),
        value: ESwapProviderSort.SWAP_DURATION,
      },
      {
        label: intl.formatMessage({
          id: ETranslations.provider_sort_item_received,
        }),
        value: ESwapProviderSort.RECEIVED,
      },
    ],
    [intl],
  );
  const availableList = useMemo(
    () =>
      swapSortedList.filter((item) =>
        isSwapQuoteAvailable(item, fromTokenAmount.value),
      ),
    [fromTokenAmount.value, swapSortedList],
  );
  const unavailableList = useMemo(
    () =>
      swapSortedList.filter(
        (item) => !isSwapQuoteAvailable(item, fromTokenAmount.value),
      ),
    [fromTokenAmount.value, swapSortedList],
  );
  const sectionData = useMemo(() => {
    return [
      ...(availableList?.length > 0
        ? [
            {
              title: '可用报价',
              type: ESwapProviderStatus.AVAILABLE,
              data: availableList,
            },
          ]
        : []),
      ...(unavailableList?.length > 0
        ? [
            {
              title: intl.formatMessage({
                id: ETranslations.provider_unavailable,
              }),
              type: ESwapProviderStatus.UNAVAILABLE,
              data: unavailableList,
            },
          ]
        : []),
    ];
  }, [availableList, intl, unavailableList]);

  const lowestCostQuote = useMemo(
    () =>
      getLowestCostSwapQuote({
        quotes: availableList,
        fromTokenPrice: fromToken?.price,
        toTokenPrice: toToken?.price,
      }),
    [availableList, fromToken?.price, toToken?.price],
  );
  const canCompareNetCost = canCompareSwapQuoteNetCost({
    quoteKind: lowestCostQuote?.kind ?? ESwapQuoteKind.SELL,
    fromTokenPrice: fromToken?.price,
    toTokenPrice: toToken?.price,
  });
  const bestValueLabel = canCompareNetCost ? '最便宜' : '到账最多';

  const confirmedQuote = useMemo(() => {
    const selectedQuote = pendingSelectQuote ?? currentSelectQuote;
    if (!selectedQuote) {
      return undefined;
    }
    return availableList.find(
      (item) =>
        item.info.provider === selectedQuote.info.provider &&
        item.info.providerName === selectedQuote.info.providerName,
    );
  }, [availableList, currentSelectQuote, pendingSelectQuote]);

  const onConfirmQuote = useCallback(() => {
    if (!confirmedQuote) {
      return;
    }
    setSwapManualSelect(confirmedQuote);
    defaultLogger.swap.providerChange.providerChange({
      changeFrom: currentSelectQuote?.info.provider ?? '-',
      changeTo: confirmedQuote.info.provider,
    });
    navigation.pop();
  }, [
    confirmedQuote,
    currentSelectQuote?.info.provider,
    navigation,
    setSwapManualSelect,
  ]);

  const onChooseQuote = useCallback((item: IFetchQuoteResult) => {
    setPendingSelectQuote(item);
  }, []);
  const renderItem = useCallback(
    ({ item }: { item: IFetchQuoteResult; index: number }) => {
      const disabled = !isSwapQuoteAvailable(item, fromTokenAmount.value);
      return (
        <SwapProviderListItem
          onPress={
            !disabled
              ? () => {
                  onChooseQuote(item);
                }
              : undefined
          }
          selected={Boolean(
            item.info.provider === confirmedQuote?.info.provider &&
              item.info.providerName === confirmedQuote?.info.providerName,
          )}
          fromTokenAmount={fromTokenAmount.value}
          fromToken={fromToken}
          toToken={toToken}
          providerResult={item}
          currencySymbol={settingsPersist.currencyInfo.symbol}
          disabled={disabled}
          bestValueLabel={
            isSameSwapQuote(item, lowestCostQuote) ? bestValueLabel : undefined
          }
        />
      );
    },
    [
      bestValueLabel,
      confirmedQuote?.info.provider,
      confirmedQuote?.info.providerName,
      fromToken,
      fromTokenAmount,
      lowestCostQuote,
      onChooseQuote,
      settingsPersist.currencyInfo.symbol,
      toToken,
    ],
  );

  const rightInfoComponent = useCallback(
    () => (
      <Popover
        title={intl.formatMessage({
          id: ETranslations.provider_ios_popover_title,
        })}
        renderTrigger={
          <IconButton
            variant="tertiary"
            size="medium"
            icon="InfoCircleOutline"
          />
        }
        renderContent={
          <Stack p="$5" gap="$6">
            <Stack gap="$3">
              <Stack gap="$1">
                <SizableText size="$headingMd" color="$text">
                  {intl.formatMessage({
                    id: ETranslations.provider_ios_popover_order_info_title,
                  })}
                </SizableText>
                <SizableText size="$bodySm" color="$textSubdued">
                  {intl.formatMessage({
                    id: ETranslations.provider_popover_order_info_content,
                  })}
                </SizableText>
              </Stack>
              <InformationItem
                icon="LockOutline"
                content={intl.formatMessage({
                  id: ETranslations.provider_ios_popover_approval_require_msg,
                })}
              />
              <InformationItem
                icon="GasOutline"
                content={intl.formatMessage({
                  id: ETranslations.provider_network_fee,
                })}
              />
              <InformationItem
                icon="ClockTimeHistoryOutline"
                content={intl.formatMessage({
                  id: ETranslations.provider_swap_duration,
                })}
              />
              <InformationItem
                icon="HandCoinsOutline"
                content={intl.formatMessage({
                  id: ETranslations.provider_protocol_fee,
                })}
              />
            </Stack>
          </Stack>
        }
      />
    ),
    [intl],
  );
  return (
    <Page>
      <Page.Header headerRight={rightInfoComponent} />
      <SectionList
        px="$5"
        pt="$2"
        pb="$4"
        estimatedItemSize="$10"
        renderItem={renderItem}
        sections={sectionData}
        ListHeaderComponent={
          <Stack
            mb="$3"
            p="$4"
            borderRadius="$4"
            borderWidth="$px"
            borderColor="$borderSubdued"
            bg="$bgSubdued"
          >
            <XStack alignItems="center" justifyContent="space-between" gap="$3">
              <XStack alignItems="center" gap="$2" flex={1}>
                <Icon name="FilterSortSolid" size="$5" color="$iconActive" />
                <Stack flex={1}>
                  <SizableText size="$bodyLgMedium" color="$text">
                    实时报价比较
                  </SizableText>
                  <SizableText size="$bodySm" color="$textSubdued">
                    {availableList.length} 家可用路由商
                  </SizableText>
                </Stack>
              </XStack>
              {lowestCostQuote?.info.providerName ? (
                <Button
                  size="small"
                  variant="primary"
                  onPress={() => onChooseQuote(lowestCostQuote)}
                >
                  选择
                </Button>
              ) : null}
            </XStack>
            <SizableText size="$bodyMd" color="$textSubdued" mt="$3">
              {lowestCostQuote?.info.providerName
                ? `${bestValueLabel}：${lowestCostQuote.info.providerName}`
                : '输入兑换数量后显示各路由商的实时可执行报价。'}
            </SizableText>
          </Stack>
        }
        renderSectionHeader={({ section: { type, title } }) => {
          if (type === ESwapProviderStatus.AVAILABLE) {
            return (
              <Select
                title={intl.formatMessage({
                  id: ETranslations.provider_sort_title,
                })}
                items={swapProviderSortSelectItems}
                onChange={onSelectSortChange}
                value={providerSort}
                renderTrigger={({ value, label, placeholder }) => (
                  <Button
                    mt="$1"
                    alignSelf="flex-start"
                    variant="tertiary"
                    icon="FilterSortSolid"
                    iconAfter="ChevronDownSmallOutline"
                  >
                    <SizableText size="$bodyMd">
                      {value ? label : placeholder}
                    </SizableText>
                  </Button>
                )}
              />
            );
          }
          return <SectionList.SectionHeader title={title} px="$0" />;
        }}
      />
      <Page.Footer
        onConfirmText="确定"
        onConfirm={onConfirmQuote}
        confirmButtonProps={{
          disabled: !confirmedQuote,
        }}
      />
    </Page>
  );
};

const SwapProviderSelectModalWithProvider = () => {
  const route =
    useRoute<
      RouteProp<IModalSwapParamList, EModalSwapRoutes.SwapProviderSelect>
    >();
  const { storeName } = route.params;
  return (
    <SwapProviderMirror storeName={storeName}>
      <SwapProviderSelectModal />
    </SwapProviderMirror>
  );
};

export default SwapProviderSelectModalWithProvider;
