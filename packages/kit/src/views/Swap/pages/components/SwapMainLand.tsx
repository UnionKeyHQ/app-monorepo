import { useCallback, useEffect, useMemo, useState } from 'react';

import BigNumber from 'bignumber.js';
import { type IntlShape, useIntl } from 'react-intl';

import {
  Badge,
  Button,
  Dialog,
  EPageType,
  type IPageNavigationProp,
  Icon,
  Image,
  Input,
  ScrollView,
  SizableText,
  Stack,
  TextArea,
  Toast,
  XStack,
  YStack,
} from '@onekeyhq/components';
import backgroundApiProxy from '@onekeyhq/kit/src/background/instance/backgroundApiProxy';
import useAppNavigation from '@onekeyhq/kit/src/hooks/useAppNavigation';
import { useSignatureConfirm } from '@onekeyhq/kit/src/hooks/useSignatureConfirm';
import {
  useSwapActions,
  useSwapAlertsAtom,
  useSwapFromTokenAmountAtom,
  useSwapQuoteCurrentSelectAtom,
  useSwapSelectFromTokenAtom,
  useSwapSelectToTokenAtom,
  useSwapSelectedFromTokenBalanceAtom,
  useSwapTypeSwitchAtom,
} from '@onekeyhq/kit/src/states/jotai/contexts/swap';
import { EJotaiContextStoreNames } from '@onekeyhq/kit-bg/src/states/jotai/atoms';
import { ETranslations } from '@onekeyhq/shared/src/locale';
import { EModalRoutes } from '@onekeyhq/shared/src/routes';
import {
  EModalSwapRoutes,
  type IModalSwapParamList,
} from '@onekeyhq/shared/src/routes/swap';
import networkUtils from '@onekeyhq/shared/src/utils/networkUtils';
import {
  assertUnionKeyAssistRequirementIsUnambiguous,
  getUnionKeyTradeInstrument,
  parseUnionKeyAssistRequirement,
} from '@onekeyhq/shared/src/utils/unionKeyTradeUtils';
import { EMessageTypesEth } from '@onekeyhq/shared/types/message';
import { swapApproveResetValue } from '@onekeyhq/shared/types/swap/SwapProvider.constants';
import {
  ESwapDirectionType,
  ESwapQuoteKind,
  ESwapTabSwitchType,
  type ISwapInitParams,
} from '@onekeyhq/shared/types/swap/types';
import type {
  IUnionKeyAssistAgentGrant,
  IUnionKeyAssistAuthorizationMode,
  IUnionKeyAssistExecutionReceipt,
  IUnionKeyAssistMarketAnalysis,
  IUnionKeyAssistRiskCheck,
  IUnionKeyAssistRiskPolicy,
  IUnionKeyAssistSiteId,
  IUnionKeyAssistTask,
} from '@onekeyhq/shared/types/unionkey/trade';

import SwapProviderInfoItem from '../../components/SwapProviderInfoItem';
import { useSwapAddressInfo } from '../../hooks/useSwapAccount';
import { useSwapBuildTx } from '../../hooks/useSwapBuiltTx';
import { useSwapInit } from '../../hooks/useSwapGlobal';
import { useSwapSlippagePercentageModeInfo } from '../../hooks/useSwapState';
import { SwapProviderMirror } from '../SwapProviderMirror';

import NFTMarket from './NFTMarket';
import SwapActionsState from './SwapActionsState';
import SwapAlertContainer from './SwapAlertContainer';
import SwapHeaderContainer from './SwapHeaderContainer';
import SwapQuoteInput from './SwapQuoteInput';
import SwapQuoteResult from './SwapQuoteResult';

interface ISwapMainLoadProps {
  pageType?: EPageType.modal;
  swapInitParams?: ISwapInitParams;
}
type ITradeMode = 'normal' | 'assist' | 'privacy';
type ISwapBranch = ITradeMode | 'nft';
const UNIONKEY_ORANGE = '#f76b15';
const UNIONKEY_ORANGE_SOFT = '#fff7ed';
const ASSIST_TRADE_ACTION_PATTERN =
  /(?:买入|买进|购买|购入|买|卖出|卖掉|出售|卖|兑换|换成|做多|做空|开仓|加仓|减仓|平仓|平掉|撤单|取消.*订单|止盈|止损|buy|sell|swap|exchange|long|short|open|close|reduce|cancel|take profit|stop loss)/i;
const isAssistReadOnlyIntent = (requirement: string) =>
  /(?:查看|查询|看看|看大盘|价格|行情|分析|局势|大盘|概览|走势|analyze|analysis|price|market|trend|overview)/i.test(
    requirement,
  ) && !ASSIST_TRADE_ACTION_PATTERN.test(requirement);
const isAssistTradeIntent = (requirement: string) =>
  ASSIST_TRADE_ACTION_PATTERN.test(requirement);
const isAssistUnsupportedIntent = (requirement: string) =>
  /(?:撤单|取消.*订单|cancel(?:\s+\w+)*\s+order)/i.test(requirement);
const isAssistFundsOrRouteError = (message: string) =>
  /(?:余额不足|可用余额\s*0(?:\D|$)|insufficient balance|no available (?:payment|usdc|trading) route|没有可用的 USDC 中转路径)/i.test(
    message,
  );

const isAssistUnsupportedMarketError = (message: string) =>
  /(?:暂不支持|不支持.*(?:行情|交易|交易对)|unsupported (?:market|asset|pair|trade)|does not support)/i.test(
    message,
  );
type IAssistTradeValidationError = '' | 'ambiguous' | 'missingAmount';
const getAssistTradeValidationError = (
  requirement: string,
): IAssistTradeValidationError => {
  try {
    assertUnionKeyAssistRequirementIsUnambiguous(requirement);
  } catch {
    return 'ambiguous';
  }
  if (
    /(?:买入|买进|购买|购入|买|卖出|卖掉|出售|卖|兑换|换成|做多|做空|开仓|加仓|buy|sell|swap|exchange|long|short|open)/i.test(
      requirement,
    ) &&
    !/\d/.test(requirement)
  ) {
    return 'missingAmount';
  }
  return '';
};
type IAssistSite = {
  id: IUnionKeyAssistSiteId;
  name: string;
  description: string;
  accent: string;
  logo: string;
  enabled: boolean;
  textColor?: string;
};
const assistSites: IAssistSite[] = [
  {
    id: 'hyperliquid',
    name: 'Hyperliquid',
    description: 'Perp / Spot',
    accent: '#9cff32',
    logo: 'https://www.google.com/s2/favicons?domain=hyperliquid.xyz&sz=64',
    enabled: true,
    textColor: '#101608',
  },
  {
    id: 'oneInch',
    name: '1inch',
    description: 'Aggregator',
    accent: '#121820',
    logo: 'https://www.google.com/s2/favicons?domain=1inch.io&sz=64',
    enabled: false,
  },
  {
    id: 'nearIntents',
    name: 'Near Intents',
    description: 'Intent Match',
    accent: '#ff6b1a',
    logo: 'https://www.google.com/s2/favicons?domain=near.org&sz=64',
    enabled: false,
  },
  {
    id: 'velora',
    name: 'Velora',
    description: 'Smart Route',
    accent: UNIONKEY_ORANGE,
    logo: 'https://www.google.com/s2/favicons?domain=velora.xyz&sz=64',
    enabled: false,
  },
];
const getAssistStatusLabel = (intl: IntlShape, task?: IUnionKeyAssistTask) => {
  switch (task?.status) {
    case 'draft':
      return task.riskAssessment.passed
        ? intl.formatMessage({
            id: ETranslations.swap_page_assist_ui_plan_to_be_confirmed,
          })
        : intl.formatMessage({
            id: ETranslations.swap_page_assist_ui_risk_control_failed,
          });
    case 'authorizing':
      return intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_waiting_for_proxy_authorization,
      });
    case 'monitoring':
      return intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_ai_monitoring,
      });
    case 'ready':
      return intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_condition_has_been_triggered,
      });
    case 'awaitingSignature':
      return intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_wait_for_hardware_confirmation,
      });
    case 'submitting':
      return intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_submitting,
      });
    case 'completed':
      return task.executionResult?.status === 'resting'
        ? intl.formatMessage({
            id: ETranslations.swap_page_assist_ui_pending_order,
          })
        : intl.formatMessage({
            id: ETranslations.swap_page_assist_ui_transaction_completed,
          });
    case 'cancelled':
      return intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_stopped,
      });
    case 'error':
      return intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_execution_failed,
      });
    default:
      return intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_to_be_set,
      });
  }
};
const getAssistTriggerLabel = (intl: IntlShape, task?: IUnionKeyAssistTask) => {
  if (!task) {
    return '';
  }
  if (task.trigger.type === 'immediate') {
    return intl.formatMessage({
      id: ETranslations.swap_page_assist_ui_execute_immediately_after_startup,
    });
  }
  if (task.trigger.type === 'price') {
    const operatorLabel =
      task.trigger.operator === 'gte'
        ? intl.formatMessage({
            id: ETranslations.swap_page_assist_ui_the_price_is_not_less_than,
          })
        : intl.formatMessage({
            id: ETranslations.swap_page_assist_ui_the_price_is_not_higher_than,
          });
    return `${operatorLabel} $${task.trigger.value}`;
  }
  const signalTriggered =
    task.status === 'ready' ||
    task.status === 'awaitingSignature' ||
    task.status === 'submitting' ||
    task.status === 'completed';
  if (task.trigger.side === 'buy') {
    return signalTriggered
      ? intl.formatMessage({
          id: ETranslations.swap_page_assist_ui_the_15_minute_trend_buy_signal_has_been_triggered,
        })
      : intl.formatMessage({
          id: ETranslations.swap_page_assist_ui_wait_15_minutes_for_trend_buy_signal,
        });
  }
  return signalTriggered
    ? intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_15_minute_trend_sell_signal_has_been_triggered,
      })
    : intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_wait_15_minutes_for_trend_sell_signal,
      });
};
const formatAssistDateTime = (intl: IntlShape, value: number) =>
  intl.formatDate(value, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
const getAssistEnvironmentLabel = (
  intl: IntlShape,
  environment: IUnionKeyAssistTask['environment'],
) =>
  intl.formatMessage({
    id:
      environment === 'mainnet'
        ? ETranslations.swap_page_assist_environment_mainnet
        : ETranslations.swap_page_assist_environment_testnet,
  });
const getAssistInstrumentLabel = (
  intl: IntlShape,
  instrument: IUnionKeyAssistTask['instrument'],
) =>
  intl.formatMessage({
    id:
      instrument === 'spot'
        ? ETranslations.swap_page_assist_instrument_spot
        : ETranslations.swap_page_assist_instrument_perpetual,
  });
const getAssistExecutionStatusLabel = (
  intl: IntlShape,
  status: IUnionKeyAssistExecutionReceipt['result']['status'],
) =>
  intl.formatMessage({
    id: `swap_page.assist.execution_status_${status}` as ETranslations,
  });
const getLocalizedAssistTaskError = (intl: IntlShape, message: string) => {
  if (isAssistFundsOrRouteError(message)) {
    return intl.formatMessage({
      id: ETranslations.swap_page_assist_error_insufficient_funds_or_route,
    });
  }
  if (isAssistUnsupportedMarketError(message)) {
    return intl.formatMessage({
      id: ETranslations.swap_page_alert_no_provider_supports_trade,
    });
  }
  return intl.formatMessage({
    id: ETranslations.swap_page_assist_ui_execution_failed,
  });
};
const getAssistRiskCheckText = ({
  intl,
  task,
  check,
}: {
  intl: IntlShape;
  task: IUnionKeyAssistTask;
  check: IUnionKeyAssistRiskCheck;
}) => {
  const label = intl.formatMessage({
    id: `swap_page.assist.risk_${check.id}` as ETranslations,
  });
  if (check.id === 'symbol') {
    return {
      label,
      detail: intl.formatMessage(
        {
          id:
            check.status === 'passed'
              ? ETranslations.swap_page_assist_risk_symbol_allowed
              : ETranslations.swap_page_assist_risk_symbol_blocked,
        },
        { symbol: task.baseSymbol },
      ),
    };
  }
  if (check.id === 'orderNotional' || check.id === 'dailyNotional') {
    return {
      label,
      detail: intl.formatMessage(
        { id: ETranslations.swap_page_assist_risk_limit_usage },
        {
          used:
            check.id === 'orderNotional'
              ? task.riskAssessment.estimatedNotional
              : task.riskAssessment.dailyNotionalAfterOrder,
          limit:
            check.id === 'orderNotional'
              ? task.riskPolicy.maxOrderNotional
              : task.riskPolicy.maxDailyNotional,
          symbol: task.quoteSymbol,
        },
      ),
    };
  }
  if (check.id === 'leverage') {
    return {
      label,
      detail: intl.formatMessage(
        { id: ETranslations.swap_page_assist_risk_maximum },
        {
          current: `${task.orderPlan.leverage ?? 1}x`,
          maximum: `${task.riskPolicy.maxLeverage}x`,
        },
      ),
    };
  }
  if (check.id === 'slippage') {
    return {
      label,
      detail: intl.formatMessage(
        { id: ETranslations.swap_page_assist_risk_maximum },
        {
          current: `${task.orderPlan.maxSlippagePercent}%`,
          maximum: `${task.riskPolicy.maxSlippagePercent}%`,
        },
      ),
    };
  }
  if (check.id === 'stopLoss') {
    let detail = intl.formatMessage({
      id: ETranslations.swap_page_assist_risk_stop_loss_missing,
    });
    if (task.orderPlan.stopLossPercent) {
      detail = intl.formatMessage(
        { id: ETranslations.swap_page_assist_risk_stop_loss_set },
        { percent: task.orderPlan.stopLossPercent },
      );
    } else if (task.riskPolicy.requireStopLoss) {
      detail = intl.formatMessage({
        id: ETranslations.swap_page_assist_risk_stop_loss_required,
      });
    }
    return { label, detail };
  }
  return {
    label,
    detail:
      check.status === 'blocked'
        ? intl.formatMessage({
            id: ETranslations.swap_page_assist_risk_expired,
          })
        : formatAssistDateTime(intl, task.riskPolicy.expiresAt),
  };
};
const getAssistButtonLabel = ({
  intl,
  task,
  hasAgentGrant,
}: {
  intl: IntlShape;
  task?: IUnionKeyAssistTask;
  hasAgentGrant: boolean;
}) => {
  switch (task?.status) {
    case 'draft':
    case 'authorizing':
      return task.authorizationMode === 'delegated' && !hasAgentGrant
        ? intl.formatMessage({
            id: ETranslations.swap_page_assist_ui_hardware_authorization_and_startup,
          })
        : intl.formatMessage({
            id: ETranslations.swap_page_assist_ui_confirm_plan_and_start,
          });
    case 'monitoring':
      return intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_stop_monitoring,
      });
    case 'ready':
    case 'awaitingSignature':
      return task.authorizationMode === 'delegated'
        ? intl.formatMessage({
            id: ETranslations.swap_page_assist_ui_ai_is_executing,
          })
        : intl.formatMessage({
            id: ETranslations.swap_page_assist_ui_hardware_confirmation_and_execution,
          });
    case 'submitting':
      return intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_submitting_order,
      });
    case 'completed':
    case 'cancelled':
    case 'error':
      return intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_create_new_task,
      });
    default:
      return intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_start_smart_operation,
      });
  }
};
type IAssistTaskFilter = 'all' | 'active' | 'history' | 'receipts';
const isAssistTaskActive = (task: IUnionKeyAssistTask) =>
  [
    'draft',
    'authorizing',
    'monitoring',
    'ready',
    'awaitingSignature',
    'submitting',
  ].includes(task.status);
const isAssistTaskCancellable = (task: IUnionKeyAssistTask) =>
  ['draft', 'authorizing', 'monitoring', 'ready', 'awaitingSignature'].includes(
    task.status,
  );
function UnionKeyAssistTaskCenter({
  tasks,
  receipts,
  loading,
  onBack,
  onOpenTask,
  onCancelTask,
  onDeleteTask,
}: {
  tasks: IUnionKeyAssistTask[];
  receipts: IUnionKeyAssistExecutionReceipt[];
  loading: boolean;
  onBack: () => void;
  onOpenTask: (task: IUnionKeyAssistTask) => void;
  onCancelTask: (task: IUnionKeyAssistTask) => void;
  onDeleteTask: (task: IUnionKeyAssistTask) => void;
}) {
  const intl = useIntl();
  const [filter, setFilter] = useState<IAssistTaskFilter>('all');
  const sortedTasks = useMemo(
    () => [...tasks].sort((left, right) => right.updatedAt - left.updatedAt),
    [tasks],
  );
  const activeCount = sortedTasks.filter(isAssistTaskActive).length;
  const completedCount = sortedTasks.filter(
    (task) => task.status === 'completed',
  ).length;
  const filteredTasks = sortedTasks.filter((task) => {
    if (filter === 'active') {
      return isAssistTaskActive(task);
    }
    if (filter === 'history') {
      return !isAssistTaskActive(task);
    }
    return true;
  });
  return (
    <YStack gap="$4">
      <XStack alignItems="center" justifyContent="space-between" gap="$3">
        <XStack alignItems="center" gap="$2.5">
          <Stack
            w="$10"
            h="$10"
            borderRadius="$3"
            bg={UNIONKEY_ORANGE}
            alignItems="center"
            justifyContent="center"
          >
            <Icon name="Calendar3HistoryOutline" size="$5" color="white" />
          </Stack>
          <YStack>
            <SizableText size="$headingMd" color="$text">
              {intl.formatMessage({
                id: ETranslations.swap_page_assist_ui_mission_center,
              })}
            </SizableText>
            <SizableText size="$bodySm" color="$textSubdued">
              {intl.formatMessage({
                id: ETranslations.swap_page_assist_ui_view_monitoring_signature_and_execution_records,
              })}
            </SizableText>
          </YStack>
        </XStack>
        <Button size="small" variant="secondary" onPress={onBack}>
          <XStack alignItems="center" gap="$1">
            <Icon name="ArrowLeftOutline" size="$4" />
            <SizableText size="$bodySmMedium">
              {intl.formatMessage({
                id: ETranslations.swap_page_assist_ui_return,
              })}
            </SizableText>
          </XStack>
        </Button>
      </XStack>

      <XStack
        px="$3"
        py="$2.5"
        alignItems="center"
        justifyContent="space-between"
        borderTopWidth="$px"
        borderBottomWidth="$px"
        borderColor="$borderSubdued"
      >
        <YStack>
          <SizableText size="$headingLg" color="$text">
            {sortedTasks.length}
          </SizableText>
          <SizableText size="$bodySm" color="$textSubdued">
            {intl.formatMessage({
              id: ETranslations.swap_page_assist_ui_all_tasks,
            })}
          </SizableText>
        </YStack>
        <YStack alignItems="center">
          <SizableText size="$headingLg" color={UNIONKEY_ORANGE}>
            {activeCount}
          </SizableText>
          <SizableText size="$bodySm" color="$textSubdued">
            {intl.formatMessage({
              id: ETranslations.swap_page_assist_ui_running,
            })}
          </SizableText>
        </YStack>
        <YStack alignItems="flex-end">
          <SizableText size="$headingLg" color="$textSuccess">
            {completedCount}
          </SizableText>
          <SizableText size="$bodySm" color="$textSubdued">
            {intl.formatMessage({
              id: ETranslations.swap_page_assist_ui_executed,
            })}
          </SizableText>
        </YStack>
      </XStack>

      <XStack p="$0.5" gap="$0.5" borderRadius="$2" bg="$bgSubdued">
        {(
          [
            [
              'all',
              intl.formatMessage({
                id: ETranslations.swap_page_assist_ui_all,
              }),
            ],
            [
              'active',
              intl.formatMessage({
                id: ETranslations.swap_page_assist_ui_running,
              }),
            ],
            [
              'history',
              intl.formatMessage({
                id: ETranslations.swap_page_assist_ui_history,
              }),
            ],
            [
              'receipts',
              intl.formatMessage({
                id: ETranslations.swap_page_assist_ui_execution_record,
              }),
            ],
          ] as const
        ).map(([value, label]) => {
          const selected = filter === value;
          return (
            <Stack
              key={value}
              flex={1}
              py="$1.5"
              borderRadius="$2"
              alignItems="center"
              bg={selected ? '$bg' : 'transparent'}
              cursor="pointer"
              onPress={() => setFilter(value)}
            >
              <SizableText
                size="$bodySmMedium"
                color={selected ? '$text' : '$textSubdued'}
              >
                {label}
              </SizableText>
            </Stack>
          );
        })}
      </XStack>

      {filter === 'receipts' ? (
        receipts.length ? (
          <YStack gap="$2">
            {receipts.map((receipt) => (
              <Stack
                key={receipt.id}
                p="$3.5"
                borderRadius="$3"
                borderWidth="$px"
                borderColor="$borderSubdued"
                bg="$bg"
              >
                <YStack gap="$2">
                  <XStack justifyContent="space-between" gap="$3">
                    <SizableText size="$headingSm" color="$text">
                      {receipt.side === 'buy'
                        ? intl.formatMessage({
                            id: ETranslations.swap_page_assist_ui_buy,
                          })
                        : intl.formatMessage({
                            id: ETranslations.swap_page_assist_ui_sell,
                          })}{' '}
                      {receipt.baseSymbol}
                    </SizableText>
                    <Badge badgeType="default">
                      {getAssistExecutionStatusLabel(
                        intl,
                        receipt.result.status,
                      )}{' '}
                      · {getAssistEnvironmentLabel(intl, receipt.environment)}
                    </Badge>
                  </XStack>
                  <XStack justifyContent="space-between" gap="$3">
                    <SizableText size="$bodySm" color="$textSubdued">
                      {getAssistInstrumentLabel(intl, receipt.instrument)} ·{' '}
                      {receipt.size} {receipt.baseSymbol} ·{' '}
                      {receipt.estimatedNotional} {receipt.quoteSymbol}
                    </SizableText>
                    <SizableText size="$bodySm" color="$textSubdued">
                      {formatAssistDateTime(intl, receipt.createdAt)}
                    </SizableText>
                  </XStack>
                  <SizableText size="$bodySm" color="$textSubdued">
                    {receipt.result.orderId
                      ? intl.formatMessage(
                          {
                            id: ETranslations.swap_page_assist_ui_order,
                          },
                          {
                            value0: receipt.result.orderId,
                          },
                        )
                      : intl.formatMessage({
                          id: ETranslations.swap_page_assist_ui_the_exchange_has_accepted,
                        })}
                    {' · '}
                    {receipt.result.signedBy === 'agent'
                      ? intl.formatMessage({
                          id: ETranslations.swap_page_assist_ui_restricted_proxy_signature,
                        })
                      : intl.formatMessage({
                          id: ETranslations.swap_page_assist_ui_hardware_signature,
                        })}
                  </SizableText>
                </YStack>
              </Stack>
            ))}
          </YStack>
        ) : (
          <YStack py="$10" alignItems="center" gap="$2">
            <Icon name="ReceiptOutline" size="$8" color="$iconSubdued" />
            <SizableText size="$bodyMdMedium" color="$text">
              {intl.formatMessage({
                id: ETranslations.swap_page_assist_ui_no_execution_record_yet,
              })}
            </SizableText>
          </YStack>
        )
      ) : filteredTasks.length ? (
        <YStack gap="$2">
          {filteredTasks.map((task) => {
            const active = isAssistTaskActive(task);
            const directionLabel = task.orderPlan.reduceOnly
              ? intl.formatMessage({
                  id: ETranslations.swap_page_assist_ui_reduce_positions,
                })
              : task.orderPlan.side === 'buy'
              ? intl.formatMessage({
                  id: ETranslations.swap_page_assist_ui_buy,
                })
              : intl.formatMessage({
                  id: ETranslations.swap_page_assist_ui_sell,
                });
            const account = task.accountAddress
              ? `${task.accountAddress.slice(
                  0,
                  6,
                )}...${task.accountAddress.slice(-4)}`
              : intl.formatMessage({
                  id: ETranslations.swap_page_assist_ui_unbound_account,
                });
            return (
              <Stack
                key={task.id}
                p="$3.5"
                borderRadius="$3"
                borderWidth="$px"
                borderColor={active ? UNIONKEY_ORANGE : '$borderSubdued'}
                bg="$bg"
                cursor="pointer"
                hoverStyle={{
                  bg: '$bgHover',
                }}
                onPress={() => onOpenTask(task)}
              >
                <YStack gap="$3">
                  <XStack
                    alignItems="flex-start"
                    justifyContent="space-between"
                    gap="$3"
                  >
                    <YStack flex={1}>
                      <SizableText size="$headingSm" color="$text">
                        {directionLabel} {task.baseSymbol}
                      </SizableText>
                      <SizableText size="$bodySm" color="$textSubdued">
                        {getAssistInstrumentLabel(intl, task.instrument)} ·{' '}
                        {task.baseSymbol}/{task.quoteSymbol} ·{' '}
                        {task.orderPlan.amount}{' '}
                        {task.orderPlan.amountUnit === 'base'
                          ? task.baseSymbol
                          : task.quoteSymbol}
                      </SizableText>
                    </YStack>
                    <Badge badgeType={active ? 'success' : 'default'}>
                      {getAssistStatusLabel(intl, task)}
                    </Badge>
                  </XStack>

                  <YStack gap="$1">
                    <XStack justifyContent="space-between" gap="$3">
                      <SizableText size="$bodySm" color="$textSubdued">
                        {intl.formatMessage({
                          id: ETranslations.swap_page_assist_ui_trigger_condition,
                        })}
                      </SizableText>
                      <SizableText
                        size="$bodySmMedium"
                        color="$text"
                        textAlign="right"
                        flex={1}
                      >
                        {getAssistTriggerLabel(intl, task)}
                      </SizableText>
                    </XStack>
                    <XStack justifyContent="space-between" gap="$3">
                      <SizableText size="$bodySm" color="$textSubdued">
                        {intl.formatMessage({
                          id: ETranslations.swap_page_assist_ui_account,
                        })}
                      </SizableText>
                      <SizableText size="$bodySm" color="$textSubdued">
                        {account}
                      </SizableText>
                    </XStack>
                    <XStack justifyContent="space-between" gap="$3">
                      <SizableText size="$bodySm" color="$textSubdued">
                        {intl.formatMessage({
                          id: ETranslations.swap_page_assist_ui_update_time,
                        })}
                      </SizableText>
                      <SizableText size="$bodySm" color="$textSubdued">
                        {formatAssistDateTime(intl, task.updatedAt)}
                      </SizableText>
                    </XStack>
                    {task.executionResult?.orderId ? (
                      <XStack justifyContent="space-between" gap="$3">
                        <SizableText size="$bodySm" color="$textSubdued">
                          {intl.formatMessage({
                            id: ETranslations.swap_page_assist_ui_order_id,
                          })}
                        </SizableText>
                        <SizableText size="$bodySm" color="$textSubdued">
                          {task.executionResult.orderId}
                        </SizableText>
                      </XStack>
                    ) : null}
                    {task.error ? (
                      <SizableText size="$bodySm" color="$textCritical">
                        {getLocalizedAssistTaskError(intl, task.error)}
                      </SizableText>
                    ) : null}
                  </YStack>

                  <XStack justifyContent="flex-end" gap="$2">
                    {isAssistTaskCancellable(task) ? (
                      <Button
                        size="small"
                        variant="secondary"
                        loading={loading}
                        onPress={(event) => {
                          event.stopPropagation();
                          onCancelTask(task);
                        }}
                      >
                        {intl.formatMessage({
                          id: ETranslations.swap_page_assist_ui_stop_task,
                        })}
                      </Button>
                    ) : null}
                    {!active ? (
                      <Button
                        size="small"
                        variant="secondary"
                        onPress={(event) => {
                          event.stopPropagation();
                          onDeleteTask(task);
                        }}
                      >
                        <XStack alignItems="center" gap="$1">
                          <Icon
                            name="DeleteOutline"
                            size="$4"
                            color="$iconCritical"
                          />
                          <SizableText
                            size="$bodySmMedium"
                            color="$textCritical"
                          >
                            {intl.formatMessage({
                              id: ETranslations.swap_page_assist_ui_delete,
                            })}
                          </SizableText>
                        </XStack>
                      </Button>
                    ) : null}
                    <Button
                      size="small"
                      variant="secondary"
                      onPress={(event) => {
                        event.stopPropagation();
                        onOpenTask(task);
                      }}
                    >
                      {(task.status === 'ready' ||
                        task.status === 'awaitingSignature') &&
                      task.authorizationMode === 'confirmEach'
                        ? intl.formatMessage({
                            id: ETranslations.swap_page_assist_ui_go_to_confirm_execution,
                          })
                        : intl.formatMessage({
                            id: ETranslations.swap_page_assist_ui_view_details,
                          })}
                    </Button>
                  </XStack>
                </YStack>
              </Stack>
            );
          })}
        </YStack>
      ) : (
        <YStack py="$10" alignItems="center" gap="$2">
          <Icon name="Calendar3HistoryOutline" size="$8" color="$iconSubdued" />
          <SizableText size="$bodyMdMedium" color="$text">
            {intl.formatMessage({
              id: ETranslations.swap_page_assist_ui_no_related_tasks_yet,
            })}
          </SizableText>
          <SizableText size="$bodySm" color="$textSubdued">
            {intl.formatMessage({
              id: ETranslations.swap_page_assist_ui_after_creating_a_new_intelligent_operation_task_it_w,
            })}
          </SizableText>
        </YStack>
      )}
    </YStack>
  );
}
function UnionKeyAssistPanel() {
  const intl = useIntl();
  const [assistView, setAssistView] = useState<'command' | 'tasks'>('command');
  const [assistSite, setAssistSite] =
    useState<IUnionKeyAssistSiteId>('hyperliquid');
  const [assistRequirement, setAssistRequirement] = useState('');
  const [authorizationMode, setAuthorizationMode] =
    useState<IUnionKeyAssistAuthorizationMode>('confirmEach');
  const [allowedSymbols, setAllowedSymbols] = useState('BTC, ETH, SOL');
  const [maxOrderNotional, setMaxOrderNotional] = useState('500');
  const [maxDailyNotional, setMaxDailyNotional] = useState('1000');
  const [maxLeverage, setMaxLeverage] = useState('3');
  const [maxAgentSlippage, setMaxAgentSlippage] = useState('0.5');
  const [authorizationHours, setAuthorizationHours] = useState('24');
  const [agentGrant, setAgentGrant] = useState<IUnionKeyAssistAgentGrant>();
  const [assistTasks, setAssistTasks] = useState<IUnionKeyAssistTask[]>([]);
  const [executionReceipts, setExecutionReceipts] = useState<
    IUnionKeyAssistExecutionReceipt[]
  >([]);
  const [tradeRuntime, setTradeRuntime] = useState<{
    environment: 'testnet' | 'mainnet';
    supervision: 'local';
    unionKeyFeeEnabled: boolean;
  }>();
  const [activeTaskId, setActiveTaskId] = useState<string>();
  const [activeTask, setActiveTask] = useState<IUnionKeyAssistTask>();
  const [assistAnalysis, setAssistAnalysis] =
    useState<IUnionKeyAssistMarketAnalysis>();
  const [taskLoading, setTaskLoading] = useState(false);
  const [taskError, setTaskError] = useState('');
  const [assistPreflightBlocked, setAssistPreflightBlocked] = useState(false);
  const [assistPaymentSymbol, setAssistPaymentSymbol] = useState('USDC');
  const [assistPaymentOptions, setAssistPaymentOptions] = useState<string[]>([
    'USDC',
  ]);
  const swapFromAddressInfo = useSwapAddressInfo(ESwapDirectionType.FROM);
  const accountId = swapFromAddressInfo.accountInfo?.account?.id ?? '';
  const networkId = swapFromAddressInfo.networkId ?? '';
  const parsedAssistRequirement = useMemo(() => {
    try {
      return parseUnionKeyAssistRequirement(assistRequirement);
    } catch {
      return undefined;
    }
  }, [assistRequirement]);
  const assistHasExplicitPayment =
    /(?:用|使用|花)\s*\$?\s*[\d,.]*\s*[a-z0-9]{2,12}|\b(?:with|using)\s+[a-z0-9]{2,12}\b|\b[a-z0-9]{2,12}\s*(?:\/|兑|换成|兑换成|to)\s*[a-z0-9]{2,12}\b/i.test(
      assistRequirement,
    );
  const showAssistPaymentOptions =
    parsedAssistRequirement?.orderPlan.side === 'buy' &&
    getUnionKeyTradeInstrument(assistRequirement) === 'spot' &&
    !assistHasExplicitPayment;
  useEffect(() => {
    const baseSymbol = parsedAssistRequirement?.baseSymbol;
    if (!showAssistPaymentOptions || !baseSymbol) {
      return;
    }
    let cancelled = false;
    void backgroundApiProxy.serviceUnionKeyTrade
      .getAssistPaymentOptions({ baseSymbol })
      .then((options) => {
        if (cancelled) {
          return;
        }
        const resolvedOptions = options.length ? options : ['USDC'];
        setAssistPaymentOptions(resolvedOptions);
        setAssistPaymentSymbol((current) =>
          resolvedOptions.includes(current) ? current : resolvedOptions[0],
        );
      })
      .catch(() => {
        if (!cancelled) {
          // Task creation still validates the real route. Keep the default
          // quote asset selectable if metadata is temporarily slow.
          setAssistPaymentOptions(['USDC']);
          setAssistPaymentSymbol('USDC');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [parsedAssistRequirement?.baseSymbol, showAssistPaymentOptions]);
  const { navigationToMessageConfirmAsync } = useSignatureConfirm({
    accountId,
    networkId,
  });
  const buildRiskPolicy = useCallback((): IUnionKeyAssistRiskPolicy => {
    const validHours = Number(authorizationHours);
    return {
      allowedSymbols: allowedSymbols
        .split(/[\s,，]+/)
        .map((symbol) => symbol.trim().toUpperCase())
        .filter(Boolean),
      maxOrderNotional,
      maxDailyNotional,
      maxLeverage: Number(maxLeverage),
      maxSlippagePercent: maxAgentSlippage,
      requireStopLoss: authorizationMode === 'delegated',
      expiresAt:
        Date.now() +
        (Number.isFinite(validHours) ? validHours : 0) * 60 * 60 * 1000,
    };
  }, [
    allowedSymbols,
    authorizationHours,
    authorizationMode,
    maxAgentSlippage,
    maxDailyNotional,
    maxLeverage,
    maxOrderNotional,
  ]);
  const loadTask = useCallback(async () => {
    const [tasks, receipts, runtime, currentGrant] = await Promise.all([
      backgroundApiProxy.serviceUnionKeyTrade.getAssistTasks(),
      backgroundApiProxy.serviceUnionKeyTrade.getExecutionReceipts(),
      backgroundApiProxy.serviceUnionKeyTrade.getTradeRuntimeInfo(),
      swapFromAddressInfo.address
        ? backgroundApiProxy.serviceUnionKeyTrade.getAgentGrant(
            swapFromAddressInfo.address,
          )
        : Promise.resolve(undefined),
    ]);
    setExecutionReceipts(receipts);
    setTradeRuntime(runtime);
    setAgentGrant(currentGrant);
    const normalizedAddress = swapFromAddressInfo.address?.toLowerCase();
    const accountTasks = tasks.filter(
      (task) =>
        !normalizedAddress ||
        !task.accountAddress ||
        task.accountAddress.toLowerCase() === normalizedAddress,
    );
    setAssistTasks(accountTasks);
    const currentTask = activeTaskId
      ? accountTasks.find((task) => task.id === activeTaskId)
      : accountTasks.find(
          (task) =>
            task.status === 'draft' ||
            task.status === 'authorizing' ||
            task.status === 'monitoring' ||
            task.status === 'ready' ||
            task.status === 'awaitingSignature' ||
            task.status === 'submitting',
        );
    setActiveTask(currentTask);
    if (activeTaskId && !currentTask) {
      setActiveTaskId(undefined);
    }
    if (!activeTaskId && currentTask) {
      setActiveTaskId(currentTask.id);
      setAssistSite(currentTask.siteId);
      setAssistRequirement(currentTask.requirement);
      setAuthorizationMode(currentTask.authorizationMode);
    }
  }, [activeTaskId, swapFromAddressInfo.address]);
  useEffect(() => {
    void backgroundApiProxy.serviceUnionKeyTrade.resumeAssistTasks();
    void loadTask();
    const interval = setInterval(() => {
      void loadTask();
    }, 3000);
    return () => clearInterval(interval);
  }, [loadTask]);
  const signTypedData = useCallback(
    async (typedData: object) => {
      if (
        !accountId ||
        !networkId ||
        !swapFromAddressInfo.address ||
        !networkUtils.isEvmNetwork({
          networkId,
        })
      ) {
        throw new Error(
          intl.formatMessage({
            id: ETranslations.swap_page_assist_ui_please_first_select_an_evm_account_in_the_wallet_for,
          }),
        );
      }
      const dataMessage = JSON.stringify(typedData);
      return navigationToMessageConfirmAsync({
        accountId,
        networkId,
        unsignedMessage: {
          type: EMessageTypesEth.TYPED_DATA_V4,
          message: dataMessage,
          payload: [swapFromAddressInfo.address.toLowerCase(), dataMessage],
        },
        walletInternalSign: true,
      });
    },
    [
      accountId,
      intl,
      navigationToMessageConfirmAsync,
      networkId,
      swapFromAddressInfo.address,
    ],
  );
  const handleAssistAction = useCallback(async () => {
    setTaskLoading(true);
    setTaskError('');
    setAssistPreflightBlocked(false);
    try {
      if (
        activeTask &&
        (assistRequirement.trim() !== activeTask.requirement.trim() ||
          (showAssistPaymentOptions &&
            assistPaymentSymbol !== activeTask.quoteSymbol))
      ) {
        if (activeTask.status === 'submitting') {
          throw new Error(
            intl.formatMessage({
              id: ETranslations.swap_page_assist_ui_the_current_task_is_being_submitted_and_a_new_task_c,
            }),
          );
        }
        if (
          activeTask.status !== 'completed' &&
          activeTask.status !== 'cancelled' &&
          activeTask.status !== 'error'
        ) {
          await backgroundApiProxy.serviceUnionKeyTrade.cancelAssistTask(
            activeTask.id,
          );
        }
        if (!swapFromAddressInfo.address) {
          throw new Error(
            intl.formatMessage({
              id: ETranslations.swap_page_assist_ui_please_select_the_evm_account_for_hyperliquid_tradin,
            }),
          );
        }
        const replacementTask =
          await backgroundApiProxy.serviceUnionKeyTrade.createAssistTask({
            siteId: assistSite,
            accountAddress: swapFromAddressInfo.address,
            authorizationMode,
            requirement: assistRequirement,
            paymentSymbol: showAssistPaymentOptions
              ? assistPaymentSymbol
              : undefined,
            riskPolicy: buildRiskPolicy(),
          });
        setActiveTaskId(replacementTask.id);
        setActiveTask(replacementTask);
        Toast.success({
          title: intl.formatMessage({
            id: ETranslations.swap_page_assist_ui_the_mission_plan_has_been_regenerated_with_new_conte,
          }),
        });
        return;
      }
      if (activeTask?.status === 'monitoring') {
        const cancelledTask =
          await backgroundApiProxy.serviceUnionKeyTrade.cancelAssistTask(
            activeTask.id,
          );
        setActiveTask(cancelledTask);
        return;
      }
      if (
        activeTask?.status === 'ready' ||
        activeTask?.status === 'awaitingSignature'
      ) {
        if (activeTask.authorizationMode === 'delegated') {
          throw new Error(
            intl.formatMessage({
              id: ETranslations.swap_page_assist_ui_restricted_agent_is_executing_please_wait_to_check_t,
            }),
          );
        }
        const executionAccountAddress = swapFromAddressInfo.address;
        if (!executionAccountAddress) {
          throw new Error(
            intl.formatMessage({
              id: ETranslations.swap_page_assist_ui_please_select_the_evm_account_for_hyperliquid_tradin,
            }),
          );
        }
        const preparedTask =
          await backgroundApiProxy.serviceUnionKeyTrade.prepareAssistTaskExecution(
            {
              taskId: activeTask.id,
              accountAddress: executionAccountAddress,
            },
          );
        setActiveTask(preparedTask);
        if (!preparedTask.preparedOrder) {
          throw new Error(
            intl.formatMessage({
              id: ETranslations.swap_page_assist_ui_order_preparation_failed_please_try_again,
            }),
          );
        }
        const signatures: string[] = [];
        for (const preparedAction of preparedTask.preparedOrder.actions) {
          signatures.push(await signTypedData(preparedAction.typedData));
        }
        const completedTask =
          await backgroundApiProxy.serviceUnionKeyTrade.submitAssistTaskExecution(
            {
              taskId: activeTask.id,
              accountAddress: executionAccountAddress,
              signatures,
            },
          );
        setActiveTask(completedTask);
        Toast.success({
          title:
            completedTask.executionResult?.status === 'resting'
              ? intl.formatMessage({
                  id: ETranslations.swap_page_assist_ui_limit_order_has_been_placed,
                })
              : intl.formatMessage({
                  id: ETranslations.swap_page_assist_ui_order_has_been_submitted,
                }),
        });
        return;
      }
      if (
        activeTask?.status === 'draft' ||
        activeTask?.status === 'authorizing'
      ) {
        if (!activeTask.riskAssessment.passed) {
          throw new Error(
            intl.formatMessage({
              id: ETranslations.swap_page_assist_ui_the_current_trading_plan_has_not_passed_risk_control,
            }),
          );
        }
        if (activeTask.authorizationMode === 'delegated' && !agentGrant) {
          const approval =
            await backgroundApiProxy.serviceUnionKeyTrade.prepareAgentAuthorization(
              activeTask.id,
            );
          const signature = await signTypedData(approval.typedData);
          const result =
            await backgroundApiProxy.serviceUnionKeyTrade.submitAgentAuthorization(
              {
                taskId: activeTask.id,
                approvalId: approval.id,
                signature,
              },
            );
          setAgentGrant(result.grant);
          setActiveTask(result.task);
        }
        const activatedTask =
          await backgroundApiProxy.serviceUnionKeyTrade.activateAssistTask({
            taskId: activeTask.id,
          });
        setActiveTask(activatedTask);
        Toast.success({
          title:
            activeTask.authorizationMode === 'delegated'
              ? intl.formatMessage({
                  id: ETranslations.swap_page_assist_ui_restricted_agent_started,
                })
              : intl.formatMessage({
                  id: ETranslations.swap_page_assist_ui_price_monitoring_has_been_started,
                }),
        });
        return;
      }
      if (
        activeTask?.status === 'completed' ||
        activeTask?.status === 'cancelled' ||
        activeTask?.status === 'error'
      ) {
        setActiveTask(undefined);
        setActiveTaskId(undefined);
        return;
      }
      const selectedSite = assistSites.find((site) => site.id === assistSite);
      if (!selectedSite?.enabled) {
        throw new Error(
          intl.formatMessage({
            id: ETranslations.swap_page_assist_ui_the_dealer_s_agent_signature_is_being_accessed,
          }),
        );
      }
      if (!swapFromAddressInfo.address) {
        throw new Error(
          intl.formatMessage({
            id: ETranslations.swap_page_assist_ui_please_select_the_evm_account_for_hyperliquid_tradin,
          }),
        );
      }
      const task =
        await backgroundApiProxy.serviceUnionKeyTrade.createAssistTask({
          siteId: assistSite,
          accountAddress: swapFromAddressInfo.address,
          authorizationMode,
          requirement: assistRequirement,
          paymentSymbol: showAssistPaymentOptions
            ? assistPaymentSymbol
            : undefined,
          riskPolicy: buildRiskPolicy(),
        });
      setActiveTaskId(task.id);
      setActiveTask(task);
      Toast.success({
        title: task.riskAssessment.passed
          ? intl.formatMessage({
              id: ETranslations.swap_page_assist_ui_the_trading_plan_has_been_generated_please_check_it_,
            })
          : intl.formatMessage({
              id: ETranslations.swap_page_assist_ui_the_trading_plan_has_been_generated_but_the_risk_con,
            }),
      });
    } catch (error) {
      const rawMessage =
        error instanceof Error
          ? error.message
          : intl.formatMessage({
              id: ETranslations.swap_page_assist_ui_failed_to_create_agent_task,
            });
      const shouldBlock = isAssistFundsOrRouteError(rawMessage);
      const unsupportedMarket = isAssistUnsupportedMarketError(rawMessage);
      let message = intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_failed_to_create_agent_task,
      });
      if (shouldBlock) {
        message = intl.formatMessage({
          id: ETranslations.swap_page_assist_error_insufficient_funds_or_route,
        });
      } else if (unsupportedMarket) {
        message = intl.formatMessage({
          id: ETranslations.swap_page_alert_no_provider_supports_trade,
        });
      }
      setAssistPreflightBlocked(shouldBlock || unsupportedMarket);
      setTaskError(message);
      Toast.error({
        title: message,
      });
      await loadTask();
    } finally {
      setTaskLoading(false);
    }
  }, [
    activeTask,
    agentGrant,
    assistSite,
    assistPaymentSymbol,
    assistRequirement,
    authorizationMode,
    buildRiskPolicy,
    intl,
    loadTask,
    showAssistPaymentOptions,
    signTypedData,
    swapFromAddressInfo.address,
  ]);
  const handleAnalyzeAssistMarket = useCallback(async () => {
    setTaskLoading(true);
    setTaskError('');
    try {
      const analysis =
        await backgroundApiProxy.serviceUnionKeyTrade.analyzeAssistMarket(
          assistRequirement,
        );
      setAssistAnalysis(analysis);
    } catch {
      const message = intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_market_analysis_failed,
      });
      setTaskError(message);
      Toast.error({
        title: message,
      });
    } finally {
      setTaskLoading(false);
    }
  }, [assistRequirement, intl]);
  const handleCancelTask = useCallback(
    async (task: IUnionKeyAssistTask) => {
      setTaskLoading(true);
      setTaskError('');
      try {
        const cancelledTask =
          await backgroundApiProxy.serviceUnionKeyTrade.cancelAssistTask(
            task.id,
          );
        if (activeTaskId === task.id) {
          setActiveTask(cancelledTask);
        }
        await loadTask();
        Toast.success({
          title: intl.formatMessage({
            id: ETranslations.swap_page_assist_ui_task_has_stopped,
          }),
        });
      } catch {
        const message = intl.formatMessage({
          id: ETranslations.swap_page_assist_ui_failed_to_cancel_task,
        });
        setTaskError(message);
        Toast.error({
          title: message,
        });
      } finally {
        setTaskLoading(false);
      }
    },
    [activeTaskId, intl, loadTask],
  );
  const handleCancelAssistTask = useCallback(async () => {
    if (activeTask) {
      await handleCancelTask(activeTask);
    }
  }, [activeTask, handleCancelTask]);
  const handleOpenAssistTask = useCallback((task: IUnionKeyAssistTask) => {
    setActiveTaskId(task.id);
    setActiveTask(task);
    setAssistSite(task.siteId);
    setAssistRequirement(task.requirement);
    setAuthorizationMode(task.authorizationMode);
    setAllowedSymbols(task.riskPolicy.allowedSymbols.join(', '));
    setMaxOrderNotional(task.riskPolicy.maxOrderNotional);
    setMaxDailyNotional(task.riskPolicy.maxDailyNotional);
    setMaxLeverage(String(task.riskPolicy.maxLeverage));
    setMaxAgentSlippage(task.riskPolicy.maxSlippagePercent);
    setAuthorizationHours(
      String(
        Math.max(
          1,
          Math.ceil(
            (task.riskPolicy.expiresAt - Date.now()) / (60 * 60 * 1000),
          ),
        ),
      ),
    );
    setAssistAnalysis(undefined);
    setTaskError('');
    setAssistView('command');
  }, []);
  const handleDeleteAssistTask = useCallback(
    async (task: IUnionKeyAssistTask) => {
      setTaskLoading(true);
      setTaskError('');
      try {
        await backgroundApiProxy.serviceUnionKeyTrade.deleteAssistTask(task.id);
        setAssistTasks((currentTasks) =>
          currentTasks.filter((item) => item.id !== task.id),
        );
        if (activeTaskId === task.id) {
          setActiveTaskId(undefined);
          setActiveTask(undefined);
          setAssistRequirement('');
        }
        Toast.success({
          title: intl.formatMessage({
            id: ETranslations.swap_page_assist_ui_task_record_has_been_deleted,
          }),
        });
      } catch {
        const message = intl.formatMessage({
          id: ETranslations.swap_page_assist_ui_delete_task_failed,
        });
        setTaskError(message);
        Toast.error({
          title: message,
        });
      } finally {
        setTaskLoading(false);
      }
    },
    [activeTaskId, intl],
  );
  const handleRequestDeleteAssistTask = useCallback(
    (task: IUnionKeyAssistTask) => {
      const dialog = Dialog.show({
        title: intl.formatMessage({
          id: ETranslations.swap_page_assist_ui_delete_task_record,
        }),
        description:
          task.status === 'completed'
            ? intl.formatMessage({
                id: ETranslations.swap_page_assist_ui_this_will_only_delete_the_unionkey_local_task_record,
              })
            : intl.formatMessage({
                id: ETranslations.swap_page_assist_ui_this_task_record_cannot_be_restored_after_deletion,
              }),
        icon: 'DeleteOutline',
        tone: 'destructive',
        showCancelButton: true,
        showConfirmButton: true,
        onConfirm: async () => {
          await dialog.close();
          await handleDeleteAssistTask(task);
        },
      });
    },
    [handleDeleteAssistTask, intl],
  );
  const handleCancelRestingOrder = useCallback(async () => {
    if (!activeTask || !swapFromAddressInfo.address) {
      return;
    }
    setTaskLoading(true);
    setTaskError('');
    try {
      const preparedAction =
        await backgroundApiProxy.serviceUnionKeyTrade.prepareAssistOrderCancellation(
          {
            taskId: activeTask.id,
            accountAddress: swapFromAddressInfo.address,
          },
        );
      const signature = await signTypedData(preparedAction.typedData);
      const updatedTask =
        await backgroundApiProxy.serviceUnionKeyTrade.submitAssistOrderCancellation(
          {
            taskId: activeTask.id,
            accountAddress: swapFromAddressInfo.address,
            signature,
          },
        );
      setActiveTask(updatedTask);
      await loadTask();
      Toast.success({
        title: intl.formatMessage({
          id: ETranslations.swap_page_assist_ui_the_exchange_has_accepted_the_order_cancellation_req,
        }),
      });
    } catch {
      const message = intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_cancellation_failed,
      });
      setTaskError(message);
      Toast.error({
        title: message,
      });
    } finally {
      setTaskLoading(false);
    }
  }, [activeTask, intl, loadTask, signTypedData, swapFromAddressInfo.address]);
  const handleRequestCancelRestingOrder = useCallback(() => {
    const dialog = Dialog.show({
      title: intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_cancel_hyperliquid_pending_order,
      }),
      description: intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_the_current_hardware_account_signature_will_be_used_,
      }),
      icon: 'XCircleOutline',
      showCancelButton: true,
      showConfirmButton: true,
      onConfirm: async () => {
        await dialog.close();
        await handleCancelRestingOrder();
      },
    });
  }, [handleCancelRestingOrder, intl]);
  const handleEmergencyStop = useCallback(async () => {
    if (!swapFromAddressInfo.address) {
      return;
    }
    setTaskLoading(true);
    try {
      const stoppedCount =
        await backgroundApiProxy.serviceUnionKeyTrade.stopAllAssistTasks(
          swapFromAddressInfo.address,
        );
      await loadTask();
      Toast.success({
        title: intl.formatMessage(
          {
            id: ETranslations.swap_page_assist_ui_local_agent_tasks_have_been_stopped,
          },
          {
            value0: stoppedCount,
          },
        ),
      });
    } catch {
      const message = intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_emergency_stop_failed,
      });
      setTaskError(message);
      Toast.error({
        title: message,
      });
    } finally {
      setTaskLoading(false);
    }
  }, [intl, loadTask, swapFromAddressInfo.address]);
  const handleRequestEmergencyStop = useCallback(() => {
    const dialog = Dialog.show({
      title: intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_stop_all_local_proxy_operations,
      }),
      description: intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_immediately_stop_monitoring_the_current_account_and_,
      }),
      icon: 'XCircleOutline',
      tone: 'destructive',
      showCancelButton: true,
      showConfirmButton: true,
      onConfirm: async () => {
        await dialog.close();
        await handleEmergencyStop();
      },
    });
  }, [handleEmergencyStop, intl]);
  const handleReauthorizeAgent = useCallback(async () => {
    if (!activeTask || !['draft', 'authorizing'].includes(activeTask.status)) {
      return;
    }
    setTaskLoading(true);
    setTaskError('');
    try {
      const approval =
        await backgroundApiProxy.serviceUnionKeyTrade.prepareAgentAuthorization(
          activeTask.id,
        );
      const signature = await signTypedData(approval.typedData);
      const result =
        await backgroundApiProxy.serviceUnionKeyTrade.submitAgentAuthorization({
          taskId: activeTask.id,
          approvalId: approval.id,
          signature,
        });
      setAgentGrant(result.grant);
      setActiveTask(result.task);
      Toast.success({
        title: intl.formatMessage({
          id: ETranslations.swap_page_assist_ui_limited_proxy_permissions_updated,
        }),
      });
    } catch {
      const message = intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_agent_authorization_failed,
      });
      setTaskError(message);
      Toast.error({
        title: message,
      });
      await loadTask();
    } finally {
      setTaskLoading(false);
    }
  }, [activeTask, intl, loadTask, signTypedData]);
  const handleRevokeAgent = useCallback(async () => {
    if (!swapFromAddressInfo.address || !agentGrant) {
      return;
    }
    setTaskLoading(true);
    setTaskError('');
    try {
      const approval =
        await backgroundApiProxy.serviceUnionKeyTrade.prepareAgentRevocation({
          accountAddress: swapFromAddressInfo.address,
        });
      const signature = await signTypedData(approval.typedData);
      await backgroundApiProxy.serviceUnionKeyTrade.submitAgentRevocation({
        accountAddress: swapFromAddressInfo.address,
        approvalId: approval.id,
        signature,
      });
      setAgentGrant(undefined);
      await loadTask();
      Toast.success({
        title: intl.formatMessage({
          id: ETranslations.swap_page_assist_ui_hyperliquid_proxy_permission_has_been_revoked,
        }),
      });
    } catch {
      const message = intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_failed_to_revoke_proxy,
      });
      setTaskError(message);
      Toast.error({
        title: message,
      });
    } finally {
      setTaskLoading(false);
    }
  }, [agentGrant, intl, loadTask, signTypedData, swapFromAddressInfo.address]);
  const assistRunning = activeTask?.status === 'monitoring';
  const assistReady =
    activeTask?.status === 'ready' ||
    activeTask?.status === 'awaitingSignature';
  const assistDraft =
    activeTask?.status === 'draft' || activeTask?.status === 'authorizing';
  const assistTerminal =
    activeTask?.status === 'completed' ||
    activeTask?.status === 'cancelled' ||
    activeTask?.status === 'error';
  const assistTaskChanged =
    !!activeTask &&
    (assistRequirement.trim() !== activeTask.requirement.trim() ||
      (showAssistPaymentOptions &&
        assistPaymentSymbol !== activeTask.quoteSymbol));
  const assistReadOnlyIntent = isAssistReadOnlyIntent(assistRequirement);
  const assistDetectedTradeIntent = isAssistTradeIntent(assistRequirement);
  const assistUnsupportedIntent = isAssistUnsupportedIntent(assistRequirement);
  const assistTradeIntent =
    assistDetectedTradeIntent && !assistUnsupportedIntent;
  const assistTradeValidationError = assistTradeIntent
    ? getAssistTradeValidationError(assistRequirement)
    : '';
  const displayedAssistTradeValidationError = assistTradeValidationError
    ? intl.formatMessage({
        id:
          assistTradeValidationError === 'missingAmount'
            ? ETranslations.swap_page_assist_error_missing_amount
            : ETranslations.swap_page_assist_error_invalid_instruction,
      })
    : '';
  const assistUnknownIntent =
    !!assistRequirement.trim() &&
    !assistReadOnlyIntent &&
    !assistDetectedTradeIntent;
  const selectedSite = assistSites.find((site) => site.id === assistSite);
  const hasAgentGrant = agentGrant?.status === 'active';
  const assistError = activeTask?.error
    ? intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_execution_failed,
      })
    : taskError;
  const assistFundsOrRouteBlocked =
    assistPreflightBlocked || isAssistFundsOrRouteError(assistError ?? '');
  const assistPaymentRouteReady =
    !showAssistPaymentOptions || assistPaymentOptions.length > 0;
  const displayedAssistError =
    assistError && isAssistFundsOrRouteError(assistError)
      ? intl.formatMessage({
          id: ETranslations.swap_page_assist_error_insufficient_funds_or_route,
        })
      : assistError;
  const assetMomentum = new BigNumber(
    assistAnalysis?.signal?.momentumPercent ?? 0,
  );
  const assetDirection = assetMomentum.isGreaterThan(0)
    ? 'bullish'
    : assetMomentum.isLessThan(0)
    ? 'bearish'
    : 'neutral';
  const getMarketDirectionLabel = (
    direction: 'bullish' | 'bearish' | 'neutral',
  ) =>
    intl.formatMessage({
      id:
        direction === 'bullish'
          ? ETranslations.swap_page_assist_trend_bullish
          : direction === 'bearish'
          ? ETranslations.swap_page_assist_trend_bearish
          : ETranslations.swap_page_assist_trend_neutral,
    });
  const marketBullishCount =
    assistAnalysis?.markets?.filter((market) => market.direction === 'bullish')
      .length ?? 0;
  const marketBearishCount =
    assistAnalysis?.markets?.filter((market) => market.direction === 'bearish')
      .length ?? 0;
  let assistStatusLabel = activeTask
    ? getAssistStatusLabel(intl, activeTask)
    : intl.formatMessage({
        id: ETranslations.swap_page_assist_status_pending_setup,
      });
  if (assistUnknownIntent) {
    assistStatusLabel = intl.formatMessage({
      id: ETranslations.global_unknown,
    });
  }
  if (assistTradeValidationError) {
    assistStatusLabel = intl.formatMessage({
      id: ETranslations.swap_page_assist_status_incomplete,
    });
  }
  if (assistUnsupportedIntent) {
    assistStatusLabel = intl.formatMessage({
      id: ETranslations.swap_page_assist_status_unsupported,
    });
  }
  if (assistReadOnlyIntent) {
    assistStatusLabel = intl.formatMessage({
      id: ETranslations.swap_page_assist_status_read_only,
    });
  }
  let assistPrimaryActionLabel = activeTask
    ? getAssistButtonLabel({
        intl,
        task: activeTask,
        hasAgentGrant,
      })
    : intl.formatMessage({
        id: ETranslations.swap_page_assist_start,
      });
  if (assistTaskChanged) {
    assistPrimaryActionLabel = intl.formatMessage({
      id: ETranslations.swap_page_assist_button_create_task,
    });
  }
  if (assistUnknownIntent) {
    assistPrimaryActionLabel = intl.formatMessage({
      id: ETranslations.swap_page_assist_button_unrecognized,
    });
  }
  if (assistTradeValidationError) {
    assistPrimaryActionLabel = intl.formatMessage({
      id: ETranslations.swap_page_assist_button_incomplete,
    });
  }
  if (assistUnsupportedIntent) {
    assistPrimaryActionLabel = intl.formatMessage({
      id: ETranslations.swap_page_assist_button_unsupported_cancel,
    });
  }
  if (assistReadOnlyIntent) {
    assistPrimaryActionLabel = intl.formatMessage({
      id: ETranslations.swap_page_assist_button_view_market,
    });
  }
  if (assistView === 'tasks') {
    return (
      <UnionKeyAssistTaskCenter
        tasks={assistTasks}
        receipts={executionReceipts}
        loading={taskLoading}
        onBack={() => setAssistView('command')}
        onOpenTask={handleOpenAssistTask}
        onCancelTask={(task) => void handleCancelTask(task)}
        onDeleteTask={handleRequestDeleteAssistTask}
      />
    );
  }
  return (
    <YStack gap="$4">
      <XStack alignItems="center" justifyContent="space-between" gap="$3">
        <XStack alignItems="center" gap="$2.5" flex={1}>
          <Stack
            w="$10"
            h="$10"
            borderRadius="$3"
            bg={UNIONKEY_ORANGE}
            alignItems="center"
            justifyContent="center"
            style={{
              boxShadow: '0 0 20px rgba(247,107,21,0.42)',
            }}
          >
            <Icon name="BrainAiSolid" size="$5" color="white" />
          </Stack>
          <YStack flex={1}>
            <SizableText size="$headingMd" color="$text">
              {intl.formatMessage({
                id: ETranslations.swap_page_assist_title,
              })}
            </SizableText>
            <SizableText size="$bodySm" color="$textSubdued">
              {intl.formatMessage({
                id: ETranslations.swap_page_assist_subtitle,
              })}
            </SizableText>
          </YStack>
        </XStack>
        <XStack alignItems="center" gap="$2">
          <Badge badgeType="default">
            {getAssistEnvironmentLabel(
              intl,
              activeTask?.environment ?? tradeRuntime?.environment ?? 'testnet',
            )}
          </Badge>
          <Badge badgeType={assistReady ? 'success' : 'default'}>
            {assistStatusLabel}
          </Badge>
          <Button
            size="small"
            variant="secondary"
            onPress={() => setAssistView('tasks')}
          >
            <XStack alignItems="center" gap="$1">
              <Icon name="Calendar3HistoryOutline" size="$4" />
              <SizableText size="$bodySmMedium">
                {intl.formatMessage(
                  {
                    id: ETranslations.swap_page_assist_task_count,
                  },
                  {
                    count: assistTasks.length,
                  },
                )}
              </SizableText>
            </XStack>
          </Button>
          {assistTasks.some(isAssistTaskActive) ? (
            <Button
              size="small"
              variant="secondary"
              loading={taskLoading}
              onPress={handleRequestEmergencyStop}
            >
              {intl.formatMessage({
                id: ETranslations.swap_page_assist_emergency_stop,
              })}
            </Button>
          ) : null}
        </XStack>
      </XStack>

      <Stack
        p="$3.5"
        borderRadius="$4"
        borderWidth="$px"
        borderColor={
          assistUnknownIntent
            ? '$borderCritical'
            : assistRequirement.trim()
            ? UNIONKEY_ORANGE
            : '$borderSubdued'
        }
        bg="$bg"
        style={
          assistRequirement.trim() && !assistUnknownIntent
            ? {
                boxShadow: '0 0 18px rgba(247,107,21,0.10)',
              }
            : undefined
        }
      >
        <YStack gap="$3">
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap="$2">
              <Icon name="AiTextOutline" size="$4" color="$iconCaution" />
              <SizableText size="$bodyMdMedium" color="$text">
                {intl.formatMessage({
                  id: ETranslations.swap_page_assist_prompt_title,
                })}
              </SizableText>
            </XStack>
            <SizableText size="$bodySm" color="$textSubdued">
              {intl.formatMessage({
                id: ETranslations.swap_page_assist_realtime_data,
              })}
            </SizableText>
          </XStack>
          <TextArea
            minHeight={96}
            value={assistRequirement}
            onChangeText={(value) => {
              setAssistRequirement(value);
              setAssistAnalysis(undefined);
              setTaskError('');
              setAssistPreflightBlocked(false);
            }}
            placeholder={intl.formatMessage({
              id: ETranslations.swap_page_assist_placeholder,
            })}
            color="$text"
            bg="$bgSubdued"
            borderColor="$borderSubdued"
            placeholderTextColor="$textPlaceholder"
            editable
          />
          {!assistRequirement.trim() ? (
            <XStack gap="$2" flexWrap="wrap">
              {[
                intl.formatMessage({
                  id: ETranslations.swap_page_assist_suggestion_eth_price,
                }),
                intl.formatMessage({
                  id: ETranslations.swap_page_assist_suggestion_btc_trend,
                }),
                intl.formatMessage({
                  id: ETranslations.swap_page_assist_suggestion_sol_price,
                }),
              ].map((prompt) => (
                <Stack
                  key={prompt}
                  px="$2.5"
                  py="$1.5"
                  borderRadius="$2"
                  bg="$bgSubdued"
                  cursor="pointer"
                  hoverStyle={{
                    bg: '$bgHover',
                  }}
                  onPress={() => setAssistRequirement(prompt)}
                >
                  <SizableText size="$bodySm" color="$textSubdued">
                    {prompt}
                  </SizableText>
                </Stack>
              ))}
            </XStack>
          ) : null}
          {assistUnknownIntent ? (
            <SizableText size="$bodySm" color="$textCritical">
              {intl.formatMessage({
                id: ETranslations.swap_page_assist_error_unrecognized_intent,
              })}
            </SizableText>
          ) : assistUnsupportedIntent ? (
            <SizableText size="$bodySm" color="$textCritical">
              {intl.formatMessage({
                id: ETranslations.swap_page_assist_error_unsupported_cancel,
              })}
            </SizableText>
          ) : assistTradeValidationError ? (
            <SizableText size="$bodySm" color="$textCritical">
              {displayedAssistTradeValidationError}
            </SizableText>
          ) : null}
        </YStack>
      </Stack>

      {assistTradeIntent ? (
        <YStack gap="$4">
          <XStack gap="$2" flexWrap="wrap">
            {assistSites.map((site) => {
              const selected = assistSite === site.id;
              const disabled = !!activeTask && !assistTerminal;
              let siteOpacity = 1;
              if (!site.enabled) {
                siteOpacity = 0.48;
              } else if (disabled) {
                siteOpacity = 0.72;
              }
              return (
                <Stack
                  key={site.id}
                  minHeight={54}
                  flexBasis="45%"
                  flexGrow={1}
                  px="$2.5"
                  py="$2.5"
                  borderRadius="$3"
                  borderWidth="$px"
                  borderColor={selected ? UNIONKEY_ORANGE : '$borderSubdued'}
                  bg={selected ? UNIONKEY_ORANGE_SOFT : '$bg'}
                  cursor={site.enabled && !disabled ? 'pointer' : 'default'}
                  opacity={siteOpacity}
                  onPress={() => {
                    if (site.enabled && !disabled) {
                      setAssistSite(site.id);
                    }
                  }}
                  style={
                    selected
                      ? {
                          boxShadow: '0 0 16px rgba(247,107,21,0.16)',
                        }
                      : undefined
                  }
                >
                  <XStack alignItems="center" gap="$2">
                    <Image size="$7" borderRadius="$2">
                      <Image.Source src={site.logo} />
                      <Image.Fallback
                        alignItems="center"
                        justifyContent="center"
                        bg={site.accent}
                      >
                        <SizableText
                          size="$bodySmMedium"
                          color={site.textColor ?? 'white'}
                        >
                          {site.name.slice(0, 1)}
                        </SizableText>
                      </Image.Fallback>
                    </Image>
                    <YStack flex={1}>
                      <SizableText size="$bodySmMedium" color="$text">
                        {site.name}
                      </SizableText>
                      <SizableText size="$bodySm" color="$textSubdued">
                        {site.enabled
                          ? intl.formatMessage({
                              id: ETranslations.swap_page_assist_provider_api_direct,
                            })
                          : intl.formatMessage({
                              id: ETranslations.coming_soon,
                            })}
                      </SizableText>
                    </YStack>
                  </XStack>
                </Stack>
              );
            })}
          </XStack>

          {showAssistPaymentOptions ? (
            <YStack gap="$2">
              <SizableText size="$bodySmMedium" color="$textSubdued">
                {intl.formatMessage({
                  id: ETranslations.swap_page_assist_pay_with,
                })}
              </SizableText>
              <XStack gap="$2" flexWrap="wrap">
                {assistPaymentOptions.length ? (
                  assistPaymentOptions.map((symbol) => {
                    const selected = assistPaymentSymbol === symbol;
                    return (
                      <Stack
                        key={symbol}
                        px="$3"
                        py="$2"
                        borderRadius="$3"
                        borderWidth="$px"
                        borderColor={
                          selected ? UNIONKEY_ORANGE : '$borderSubdued'
                        }
                        bg={selected ? UNIONKEY_ORANGE_SOFT : '$bg'}
                        cursor="pointer"
                        onPress={() => {
                          setAssistPaymentSymbol(symbol);
                          setTaskError('');
                          setAssistPreflightBlocked(false);
                        }}
                      >
                        <SizableText
                          size="$bodySmMedium"
                          color={selected ? '$text' : '$textSubdued'}
                        >
                          {symbol}
                        </SizableText>
                      </Stack>
                    );
                  })
                ) : (
                  <SizableText size="$bodySm" color="$textSubdued">
                    …
                  </SizableText>
                )}
              </XStack>
            </YStack>
          ) : null}

          <Stack
            p="$1"
            borderRadius="$3"
            borderWidth="$px"
            borderColor="$borderSubdued"
            bg="$bgSubdued"
          >
            <XStack gap="$1">
              {(
                [
                  {
                    mode: 'confirmEach',
                    title: intl.formatMessage({
                      id: ETranslations.swap_page_assist_mode_confirm_each,
                    }),
                    description: intl.formatMessage({
                      id: ETranslations.swap_page_assist_mode_confirm_each_desc,
                    }),
                  },
                  {
                    mode: 'delegated',
                    title: intl.formatMessage({
                      id: ETranslations.swap_page_assist_mode_delegated,
                    }),
                    description: intl.formatMessage({
                      id: ETranslations.swap_page_assist_mode_delegated_desc,
                    }),
                  },
                ] as const
              ).map((item) => {
                const selected = authorizationMode === item.mode;
                const disabled = !!activeTask && !assistTerminal;
                return (
                  <Stack
                    key={item.mode}
                    flex={1}
                    px="$3"
                    py="$2.5"
                    borderRadius="$2"
                    bg={selected ? '$bg' : 'transparent'}
                    borderWidth={selected ? '$px' : 0}
                    borderColor={selected ? UNIONKEY_ORANGE : 'transparent'}
                    opacity={disabled && !selected ? 0.5 : 1}
                    cursor={disabled ? 'default' : 'pointer'}
                    onPress={() => {
                      if (!disabled) {
                        setAuthorizationMode(item.mode);
                      }
                    }}
                  >
                    <SizableText
                      size="$bodySmMedium"
                      color={selected ? '$text' : '$textSubdued'}
                    >
                      {item.title}
                    </SizableText>
                    <SizableText size="$bodySm" color="$textSubdued">
                      {item.description}
                    </SizableText>
                  </Stack>
                );
              })}
            </XStack>
          </Stack>

          {authorizationMode === 'delegated' && hasAgentGrant ? (
            <XStack
              px="$3"
              py="$2.5"
              alignItems="center"
              justifyContent="space-between"
              gap="$3"
              borderWidth="$px"
              borderColor="$borderSubdued"
              borderRadius="$3"
              bg="$bg"
            >
              <XStack alignItems="center" gap="$2" flex={1}>
                <Icon
                  name="Shield2CheckOutline"
                  size="$4"
                  color="$iconSuccess"
                />
                <YStack flex={1}>
                  <SizableText size="$bodySmMedium" color="$text">
                    {intl.formatMessage({
                      id: ETranslations.swap_page_assist_agent_authorized,
                    })}
                  </SizableText>
                  <SizableText size="$bodySm" color="$textSubdued">
                    {agentGrant.agentAddress.slice(0, 8)}...
                    {agentGrant.agentAddress.slice(-6)} ·{' '}
                    {intl.formatMessage({
                      id: ETranslations.swap_page_assist_expires,
                    })}{' '}
                    {formatAssistDateTime(
                      intl,
                      agentGrant.riskPolicy.expiresAt,
                    )}
                  </SizableText>
                </YStack>
              </XStack>
              <Button
                size="small"
                variant="secondary"
                loading={taskLoading}
                onPress={() => void handleRevokeAgent()}
              >
                {intl.formatMessage({
                  id: ETranslations.global_revoke,
                })}
              </Button>
            </XStack>
          ) : null}

          {!activeTask || assistTerminal ? (
            <YStack gap="$2.5">
              <SizableText size="$bodySmMedium" color="$textSubdued">
                {authorizationMode === 'delegated'
                  ? intl.formatMessage({
                      id: ETranslations.swap_page_assist_agent_policy,
                    })
                  : intl.formatMessage({
                      id: ETranslations.swap_page_assist_task_risk_controls,
                    })}
              </SizableText>
              <XStack gap="$2" flexWrap="wrap">
                <YStack minWidth={150} flex={2} gap="$1">
                  <SizableText size="$bodySm" color="$textSubdued">
                    {intl.formatMessage({
                      id: ETranslations.swap_page_assist_allowed_symbols,
                    })}
                  </SizableText>
                  <Input
                    size="small"
                    value={allowedSymbols}
                    onChangeText={setAllowedSymbols}
                    placeholder="BTC, ETH, SOL"
                  />
                </YStack>
                <YStack minWidth={92} flex={1} gap="$1">
                  <SizableText size="$bodySm" color="$textSubdued">
                    {intl.formatMessage({
                      id: ETranslations.swap_page_assist_max_order,
                    })}
                  </SizableText>
                  <Input
                    size="small"
                    keyboardType="decimal-pad"
                    value={maxOrderNotional}
                    onChangeText={setMaxOrderNotional}
                    placeholder="500"
                  />
                </YStack>
                <YStack minWidth={92} flex={1} gap="$1">
                  <SizableText size="$bodySm" color="$textSubdued">
                    {intl.formatMessage({
                      id: ETranslations.swap_page_assist_max_daily,
                    })}
                  </SizableText>
                  <Input
                    size="small"
                    keyboardType="decimal-pad"
                    value={maxDailyNotional}
                    onChangeText={setMaxDailyNotional}
                    placeholder="1000"
                  />
                </YStack>
                <YStack minWidth={84} flex={1} gap="$1">
                  <SizableText size="$bodySm" color="$textSubdued">
                    {intl.formatMessage({
                      id: ETranslations.swap_page_assist_max_leverage,
                    })}
                  </SizableText>
                  <Input
                    size="small"
                    keyboardType="number-pad"
                    value={maxLeverage}
                    onChangeText={setMaxLeverage}
                    placeholder="3"
                  />
                </YStack>
                <YStack minWidth={84} flex={1} gap="$1">
                  <SizableText size="$bodySm" color="$textSubdued">
                    {intl.formatMessage({
                      id: ETranslations.swap_page_assist_max_slippage,
                    })}
                  </SizableText>
                  <Input
                    size="small"
                    keyboardType="decimal-pad"
                    value={maxAgentSlippage}
                    onChangeText={setMaxAgentSlippage}
                    placeholder="0.5"
                  />
                </YStack>
                <YStack minWidth={84} flex={1} gap="$1">
                  <SizableText size="$bodySm" color="$textSubdued">
                    {intl.formatMessage({
                      id: ETranslations.swap_page_assist_validity_hours,
                    })}
                  </SizableText>
                  <Input
                    size="small"
                    keyboardType="number-pad"
                    value={authorizationHours}
                    onChangeText={setAuthorizationHours}
                    placeholder="24"
                  />
                </YStack>
              </XStack>
              {authorizationMode === 'delegated' ? (
                <SizableText size="$bodySm" color="$textCaution">
                  {intl.formatMessage({
                    id: ETranslations.swap_page_assist_agent_policy_notice,
                  })}
                </SizableText>
              ) : null}
            </YStack>
          ) : null}
        </YStack>
      ) : null}

      {assistAnalysis ? (
        <YStack
          px="$3.5"
          py="$3"
          gap="$3"
          borderRadius="$3"
          borderWidth="$px"
          borderColor="$borderSubdued"
          bg="$bg"
        >
          <XStack alignItems="center" justifyContent="space-between" gap="$3">
            <XStack alignItems="center" gap="$2">
              <Icon
                name="ChartTrendingUpOutline"
                size="$5"
                color="$iconCaution"
              />
              <SizableText size="$bodyMdMedium" color="$text">
                {assistAnalysis.scope === 'market'
                  ? intl.formatMessage({
                      id: ETranslations.swap_page_assist_market_overview,
                    })
                  : intl.formatMessage(
                      {
                        id: ETranslations.swap_page_assist_live_market,
                      },
                      {
                        symbol: assistAnalysis.baseSymbol ?? '',
                      },
                    )}
              </SizableText>
            </XStack>
            <Badge badgeType="success">
              {intl.formatMessage({
                id: ETranslations.swap_page_assist_read_only_badge,
              })}
            </Badge>
          </XStack>
          {assistAnalysis.scope === 'market' ? (
            <XStack gap="$2" flexWrap="wrap">
              {assistAnalysis.markets?.map((market) => {
                const momentum = new BigNumber(market.momentumPercent ?? 0);
                const trendColor =
                  market.direction === 'bullish'
                    ? '$textSuccess'
                    : market.direction === 'bearish'
                    ? '$textCritical'
                    : '$textSubdued';
                return (
                  <YStack
                    key={market.symbol}
                    flex={1}
                    minWidth={120}
                    p="$3"
                    gap="$1"
                    borderRadius="$3"
                    borderWidth="$px"
                    borderColor="$borderSubdued"
                    bg="$bgSubdued"
                  >
                    <XStack
                      alignItems="center"
                      justifyContent="space-between"
                      gap="$2"
                    >
                      <SizableText size="$bodyMdMedium" color="$text">
                        {market.symbol}
                      </SizableText>
                      <SizableText size="$bodySmMedium" color={trendColor}>
                        {getMarketDirectionLabel(market.direction)}
                      </SizableText>
                    </XStack>
                    <SizableText size="$headingLg" color="$text">
                      ${new BigNumber(market.currentPrice).toFormat()}
                    </SizableText>
                    <SizableText size="$bodySm" color={trendColor}>
                      15 min {momentum.isGreaterThan(0) ? '+' : ''}
                      {momentum.toFixed(2)}%
                    </SizableText>
                  </YStack>
                );
              })}
            </XStack>
          ) : (
            <SizableText size="$heading2xl" color="$text">
              ${new BigNumber(assistAnalysis.currentPrice ?? 0).toFormat()}
            </SizableText>
          )}
          <SizableText size="$bodyMd" color="$textSubdued">
            {assistAnalysis.scope === 'market'
              ? intl.formatMessage(
                  {
                    id: ETranslations.swap_page_assist_market_summary,
                  },
                  {
                    bullish: marketBullishCount,
                    bearish: marketBearishCount,
                  },
                )
              : assistAnalysis.signal
              ? intl.formatMessage(
                  {
                    id: ETranslations.swap_page_assist_asset_summary,
                  },
                  {
                    direction: getMarketDirectionLabel(assetDirection),
                    momentum: assistAnalysis.signal.momentumPercent,
                  },
                )
              : intl.formatMessage({
                  id: ETranslations.swap_page_assist_market_data_insufficient,
                })}
          </SizableText>
          <XStack justifyContent="space-between" gap="$3">
            <SizableText size="$bodySm" color="$textSubdued">
              {intl.formatMessage({
                id: ETranslations.swap_page_assist_data_source,
              })}
            </SizableText>
            <SizableText size="$bodySm" color="$textSubdued">
              {new Date(assistAnalysis.updatedAt).toLocaleTimeString()}
            </SizableText>
          </XStack>
        </YStack>
      ) : null}

      {activeTask && !assistTaskChanged ? (
        <Stack
          overflow="hidden"
          borderRadius="$4"
          borderWidth="$px"
          borderColor={assistReady ? UNIONKEY_ORANGE : '$borderSubdued'}
          bg="$bg"
        >
          <YStack>
            <XStack
              px="$3.5"
              py="$3"
              alignItems="center"
              justifyContent="space-between"
              bg={assistReady ? UNIONKEY_ORANGE_SOFT : '$bgSubdued'}
            >
              <YStack>
                <SizableText size="$headingSm" color="$text">
                  {activeTask.orderPlan.reduceOnly
                    ? intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_reduce_positions,
                      })
                    : activeTask.orderPlan.side === 'buy'
                    ? intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_buy,
                      })
                    : intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_sell,
                      })}{' '}
                  {activeTask.baseSymbol}
                </SizableText>
                <SizableText size="$bodySm" color="$textSubdued">
                  {activeTask.instrument === 'spot'
                    ? 'Hyperliquid Spot'
                    : 'Hyperliquid Perp'}{' '}
                  · {activeTask.baseSymbol}/{activeTask.quoteSymbol} ·{' '}
                  {activeTask.orderPlan.orderType === 'market'
                    ? intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_market_price_ioc,
                      })
                    : intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_limit_price_gtc,
                      })}{' '}
                  ·{' '}
                  {activeTask.authorizationMode === 'delegated'
                    ? intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_restricted_proxy,
                      })
                    : intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_confirm_transaction_by_transaction,
                      })}
                </SizableText>
              </YStack>
              <YStack alignItems="flex-end">
                <SizableText size="$bodyLgMedium" color="$text">
                  {activeTask.currentPrice
                    ? `$${new BigNumber(activeTask.currentPrice).toFormat()}`
                    : intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_getting,
                      })}
                </SizableText>
                <SizableText size="$bodySm" color="$textSubdued">
                  {intl.formatMessage({
                    id: ETranslations.swap_page_assist_ui_hyperliquid_real_time_quotes,
                  })}
                </SizableText>
              </YStack>
            </XStack>

            <XStack px="$3.5" py="$3" gap="$4" flexWrap="wrap">
              <YStack minWidth={92} flex={1}>
                <SizableText size="$bodySm" color="$textSubdued">
                  {intl.formatMessage({
                    id: ETranslations.swap_page_assist_ui_order_amount,
                  })}
                </SizableText>
                <SizableText size="$bodyMdMedium" color="$text">
                  {activeTask.orderPlan.amount}{' '}
                  {activeTask.orderPlan.amountUnit === 'base'
                    ? activeTask.baseSymbol
                    : activeTask.quoteSymbol}
                </SizableText>
              </YStack>
              <YStack minWidth={120} flex={1}>
                <SizableText size="$bodySm" color="$textSubdued">
                  {intl.formatMessage({
                    id: ETranslations.swap_page_assist_ui_trigger_condition,
                  })}
                </SizableText>
                <SizableText size="$bodyMdMedium" color="$text">
                  {getAssistTriggerLabel(intl, activeTask)}
                </SizableText>
              </YStack>
              <YStack minWidth={84} flex={1}>
                <SizableText size="$bodySm" color="$textSubdued">
                  {intl.formatMessage({
                    id: ETranslations.swap_page_assist_ui_maximum_slippage,
                  })}
                </SizableText>
                <SizableText size="$bodyMdMedium" color="$text">
                  {activeTask.orderPlan.maxSlippagePercent}%
                </SizableText>
              </YStack>
              <YStack minWidth={84} flex={1}>
                <SizableText size="$bodySm" color="$textSubdued">
                  {intl.formatMessage({
                    id: ETranslations.swap_page_assist_ui_leverage_mode,
                  })}
                </SizableText>
                <SizableText size="$bodyMdMedium" color="$text">
                  {activeTask.orderPlan.leverage
                    ? `${activeTask.orderPlan.leverage}x · ${
                        activeTask.orderPlan.marginMode === 'cross'
                          ? intl.formatMessage({
                              id: ETranslations.swap_page_assist_ui_full_warehouse,
                            })
                          : intl.formatMessage({
                              id: ETranslations.swap_page_assist_ui_isolated_position,
                            })
                      }`
                    : activeTask.instrument === 'spot'
                    ? intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_spot_no_leverage,
                      })
                    : intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_keep_account_settings,
                      })}
                </SizableText>
              </YStack>
            </XStack>

            <YStack
              px="$3.5"
              py="$3"
              gap="$2"
              borderTopWidth="$px"
              borderColor="$borderSubdued"
            >
              <XStack
                alignItems="center"
                justifyContent="space-between"
                gap="$3"
              >
                <SizableText size="$bodySmMedium" color="$text">
                  {intl.formatMessage({
                    id: ETranslations.swap_page_assist_ui_deterministic_risk_control,
                  })}
                </SizableText>
                <SizableText
                  size="$bodySmMedium"
                  color={
                    activeTask.riskAssessment.passed
                      ? '$textSuccess'
                      : '$textCritical'
                  }
                >
                  {activeTask.riskAssessment.passed
                    ? intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_all_passed,
                      })
                    : intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_execution_blocked,
                      })}
                </SizableText>
              </XStack>
              <XStack gap="$2" flexWrap="wrap">
                {activeTask.riskAssessment.checks.map((check) => {
                  const localizedCheck = getAssistRiskCheckText({
                    intl,
                    task: activeTask,
                    check,
                  });
                  return (
                    <XStack
                      key={check.id}
                      minWidth={145}
                      flex={1}
                      alignItems="center"
                      gap="$1.5"
                    >
                      <Icon
                        name={
                          check.status === 'passed'
                            ? 'CheckRadioSolid'
                            : check.status === 'blocked'
                            ? 'XCircleOutline'
                            : 'InfoCircleOutline'
                        }
                        size="$3.5"
                        color={
                          check.status === 'passed'
                            ? '$iconSuccess'
                            : check.status === 'blocked'
                            ? '$iconCritical'
                            : '$iconSubdued'
                        }
                      />
                      <YStack flex={1}>
                        <SizableText size="$bodySmMedium" color="$text">
                          {localizedCheck.label}
                        </SizableText>
                        <SizableText
                          size="$bodySm"
                          color="$textSubdued"
                          numberOfLines={2}
                        >
                          {localizedCheck.detail}
                        </SizableText>
                      </YStack>
                    </XStack>
                  );
                })}
              </XStack>
              <SizableText size="$bodySm" color="$textSubdued">
                {intl.formatMessage({
                  id: ETranslations.swap_page_assist_ui_estimated_nominal_value,
                })}
                {activeTask.riskAssessment.estimatedNotional}{' '}
                {activeTask.quoteSymbol}
                {activeTask.riskAssessment.estimatedMaxLoss
                  ? intl.formatMessage(
                      {
                        id: ETranslations.swap_page_assist_ui_stop_loss_estimate,
                      },
                      {
                        value0: activeTask.riskAssessment.estimatedMaxLoss,
                        value1: activeTask.quoteSymbol,
                      },
                    )
                  : ''}
              </SizableText>
            </YStack>

            {activeTask.preparedOrder ? (
              <XStack
                px="$3.5"
                py="$3"
                gap="$4"
                borderTopWidth="$px"
                borderColor="$borderSubdued"
                flexWrap="wrap"
              >
                <YStack flex={1} minWidth={112}>
                  <SizableText size="$bodySm" color="$textSubdued">
                    {intl.formatMessage({
                      id: ETranslations.swap_page_assist_ui_final_quantity,
                    })}
                  </SizableText>
                  <SizableText size="$bodyMdMedium" color="$text">
                    {activeTask.preparedOrder.size} {activeTask.baseSymbol}
                  </SizableText>
                </YStack>
                <YStack flex={1} minWidth={112}>
                  <SizableText size="$bodySm" color="$textSubdued">
                    {activeTask.instrument === 'spot'
                      ? intl.formatMessage({
                          id: ETranslations.swap_page_assist_ui_available_payment_balance,
                        })
                      : intl.formatMessage({
                          id: ETranslations.swap_page_assist_ui_available_margin,
                        })}
                  </SizableText>
                  <SizableText size="$bodyMdMedium" color="$text">
                    {activeTask.preparedOrder.preview.availableToTrade
                      ? `${new BigNumber(
                          activeTask.preparedOrder.preview.availableToTrade,
                        ).toFixed(2)} USDC`
                      : intl.formatMessage({
                          id: ETranslations.swap_page_assist_ui_the_exchange_did_not_return,
                        })}
                  </SizableText>
                </YStack>
                <YStack flex={1} minWidth={112}>
                  <SizableText size="$bodySm" color="$textSubdued">
                    {activeTask.instrument === 'spot'
                      ? intl.formatMessage({
                          id: ETranslations.swap_page_assist_ui_settlement_method,
                        })
                      : intl.formatMessage({
                          id: ETranslations.swap_page_assist_ui_estimated_occupied_margin,
                        })}
                  </SizableText>
                  <SizableText size="$bodyMdMedium" color="$text">
                    {activeTask.instrument === 'spot'
                      ? intl.formatMessage({
                          id: ETranslations.swap_page_assist_ui_spot_full_settlement,
                        })
                      : `${
                          activeTask.preparedOrder.preview
                            .estimatedInitialMargin ?? '--'
                        } USDC`}
                  </SizableText>
                </YStack>
                <YStack flex={1} minWidth={112}>
                  <SizableText size="$bodySm" color="$textSubdued">
                    {intl.formatMessage({
                      id: ETranslations.swap_page_assist_ui_transaction_fee_unionkey_fee,
                    })}
                  </SizableText>
                  <SizableText size="$bodyMdMedium" color="$text">
                    {activeTask.preparedOrder.preview.estimatedTradingFee ??
                      intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_waiting_for_exchange_to_return,
                      })}{' '}
                    / 0 {activeTask.quoteSymbol}
                  </SizableText>
                </YStack>
                {activeTask.instrument === 'perp' ? (
                  <>
                    <YStack flex={1} minWidth={112}>
                      <SizableText size="$bodySm" color="$textSubdued">
                        {intl.formatMessage({
                          id: ETranslations.swap_page_assist_ui_current_funding_rate,
                        })}
                      </SizableText>
                      <SizableText size="$bodyMdMedium" color="$text">
                        {activeTask.preparedOrder.preview.currentFundingRate
                          ? intl.formatMessage(
                              {
                                id: ETranslations.swap_page_assist_ui_hour,
                              },
                              {
                                value0: new BigNumber(
                                  activeTask.preparedOrder.preview.currentFundingRate,
                                )
                                  .multipliedBy(100)
                                  .toFixed(4),
                              },
                            )
                          : intl.formatMessage({
                              id: ETranslations.swap_page_assist_ui_the_exchange_did_not_return,
                            })}
                      </SizableText>
                    </YStack>
                    <YStack flex={1} minWidth={112}>
                      <SizableText size="$bodySm" color="$textSubdued">
                        {intl.formatMessage({
                          id: ETranslations.swap_page_assist_ui_liquidation_price_of_current_position,
                        })}
                      </SizableText>
                      <SizableText size="$bodyMdMedium" color="$text">
                        {activeTask.preparedOrder.preview
                          .currentLiquidationPrice
                          ? `$${activeTask.preparedOrder.preview.currentLiquidationPrice}`
                          : intl.formatMessage({
                              id: ETranslations.swap_page_assist_ui_no_existing_positions,
                            })}
                      </SizableText>
                    </YStack>
                  </>
                ) : null}
                <YStack flex={1} minWidth={112}>
                  <SizableText size="$bodySm" color="$textSubdued">
                    {intl.formatMessage({
                      id: ETranslations.swap_page_assist_ui_transaction_protection_price,
                    })}
                  </SizableText>
                  <SizableText size="$bodyMdMedium" color="$text">
                    ${activeTask.preparedOrder.limitPrice}
                  </SizableText>
                </YStack>
                {activeTask.preparedOrder.takeProfitPrice ? (
                  <YStack flex={1} minWidth={92}>
                    <SizableText size="$bodySm" color="$textSubdued">
                      {intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_take_profit_triggered,
                      })}
                    </SizableText>
                    <SizableText size="$bodyMdMedium" color="$text">
                      ${activeTask.preparedOrder.takeProfitPrice}
                    </SizableText>
                  </YStack>
                ) : null}
                {activeTask.preparedOrder.stopLossPrice ? (
                  <YStack flex={1} minWidth={92}>
                    <SizableText size="$bodySm" color="$textSubdued">
                      {intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_stop_loss_triggered,
                      })}
                    </SizableText>
                    <SizableText size="$bodyMdMedium" color="$text">
                      ${activeTask.preparedOrder.stopLossPrice}
                    </SizableText>
                  </YStack>
                ) : null}
              </XStack>
            ) : null}

            {activeTask.executionResult ? (
              <XStack
                px="$3.5"
                py="$3"
                borderTopWidth="$px"
                borderColor="$borderSubdued"
                justifyContent="space-between"
                gap="$3"
              >
                <SizableText size="$bodySmMedium" color="$textSuccess">
                  {activeTask.executionResult.status === 'resting'
                    ? intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_the_limit_order_has_been_entered_into_the_order_book,
                      })
                    : activeTask.executionResult.status === 'cancelled'
                    ? intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_the_exchange_pending_order_has_been_cancelled,
                      })
                    : intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_the_exchange_has_accepted_the_order,
                      })}
                  {' · '}
                  {activeTask.executionResult.signedBy === 'agent'
                    ? intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_transaction_agent_signature,
                      })
                    : intl.formatMessage({
                        id: ETranslations.swap_page_assist_ui_hardware_signature,
                      })}
                </SizableText>
                {activeTask.executionResult.orderId ? (
                  <SizableText size="$bodySm" color="$textSubdued">
                    #{activeTask.executionResult.orderId}
                  </SizableText>
                ) : null}
              </XStack>
            ) : null}
          </YStack>
        </Stack>
      ) : null}

      {displayedAssistError ? (
        <SizableText size="$bodySm" color="$textCritical">
          {displayedAssistError}
        </SizableText>
      ) : null}

      <XStack gap="$2">
        {activeTask?.executionResult?.status === 'resting' ? (
          <Button
            size="large"
            flex={1}
            variant="secondary"
            loading={taskLoading}
            onPress={handleRequestCancelRestingOrder}
          >
            {intl.formatMessage({
              id: ETranslations.swap_page_assist_ui_cancel_pending_order,
            })}
          </Button>
        ) : null}
        {assistReady || assistDraft ? (
          <Button
            size="large"
            flex={1}
            variant="secondary"
            loading={taskLoading}
            onPress={() => void handleCancelAssistTask()}
          >
            {intl.formatMessage({
              id: ETranslations.swap_page_assist_ui_cancel_task,
            })}
          </Button>
        ) : null}
        {assistDraft &&
        activeTask?.authorizationMode === 'delegated' &&
        hasAgentGrant ? (
          <Button
            size="large"
            flex={1}
            variant="secondary"
            loading={taskLoading}
            onPress={() => void handleReauthorizeAgent()}
          >
            {intl.formatMessage({
              id: ETranslations.swap_page_assist_ui_update_authorization,
            })}
          </Button>
        ) : null}
        <Button
          size="large"
          flex={assistReady || assistDraft ? 2 : 1}
          bg={assistRunning ? '$bgCritical' : UNIONKEY_ORANGE}
          color="$textInverse"
          loading={taskLoading || activeTask?.status === 'submitting'}
          disabled={
            !assistRequirement.trim() ||
            assistUnknownIntent ||
            assistUnsupportedIntent ||
            assistFundsOrRouteBlocked ||
            !assistPaymentRouteReady ||
            !!assistTradeValidationError ||
            (!assistReadOnlyIntent &&
              (activeTask?.status === 'submitting' ||
                (assistDraft && !activeTask.riskAssessment.passed) ||
                (assistReady &&
                  activeTask?.authorizationMode === 'delegated') ||
                (!selectedSite?.enabled && !activeTask)))
          }
          onPress={() =>
            void (assistReadOnlyIntent
              ? handleAnalyzeAssistMarket()
              : handleAssistAction())
          }
          style={{
            boxShadow: assistRunning
              ? undefined
              : '0 0 18px rgba(247,107,21,0.25)',
          }}
        >
          {assistPrimaryActionLabel}
        </Button>
      </XStack>
    </YStack>
  );
}
function UnionKeyInternalSwapPanel({
  quoteReady,
  providerName,
}: {
  quoteReady: boolean;
  providerName?: string;
}) {
  const intl = useIntl();
  const statusItems: [string, string][] = [
    [
      intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_execution_environment,
      }),
      intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_unionkey_internal,
      }),
    ],
    [
      intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_quotation_status,
      }),
      quoteReady
        ? intl.formatMessage({
            id: ETranslations.swap_page_assist_ui_ready,
          })
        : intl.formatMessage({
            id: ETranslations.swap_page_assist_ui_waiting_for_quotation,
          }),
    ],
    [
      intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_transaction_method,
      }),
      intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_instant_redemption,
      }),
    ],
    [
      intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_signature_control,
      }),
      intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_each_confirmation,
      }),
    ],
  ];
  if (providerName) {
    statusItems.push([
      intl.formatMessage({
        id: ETranslations.swap_page_assist_ui_liquidity_channel,
      }),
      providerName,
    ]);
  }
  return (
    <Stack
      p="$4"
      borderRadius="$5"
      borderWidth="$px"
      borderColor="$borderSubdued"
      bg="$bgSubdued"
    >
      <YStack gap="$4">
        <XStack alignItems="center" justifyContent="space-between" gap="$3">
          <XStack alignItems="center" gap="$2.5" flex={1}>
            <Stack
              w="$10"
              h="$10"
              borderRadius="$3"
              bg={UNIONKEY_ORANGE}
              alignItems="center"
              justifyContent="center"
              style={{
                boxShadow: '0 0 20px rgba(247,107,21,0.42)',
              }}
            >
              <Icon name="Shield2CheckOutline" size="$5" color="white" />
            </Stack>
            <YStack flex={1}>
              <SizableText size="$headingMd" color="$text">
                {intl.formatMessage({
                  id: ETranslations.swap_page_assist_ui_internal_flash_exchange,
                })}
              </SizableText>
              <SizableText size="$bodySm" color="$textSubdued">
                {intl.formatMessage({
                  id: ETranslations.swap_page_assist_ui_complete_quotations_and_exchanges_within_unionkey_wi,
                })}
              </SizableText>
            </YStack>
          </XStack>
          <Badge badgeType="success">
            {intl.formatMessage({
              id: ETranslations.swap_page_assist_ui_insider_trading,
            })}
          </Badge>
        </XStack>

        <XStack
          p="$3.5"
          gap="$3"
          alignItems="center"
          borderRadius="$3"
          borderWidth="$px"
          borderColor={UNIONKEY_ORANGE}
          bg={UNIONKEY_ORANGE_SOFT}
          style={{
            boxShadow: '0 0 18px rgba(247,107,21,0.18)',
          }}
        >
          <Stack
            w="$8"
            h="$8"
            borderRadius="$2.5"
            bg={UNIONKEY_ORANGE}
            alignItems="center"
            justifyContent="center"
          >
            <Icon name="FlashOutline" size="$4" color="white" />
          </Stack>
          <YStack flex={1}>
            <SizableText size="$bodyMdMedium" color="$text">
              {intl.formatMessage({
                id: ETranslations.swap_page_assist_ui_unionkey_internal_flash_exchange,
              })}
            </SizableText>
            <SizableText size="$bodySm" color="$textSubdued">
              {intl.formatMessage({
                id: ETranslations.swap_page_assist_ui_automatically_match_the_best_offer_currently_availab,
              })}
            </SizableText>
          </YStack>
        </XStack>

        <XStack gap="$2" flexWrap="wrap">
          {statusItems.map(([label, value]) => (
            <Stack
              key={label}
              flex={1}
              minWidth={120}
              p="$3"
              borderRadius="$3"
              borderWidth="$px"
              borderColor="$borderSubdued"
              bg="$bg"
            >
              <SizableText size="$bodySm" color="$textSubdued">
                {label}
              </SizableText>
              <SizableText size="$bodyMdMedium" color="$text">
                {value}
              </SizableText>
            </Stack>
          ))}
        </XStack>
      </YStack>
    </Stack>
  );
}
const NormalSwapBranch = ({
  storeName,
  tradeMode,
}: {
  storeName: EJotaiContextStoreNames;
  tradeMode: ITradeMode;
}) => {
  const navigation =
    useAppNavigation<IPageNavigationProp<IModalSwapParamList>>();
  const [quoteResult] = useSwapQuoteCurrentSelectAtom();
  const [swapTypeSwitch] = useSwapTypeSwitchAtom();
  const [alerts] = useSwapAlertsAtom();
  const [fromToken] = useSwapSelectFromTokenAtom();
  const [toToken] = useSwapSelectToTokenAtom();
  const [selectedFromTokenBalance] = useSwapSelectedFromTokenBalanceAtom();
  const [, setFromTokenAmount] = useSwapFromTokenAmountAtom();
  const { buildTx, wrappedTx, approveTx } = useSwapBuildTx();
  const { quoteAction, swapTypeSwitchAction } = useSwapActions().current;
  const { slippageItem } = useSwapSlippagePercentageModeInfo();
  const swapFromAddressInfo = useSwapAddressInfo(ESwapDirectionType.FROM);
  const swapToAddressInfo = useSwapAddressInfo(ESwapDirectionType.TO);
  useEffect(() => {
    if (tradeMode !== 'privacy') {
      return;
    }
    if (swapTypeSwitch !== ESwapTabSwitchType.SWAP) {
      void swapTypeSwitchAction(
        ESwapTabSwitchType.SWAP,
        swapFromAddressInfo.networkId,
      );
    }
  }, [
    swapFromAddressInfo.networkId,
    swapTypeSwitch,
    swapTypeSwitchAction,
    tradeMode,
  ]);
  const handleBuildTx = useCallback(() => {
    void buildTx();
  }, [buildTx]);
  const handleApprove = useCallback(
    (amount: string, isMax?: boolean, shouldResetApprove?: boolean) => {
      void approveTx(
        shouldResetApprove ? swapApproveResetValue : amount,
        isMax,
        shouldResetApprove ? amount : undefined,
      );
    },
    [approveTx],
  );
  const onSelectToken = useCallback(
    (type: ESwapDirectionType) => {
      const params = {
        type,
        storeName,
      };
      if (storeName === EJotaiContextStoreNames.swapModal) {
        navigation.push(EModalSwapRoutes.SwapTokenSelect, params);
      } else {
        navigation.pushModal(EModalRoutes.SwapModal, {
          screen: EModalSwapRoutes.SwapTokenSelect,
          params,
        });
      }
    },
    [navigation, storeName],
  );
  const onOpenProviderList = useCallback(() => {
    const params = {
      storeName,
    };
    if (storeName === EJotaiContextStoreNames.swapModal) {
      navigation.push(EModalSwapRoutes.SwapProviderSelect, params);
    } else {
      navigation.pushModal(EModalRoutes.SwapModal, {
        screen: EModalSwapRoutes.SwapProviderSelect,
        params,
      });
    }
  }, [navigation, storeName]);
  const onOpenRecipient = useCallback(() => {
    const params = {
      storeName,
    };
    if (storeName === EJotaiContextStoreNames.swapModal) {
      navigation.push(EModalSwapRoutes.SwapToAnotherAddress, params);
    } else {
      navigation.pushModal(EModalRoutes.SwapModal, {
        screen: EModalSwapRoutes.SwapToAnotherAddress,
        params,
      });
    }
  }, [navigation, storeName]);
  const refreshAction = useCallback(
    (manual?: boolean) => {
      void quoteAction(
        slippageItem,
        swapFromAddressInfo.address,
        swapFromAddressInfo.accountInfo?.account?.id,
        undefined,
        undefined,
        quoteResult?.kind ?? ESwapQuoteKind.SELL,
        manual,
        swapToAddressInfo.address,
      );
    },
    [
      quoteAction,
      quoteResult?.kind,
      slippageItem,
      swapFromAddressInfo.accountInfo?.account?.id,
      swapFromAddressInfo.address,
      swapToAddressInfo.address,
    ],
  );
  const onSelectPercentageStage = useCallback(
    (stage: number) => {
      const balance = new BigNumber(selectedFromTokenBalance ?? 0);
      if (balance.isNaN()) {
        return;
      }
      setFromTokenAmount({
        value: balance
          .multipliedBy(stage)
          .dividedBy(100)
          .decimalPlaces(8, BigNumber.ROUND_DOWN)
          .toFixed()
          .replace(/\.?0+$/, ''),
        isInput: true,
      });
    },
    [selectedFromTokenBalance, setFromTokenAmount],
  );
  if (tradeMode === 'assist') {
    return <UnionKeyAssistPanel />;
  }
  return (
    <YStack gap="$4">
      {tradeMode === 'privacy' ? (
        <UnionKeyInternalSwapPanel
          quoteReady={Boolean(quoteResult?.toAmount)}
          providerName={quoteResult?.info.providerName}
        />
      ) : null}
      <SwapQuoteInput
        onSelectToken={onSelectToken}
        onSelectPercentageStage={onSelectPercentageStage}
      />
      {quoteResult?.info.provider ? (
        <Stack
          p="$3.5"
          borderRadius="$3"
          borderWidth="$px"
          borderColor="$borderSubdued"
          bg="$bg"
        >
          <SwapProviderInfoItem
            fromToken={fromToken}
            toToken={toToken}
            providerIcon={quoteResult.info.providerLogo ?? ''}
            providerName={quoteResult.info.providerName ?? ''}
            isBest={quoteResult.isBest}
            onekeyFee={quoteResult.fee?.percentageFee}
            showLock={!!quoteResult.allowanceResult}
            onPress={tradeMode === 'normal' ? onOpenProviderList : undefined}
          />
        </Stack>
      ) : null}
      <SwapAlertContainer alerts={alerts.states} />
      <SwapQuoteResult
        quoteResult={quoteResult}
        refreshAction={refreshAction}
        onOpenProviderList={onOpenProviderList}
        onOpenRecipient={onOpenRecipient}
      />
      <SwapActionsState
        onBuildTx={handleBuildTx}
        onWrapped={wrappedTx}
        onApprove={handleApprove}
        onOpenRecipientAddress={onOpenRecipient}
        onSelectPercentageStage={onSelectPercentageStage}
      />
    </YStack>
  );
};
const SwapMainLoad = ({ pageType, swapInitParams }: ISwapMainLoadProps) => {
  const [activeBranch, setActiveBranch] = useState<ISwapBranch>('normal');
  const storeName = useMemo(
    () =>
      pageType === EPageType.modal
        ? EJotaiContextStoreNames.swapModal
        : EJotaiContextStoreNames.swap,
    [pageType],
  );
  useSwapInit(swapInitParams);
  return (
    <ScrollView>
      <YStack
        flex={1}
        marginHorizontal="auto"
        width="100%"
        maxWidth={pageType === EPageType.modal ? '100%' : 500}
      >
        <YStack pt="$2.5" px="$5" pb="$5" gap="$5" flex={1}>
          <SwapHeaderContainer
            pageType={pageType}
            activeUnionKeyBranch={activeBranch}
            onUnionKeyBranchChange={setActiveBranch}
          />

          {activeBranch === 'nft' ? (
            <NFTMarket />
          ) : (
            <NormalSwapBranch storeName={storeName} tradeMode={activeBranch} />
          )}
        </YStack>
      </YStack>
    </ScrollView>
  );
};
const SwapMainLandWithPageType = ({
  pageType,
  swapInitParams,
}: ISwapMainLoadProps) => (
  <SwapProviderMirror
    storeName={
      pageType === EPageType.modal
        ? EJotaiContextStoreNames.swapModal
        : EJotaiContextStoreNames.swap
    }
  >
    <SwapMainLoad pageType={pageType} swapInitParams={swapInitParams} />
  </SwapProviderMirror>
);
export default SwapMainLandWithPageType;
