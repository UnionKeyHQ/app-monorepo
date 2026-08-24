/* eslint-disable spellcheck/spell-checker */
import axios from 'axios';
import BigNumber from 'bignumber.js';
import {
  Signature,
  Wallet,
  getAddress,
  keccak256,
  toUtf8Bytes,
  verifyTypedData,
} from 'ethersV6';

import {
  backgroundClass,
  backgroundMethod,
} from '@unionkeyhq/shared/src/background/backgroundDecorators';
import secureStorageInstance from '@unionkeyhq/shared/src/storage/instance/secureStorageInstance';
import { generateUUID } from '@unionkeyhq/shared/src/utils/miscUtils';
import {
  buildUnionKeyHyperliquidActionHash,
  buildUnionKeyHyperliquidAgentApprovalTypedData,
  buildUnionKeyHyperliquidTypedData,
  formatUnionKeyHyperliquidPrice,
} from '@unionkeyhq/shared/src/utils/unionKeyHyperliquidUtils';
import {
  assertUnionKeyAssistRiskPolicy,
  assessUnionKeyAssistRisk,
  getUnionKeyMarketSymbol,
  getUnionKeyTradeInstrument,
  isUnionKeyAssistTriggerMet,
  parseUnionKeyAssistClosePositionIntent,
  parseUnionKeyAssistRequirement,
} from '@unionkeyhq/shared/src/utils/unionKeyTradeUtils';
import type {
  IActivateUnionKeyAssistTaskParams,
  ICreateUnionKeyAssistTaskParams,
  IPrepareUnionKeyAgentRevocationParams,
  IPrepareUnionKeyAssistExecutionParams,
  IPrepareUnionKeyAssistOrderCancellationParams,
  ISubmitUnionKeyAgentApprovalParams,
  ISubmitUnionKeyAgentRevocationParams,
  ISubmitUnionKeyAssistExecutionParams,
  ISubmitUnionKeyAssistOrderCancellationParams,
  IUnionKeyAgentApproval,
  IUnionKeyAssistAgentGrant,
  IUnionKeyAssistExecutionReceipt,
  IUnionKeyAssistExecutionResult,
  IUnionKeyAssistMarketAnalysis,
  IUnionKeyAssistMarketSignal,
  IUnionKeyAssistOrderPlan,
  IUnionKeyAssistPreparedAction,
  IUnionKeyAssistPreparedOrder,
  IUnionKeyAssistRiskAssessment,
  IUnionKeyAssistRiskPolicy,
  IUnionKeyAssistTask,
  IUnionKeyHyperliquidApproveAgentAction,
  IUnionKeyHyperliquidOrderAction,
  IUnionKeyHyperliquidOrderWire,
  IUnionKeyHyperliquidTradingAction,
} from '@unionkeyhq/shared/types/unionkey/trade';

import ServiceBase from './ServiceBase';

const HYPERLIQUID_ENVIRONMENT =
  process.env.UNIONKEY_HYPERLIQUID_ENV === 'mainnet'
    ? ('mainnet' as const)
    : ('testnet' as const);
const HYPERLIQUID_API_ORIGIN =
  HYPERLIQUID_ENVIRONMENT === 'mainnet'
    ? 'https://api.hyperliquid.xyz'
    : 'https://api.hyperliquid-testnet.xyz';
const HYPERLIQUID_INFO_URL = `${HYPERLIQUID_API_ORIGIN}/info`;
const HYPERLIQUID_EXCHANGE_URL = `${HYPERLIQUID_API_ORIGIN}/exchange`;
const HYPERLIQUID_AGENT_NAME = 'UnionKey AI';
const HYPERLIQUID_SIGNATURE_CHAIN_ID = '0xa4b1';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const MONITOR_INTERVAL_MS = 15_000;
const REQUEST_TIMEOUT_MS = 10_000;
const MARKET_METADATA_CACHE_MS = 30_000;
const SIGNATURE_TTL_MS = 2 * 60 * 1000;
const AGENT_REMOTE_VERIFY_INTERVAL_MS = 30_000;
const MIN_HYPERLIQUID_ORDER_NOTIONAL = 10;

type IHyperliquidCandle = {
  c: string;
};

type IHyperliquidMeta = {
  universe: Array<{
    name: string;
    szDecimals: number;
    maxLeverage?: number;
  }>;
};

type IHyperliquidAssetContext = {
  markPx?: string;
  midPx?: string;
  oraclePx?: string;
  funding?: string;
};

type IHyperliquidSpotMeta = {
  universe: Array<{
    name: string;
    index: number;
    tokens: [number, number];
  }>;
  tokens: Array<{
    name: string;
    index: number;
    szDecimals: number;
    weiDecimals: number;
    isCanonical?: boolean;
  }>;
};

type IHyperliquidSpotMetaResult = {
  meta: IHyperliquidSpotMeta;
  assetContexts: IHyperliquidAssetContext[];
};

type IHyperliquidSpotClearinghouseState = {
  balances?: Array<{
    coin: string;
    token: number;
    total: string;
    hold: string;
  }>;
};

type IHyperliquidClearinghouseState = {
  marginSummary?: {
    accountValue?: string;
    totalMarginUsed?: string;
  };
  withdrawable?: string;
  assetPositions?: Array<{
    position?: {
      coin?: string;
      szi?: string;
      liquidationPx?: string;
    };
  }>;
};

type IHyperliquidUserFees = {
  userCrossRate?: string;
  userAddRate?: string;
  userSpotCrossRate?: string;
  userSpotAddRate?: string;
};

type IHyperliquidOrderStatusResponse =
  | {
      status: 'order';
      order: {
        status: string;
        order?: {
          oid?: number;
        };
      };
    }
  | {
      status: 'unknownOid';
    };

type IHyperliquidOrderStatus =
  | {
      filled: {
        oid: number;
      };
    }
  | {
      resting: {
        oid: number;
      };
    }
  | {
      error: string;
    };

type IHyperliquidExchangeResponse =
  | {
      status: 'ok';
      response: {
        type: string;
        data?: {
          statuses?: Array<IHyperliquidOrderStatus | string>;
        };
      };
    }
  | {
      status: 'err';
      response: string;
    };

type IHyperliquidExtraAgent = {
  address?: string;
  agentAddress?: string;
  name?: string;
  validUntil?: number;
};

type IStoredAgentSecret = {
  version: 1;
  accountAddress: string;
  agentAddress: string;
  agentName: string;
  expiresAt: number;
  privateKey: string;
};

type IPendingAgentApproval = {
  approval: IUnionKeyAgentApproval;
  taskId?: string;
  privateKey?: string;
  riskPolicy?: IUnionKeyAssistRiskPolicy;
  validUntil: number;
};

const average = (values: number[]) =>
  values.reduce((total, value) => total + value, 0) / values.length;

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | {
          response?: string;
          message?: string;
        }
      | string
      | undefined;
    if (typeof responseData === 'string') {
      return responseData;
    }
    return (
      responseData?.response ||
      responseData?.message ||
      error.message ||
      '交易服务暂时不可用'
    );
  }
  return error instanceof Error ? error.message : '交易服务暂时不可用';
};

const normalizeWireNumber = (value: BigNumber.Value) =>
  new BigNumber(value).toFixed();

const buildClientOrderId = (taskId: string, orderIndex: number) =>
  keccak256(toUtf8Bytes(`${taskId}:${orderIndex}`)).slice(0, 34);

const getAgentSecureStorageKey = (accountAddress: string) =>
  `unionkey-hyperliquid-agent:${accountAddress.toLowerCase()}`;

const getApprovalTypes = (approval: IUnionKeyAgentApproval) => ({
  [approval.typedData.primaryType]:
    approval.typedData.types[approval.typedData.primaryType],
});

const getTradingTypes = (preparedAction: IUnionKeyAssistPreparedAction) => ({
  Agent: preparedAction.typedData.types.Agent,
});

const parseOrderExecutionResult = ({
  response,
  signedBy,
}: {
  response: IHyperliquidExchangeResponse;
  signedBy: IUnionKeyAssistExecutionResult['signedBy'];
}): IUnionKeyAssistExecutionResult => {
  if (response.status === 'err') {
    throw new Error(response.response || '交易所拒绝了订单');
  }
  const statuses = response.response.data?.statuses ?? [];
  const failedStatus = statuses.find(
    (status): status is { error: string } =>
      typeof status === 'object' && 'error' in status,
  );
  if (failedStatus) {
    throw new Error(failedStatus.error);
  }
  const orderIds = statuses
    .map((status) => {
      if (typeof status === 'string') {
        return undefined;
      }
      if ('filled' in status) {
        return String(status.filled.oid);
      }
      if ('resting' in status) {
        return String(status.resting.oid);
      }
      return undefined;
    })
    .filter((orderId): orderId is string => !!orderId);
  const firstStatus = statuses[0];
  let status: IUnionKeyAssistExecutionResult['status'] = 'accepted';
  if (
    firstStatus &&
    typeof firstStatus === 'object' &&
    'filled' in firstStatus
  ) {
    status = 'filled';
  } else if (
    firstStatus &&
    typeof firstStatus === 'object' &&
    'resting' in firstStatus
  ) {
    status = 'resting';
  }
  return {
    status,
    orderId: orderIds[0],
    orderIds,
    signedBy,
    submittedAt: Date.now(),
  };
};

const assertDefaultExchangeResponse = (
  response: IHyperliquidExchangeResponse,
) => {
  if (response.status === 'err') {
    throw new Error(response.response || 'Hyperliquid 拒绝了请求');
  }
  const failedStatus = response.response.data?.statuses?.find(
    (status): status is { error: string } =>
      typeof status === 'object' && 'error' in status,
  );
  if (failedStatus) {
    throw new Error(failedStatus.error);
  }
};

const getRecoveredExecutionStatus = (
  exchangeStatus: string,
): IUnionKeyAssistExecutionResult['status'] => {
  if (exchangeStatus === 'filled') {
    return 'filled';
  }
  if (exchangeStatus === 'open') {
    return 'resting';
  }
  if (exchangeStatus === 'canceled' || exchangeStatus.endsWith('Canceled')) {
    return 'cancelled';
  }
  return 'rejected';
};

@backgroundClass()
export default class ServiceUnionKeyTrade extends ServiceBase {
  private monitorInterval: ReturnType<typeof setInterval> | undefined;

  private isRefreshing = false;

  private pendingAgentApprovals = new Map<string, IPendingAgentApproval>();

  private spotMetaCache:
    | (IHyperliquidSpotMetaResult & { expiresAt: number })
    | undefined;

  private spotMetaRequest: Promise<IHyperliquidSpotMetaResult> | undefined;

  private pendingOrderCancellations = new Map<
    string,
    {
      accountAddress: string;
      preparedAction: IUnionKeyAssistPreparedAction;
      validUntil: number;
    }
  >();

  constructor({ backgroundApi }: { backgroundApi: any }) {
    super({ backgroundApi });
  }

  private normalizePersistedTask(
    task: IUnionKeyAssistTask,
  ): IUnionKeyAssistTask {
    const orderPlan = {
      ...task.orderPlan,
      marginMode: task.orderPlan.marginMode ?? ('isolated' as const),
    };
    const accountAddress =
      task.accountAddress ?? task.preparedOrder?.accountAddress ?? '';
    const fallbackRiskPolicy: IUnionKeyAssistRiskPolicy = {
      allowedSymbols: [task.baseSymbol],
      maxOrderNotional: '1000000',
      maxDailyNotional: '1000000',
      maxLeverage: 50,
      maxSlippagePercent: '5',
      requireStopLoss: false,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    };
    const fallbackRiskAssessment: IUnionKeyAssistRiskAssessment = {
      passed: true,
      estimatedNotional:
        task.preparedOrder?.estimatedNotional ??
        (orderPlan.amountUnit === 'quote' ? orderPlan.amount : '0'),
      dailyNotionalAfterOrder:
        task.preparedOrder?.estimatedNotional ??
        (orderPlan.amountUnit === 'quote' ? orderPlan.amount : '0'),
      checks: [],
    };
    const preparedOrder = task.preparedOrder
      ? {
          ...task.preparedOrder,
          environment:
            task.preparedOrder.environment ?? HYPERLIQUID_ENVIRONMENT,
          clientOrderIds: task.preparedOrder.clientOrderIds ?? [],
          preview: task.preparedOrder.preview ?? {
            markPrice: task.preparedOrder.currentPrice,
            estimatedFillPrice: task.preparedOrder.limitPrice,
            unionKeyFee: '0' as const,
          },
        }
      : undefined;
    let status = task.status;
    let error = task.error;
    if (
      [
        'draft',
        'authorizing',
        'monitoring',
        'ready',
        'awaitingSignature',
      ].includes(task.status)
    ) {
      try {
        const closeIntent = parseUnionKeyAssistClosePositionIntent(
          task.requirement,
        );
        if (!closeIntent) {
          const reparsed = parseUnionKeyAssistRequirement(task.requirement);
          if (
            reparsed.baseSymbol !== task.baseSymbol ||
            reparsed.quoteSymbol !== task.quoteSymbol ||
            reparsed.orderPlan.amount !== task.orderPlan.amount ||
            reparsed.orderPlan.amountUnit !== task.orderPlan.amountUnit
          ) {
            throw new Error('自然语言解析规则已更新，请重新创建并核对任务');
          }
        }
      } catch (validationError) {
        status = 'error';
        error = `任务已失效：${getErrorMessage(validationError)}`;
      }
    }
    return {
      ...task,
      accountAddress,
      preparedOrder,
      status,
      error,
      environment: task.environment ?? HYPERLIQUID_ENVIRONMENT,
      instrument: task.instrument ?? 'perp',
      authorizationMode: task.authorizationMode ?? 'confirmEach',
      orderPlan,
      riskPolicy: task.riskPolicy ?? fallbackRiskPolicy,
      riskAssessment: task.riskAssessment ?? fallbackRiskAssessment,
    };
  }

  private async getTask(taskId: string) {
    const tasks: IUnionKeyAssistTask[] =
      await this.backgroundApi.simpleDb.unionKeyTrade.getAssistTasks();
    const task = tasks.find((item) => item.id === taskId);
    if (!task) {
      throw new Error('代操任务不存在');
    }
    return this.normalizePersistedTask(task);
  }

  private async getPersistedAgentGrant(accountAddress: string) {
    const normalizedAddress = getAddress(accountAddress).toLowerCase();
    const grants: IUnionKeyAssistAgentGrant[] =
      await this.backgroundApi.simpleDb.unionKeyTrade.getAgentGrants();
    return grants.find(
      (grant) => grant.accountAddress.toLowerCase() === normalizedAddress,
    );
  }

  private async getStoredAgentSecret(accountAddress: string) {
    if (!secureStorageInstance.supportSecureStorage()) {
      return undefined;
    }
    const value = await secureStorageInstance.getSecureItem(
      getAgentSecureStorageKey(accountAddress),
    );
    if (!value) {
      return undefined;
    }
    try {
      const secret = JSON.parse(value) as IStoredAgentSecret;
      if (
        secret.version !== 1 ||
        getAddress(secret.accountAddress).toLowerCase() !==
          getAddress(accountAddress).toLowerCase() ||
        getAddress(secret.agentAddress).toLowerCase() !==
          new Wallet(secret.privateKey).address.toLowerCase()
      ) {
        return undefined;
      }
      return secret;
    } catch {
      return undefined;
    }
  }

  private async getAgentGrantInternal(accountAddress: string) {
    const grant = await this.getPersistedAgentGrant(accountAddress);
    if (!grant || grant.status !== 'active') {
      return undefined;
    }
    if (grant.riskPolicy.expiresAt <= Date.now()) {
      const expiredGrant: IUnionKeyAssistAgentGrant = {
        ...grant,
        status: 'expired',
        updatedAt: Date.now(),
      };
      await this.backgroundApi.simpleDb.unionKeyTrade.upsertAgentGrant(
        expiredGrant,
      );
      return undefined;
    }
    const secret = await this.getStoredAgentSecret(accountAddress);
    if (
      !secret ||
      secret.expiresAt <= Date.now() ||
      secret.agentAddress.toLowerCase() !== grant.agentAddress.toLowerCase()
    ) {
      return undefined;
    }

    if (
      grant.lastVerifiedAt &&
      grant.lastVerifiedAt > Date.now() - AGENT_REMOTE_VERIFY_INTERVAL_MS
    ) {
      return grant;
    }

    try {
      const response = await axios.post<IHyperliquidExtraAgent[]>(
        HYPERLIQUID_INFO_URL,
        {
          type: 'extraAgents',
          user: grant.accountAddress,
        },
        { timeout: REQUEST_TIMEOUT_MS },
      );
      if (Array.isArray(response.data)) {
        const remoteAgent = response.data.find((item) => {
          const address = item.address ?? item.agentAddress;
          return address?.toLowerCase() === grant.agentAddress.toLowerCase();
        });
        if (
          !remoteAgent ||
          (remoteAgent.validUntil ?? Infinity) <= Date.now()
        ) {
          const revokedGrant: IUnionKeyAssistAgentGrant = {
            ...grant,
            status: 'revoked',
            updatedAt: Date.now(),
            lastVerifiedAt: Date.now(),
          };
          await this.backgroundApi.simpleDb.unionKeyTrade.upsertAgentGrant(
            revokedGrant,
          );
          await secureStorageInstance.removeSecureItem(
            getAgentSecureStorageKey(accountAddress),
          );
          return undefined;
        }
      }
      const verifiedGrant: IUnionKeyAssistAgentGrant = {
        ...grant,
        lastVerifiedAt: Date.now(),
        updatedAt: Date.now(),
      };
      await this.backgroundApi.simpleDb.unionKeyTrade.upsertAgentGrant(
        verifiedGrant,
      );
      return verifiedGrant;
    } catch {
      return grant;
    }
  }

  private async fetchMarketSnapshot(
    baseSymbol: string,
    withSignal: boolean,
  ): Promise<{
    currentPrice: string;
    signal?: IUnionKeyAssistMarketSignal;
  }> {
    const symbol = baseSymbol.toUpperCase();
    const midsRequest = axios.post<Record<string, string>>(
      HYPERLIQUID_INFO_URL,
      { type: 'allMids' },
      { timeout: REQUEST_TIMEOUT_MS },
    );
    const candlesRequest = withSignal
      ? axios.post<IHyperliquidCandle[]>(
          HYPERLIQUID_INFO_URL,
          {
            type: 'candleSnapshot',
            req: {
              coin: symbol,
              interval: '15m',
              startTime: Date.now() - 24 * 60 * 60 * 1000,
              endTime: Date.now(),
            },
          },
          { timeout: REQUEST_TIMEOUT_MS },
        )
      : undefined;
    const [midsResponse, candlesResponse] = await Promise.all([
      midsRequest,
      candlesRequest,
    ]);
    const currentPrice = midsResponse.data[symbol];
    if (!currentPrice || !Number.isFinite(Number(currentPrice))) {
      throw new Error(`Hyperliquid 暂不支持 ${symbol} 实时行情`);
    }
    if (!candlesResponse) {
      return { currentPrice };
    }
    const closePrices = candlesResponse.data
      .map((item) => Number(item.c))
      .filter(Number.isFinite);
    if (closePrices.length < 20) {
      return { currentPrice };
    }
    const shortAverage = average(closePrices.slice(-5));
    const longAverage = average(closePrices.slice(-20));
    const momentumPercent = ((shortAverage / longAverage - 1) * 100).toFixed(3);
    return {
      currentPrice,
      signal: {
        shortAverage: shortAverage.toString(),
        longAverage: longAverage.toString(),
        momentumPercent,
      },
    };
  }

  private async fetchHyperliquidMeta() {
    const response = await axios.post<
      [IHyperliquidMeta, IHyperliquidAssetContext[]]
    >(
      HYPERLIQUID_INFO_URL,
      { type: 'metaAndAssetCtxs' },
      { timeout: REQUEST_TIMEOUT_MS },
    );
    return {
      meta: response.data[0],
      assetContexts: response.data[1],
    };
  }

  private async fetchHyperliquidSpotMeta(): Promise<IHyperliquidSpotMetaResult> {
    if (this.spotMetaCache && this.spotMetaCache.expiresAt > Date.now()) {
      return this.spotMetaCache;
    }
    if (this.spotMetaRequest) {
      return this.spotMetaRequest;
    }
    this.spotMetaRequest = (async () => {
      let lastError: unknown;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const response = await axios.post<
            [IHyperliquidSpotMeta, IHyperliquidAssetContext[]]
          >(
            HYPERLIQUID_INFO_URL,
            { type: 'spotMetaAndAssetCtxs' },
            { timeout: REQUEST_TIMEOUT_MS },
          );
          const result = {
            meta: response.data[0],
            assetContexts: response.data[1],
          };
          this.spotMetaCache = {
            ...result,
            expiresAt: Date.now() + MARKET_METADATA_CACHE_MS,
          };
          return result;
        } catch (error) {
          lastError = error;
        }
      }
      throw lastError;
    })();
    try {
      return await this.spotMetaRequest;
    } finally {
      this.spotMetaRequest = undefined;
    }
  }

  private async resolveSpotMarket(baseSymbol: string, quoteSymbol: string) {
    const result = await this.fetchHyperliquidSpotMeta();
    const requestedBase = baseSymbol.toUpperCase();
    const requestedQuote =
      quoteSymbol.toUpperCase() === 'USD' ? 'USDC' : quoteSymbol.toUpperCase();
    const tokensByIndex = new Map(
      result.meta.tokens.map((token) => [token.index, token]),
    );
    const candidates = result.meta.universe
      .map((market, position) => ({
        market,
        position,
        baseToken: tokensByIndex.get(market.tokens[0]),
        quoteToken: tokensByIndex.get(market.tokens[1]),
      }))
      .filter(
        (
          item,
        ): item is typeof item & {
          baseToken: NonNullable<typeof item.baseToken>;
          quoteToken: NonNullable<typeof item.quoteToken>;
        } => !!item.baseToken && !!item.quoteToken,
      )
      .filter((item) => {
        const baseName = item.baseToken.name.toUpperCase();
        const quoteName = item.quoteToken.name.toUpperCase();
        return (
          (baseName === requestedBase || baseName === `U${requestedBase}`) &&
          quoteName === requestedQuote
        );
      })
      .sort((left, right) => {
        const leftExact =
          left.baseToken.name.toUpperCase() === requestedBase ? 1 : 0;
        const rightExact =
          right.baseToken.name.toUpperCase() === requestedBase ? 1 : 0;
        const leftCanonical = left.baseToken.isCanonical ? 1 : 0;
        const rightCanonical = right.baseToken.isCanonical ? 1 : 0;
        return (
          rightExact - leftExact ||
          rightCanonical - leftCanonical ||
          left.market.index - right.market.index
        );
      });
    const resolved = candidates[0];
    if (!resolved) {
      throw new Error(
        `Hyperliquid Spot 暂不支持 ${requestedBase}/${requestedQuote}`,
      );
    }
    return {
      ...resolved,
      context: result.assetContexts[resolved.position],
      assetIndex: 10_000 + resolved.market.index,
    };
  }

  private async fetchSpotMarketSnapshot(
    baseSymbol: string,
    quoteSymbol: string,
    withSignal: boolean,
  ) {
    const resolved = await this.resolveSpotMarket(baseSymbol, quoteSymbol);
    const midsRequest = axios.post<Record<string, string>>(
      HYPERLIQUID_INFO_URL,
      { type: 'allMids' },
      { timeout: REQUEST_TIMEOUT_MS },
    );
    const candlesRequest = withSignal
      ? axios.post<IHyperliquidCandle[]>(
          HYPERLIQUID_INFO_URL,
          {
            type: 'candleSnapshot',
            req: {
              coin: resolved.market.name,
              interval: '15m',
              startTime: Date.now() - 24 * 60 * 60 * 1000,
              endTime: Date.now(),
            },
          },
          { timeout: REQUEST_TIMEOUT_MS },
        )
      : undefined;
    const [midsResponse, candlesResponse] = await Promise.all([
      midsRequest,
      candlesRequest,
    ]);
    const currentPrice =
      midsResponse.data[resolved.market.name] ??
      resolved.context?.midPx ??
      resolved.context?.markPx;
    if (!currentPrice || !Number.isFinite(Number(currentPrice))) {
      throw new Error(
        `Hyperliquid Spot 暂无 ${baseSymbol}/${quoteSymbol} 有效价格`,
      );
    }
    if (!candlesResponse) {
      return { currentPrice };
    }
    const closePrices = candlesResponse.data
      .map((item) => Number(item.c))
      .filter(Number.isFinite);
    if (closePrices.length < 20) {
      return { currentPrice };
    }
    const shortAverage = average(closePrices.slice(-5));
    const longAverage = average(closePrices.slice(-20));
    return {
      currentPrice,
      signal: {
        shortAverage: shortAverage.toString(),
        longAverage: longAverage.toString(),
        momentumPercent: ((shortAverage / longAverage - 1) * 100).toFixed(3),
      },
    };
  }

  private async buildUnsupportedSpotPairMessage({
    accountAddress,
    baseSymbol,
    quoteSymbol,
    amount,
    amountUnit,
    maxSlippagePercent,
  }: {
    accountAddress: string;
    baseSymbol: string;
    quoteSymbol: string;
    amount: string;
    amountUnit: IUnionKeyAssistOrderPlan['amountUnit'];
    maxSlippagePercent: string;
  }) {
    const normalizedQuote = quoteSymbol.toUpperCase();
    let availablePaymentBalance: BigNumber | undefined;
    try {
      const [spotMeta, spotStateResponse] = await Promise.all([
        this.fetchHyperliquidSpotMeta(),
        axios.post<IHyperliquidSpotClearinghouseState>(
          HYPERLIQUID_INFO_URL,
          {
            type: 'spotClearinghouseState',
            user: accountAddress,
          },
          { timeout: REQUEST_TIMEOUT_MS },
        ),
      ]);
      const paymentTokenIndexes = new Set(
        spotMeta.meta.tokens
          .filter((token) => {
            const tokenName = token.name.toUpperCase();
            return (
              tokenName === normalizedQuote ||
              tokenName === `U${normalizedQuote}`
            );
          })
          .map((token) => token.index),
      );
      availablePaymentBalance = (spotStateResponse.data.balances ?? [])
        .filter((balance) => paymentTokenIndexes.has(balance.token))
        .reduce(
          (total, balance) =>
            total.plus(
              BigNumber.maximum(
                new BigNumber(balance.total ?? '0').minus(balance.hold ?? '0'),
                0,
              ),
            ),
          new BigNumber(0),
        );
    } catch {
      // The original unsupported-pair error remains useful if balance lookup fails.
    }

    const balanceText = availablePaymentBalance
      ? `，Hyperliquid 可用余额 ${availablePaymentBalance.toFixed()} ${normalizedQuote}`
      : '';
    if (normalizedQuote === 'USDC' || normalizedQuote === 'USD') {
      return `Hyperliquid Spot 暂不支持 ${baseSymbol}/${normalizedQuote}${balanceText}`;
    }

    try {
      const [baseSnapshot, paymentSnapshot] = await Promise.all([
        this.fetchSpotMarketSnapshot(baseSymbol, 'USDC', false),
        this.fetchSpotMarketSnapshot(normalizedQuote, 'USDC', false),
      ]);
      const slippage = new BigNumber(maxSlippagePercent).dividedBy(100);
      const requestedAmount = new BigNumber(amount);
      const estimatedPayment =
        amountUnit === 'base'
          ? requestedAmount
              .multipliedBy(baseSnapshot.currentPrice)
              .multipliedBy(new BigNumber(1).plus(slippage))
              .dividedBy(
                new BigNumber(paymentSnapshot.currentPrice).multipliedBy(
                  new BigNumber(1).minus(slippage),
                ),
              )
          : requestedAmount;
      const balanceCheck =
        availablePaymentBalance && availablePaymentBalance.lt(estimatedPayment)
          ? `；当前余额不足，缺少约 ${estimatedPayment
              .minus(availablePaymentBalance)
              .toFixed(6)} ${normalizedQuote}`
          : '';
      return `已识别付款币 ${normalizedQuote}${balanceText}。Hyperliquid 没有 ${baseSymbol}/${normalizedQuote} 直连市场；可用路径为 ${normalizedQuote} → USDC → ${baseSymbol}，按实时行情和滑点预计需要约 ${estimatedPayment.toFixed(
        6,
      )} ${normalizedQuote}${balanceCheck}。两段交易需分别成交确认，系统不会擅自改成 USDC 付款`;
    } catch {
      return `已识别付款币 ${normalizedQuote}${balanceText}，但 Hyperliquid Spot 暂不支持 ${baseSymbol}/${normalizedQuote}，也没有可用的 USDC 中转路径`;
    }
  }

  private fetchTaskMarketSnapshot(
    task: IUnionKeyAssistTask,
    withSignal: boolean,
  ) {
    return task.instrument === 'spot'
      ? this.fetchSpotMarketSnapshot(
          task.baseSymbol,
          task.quoteSymbol,
          withSignal,
        )
      : this.fetchMarketSnapshot(task.baseSymbol, withSignal);
  }

  private async fetchExecutionPreviewContext({
    accountAddress,
  }: {
    accountAddress: string;
  }) {
    const [clearinghouseResponse, feesResponse] = await Promise.all([
      axios.post<IHyperliquidClearinghouseState>(
        HYPERLIQUID_INFO_URL,
        {
          type: 'clearinghouseState',
          user: accountAddress,
        },
        { timeout: REQUEST_TIMEOUT_MS },
      ),
      axios
        .post<IHyperliquidUserFees>(
          HYPERLIQUID_INFO_URL,
          {
            type: 'userFees',
            user: accountAddress,
          },
          { timeout: REQUEST_TIMEOUT_MS },
        )
        .catch(() => undefined),
    ]);
    return {
      clearinghouse: clearinghouseResponse.data,
      fees: feesResponse?.data,
    };
  }

  private async fetchOrderStatus({
    accountAddress,
    oid,
  }: {
    accountAddress: string;
    oid: number | string;
  }) {
    const response = await axios.post<IHyperliquidOrderStatusResponse>(
      HYPERLIQUID_INFO_URL,
      {
        type: 'orderStatus',
        user: accountAddress,
        oid,
      },
      { timeout: REQUEST_TIMEOUT_MS },
    );
    return response.data;
  }

  @backgroundMethod()
  async getAssistPaymentOptions({
    baseSymbol,
  }: {
    baseSymbol: string;
  }): Promise<string[]> {
    const result = await this.fetchHyperliquidSpotMeta();
    const requestedBase = baseSymbol.trim().toUpperCase();
    const tokensByIndex = new Map(
      result.meta.tokens.map((token) => [token.index, token]),
    );
    const quoteSymbols = new Set<string>();
    result.meta.universe.forEach((market) => {
      const baseToken = tokensByIndex.get(market.tokens[0]);
      const quoteToken = tokensByIndex.get(market.tokens[1]);
      if (!baseToken || !quoteToken) {
        return;
      }
      const baseName = baseToken.name.toUpperCase();
      if (baseName !== requestedBase && baseName !== `U${requestedBase}`) {
        return;
      }
      const quoteName = quoteToken.name.toUpperCase();
      quoteSymbols.add(quoteName === 'USD' ? 'USDC' : quoteName);
    });
    return [...quoteSymbols].sort((left, right) => {
      if (left === 'USDC') {
        return -1;
      }
      if (right === 'USDC') {
        return 1;
      }
      return left.localeCompare(right);
    });
  }

  @backgroundMethod()
  async analyzeAssistMarket(
    requirement: string,
  ): Promise<IUnionKeyAssistMarketAnalysis> {
    const baseSymbol = getUnionKeyMarketSymbol(requirement);
    if (!baseSymbol) {
      const symbols = ['BTC', 'ETH', 'SOL'];
      const snapshots = await Promise.all(
        symbols.map((symbol) => this.fetchMarketSnapshot(symbol, true)),
      );
      const markets = snapshots.map((snapshot, index) => {
        const momentum = Number(snapshot.signal?.momentumPercent ?? 0);
        let direction: 'bullish' | 'bearish' | 'neutral' = 'neutral';
        if (momentum > 0) {
          direction = 'bullish';
        } else if (momentum < 0) {
          direction = 'bearish';
        }
        return {
          symbol: symbols[index],
          currentPrice: snapshot.currentPrice,
          momentumPercent: snapshot.signal?.momentumPercent,
          direction,
        };
      });
      return {
        scope: 'market',
        markets,
        updatedAt: Date.now(),
      };
    }
    const snapshot = await this.fetchMarketSnapshot(baseSymbol, true);
    return {
      scope: 'asset',
      baseSymbol,
      currentPrice: snapshot.currentPrice,
      signal: snapshot.signal,
      updatedAt: Date.now(),
    };
  }

  private async buildReduceOnlyCloseRequirement({
    accountAddress,
    baseSymbol,
    percentage,
  }: {
    accountAddress: string;
    baseSymbol: string;
    percentage: string;
  }) {
    const response = await axios.post<IHyperliquidClearinghouseState>(
      HYPERLIQUID_INFO_URL,
      {
        type: 'clearinghouseState',
        user: accountAddress,
      },
      { timeout: REQUEST_TIMEOUT_MS },
    );
    const position = response.data.assetPositions?.find(
      (item) => item.position?.coin?.toUpperCase() === baseSymbol,
    )?.position;
    const signedSize = new BigNumber(position?.szi ?? '0');
    if (!signedSize.isFinite() || signedSize.isZero()) {
      throw new Error(`Hyperliquid 中没有可平的 ${baseSymbol} 仓位`);
    }
    const closeSize = signedSize
      .absoluteValue()
      .multipliedBy(percentage)
      .dividedBy(100);
    if (closeSize.lte(0)) {
      throw new Error(`无法计算 ${baseSymbol} 的减仓数量`);
    }
    return {
      baseSymbol,
      quoteSymbol: 'USDC',
      trigger: { type: 'immediate' as const },
      orderPlan: {
        side: signedSize.gt(0) ? ('sell' as const) : ('buy' as const),
        orderType: 'market' as const,
        reduceOnly: true,
        amount: closeSize.toFixed(),
        amountUnit: 'base' as const,
        limitPrice: undefined,
        maxSlippagePercent: '0.5',
        leverage: undefined,
        marginMode: 'isolated' as const,
        takeProfitPercent: undefined,
        stopLossPercent: undefined,
      },
    };
  }

  private async getDailyNotionalUsed(
    accountAddress: string,
    excludeTaskId?: string,
  ) {
    const tasks: IUnionKeyAssistTask[] =
      await this.backgroundApi.simpleDb.unionKeyTrade.getAssistTasks();
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    return tasks
      .map((task) => this.normalizePersistedTask(task))
      .filter(
        (task) =>
          task.id !== excludeTaskId &&
          task.status === 'completed' &&
          task.accountAddress.toLowerCase() === accountAddress.toLowerCase() &&
          (task.executionResult?.submittedAt ?? 0) >= startOfDay.getTime(),
      )
      .reduce(
        (total, task) =>
          total.plus(
            task.preparedOrder?.estimatedNotional ??
              task.riskAssessment.estimatedNotional,
          ),
        new BigNumber(0),
      )
      .toFixed();
  }

  private async assessTaskRisk(
    task: IUnionKeyAssistTask,
    currentPrice: string,
    policy = task.riskPolicy,
  ) {
    const dailyNotionalUsed = await this.getDailyNotionalUsed(
      task.accountAddress,
      task.id,
    );
    return assessUnionKeyAssistRisk({
      requirement: task,
      currentPrice,
      policy,
      dailyNotionalUsed,
    });
  }

  private getBlockedRiskMessage(assessment: IUnionKeyAssistRiskAssessment) {
    const blocked = assessment.checks
      .filter((check) => check.status === 'blocked')
      .map((check) => `${check.label}: ${check.detail}`);
    return blocked.length
      ? `风控未通过：${blocked.join('；')}`
      : '风控检查未通过';
  }

  private async assertAgentAllowsTask(
    task: IUnionKeyAssistTask,
    currentPrice: string,
  ) {
    const grant = await this.getAgentGrantInternal(task.accountAddress);
    if (!grant) {
      throw new Error('受限代理未授权、已过期或已在 Hyperliquid 撤销');
    }
    const assessment = await this.assessTaskRisk(
      task,
      currentPrice,
      grant.riskPolicy,
    );
    if (!assessment.passed) {
      throw new Error(this.getBlockedRiskMessage(assessment));
    }
    return grant;
  }

  private async notifyTaskReady(task: IUnionKeyAssistTask) {
    try {
      await this.backgroundApi.serviceNotification.showNotification({
        notificationId: `unionkey-assist-${task.id}`,
        title: 'UnionKey 智能代操',
        description:
          task.authorizationMode === 'delegated'
            ? `${task.baseSymbol}/${task.quoteSymbol} 条件已满足，代理正在执行。`
            : `${task.baseSymbol}/${task.quoteSymbol} 条件已满足，请回到 UnionKey 进行硬件确认。`,
        showByElectronMainProcess: true,
      });
    } catch (error) {
      console.error('UnionKey assist notification failed', error);
    }
  }

  private async notifyTaskCompleted(task: IUnionKeyAssistTask) {
    try {
      await this.backgroundApi.serviceNotification.showNotification({
        notificationId: `unionkey-assist-completed-${task.id}`,
        title: 'UnionKey 订单已执行',
        description: `${task.baseSymbol}/${task.quoteSymbol} ${
          task.executionResult?.status === 'resting'
            ? '订单已挂单'
            : '订单已提交'
        }。`,
        showByElectronMainProcess: true,
      });
    } catch (error) {
      console.error('UnionKey assist completion notification failed', error);
    }
  }

  private ensureMonitorRunning() {
    if (this.monitorInterval) {
      return;
    }
    this.monitorInterval = setInterval(() => {
      void this.refreshActiveAssistTasks();
    }, MONITOR_INTERVAL_MS);
  }

  private stopMonitor() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = undefined;
    }
  }

  private buildAgentApproval({
    accountAddress,
    agentAddress,
    agentName,
    expiresAt,
    operation,
  }: {
    accountAddress: string;
    agentAddress: string;
    agentName: string;
    expiresAt: number;
    operation: IUnionKeyAgentApproval['operation'];
  }) {
    const nonce = Date.now();
    const action: IUnionKeyHyperliquidApproveAgentAction = {
      type: 'approveAgent',
      signatureChainId: HYPERLIQUID_SIGNATURE_CHAIN_ID,
      hyperliquidChain:
        HYPERLIQUID_ENVIRONMENT === 'mainnet' ? 'Mainnet' : 'Testnet',
      agentAddress,
      agentName,
      nonce,
    };
    const approval: IUnionKeyAgentApproval = {
      id: generateUUID(),
      operation,
      accountAddress: getAddress(accountAddress).toLowerCase(),
      agentAddress: getAddress(agentAddress).toLowerCase(),
      agentName,
      nonce,
      expiresAt,
      action,
      typedData: buildUnionKeyHyperliquidAgentApprovalTypedData(action),
    };
    return approval;
  }

  private verifyAgentApprovalSignature({
    approval,
    signature,
  }: {
    approval: IUnionKeyAgentApproval;
    signature: string;
  }) {
    const recoveredAddress = verifyTypedData(
      approval.typedData.domain,
      getApprovalTypes(approval),
      approval.typedData.message,
      signature,
    ).toLowerCase();
    if (recoveredAddress !== approval.accountAddress) {
      throw new Error('硬件签名账户与代理授权账户不一致');
    }
  }

  private async submitAgentApprovalToHyperliquid({
    approval,
    signature,
  }: {
    approval: IUnionKeyAgentApproval;
    signature: string;
  }) {
    const parsedSignature = Signature.from(signature);
    const response = await axios.post<IHyperliquidExchangeResponse>(
      HYPERLIQUID_EXCHANGE_URL,
      {
        action: approval.action,
        nonce: approval.nonce,
        signature: {
          r: parsedSignature.r,
          s: parsedSignature.s,
          v: parsedSignature.v,
        },
      },
      { timeout: REQUEST_TIMEOUT_MS },
    );
    assertDefaultExchangeResponse(response.data);
  }

  @backgroundMethod()
  async createAssistTask({
    siteId,
    accountAddress,
    authorizationMode,
    requirement,
    paymentSymbol,
    riskPolicy,
  }: ICreateUnionKeyAssistTaskParams) {
    if (siteId !== 'hyperliquid') {
      throw new Error('该交易商的代操签名正在接入，请先选择 Hyperliquid');
    }
    const normalizedAddress = getAddress(accountAddress).toLowerCase();
    assertUnionKeyAssistRiskPolicy(riskPolicy);
    const closeIntent = parseUnionKeyAssistClosePositionIntent(requirement);
    const instrument = getUnionKeyTradeInstrument(requirement);
    const parsedRequirement = closeIntent
      ? await this.buildReduceOnlyCloseRequirement({
          accountAddress: normalizedAddress,
          ...closeIntent,
        })
      : parseUnionKeyAssistRequirement(requirement);
    const normalizedPaymentSymbol = paymentSymbol?.trim().toUpperCase();
    if (
      normalizedPaymentSymbol &&
      !/^[A-Z0-9]{2,12}$/.test(normalizedPaymentSymbol)
    ) {
      throw new Error('Invalid payment asset');
    }
    const parsed =
      instrument === 'spot' && normalizedPaymentSymbol && !closeIntent
        ? {
            ...parsedRequirement,
            quoteSymbol: normalizedPaymentSymbol,
          }
        : parsedRequirement;
    if (
      instrument === 'perp' &&
      !['USD', 'USDC'].includes(parsed.quoteSymbol)
    ) {
      throw new Error('Hyperliquid 直连当前支持 USD 或 USDC 计价');
    }
    let snapshot: Awaited<ReturnType<typeof this.fetchMarketSnapshot>>;
    try {
      snapshot =
        instrument === 'spot'
          ? await this.fetchSpotMarketSnapshot(
              parsed.baseSymbol,
              parsed.quoteSymbol,
              parsed.trigger.type === 'signal',
            )
          : await this.fetchMarketSnapshot(
              parsed.baseSymbol,
              parsed.trigger.type === 'signal',
            );
    } catch (error) {
      if (
        instrument === 'spot' &&
        getErrorMessage(error).includes('Hyperliquid Spot 暂不支持')
      ) {
        throw new Error(
          await this.buildUnsupportedSpotPairMessage({
            accountAddress: normalizedAddress,
            baseSymbol: parsed.baseSymbol,
            quoteSymbol: parsed.quoteSymbol,
            amount: parsed.orderPlan.amount,
            amountUnit: parsed.orderPlan.amountUnit,
            maxSlippagePercent: parsed.orderPlan.maxSlippagePercent,
          }),
        );
      }
      throw error;
    }
    const now = Date.now();
    const dailyNotionalUsed = await this.getDailyNotionalUsed(
      normalizedAddress,
    );
    const riskAssessment = assessUnionKeyAssistRisk({
      requirement: parsed,
      currentPrice: parsed.orderPlan.limitPrice ?? snapshot.currentPrice,
      policy: riskPolicy,
      dailyNotionalUsed,
      now,
    });
    const task: IUnionKeyAssistTask = {
      id: generateUUID(),
      siteId,
      accountAddress: normalizedAddress,
      authorizationMode,
      environment: HYPERLIQUID_ENVIRONMENT,
      instrument,
      requirement: requirement.trim(),
      ...parsed,
      riskPolicy,
      riskAssessment,
      ...snapshot,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      lastCheckedAt: now,
    };
    await this.backgroundApi.simpleDb.unionKeyTrade.upsertAssistTask(task);
    return task;
  }

  @backgroundMethod()
  async activateAssistTask({ taskId }: IActivateUnionKeyAssistTaskParams) {
    const task = await this.getTask(taskId);
    if (!['draft', 'authorizing'].includes(task.status)) {
      throw new Error('该交易计划已经启动或结束');
    }
    const snapshot = await this.fetchTaskMarketSnapshot(
      task,
      task.trigger.type === 'signal',
    );
    const riskAssessment = await this.assessTaskRisk(
      task,
      snapshot.currentPrice,
    );
    if (!riskAssessment.passed) {
      throw new Error(this.getBlockedRiskMessage(riskAssessment));
    }
    if (task.authorizationMode === 'delegated') {
      await this.assertAgentAllowsTask(task, snapshot.currentPrice);
    }
    const activatedTask: IUnionKeyAssistTask = {
      ...task,
      ...snapshot,
      riskAssessment,
      status: 'monitoring',
      error: undefined,
      updatedAt: Date.now(),
    };
    await this.backgroundApi.simpleDb.unionKeyTrade.upsertAssistTask(
      activatedTask,
    );
    this.ensureMonitorRunning();
    return this.refreshAssistTask(task.id);
  }

  @backgroundMethod()
  async getAssistTasks() {
    const tasks: IUnionKeyAssistTask[] =
      await this.backgroundApi.simpleDb.unionKeyTrade.getAssistTasks();
    return tasks
      .filter((task) => task.orderPlan)
      .map((task) => this.normalizePersistedTask(task));
  }

  @backgroundMethod()
  async getTradeRuntimeInfo() {
    return {
      environment: HYPERLIQUID_ENVIRONMENT,
      supervision: 'local' as const,
      unionKeyFeeEnabled: false,
    };
  }

  @backgroundMethod()
  async getExecutionReceipts() {
    return this.backgroundApi.simpleDb.unionKeyTrade.getExecutionReceipts();
  }

  @backgroundMethod()
  async getAgentGrant(accountAddress: string) {
    return this.getAgentGrantInternal(accountAddress);
  }

  @backgroundMethod()
  async prepareAgentAuthorization(taskId: string) {
    const task = await this.getTask(taskId);
    if (task.authorizationMode !== 'delegated') {
      throw new Error('逐笔确认任务不需要代理授权');
    }
    if (!['draft', 'authorizing'].includes(task.status)) {
      throw new Error('只能在启动任务前授权代理');
    }
    if (!secureStorageInstance.supportSecureStorage()) {
      throw new Error('当前平台没有可用的系统安全存储，不能启用受限代操');
    }
    if (
      HYPERLIQUID_ENVIRONMENT === 'mainnet' &&
      process.env.UNIONKEY_ENABLE_MAINNET_DELEGATED !== 'true'
    ) {
      throw new Error(
        'Mainnet 受限代理默认关闭；请在受控发布环境显式启用后再授权',
      );
    }

    const agentWallet = Wallet.createRandom();
    const agentName = `${HYPERLIQUID_AGENT_NAME} valid_until ${task.riskPolicy.expiresAt}`;
    const approval = this.buildAgentApproval({
      accountAddress: task.accountAddress,
      agentAddress: agentWallet.address,
      agentName,
      expiresAt: task.riskPolicy.expiresAt,
      operation: 'authorize',
    });
    this.pendingAgentApprovals.set(approval.id, {
      approval,
      taskId: task.id,
      privateKey: agentWallet.privateKey,
      riskPolicy: task.riskPolicy,
      validUntil: Date.now() + SIGNATURE_TTL_MS,
    });
    const authorizingTask: IUnionKeyAssistTask = {
      ...task,
      status: 'authorizing',
      error: undefined,
      updatedAt: Date.now(),
    };
    await this.backgroundApi.simpleDb.unionKeyTrade.upsertAssistTask(
      authorizingTask,
    );
    return approval;
  }

  @backgroundMethod()
  async submitAgentAuthorization({
    taskId,
    approvalId,
    signature,
  }: ISubmitUnionKeyAgentApprovalParams) {
    const task = await this.getTask(taskId);
    const pending = this.pendingAgentApprovals.get(approvalId);
    if (
      !pending ||
      pending.taskId !== task.id ||
      pending.approval.operation !== 'authorize' ||
      !pending.privateKey ||
      !pending.riskPolicy
    ) {
      throw new Error('代理授权请求不存在或已经失效');
    }
    if (pending.validUntil <= Date.now()) {
      this.pendingAgentApprovals.delete(approvalId);
      throw new Error('代理授权签名已经过期，请重新发起');
    }
    this.verifyAgentApprovalSignature({
      approval: pending.approval,
      signature,
    });

    const secret: IStoredAgentSecret = {
      version: 1,
      accountAddress: task.accountAddress,
      agentAddress: pending.approval.agentAddress,
      agentName: pending.approval.agentName,
      expiresAt: task.riskPolicy.expiresAt,
      privateKey: pending.privateKey,
    };
    const storageKey = getAgentSecureStorageKey(task.accountAddress);
    await secureStorageInstance.setSecureItem(
      storageKey,
      JSON.stringify(secret),
    );
    try {
      await this.submitAgentApprovalToHyperliquid({
        approval: pending.approval,
        signature,
      });
    } catch (error) {
      await secureStorageInstance.removeSecureItem(storageKey);
      throw error;
    }

    const now = Date.now();
    const grant: IUnionKeyAssistAgentGrant = {
      accountAddress: task.accountAddress,
      agentAddress: pending.approval.agentAddress,
      agentName: pending.approval.agentName,
      status: 'active',
      riskPolicy: pending.riskPolicy,
      createdAt: now,
      updatedAt: now,
      lastVerifiedAt: now,
    };
    await this.backgroundApi.simpleDb.unionKeyTrade.upsertAgentGrant(grant);
    const draftTask: IUnionKeyAssistTask = {
      ...task,
      status: 'draft',
      error: undefined,
      updatedAt: now,
    };
    await this.backgroundApi.simpleDb.unionKeyTrade.upsertAssistTask(draftTask);
    this.pendingAgentApprovals.delete(approvalId);
    return {
      grant,
      task: draftTask,
    };
  }

  @backgroundMethod()
  async prepareAgentRevocation({
    accountAddress,
  }: IPrepareUnionKeyAgentRevocationParams) {
    const grant = await this.getPersistedAgentGrant(accountAddress);
    if (!grant || grant.status !== 'active') {
      throw new Error('当前账户没有可撤销的代理授权');
    }
    const approval = this.buildAgentApproval({
      accountAddress: grant.accountAddress,
      agentAddress: ZERO_ADDRESS,
      agentName: grant.agentName,
      expiresAt: Date.now(),
      operation: 'revoke',
    });
    this.pendingAgentApprovals.set(approval.id, {
      approval,
      validUntil: Date.now() + SIGNATURE_TTL_MS,
    });
    return approval;
  }

  @backgroundMethod()
  async submitAgentRevocation({
    accountAddress,
    approvalId,
    signature,
  }: ISubmitUnionKeyAgentRevocationParams) {
    const normalizedAddress = getAddress(accountAddress).toLowerCase();
    const pending = this.pendingAgentApprovals.get(approvalId);
    if (
      !pending ||
      pending.approval.operation !== 'revoke' ||
      pending.approval.accountAddress !== normalizedAddress
    ) {
      throw new Error('代理撤销请求不存在或已经失效');
    }
    if (pending.validUntil <= Date.now()) {
      this.pendingAgentApprovals.delete(approvalId);
      throw new Error('代理撤销签名已经过期，请重新发起');
    }
    this.verifyAgentApprovalSignature({
      approval: pending.approval,
      signature,
    });
    await this.submitAgentApprovalToHyperliquid({
      approval: pending.approval,
      signature,
    });
    await secureStorageInstance.removeSecureItem(
      getAgentSecureStorageKey(normalizedAddress),
    );

    const grant = await this.getPersistedAgentGrant(normalizedAddress);
    if (grant) {
      await this.backgroundApi.simpleDb.unionKeyTrade.upsertAgentGrant({
        ...grant,
        status: 'revoked',
        updatedAt: Date.now(),
        lastVerifiedAt: Date.now(),
      });
    }
    const tasks: IUnionKeyAssistTask[] = await this.getAssistTasks();
    await Promise.all(
      tasks
        .filter(
          (task) =>
            task.accountAddress === normalizedAddress &&
            task.authorizationMode === 'delegated' &&
            !['completed', 'cancelled'].includes(task.status),
        )
        .map((task) =>
          this.backgroundApi.simpleDb.unionKeyTrade.upsertAssistTask({
            ...task,
            status: 'cancelled',
            error: '代理授权已由用户撤销',
            preparedOrder: undefined,
            updatedAt: Date.now(),
          }),
        ),
    );
    this.pendingAgentApprovals.delete(approvalId);
    return {
      ...(grant ?? {
        accountAddress: normalizedAddress,
        agentAddress: pending.approval.agentAddress,
        agentName: pending.approval.agentName,
        riskPolicy: {
          allowedSymbols: [],
          maxOrderNotional: '0',
          maxDailyNotional: '0',
          maxLeverage: 1,
          maxSlippagePercent: '0',
          requireStopLoss: true,
          expiresAt: Date.now(),
        },
        createdAt: Date.now(),
      }),
      status: 'revoked' as const,
      updatedAt: Date.now(),
    };
  }

  private buildPreparedAction({
    action,
    kind,
    nonce,
  }: {
    action: IUnionKeyHyperliquidTradingAction;
    kind: IUnionKeyAssistPreparedAction['kind'];
    nonce: number;
  }): IUnionKeyAssistPreparedAction {
    const expiresAfter = nonce + SIGNATURE_TTL_MS;
    return {
      kind,
      action,
      nonce,
      expiresAfter,
      typedData: buildUnionKeyHyperliquidTypedData(
        buildUnionKeyHyperliquidActionHash({
          action,
          nonce,
          expiresAfter,
        }),
        HYPERLIQUID_ENVIRONMENT,
      ),
    };
  }

  private buildTriggerOrder({
    assetIndex,
    size,
    isEntryBuy,
    triggerPrice,
    type,
    maxSlippagePercent,
    sizeDecimals,
  }: {
    assetIndex: number;
    size: string;
    isEntryBuy: boolean;
    triggerPrice: BigNumber;
    type: 'tp' | 'sl';
    maxSlippagePercent: string;
    sizeDecimals: number;
  }): IUnionKeyHyperliquidOrderWire {
    const isClosingBuy = !isEntryBuy;
    const executionMultiplier = new BigNumber(1).plus(
      new BigNumber(maxSlippagePercent)
        .dividedBy(100)
        .multipliedBy(isClosingBuy ? 1 : -1),
    );
    return {
      a: assetIndex,
      b: isClosingBuy,
      p: formatUnionKeyHyperliquidPrice({
        value: triggerPrice.multipliedBy(executionMultiplier),
        sizeDecimals,
      }),
      s: size,
      r: true,
      t: {
        trigger: {
          isMarket: true,
          triggerPx: formatUnionKeyHyperliquidPrice({
            value: triggerPrice,
            sizeDecimals,
          }),
          tpsl: type,
        },
      },
    };
  }

  private async prepareSpotTaskExecution({
    task,
    normalizedAddress,
    delegated,
  }: {
    task: IUnionKeyAssistTask;
    normalizedAddress: string;
    delegated: boolean;
  }) {
    if (task.orderPlan.leverage || task.orderPlan.reduceOnly) {
      throw new Error('Hyperliquid Spot 不支持杠杆或减仓参数');
    }
    if (task.orderPlan.takeProfitPercent || task.orderPlan.stopLossPercent) {
      throw new Error('Hyperliquid Spot 当前仅接入市价和限价订单');
    }
    const [snapshot, resolved, spotStateResponse, feesResponse] =
      await Promise.all([
        this.fetchSpotMarketSnapshot(task.baseSymbol, task.quoteSymbol, false),
        this.resolveSpotMarket(task.baseSymbol, task.quoteSymbol),
        axios.post<IHyperliquidSpotClearinghouseState>(
          HYPERLIQUID_INFO_URL,
          {
            type: 'spotClearinghouseState',
            user: normalizedAddress,
          },
          { timeout: REQUEST_TIMEOUT_MS },
        ),
        axios
          .post<IHyperliquidUserFees>(
            HYPERLIQUID_INFO_URL,
            {
              type: 'userFees',
              user: normalizedAddress,
            },
            { timeout: REQUEST_TIMEOUT_MS },
          )
          .catch(() => undefined),
      ]);
    const taskRiskAssessment = await this.assessTaskRisk(
      task,
      task.orderPlan.limitPrice ?? snapshot.currentPrice,
    );
    if (!taskRiskAssessment.passed) {
      throw new Error(this.getBlockedRiskMessage(taskRiskAssessment));
    }
    if (delegated) {
      await this.assertAgentAllowsTask(task, snapshot.currentPrice);
    }

    const currentPrice = new BigNumber(snapshot.currentPrice);
    const isBuy = task.orderPlan.side === 'buy';
    const isMarket = task.orderPlan.orderType === 'market';
    const slippageMultiplier = new BigNumber(1).plus(
      new BigNumber(task.orderPlan.maxSlippagePercent)
        .dividedBy(100)
        .multipliedBy(isBuy ? 1 : -1),
    );
    const rawLimitPrice = isMarket
      ? currentPrice.multipliedBy(slippageMultiplier)
      : new BigNumber(task.orderPlan.limitPrice ?? currentPrice);
    const limitPrice = formatUnionKeyHyperliquidPrice({
      value: rawLimitPrice,
      sizeDecimals: resolved.baseToken.szDecimals,
    });
    const amount = new BigNumber(task.orderPlan.amount);
    const size = (
      task.orderPlan.amountUnit === 'quote'
        ? amount.dividedBy(rawLimitPrice)
        : amount
    ).decimalPlaces(resolved.baseToken.szDecimals, BigNumber.ROUND_DOWN);
    if (!size.isFinite() || size.lte(0)) {
      throw new Error('Spot 订单数量低于该市场最小精度');
    }
    const estimatedNotional = size.multipliedBy(rawLimitPrice);
    if (
      ['USD', 'USDC'].includes(task.quoteSymbol) &&
      estimatedNotional.lt(MIN_HYPERLIQUID_ORDER_NOTIONAL)
    ) {
      throw new Error(
        `Hyperliquid Spot 订单金额不能低于 ${MIN_HYPERLIQUID_ORDER_NOTIONAL} USDC`,
      );
    }

    const feeRate = feesResponse?.data.userSpotCrossRate;
    const estimatedFee = feeRate
      ? estimatedNotional.multipliedBy(feeRate)
      : new BigNumber(0);
    const spendToken = isBuy ? resolved.quoteToken : resolved.baseToken;
    const balance = spotStateResponse.data.balances?.find(
      (item) => item.token === spendToken.index,
    );
    const availableBalance = new BigNumber(balance?.total ?? '0').minus(
      balance?.hold ?? '0',
    );
    const requiredBalance = isBuy ? estimatedNotional.plus(estimatedFee) : size;
    if (availableBalance.lt(requiredBalance)) {
      throw new Error(
        `Hyperliquid Spot ${
          spendToken.name
        } 余额不足：需要约 ${requiredBalance.toFixed(
          isBuy ? 2 : resolved.baseToken.szDecimals,
        )}，当前可用 ${BigNumber.maximum(availableBalance, 0).toFixed()}`,
      );
    }
    const normalizedSize = normalizeWireNumber(size);
    const clientOrderId = buildClientOrderId(task.id, 0);
    const action = this.buildPreparedAction({
      kind: 'order',
      action: {
        type: 'order',
        orders: [
          {
            a: resolved.assetIndex,
            b: isBuy,
            p: limitPrice,
            s: normalizedSize,
            r: false,
            c: clientOrderId,
            t: {
              limit: {
                tif: isMarket ? 'Ioc' : 'Gtc',
              },
            },
          },
        ],
        grouping: 'na',
      },
      nonce: Date.now(),
    });
    const preparedOrder: IUnionKeyAssistPreparedOrder = {
      provider: 'hyperliquid',
      actions: [action],
      accountAddress: normalizedAddress,
      typedData: action.typedData,
      currentPrice: snapshot.currentPrice,
      size: normalizedSize,
      limitPrice,
      estimatedNotional: estimatedNotional.toFixed(2),
      environment: HYPERLIQUID_ENVIRONMENT,
      clientOrderIds: [clientOrderId],
      preview: {
        markPrice:
          resolved.context?.markPx ??
          resolved.context?.midPx ??
          snapshot.currentPrice,
        estimatedFillPrice: limitPrice,
        availableToTrade: BigNumber.maximum(availableBalance, 0).toFixed(),
        accountValue: spotStateResponse.data.balances?.find(
          (item) => item.token === resolved.quoteToken.index,
        )?.total,
        estimatedInitialMargin: '0',
        estimatedTradingFee: feeRate
          ? estimatedNotional.multipliedBy(feeRate).toFixed(4)
          : undefined,
        feeRate,
        unionKeyFee: '0',
      },
      preparedAt: Date.now(),
    };
    const updatedTask: IUnionKeyAssistTask = {
      ...task,
      accountAddress: normalizedAddress,
      currentPrice: snapshot.currentPrice,
      riskAssessment: taskRiskAssessment,
      preparedOrder,
      status: delegated ? 'submitting' : 'awaitingSignature',
      error: undefined,
      updatedAt: Date.now(),
    };
    await this.backgroundApi.simpleDb.unionKeyTrade.upsertAssistTask(
      updatedTask,
    );
    return updatedTask;
  }

  private async prepareTaskExecution({
    task,
    accountAddress,
    delegated,
  }: {
    task: IUnionKeyAssistTask;
    accountAddress: string;
    delegated: boolean;
  }) {
    if (!['ready', 'awaitingSignature'].includes(task.status)) {
      throw new Error('交易条件尚未触发');
    }
    if (task.environment !== HYPERLIQUID_ENVIRONMENT) {
      throw new Error(
        `任务属于 ${task.environment}，当前运行环境为 ${HYPERLIQUID_ENVIRONMENT}，禁止跨环境提交`,
      );
    }
    const normalizedAddress = getAddress(accountAddress).toLowerCase();
    if (task.accountAddress && task.accountAddress !== normalizedAddress) {
      throw new Error('当前账户与任务账户不一致');
    }
    const existingExpiration = Math.min(
      ...(task.preparedOrder?.actions.map((action) => action.expiresAfter) ?? [
        0,
      ]),
    );
    if (
      task.preparedOrder &&
      existingExpiration > Date.now() + 10_000 &&
      task.preparedOrder.accountAddress === normalizedAddress
    ) {
      return task;
    }
    if (task.instrument === 'spot') {
      return this.prepareSpotTaskExecution({
        task,
        normalizedAddress,
        delegated,
      });
    }

    const [snapshot, metaResult, previewContext] = await Promise.all([
      this.fetchMarketSnapshot(task.baseSymbol, false),
      this.fetchHyperliquidMeta(),
      this.fetchExecutionPreviewContext({
        accountAddress: normalizedAddress,
      }),
    ]);
    const { meta, assetContexts } = metaResult;
    const assetIndex = meta.universe.findIndex(
      (asset) => asset.name.toUpperCase() === task.baseSymbol.toUpperCase(),
    );
    const asset = meta.universe[assetIndex];
    if (assetIndex < 0 || !asset) {
      throw new Error(`Hyperliquid 暂不支持 ${task.baseSymbol} 下单`);
    }
    if (
      task.orderPlan.leverage &&
      asset.maxLeverage &&
      task.orderPlan.leverage > asset.maxLeverage
    ) {
      throw new Error(
        `${task.baseSymbol} 当前最高支持 ${asset.maxLeverage}x 杠杆`,
      );
    }

    const taskRiskAssessment = await this.assessTaskRisk(
      task,
      snapshot.currentPrice,
    );
    if (!taskRiskAssessment.passed) {
      throw new Error(this.getBlockedRiskMessage(taskRiskAssessment));
    }
    if (delegated) {
      await this.assertAgentAllowsTask(task, snapshot.currentPrice);
    }

    const currentPrice = new BigNumber(snapshot.currentPrice);
    const amount = new BigNumber(task.orderPlan.amount);
    const size = (
      task.orderPlan.amountUnit === 'quote'
        ? amount.dividedBy(currentPrice)
        : amount
    ).decimalPlaces(asset.szDecimals, BigNumber.ROUND_DOWN);
    if (!size.isFinite() || size.lte(0)) {
      throw new Error('订单数量低于该市场最小精度');
    }

    const estimatedNotional = size.multipliedBy(currentPrice);
    if (estimatedNotional.lt(MIN_HYPERLIQUID_ORDER_NOTIONAL)) {
      throw new Error(
        `Hyperliquid 订单金额不能低于 ${MIN_HYPERLIQUID_ORDER_NOTIONAL} USDC`,
      );
    }

    const isBuy = task.orderPlan.side === 'buy';
    const isMarket = task.orderPlan.orderType === 'market';
    const slippageMultiplier = new BigNumber(1).plus(
      new BigNumber(task.orderPlan.maxSlippagePercent)
        .dividedBy(100)
        .multipliedBy(isBuy ? 1 : -1),
    );
    const rawLimitPrice = isMarket
      ? currentPrice.multipliedBy(slippageMultiplier)
      : new BigNumber(task.orderPlan.limitPrice ?? snapshot.currentPrice);
    const limitPrice = formatUnionKeyHyperliquidPrice({
      value: rawLimitPrice,
      sizeDecimals: asset.szDecimals,
    });
    const normalizedSize = normalizeWireNumber(size);
    const leverage = new BigNumber(task.orderPlan.leverage ?? 1);
    const estimatedInitialMargin = task.orderPlan.reduceOnly
      ? new BigNumber(0)
      : estimatedNotional.dividedBy(leverage);
    const availableToTrade = new BigNumber(
      previewContext.clearinghouse.withdrawable ?? '0',
    );
    if (
      !task.orderPlan.reduceOnly &&
      availableToTrade.isFinite() &&
      availableToTrade.lt(estimatedInitialMargin)
    ) {
      throw new Error(
        `Hyperliquid 可用保证金不足：需要约 ${estimatedInitialMargin.toFixed(
          2,
        )} USDC，当前可用 ${availableToTrade.toFixed(2)} USDC`,
      );
    }
    const clientOrderIds: string[] = [];
    const orders: IUnionKeyHyperliquidOrderWire[] = [
      {
        a: assetIndex,
        b: isBuy,
        p: limitPrice,
        s: normalizedSize,
        r: task.orderPlan.reduceOnly ?? false,
        c: buildClientOrderId(task.id, 0),
        t: {
          limit: {
            tif: isMarket ? 'Ioc' : 'Gtc',
          },
        },
      },
    ];
    clientOrderIds.push(orders[0].c as string);
    const entryReferencePrice = isMarket
      ? currentPrice
      : new BigNumber(task.orderPlan.limitPrice ?? currentPrice);
    let takeProfitPrice: string | undefined;
    let stopLossPrice: string | undefined;
    if (task.orderPlan.takeProfitPercent) {
      const multiplier = new BigNumber(1).plus(
        new BigNumber(task.orderPlan.takeProfitPercent)
          .dividedBy(100)
          .multipliedBy(isBuy ? 1 : -1),
      );
      const triggerPrice = entryReferencePrice.multipliedBy(multiplier);
      const triggerOrder = this.buildTriggerOrder({
        assetIndex,
        size: normalizedSize,
        isEntryBuy: isBuy,
        triggerPrice,
        type: 'tp',
        maxSlippagePercent: task.orderPlan.maxSlippagePercent,
        sizeDecimals: asset.szDecimals,
      });
      orders.push(triggerOrder);
      triggerOrder.c = buildClientOrderId(task.id, orders.length - 1);
      clientOrderIds.push(triggerOrder.c);
      takeProfitPrice =
        'trigger' in triggerOrder.t
          ? triggerOrder.t.trigger.triggerPx
          : undefined;
    }
    if (task.orderPlan.stopLossPercent) {
      const multiplier = new BigNumber(1).minus(
        new BigNumber(task.orderPlan.stopLossPercent)
          .dividedBy(100)
          .multipliedBy(isBuy ? 1 : -1),
      );
      const triggerPrice = entryReferencePrice.multipliedBy(multiplier);
      const triggerOrder = this.buildTriggerOrder({
        assetIndex,
        size: normalizedSize,
        isEntryBuy: isBuy,
        triggerPrice,
        type: 'sl',
        maxSlippagePercent: task.orderPlan.maxSlippagePercent,
        sizeDecimals: asset.szDecimals,
      });
      orders.push(triggerOrder);
      triggerOrder.c = buildClientOrderId(task.id, orders.length - 1);
      clientOrderIds.push(triggerOrder.c);
      stopLossPrice =
        'trigger' in triggerOrder.t
          ? triggerOrder.t.trigger.triggerPx
          : undefined;
    }

    const orderAction: IUnionKeyHyperliquidOrderAction = {
      type: 'order',
      orders,
      grouping: orders.length > 1 ? 'normalTpsl' : 'na',
    };
    const actionNonce = Date.now();
    const actions: IUnionKeyAssistPreparedAction[] = [];
    if (task.orderPlan.leverage) {
      actions.push(
        this.buildPreparedAction({
          kind: 'leverage',
          action: {
            type: 'updateLeverage',
            asset: assetIndex,
            isCross: task.orderPlan.marginMode === 'cross',
            leverage: task.orderPlan.leverage,
          },
          nonce: actionNonce,
        }),
      );
    }
    actions.push(
      this.buildPreparedAction({
        kind: 'order',
        action: orderAction,
        nonce: actionNonce + actions.length,
      }),
    );
    const orderPreparedAction = actions[actions.length - 1];
    const assetContext = assetContexts[assetIndex];
    const position = previewContext.clearinghouse.assetPositions?.find(
      (item) =>
        item.position?.coin?.toUpperCase() === task.baseSymbol.toUpperCase(),
    )?.position;
    const feeRate = previewContext.fees?.userCrossRate;
    const preparedOrder: IUnionKeyAssistPreparedOrder = {
      provider: 'hyperliquid',
      actions,
      accountAddress: normalizedAddress,
      typedData: orderPreparedAction.typedData,
      currentPrice: snapshot.currentPrice,
      size: normalizedSize,
      limitPrice,
      estimatedNotional: estimatedNotional.toFixed(2),
      environment: HYPERLIQUID_ENVIRONMENT,
      clientOrderIds,
      preview: {
        markPrice: assetContext?.markPx ?? snapshot.currentPrice,
        oraclePrice: assetContext?.oraclePx,
        estimatedFillPrice: limitPrice,
        availableToTrade: previewContext.clearinghouse.withdrawable,
        accountValue: previewContext.clearinghouse.marginSummary?.accountValue,
        marginUsed: previewContext.clearinghouse.marginSummary?.totalMarginUsed,
        estimatedInitialMargin: estimatedInitialMargin.toFixed(2),
        currentLiquidationPrice: position?.liquidationPx,
        estimatedTradingFee: feeRate
          ? estimatedNotional.multipliedBy(feeRate).toFixed(4)
          : undefined,
        feeRate,
        currentFundingRate: assetContext?.funding,
        unionKeyFee: '0',
      },
      takeProfitPrice,
      stopLossPrice,
      preparedAt: Date.now(),
    };
    const updatedTask: IUnionKeyAssistTask = {
      ...task,
      accountAddress: normalizedAddress,
      currentPrice: snapshot.currentPrice,
      riskAssessment: taskRiskAssessment,
      preparedOrder,
      status: delegated ? 'submitting' : 'awaitingSignature',
      error: undefined,
      updatedAt: Date.now(),
    };
    await this.backgroundApi.simpleDb.unionKeyTrade.upsertAssistTask(
      updatedTask,
    );
    return updatedTask;
  }

  @backgroundMethod()
  async prepareAssistTaskExecution({
    taskId,
    accountAddress,
  }: IPrepareUnionKeyAssistExecutionParams) {
    const task = await this.getTask(taskId);
    if (task.authorizationMode !== 'confirmEach') {
      throw new Error('受限代理任务会在条件满足后自动执行');
    }
    return this.prepareTaskExecution({
      task,
      accountAddress,
      delegated: false,
    });
  }

  private async submitPreparedAction({
    preparedAction,
    signature,
  }: {
    preparedAction: IUnionKeyAssistPreparedAction;
    signature: string;
  }) {
    const parsedSignature = Signature.from(signature);
    const response = await axios.post<IHyperliquidExchangeResponse>(
      HYPERLIQUID_EXCHANGE_URL,
      {
        action: preparedAction.action,
        nonce: preparedAction.nonce,
        signature: {
          r: parsedSignature.r,
          s: parsedSignature.s,
          v: parsedSignature.v,
        },
        vaultAddress: null,
        expiresAfter: preparedAction.expiresAfter,
      },
      { timeout: REQUEST_TIMEOUT_MS },
    );
    assertDefaultExchangeResponse(response.data);
    return response.data;
  }

  private async submitPreparedExecution({
    task,
    signatures,
    signerAddress,
    signedBy,
  }: {
    task: IUnionKeyAssistTask;
    signatures: string[];
    signerAddress: string;
    signedBy: IUnionKeyAssistExecutionResult['signedBy'];
  }) {
    const preparedOrder = task.preparedOrder;
    if (!preparedOrder) {
      throw new Error('没有可提交的待签名订单');
    }
    if (
      preparedOrder.actions.some((action) => action.expiresAfter <= Date.now())
    ) {
      throw new Error('订单签名已经过期，请重新确认');
    }
    if (signatures.length !== preparedOrder.actions.length) {
      throw new Error('订单签名数量与执行步骤不一致');
    }
    const normalizedSignerAddress = getAddress(signerAddress).toLowerCase();
    preparedOrder.actions.forEach((preparedAction, index) => {
      const recoveredAddress = verifyTypedData(
        preparedAction.typedData.domain,
        getTradingTypes(preparedAction),
        preparedAction.typedData.message,
        signatures[index],
      ).toLowerCase();
      if (recoveredAddress !== normalizedSignerAddress) {
        throw new Error('交易签名账户与预期签名账户不一致');
      }
    });

    const submittingTask: IUnionKeyAssistTask = {
      ...task,
      status: 'submitting',
      error: undefined,
      updatedAt: Date.now(),
    };
    await this.backgroundApi.simpleDb.unionKeyTrade.upsertAssistTask(
      submittingTask,
    );

    try {
      let orderResponse: IHyperliquidExchangeResponse | undefined;
      for (let index = 0; index < preparedOrder.actions.length; index += 1) {
        const preparedAction = preparedOrder.actions[index];
        const response = await this.submitPreparedAction({
          preparedAction,
          signature: signatures[index],
        });
        if (preparedAction.kind === 'order') {
          orderResponse = response;
        }
      }
      if (!orderResponse) {
        throw new Error('订单执行步骤缺失');
      }
      const executionResult = parseOrderExecutionResult({
        response: orderResponse,
        signedBy,
      });
      const receipt: IUnionKeyAssistExecutionReceipt = {
        id: generateUUID(),
        taskId: task.id,
        accountAddress: task.accountAddress,
        environment: task.environment,
        instrument: task.instrument,
        provider: 'hyperliquid',
        baseSymbol: task.baseSymbol,
        quoteSymbol: task.quoteSymbol,
        side: task.orderPlan.side,
        size: preparedOrder.size,
        estimatedNotional: preparedOrder.estimatedNotional,
        clientOrderIds: preparedOrder.clientOrderIds,
        result: executionResult,
        createdAt: executionResult.submittedAt,
      };
      await this.backgroundApi.simpleDb.unionKeyTrade.appendExecutionReceipt(
        receipt,
      );
      const completedTask: IUnionKeyAssistTask = {
        ...submittingTask,
        status: 'completed',
        executionResult,
        updatedAt: Date.now(),
      };
      await this.backgroundApi.simpleDb.unionKeyTrade.upsertAssistTask(
        completedTask,
      );
      await this.notifyTaskCompleted(completedTask);
      return completedTask;
    } catch (error) {
      const primaryCloid = preparedOrder.clientOrderIds[0];
      if (primaryCloid) {
        try {
          const remoteOrder = await this.fetchOrderStatus({
            accountAddress: task.accountAddress,
            oid: primaryCloid,
          });
          if (remoteOrder.status === 'order') {
            const exchangeStatus = remoteOrder.order.status;
            const recoveredStatus = getRecoveredExecutionStatus(exchangeStatus);
            const executionResult: IUnionKeyAssistExecutionResult = {
              status: recoveredStatus,
              orderId: remoteOrder.order.order?.oid
                ? String(remoteOrder.order.order.oid)
                : undefined,
              orderIds: remoteOrder.order.order?.oid
                ? [String(remoteOrder.order.order.oid)]
                : undefined,
              signedBy,
              submittedAt: Date.now(),
              exchangeStatus,
              lastReconciledAt: Date.now(),
            };
            const recoveredTask: IUnionKeyAssistTask = {
              ...submittingTask,
              status: 'completed',
              executionResult,
              error: undefined,
              updatedAt: Date.now(),
            };
            await this.backgroundApi.simpleDb.unionKeyTrade.upsertAssistTask(
              recoveredTask,
            );
            await this.backgroundApi.simpleDb.unionKeyTrade.appendExecutionReceipt(
              {
                id: generateUUID(),
                taskId: task.id,
                accountAddress: task.accountAddress,
                environment: task.environment,
                instrument: task.instrument,
                provider: 'hyperliquid',
                baseSymbol: task.baseSymbol,
                quoteSymbol: task.quoteSymbol,
                side: task.orderPlan.side,
                size: preparedOrder.size,
                estimatedNotional: preparedOrder.estimatedNotional,
                clientOrderIds: preparedOrder.clientOrderIds,
                result: executionResult,
                createdAt: executionResult.submittedAt,
              },
            );
            return recoveredTask;
          }
        } catch {
          // Preserve the original submission error when reconciliation fails.
        }
      }
      const failedTask: IUnionKeyAssistTask = {
        ...submittingTask,
        status: signedBy === 'agent' ? 'error' : 'ready',
        preparedOrder: undefined,
        error: getErrorMessage(error),
        updatedAt: Date.now(),
      };
      await this.backgroundApi.simpleDb.unionKeyTrade.upsertAssistTask(
        failedTask,
      );
      throw new Error(failedTask.error);
    }
  }

  @backgroundMethod()
  async submitAssistTaskExecution({
    taskId,
    accountAddress,
    signatures,
  }: ISubmitUnionKeyAssistExecutionParams) {
    const task = await this.getTask(taskId);
    if (
      task.authorizationMode !== 'confirmEach' ||
      task.status !== 'awaitingSignature' ||
      !task.preparedOrder
    ) {
      throw new Error('没有可提交的逐笔确认订单');
    }
    const normalizedAddress = getAddress(accountAddress).toLowerCase();
    if (normalizedAddress !== task.preparedOrder.accountAddress) {
      throw new Error('当前账户与订单准备账户不一致');
    }
    return this.submitPreparedExecution({
      task,
      signatures,
      signerAddress: normalizedAddress,
      signedBy: 'hardware',
    });
  }

  private async executeDelegatedTask(task: IUnionKeyAssistTask) {
    const grant = await this.assertAgentAllowsTask(
      task,
      task.currentPrice ?? '0',
    );
    const secret = await this.getStoredAgentSecret(task.accountAddress);
    if (
      !secret ||
      secret.agentAddress.toLowerCase() !== grant.agentAddress.toLowerCase()
    ) {
      throw new Error('代理密钥不在系统安全存储中，请重新授权');
    }
    const preparedTask = await this.prepareTaskExecution({
      task,
      accountAddress: task.accountAddress,
      delegated: true,
    });
    if (!preparedTask.preparedOrder) {
      throw new Error('代理订单准备失败');
    }
    const agentWallet = new Wallet(secret.privateKey);
    const signatures = await Promise.all(
      preparedTask.preparedOrder.actions.map((preparedAction) =>
        agentWallet.signTypedData(
          preparedAction.typedData.domain,
          getTradingTypes(preparedAction),
          preparedAction.typedData.message,
        ),
      ),
    );
    return this.submitPreparedExecution({
      task: preparedTask,
      signatures,
      signerAddress: agentWallet.address,
      signedBy: 'agent',
    });
  }

  @backgroundMethod()
  async refreshAssistTask(taskId: string) {
    const task = await this.getTask(taskId);
    if (task.status !== 'monitoring') {
      return task;
    }

    try {
      const snapshot = await this.fetchTaskMarketSnapshot(
        task,
        task.trigger.type === 'signal',
      );
      const riskAssessment = await this.assessTaskRisk(
        task,
        snapshot.currentPrice,
      );
      if (!riskAssessment.passed) {
        const blockedTask: IUnionKeyAssistTask = {
          ...task,
          ...snapshot,
          riskAssessment,
          status: 'error',
          error: this.getBlockedRiskMessage(riskAssessment),
          lastCheckedAt: Date.now(),
          updatedAt: Date.now(),
        };
        await this.backgroundApi.simpleDb.unionKeyTrade.upsertAssistTask(
          blockedTask,
        );
        return blockedTask;
      }
      if (task.authorizationMode === 'delegated') {
        await this.assertAgentAllowsTask(task, snapshot.currentPrice);
      }
      const ready = isUnionKeyAssistTriggerMet({
        trigger: task.trigger,
        currentPrice: snapshot.currentPrice,
        signal: snapshot.signal,
      });
      const updatedTask: IUnionKeyAssistTask = {
        ...task,
        ...snapshot,
        riskAssessment,
        status: ready ? 'ready' : 'monitoring',
        error: undefined,
        lastCheckedAt: Date.now(),
        updatedAt: Date.now(),
      };
      if (ready && !task.notifiedAt) {
        updatedTask.notifiedAt = Date.now();
        await this.notifyTaskReady(updatedTask);
      }
      await this.backgroundApi.simpleDb.unionKeyTrade.upsertAssistTask(
        updatedTask,
      );
      if (ready && task.authorizationMode === 'delegated') {
        return await this.executeDelegatedTask(updatedTask);
      }
      return updatedTask;
    } catch (error) {
      const updatedTask: IUnionKeyAssistTask = {
        ...task,
        status: task.authorizationMode === 'delegated' ? 'error' : 'monitoring',
        error: getErrorMessage(error),
        lastCheckedAt: Date.now(),
        updatedAt: Date.now(),
      };
      await this.backgroundApi.simpleDb.unionKeyTrade.upsertAssistTask(
        updatedTask,
      );
      return updatedTask;
    }
  }

  private async reconcileRestingTask(task: IUnionKeyAssistTask) {
    if (
      task.executionResult?.status !== 'resting' ||
      (!task.executionResult.orderId &&
        !task.preparedOrder?.clientOrderIds?.[0])
    ) {
      return task;
    }
    const oid =
      task.preparedOrder?.clientOrderIds?.[0] ??
      Number(task.executionResult.orderId);
    const remoteOrder = await this.fetchOrderStatus({
      accountAddress: task.accountAddress,
      oid,
    });
    if (remoteOrder.status !== 'order') {
      return task;
    }
    const exchangeStatus = remoteOrder.order.status;
    let status: IUnionKeyAssistExecutionResult['status'] =
      task.executionResult.status;
    if (exchangeStatus === 'filled') {
      status = 'filled';
    } else if (
      exchangeStatus === 'canceled' ||
      exchangeStatus.endsWith('Canceled') ||
      exchangeStatus === 'scheduledCancel'
    ) {
      status = 'cancelled';
    } else if (
      exchangeStatus === 'rejected' ||
      exchangeStatus.endsWith('Rejected')
    ) {
      status = 'rejected';
    }
    const executionResult: IUnionKeyAssistExecutionResult = {
      ...task.executionResult,
      status,
      exchangeStatus,
      lastReconciledAt: Date.now(),
    };
    const updatedTask: IUnionKeyAssistTask = {
      ...task,
      executionResult,
      updatedAt: Date.now(),
    };
    await this.backgroundApi.simpleDb.unionKeyTrade.upsertAssistTask(
      updatedTask,
    );
    if (status !== 'resting' && task.preparedOrder) {
      await this.backgroundApi.simpleDb.unionKeyTrade.appendExecutionReceipt({
        id: generateUUID(),
        taskId: task.id,
        accountAddress: task.accountAddress,
        environment: task.environment,
        instrument: task.instrument,
        provider: 'hyperliquid',
        baseSymbol: task.baseSymbol,
        quoteSymbol: task.quoteSymbol,
        side: task.orderPlan.side,
        size: task.preparedOrder.size,
        estimatedNotional: task.preparedOrder.estimatedNotional,
        clientOrderIds: task.preparedOrder.clientOrderIds,
        result: executionResult,
        createdAt: Date.now(),
      });
    }
    return updatedTask;
  }

  @backgroundMethod()
  async refreshActiveAssistTasks() {
    if (this.isRefreshing) {
      return this.getAssistTasks();
    }
    this.isRefreshing = true;
    try {
      const tasks: IUnionKeyAssistTask[] = await this.getAssistTasks();
      const activeTasks = tasks.filter((task) => task.status === 'monitoring');
      const restingTasks = tasks.filter(
        (task) => task.executionResult?.status === 'resting',
      );
      if (!activeTasks.length && !restingTasks.length) {
        this.stopMonitor();
        return tasks;
      }
      await Promise.all([
        ...activeTasks.map((task) => this.refreshAssistTask(task.id)),
        ...restingTasks.map((task) => this.reconcileRestingTask(task)),
      ]);
      return await this.getAssistTasks();
    } finally {
      this.isRefreshing = false;
    }
  }

  @backgroundMethod()
  async prepareAssistOrderCancellation({
    taskId,
    accountAddress,
  }: IPrepareUnionKeyAssistOrderCancellationParams) {
    const task = await this.getTask(taskId);
    if (
      task.status !== 'completed' ||
      task.executionResult?.status !== 'resting' ||
      !task.executionResult.orderIds?.length
    ) {
      throw new Error('该任务没有可撤销的交易所挂单');
    }
    const normalizedAddress = getAddress(accountAddress).toLowerCase();
    if (normalizedAddress !== task.accountAddress) {
      throw new Error('当前账户与挂单账户不一致');
    }
    let assetIndex = -1;
    if (task.instrument === 'spot') {
      const resolved = await this.resolveSpotMarket(
        task.baseSymbol,
        task.quoteSymbol,
      );
      assetIndex = resolved.assetIndex;
    } else {
      const { meta } = await this.fetchHyperliquidMeta();
      assetIndex = meta.universe.findIndex(
        (asset) => asset.name.toUpperCase() === task.baseSymbol.toUpperCase(),
      );
    }
    if (assetIndex < 0) {
      throw new Error(`无法定位 ${task.baseSymbol} 的交易所市场`);
    }
    const orderIds = task.executionResult.orderIds
      .map((orderId) => Number(orderId))
      .filter(Number.isSafeInteger);
    if (!orderIds.length) {
      throw new Error('挂单编号无效，无法提交撤单');
    }
    const preparedAction = this.buildPreparedAction({
      kind: 'cancel',
      action: {
        type: 'cancel',
        cancels: orderIds.map((orderId) => ({
          a: assetIndex,
          o: orderId,
        })),
      },
      nonce: Date.now(),
    });
    this.pendingOrderCancellations.set(task.id, {
      accountAddress: normalizedAddress,
      preparedAction,
      validUntil: preparedAction.expiresAfter,
    });
    return preparedAction;
  }

  @backgroundMethod()
  async submitAssistOrderCancellation({
    taskId,
    accountAddress,
    signature,
  }: ISubmitUnionKeyAssistOrderCancellationParams) {
    const task = await this.getTask(taskId);
    const normalizedAddress = getAddress(accountAddress).toLowerCase();
    const pending = this.pendingOrderCancellations.get(task.id);
    if (
      !pending ||
      pending.accountAddress !== normalizedAddress ||
      pending.validUntil <= Date.now()
    ) {
      this.pendingOrderCancellations.delete(task.id);
      throw new Error('撤单签名请求不存在或已经过期');
    }
    const recoveredAddress = verifyTypedData(
      pending.preparedAction.typedData.domain,
      getTradingTypes(pending.preparedAction),
      pending.preparedAction.typedData.message,
      signature,
    ).toLowerCase();
    if (recoveredAddress !== normalizedAddress) {
      throw new Error('撤单签名账户与挂单账户不一致');
    }
    await this.submitPreparedAction({
      preparedAction: pending.preparedAction,
      signature,
    });
    const executionResult: IUnionKeyAssistExecutionResult = {
      ...task.executionResult,
      status: 'cancelled',
      signedBy: 'hardware',
      submittedAt: Date.now(),
    };
    const updatedTask: IUnionKeyAssistTask = {
      ...task,
      executionResult,
      updatedAt: Date.now(),
    };
    await this.backgroundApi.simpleDb.unionKeyTrade.upsertAssistTask(
      updatedTask,
    );
    if (task.preparedOrder) {
      await this.backgroundApi.simpleDb.unionKeyTrade.appendExecutionReceipt({
        id: generateUUID(),
        taskId: task.id,
        accountAddress: task.accountAddress,
        environment: task.environment,
        instrument: task.instrument,
        provider: 'hyperliquid',
        baseSymbol: task.baseSymbol,
        quoteSymbol: task.quoteSymbol,
        side: task.orderPlan.side,
        size: task.preparedOrder.size,
        estimatedNotional: task.preparedOrder.estimatedNotional,
        clientOrderIds: task.preparedOrder.clientOrderIds,
        result: executionResult,
        createdAt: executionResult.submittedAt,
      });
    }
    this.pendingOrderCancellations.delete(task.id);
    return updatedTask;
  }

  @backgroundMethod()
  async cancelAssistTask(taskId: string) {
    const task = await this.getTask(taskId);
    if (task.status === 'submitting' || task.status === 'completed') {
      throw new Error('订单已经提交，不能取消监控任务');
    }
    const updatedTask: IUnionKeyAssistTask = {
      ...task,
      status: 'cancelled',
      preparedOrder: undefined,
      updatedAt: Date.now(),
    };
    await this.backgroundApi.simpleDb.unionKeyTrade.upsertAssistTask(
      updatedTask,
    );
    const tasks: IUnionKeyAssistTask[] = await this.getAssistTasks();
    if (
      !tasks.some(
        (item) =>
          item.status === 'monitoring' ||
          item.executionResult?.status === 'resting',
      )
    ) {
      this.stopMonitor();
    }
    return updatedTask;
  }

  @backgroundMethod()
  async stopAllAssistTasks(accountAddress: string) {
    const normalizedAddress = getAddress(accountAddress).toLowerCase();
    const tasks: IUnionKeyAssistTask[] = await this.getAssistTasks();
    const cancellableTasks = tasks.filter(
      (task) =>
        task.accountAddress === normalizedAddress &&
        [
          'draft',
          'authorizing',
          'monitoring',
          'ready',
          'awaitingSignature',
        ].includes(task.status),
    );
    await Promise.all(
      cancellableTasks.map((task) =>
        this.backgroundApi.simpleDb.unionKeyTrade.upsertAssistTask({
          ...task,
          status: 'cancelled',
          preparedOrder: undefined,
          error: '用户执行了紧急停止',
          updatedAt: Date.now(),
        }),
      ),
    );
    const remainingTasks: IUnionKeyAssistTask[] = await this.getAssistTasks();
    if (
      !remainingTasks.some(
        (task) =>
          task.status === 'monitoring' ||
          task.executionResult?.status === 'resting',
      )
    ) {
      this.stopMonitor();
    }
    return cancellableTasks.length;
  }

  @backgroundMethod()
  async deleteAssistTask(taskId: string) {
    const task = await this.getTask(taskId);
    if (!['completed', 'cancelled', 'error'].includes(task.status)) {
      throw new Error('运行中的任务必须先停止，才能删除');
    }
    await this.backgroundApi.simpleDb.unionKeyTrade.deleteAssistTask(taskId);
  }

  @backgroundMethod()
  async resumeAssistTasks() {
    const tasks: IUnionKeyAssistTask[] = await this.getAssistTasks();
    if (
      tasks.some(
        (task) =>
          task.status === 'monitoring' ||
          task.executionResult?.status === 'resting',
      )
    ) {
      this.ensureMonitorRunning();
      void this.refreshActiveAssistTasks();
    }
  }
}
