/* eslint-disable spellcheck/spell-checker */
import BigNumber from 'bignumber.js';

import type {
  IUnionKeyAssistMarketSignal,
  IUnionKeyAssistOrderPlan,
  IUnionKeyAssistRequirement,
  IUnionKeyAssistRiskAssessment,
  IUnionKeyAssistRiskCheck,
  IUnionKeyAssistRiskPolicy,
  IUnionKeyAssistTrigger,
  IUnionKeyTradeInstrument,
} from '@unionkeyhq/shared/types/unionkey/trade';

const DEFAULT_BASE_SYMBOL = 'ETH';
const DEFAULT_QUOTE_SYMBOL = 'USDC';
const DEFAULT_MAX_SLIPPAGE_PERCENT = '0.5';
const MAX_REQUIREMENT_LENGTH = 1000;
const MAX_POLICY_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const normalizeNumber = (value: string) => value.replace(/,/g, '');

const parsePositiveNumber = (value?: string) => {
  if (!value) {
    return undefined;
  }
  const normalized = normalizeNumber(value);
  const parsed = new BigNumber(normalized);
  return parsed.isFinite() && parsed.gt(0) ? parsed.toFixed() : undefined;
};

const SYMBOL_ALIASES: Record<string, string> = {
  AVALANCHE: 'AVAX',
  BITCOIN: 'BTC',
  'BITCOIN CASH': 'BCH',
  CARDANO: 'ADA',
  CHAINLINK: 'LINK',
  DOGECOIN: 'DOGE',
  ETHER: 'ETH',
  ETHEREUM: 'ETH',
  LITECOIN: 'LTC',
  POLKADOT: 'DOT',
  RIPPLE: 'XRP',
  SOLANA: 'SOL',
  'SHIBA INU': 'SHIB',
  TONCOIN: 'TON',
  TRON: 'TRX',
  XBT: 'BTC',
  以太坊: 'ETH',
  比特币: 'BTC',
  比特币现金: 'BCH',
  波场: 'TRX',
  狗狗币: 'DOGE',
  瑞波币: 'XRP',
  索拉纳: 'SOL',
};

const normalizeSymbol = (value?: string) => {
  const symbol = (value ?? '').trim().toUpperCase();
  return SYMBOL_ALIASES[symbol] ?? symbol;
};

const normalizeRequirementSymbols = (requirement: string) => {
  let normalized = requirement.normalize('NFKC');
  Object.entries(SYMBOL_ALIASES)
    .sort(([left], [right]) => right.length - left.length)
    .forEach(([name, symbol]) => {
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const isAsciiName = /^[A-Z ]+$/.test(name);
      normalized = normalized.replace(
        new RegExp(
          isAsciiName ? `\\b${escapedName}\\b` : escapedName,
          isAsciiName ? 'gi' : 'g',
        ),
        symbol,
      );
    });
  return normalized.replace(/([\d,.]+)\s*(?:个|枚|颗)\s*(?=[a-z0-9])/gi, '$1 ');
};

export const assertUnionKeyAssistRequirementIsUnambiguous = (
  requirement: string,
) => {
  const actionMatches =
    requirement.match(
      /买入|买进|购买|购入|买(?=\s*\$?\s*[\d])|卖出|卖掉|出售|卖(?=\s*\$?\s*[\d])|兑换|换成|做多|做空|开多|开空|开仓|平仓|平掉|减仓|\b(?:buy|sell|swap|exchange|long|short|close|reduce)\b/gi,
    ) ?? [];
  if (actionMatches.length > 1) {
    throw new Error(
      '检测到多个交易动作，请一次只描述一笔交易，例如“用 100 USDC 买入 ETH”',
    );
  }

  const exactSpendAndReceiveMatch = requirement.match(
    /(?:用|使用|花)\s*\$?\s*([\d,.]+)\s*([a-z0-9]{2,12})\s*(?:买入|买进|购买|购入|换成|兑换成|买)\s*\$?\s*([\d,.]+)\s*([a-z0-9]{2,12})/i,
  );
  if (exactSpendAndReceiveMatch) {
    const spendSymbol = normalizeSymbol(exactSpendAndReceiveMatch[2]);
    const receiveSymbol = normalizeSymbol(exactSpendAndReceiveMatch[4]);
    if (spendSymbol === receiveSymbol) {
      throw new Error(`支付币和购买币不能都是 ${spendSymbol}`);
    }
    throw new Error(
      `不能同时指定“支付 ${exactSpendAndReceiveMatch[1]} ${spendSymbol}”和“收到 ${exactSpendAndReceiveMatch[3]} ${receiveSymbol}”；请保留其中一个数量`,
    );
  }
};

export const getUnionKeyTradeInstrument = (
  requirement: string,
): IUnionKeyTradeInstrument => {
  if (
    /(?:永续|合约|杠杆|做多|做空|开多|开空|开仓|平仓|平掉|减仓|perp|perpetual|leverage|long|short|position)/i.test(
      requirement,
    )
  ) {
    return 'perp';
  }
  return 'spot';
};

export const getUnionKeyMarketSymbol = (requirement: string) => {
  const normalizedRequirement = normalizeRequirementSymbols(requirement);
  const controlWords = new Set([
    'analyze',
    'analysis',
    'at',
    'chart',
    'check',
    'current',
    'look',
    'market',
    'me',
    'of',
    'overview',
    'please',
    'price',
    'show',
    'the',
    'trend',
    'view',
  ]);
  const candidates =
    normalizedRequirement
      .match(/\b[a-z][a-z0-9]{1,11}\b/gi)
      ?.map(normalizeSymbol) ?? [];
  const commonSymbol = candidates.find((symbol) =>
    ['BTC', 'ETH', 'SOL'].includes(symbol),
  );
  return (
    commonSymbol ??
    candidates.find((symbol) => !controlWords.has(symbol.toLowerCase()))
  );
};

export const parseUnionKeyAssistClosePositionIntent = (requirement: string) => {
  const normalizedRequirement = normalizeRequirementSymbols(requirement);
  if (
    !/(?:平仓|平掉|全部平掉|减仓|close|reduce)/i.test(normalizedRequirement)
  ) {
    return undefined;
  }
  const controlWords = new Set([
    'close',
    'reduce',
    'position',
    'all',
    'half',
    'percent',
  ]);
  const baseSymbol = normalizeSymbol(
    normalizedRequirement
      .match(/\b[a-z][a-z0-9]{1,11}\b/gi)
      ?.find((word) => !controlWords.has(word.toLowerCase())),
  );
  if (!baseSymbol) {
    throw new Error('请说明要减仓或平仓的币种，例如“平掉 ETH 仓位”');
  }
  const percentageMatch = normalizedRequirement.match(/([\d.]+)\s*%/);
  const percentage = percentageMatch
    ? parsePositiveNumber(percentageMatch[1])
    : '100';
  if (!percentage || new BigNumber(percentage).gt(100)) {
    throw new Error('减仓比例必须在 0% 到 100% 之间');
  }
  return {
    baseSymbol,
    percentage,
  };
};

const getSide = (requirement: string): 'buy' | 'sell' | undefined => {
  if (
    /(?:买入|买进|购买|做多|开多|低吸|买(?=\s*\$?\s*[\d]))/i.test(
      requirement,
    ) ||
    /\b(?:buy|long)\b/i.test(requirement)
  ) {
    return 'buy';
  }
  if (
    /(?:卖出|卖掉|出售|做空|开空|卖(?=\s*\$?\s*[\d]))/i.test(requirement) ||
    /\b(?:sell|short)\b/i.test(requirement)
  ) {
    return 'sell';
  }
  return undefined;
};

const parsePairAndAmount = ({
  requirement,
  side,
}: {
  requirement: string;
  side: 'buy' | 'sell';
}) => {
  const receiveThenSpendMatch = requirement.match(
    /(?:买入|买进|购买|购入|买)\s*\$?\s*([\d,.]+)\s*([a-z0-9]{2,12})\s*(?:，|,)?\s*(?:用|使用|花)\s*\$?\s*([\d,.]+)\s*([a-z0-9]{2,12})/i,
  );
  if (receiveThenSpendMatch) {
    const receiveAmount = parsePositiveNumber(receiveThenSpendMatch[1]);
    const spendAmount = parsePositiveNumber(receiveThenSpendMatch[3]);
    if (!receiveAmount || !spendAmount) {
      throw new Error('购买数量或支付数量无效');
    }
    return {
      baseSymbol: normalizeSymbol(receiveThenSpendMatch[2]),
      quoteSymbol: normalizeSymbol(receiveThenSpendMatch[4]),
      amount: receiveAmount,
      amountUnit: 'base' as const,
      inferredLimitPrice: new BigNumber(spendAmount)
        .dividedBy(receiveAmount)
        .toFixed(),
    };
  }

  const receiveThenQuoteMatch =
    requirement.match(
      /(?:买入|买进|购买|购入|买)\s*\$?\s*([\d,.]+)\s*([a-z0-9]{2,12})\s*(?:，|,)?\s*(?:用|使用|花)\s*([a-z0-9]{2,12})\b/i,
    ) ??
    requirement.match(
      /\b(?:buy)\s*\$?\s*([\d,.]+)\s*([a-z0-9]{2,12})\s+(?:with|using)\s+([a-z0-9]{2,12})\b/i,
    );
  if (receiveThenQuoteMatch) {
    return {
      baseSymbol: normalizeSymbol(receiveThenQuoteMatch[2]),
      quoteSymbol: normalizeSymbol(receiveThenQuoteMatch[3]),
      amount: parsePositiveNumber(receiveThenQuoteMatch[1]),
      amountUnit: 'base' as const,
    };
  }

  const spendMatch = requirement.match(
    /(?:用|使用|花)\s*\$?\s*([\d,.]+)\s*([a-z0-9]{2,12})\s*(?:买入|买进|购买|换成|兑换成)\s*([a-z0-9]{2,12})/i,
  );
  if (spendMatch) {
    return {
      baseSymbol: normalizeSymbol(spendMatch[3]),
      quoteSymbol: normalizeSymbol(spendMatch[2]),
      amount: parsePositiveNumber(spendMatch[1]),
      amountUnit: 'quote' as const,
    };
  }

  const englishSpendMatch = requirement.match(
    /\b(?:use|spend)\s*\$?\s*([\d,.]+)\s*([a-z0-9]{2,12})\s+(?:to\s+)?(?:buy|long)\s+([a-z0-9]{2,12})\b/i,
  );
  if (englishSpendMatch) {
    return {
      baseSymbol: normalizeSymbol(englishSpendMatch[3]),
      quoteSymbol: normalizeSymbol(englishSpendMatch[2]),
      amount: parsePositiveNumber(englishSpendMatch[1]),
      amountUnit: 'quote' as const,
    };
  }

  const pairMatch =
    requirement.match(
      /\b([a-z0-9]{2,12})\s*(?:\/|-|兑|换成|兑换成|to)\s*([a-z0-9]{2,12})\b/i,
    ) ??
    requirement.match(
      /\b(?:swap|trade|exchange)\s+([a-z0-9]{2,12})\s+(?:for|into)\s+([a-z0-9]{2,12})\b/i,
    );
  const baseSymbol = normalizeSymbol(pairMatch?.[1] ?? DEFAULT_BASE_SYMBOL);
  const quoteSymbol = normalizeSymbol(pairMatch?.[2] ?? DEFAULT_QUOTE_SYMBOL);

  const amountMatch =
    requirement.match(
      /(?:买入|买进|购买|买|卖出|卖掉|出售|卖|做多|开多|做空|开空)\s*\$?\s*([\d,.]+)\s*([a-z0-9]{2,12})/i,
    ) ??
    requirement.match(
      /\b(?:buy|sell|long|short)\s*\$?\s*([\d,.]+)\s*([a-z0-9]{2,12})\b/i,
    );
  if (amountMatch) {
    const amountSymbol = normalizeSymbol(amountMatch[2]);
    return {
      baseSymbol:
        pairMatch || amountSymbol === quoteSymbol ? baseSymbol : amountSymbol,
      quoteSymbol,
      amount: parsePositiveNumber(amountMatch[1]),
      amountUnit:
        amountSymbol === quoteSymbol && side === 'buy'
          ? ('quote' as const)
          : ('base' as const),
    };
  }

  const quoteAmountMatch = requirement.match(
    /(?:金额|仓位|预算|名义价值|notional|amount)\s*(?:为|是|:|：)?\s*\$?\s*([\d,.]+)\s*([a-z0-9]{2,12})?/i,
  );
  return {
    baseSymbol,
    quoteSymbol,
    amount: parsePositiveNumber(quoteAmountMatch?.[1]),
    amountUnit:
      normalizeSymbol(quoteAmountMatch?.[2]) === baseSymbol
        ? ('base' as const)
        : ('quote' as const),
  };
};

const parseTrigger = (requirement: string): IUnionKeyAssistTrigger => {
  const greaterMatch = requirement.match(
    /(?:高于|超过|涨到|达到|不低于|突破|above|over|at least|reaches?|>=|>)\s*\$?\s*([\d,.]+)/i,
  );
  const greaterValue = parsePositiveNumber(greaterMatch?.[1]);
  if (greaterValue) {
    return {
      type: 'price',
      operator: 'gte',
      value: greaterValue,
    };
  }

  const lowerMatch = requirement.match(
    /(?:低于|跌到|不高于|跌破|below|under|at most|<=|<)\s*\$?\s*([\d,.]+)/i,
  );
  const lowerValue = parsePositiveNumber(lowerMatch?.[1]);
  if (lowerValue) {
    return {
      type: 'price',
      operator: 'lte',
      value: lowerValue,
    };
  }

  if (
    /(?:立即|马上|现在|直接|市价|immediately|right now|market)/i.test(
      requirement,
    )
  ) {
    return {
      type: 'immediate',
    };
  }

  if (/(?:趋势|信号|均线|动量|trend|signal|momentum)/i.test(requirement)) {
    return {
      type: 'signal',
      side: getSide(requirement) ?? 'buy',
    };
  }

  return { type: 'immediate' };
};

const parsePercentage = ({
  requirement,
  label,
}: {
  requirement: string;
  label: 'stopLoss' | 'takeProfit';
}) => {
  const expression =
    label === 'stopLoss'
      ? /(?:止损|stop[\s-]*loss)\s*(?:为|设为|设置为|:|：|at)?\s*([\d,.]+)\s*%/i
      : /(?:止盈|take[\s-]*profit)\s*(?:为|设为|设置为|:|：|at)?\s*([\d,.]+)\s*%/i;
  const value = parsePositiveNumber(requirement.match(expression)?.[1]);
  if (value && new BigNumber(value).gt(50)) {
    throw new Error(
      label === 'stopLoss' ? '止损比例不能超过 50%' : '止盈比例不能超过 50%',
    );
  }
  return value;
};

const parseLeverage = (requirement: string) => {
  const match =
    requirement.match(
      /([\d.]+)\s*(?:倍|x)\s*(?:杠杆|多单|空单|做多|做空|long|short)?/i,
    ) ?? requirement.match(/(?:杠杆|leverage)\s*(?:为|是|:|：)?\s*([\d.]+)/i);
  if (!match) {
    return undefined;
  }
  const leverage = Number(match[1]);
  if (!Number.isInteger(leverage) || leverage < 1 || leverage > 50) {
    throw new Error('杠杆必须是 1 到 50 之间的整数');
  }
  return leverage;
};

const parseOrderPlan = ({
  requirement,
  side,
  amount,
  amountUnit,
  trigger,
  inferredLimitPrice,
}: {
  requirement: string;
  side: 'buy' | 'sell';
  amount: string;
  amountUnit: 'base' | 'quote';
  trigger: IUnionKeyAssistTrigger;
  inferredLimitPrice?: string;
}): IUnionKeyAssistOrderPlan => {
  const isLimitOrder =
    /(?:限价|limit)/i.test(requirement) || !!inferredLimitPrice;
  const limitMatch = requirement.match(
    /(?:限价|limit(?:\s+price)?)\s*(?:为|是|:|：|at)?\s*\$?\s*([\d,.]+)/i,
  );
  const limitPrice =
    parsePositiveNumber(limitMatch?.[1]) ??
    inferredLimitPrice ??
    (isLimitOrder && trigger.type === 'price' ? trigger.value : undefined);
  if (isLimitOrder && !limitPrice) {
    throw new Error('限价单需要写明限价，例如“限价 2400”');
  }

  const slippageMatch = requirement.match(
    /(?:最大滑点|滑点不超过|max(?:imum)?\s+slippage)\s*(?:为|是|:|：)?\s*([\d,.]+)\s*%?/i,
  );
  const maxSlippagePercent =
    parsePositiveNumber(slippageMatch?.[1]) ?? DEFAULT_MAX_SLIPPAGE_PERCENT;
  if (new BigNumber(maxSlippagePercent).gt(5)) {
    throw new Error('最大滑点不能超过 5%');
  }

  const mentionsStopLoss = /(?:止损|stop[\s-]*loss)/i.test(requirement);
  const mentionsTakeProfit = /(?:止盈|take[\s-]*profit)/i.test(requirement);
  const stopLossPercent = parsePercentage({
    requirement,
    label: 'stopLoss',
  });
  const takeProfitPercent = parsePercentage({
    requirement,
    label: 'takeProfit',
  });
  if (mentionsStopLoss && !stopLossPercent) {
    throw new Error('请使用百分比设置止损，例如“止损 3%”');
  }
  if (mentionsTakeProfit && !takeProfitPercent) {
    throw new Error('请使用百分比设置止盈，例如“止盈 6%”');
  }

  return {
    side,
    orderType: isLimitOrder ? 'limit' : 'market',
    amount,
    amountUnit,
    limitPrice,
    maxSlippagePercent,
    leverage: parseLeverage(requirement),
    marginMode: /(?:全仓|cross)/i.test(requirement) ? 'cross' : 'isolated',
    takeProfitPercent,
    stopLossPercent,
  };
};

export const parseUnionKeyAssistRequirement = (
  requirement: string,
): IUnionKeyAssistRequirement => {
  const normalizedRequirement = normalizeRequirementSymbols(requirement).trim();
  if (normalizedRequirement.length < 4) {
    throw new Error('请写清楚交易对、方向、数量和执行条件');
  }
  if (normalizedRequirement.length > MAX_REQUIREMENT_LENGTH) {
    throw new Error(`代操要求不能超过 ${MAX_REQUIREMENT_LENGTH} 个字符`);
  }
  assertUnionKeyAssistRequirementIsUnambiguous(normalizedRequirement);

  const side = getSide(normalizedRequirement);
  if (!side) {
    throw new Error('请明确写出买入、卖出、做多或做空');
  }
  const pairAndAmount = parsePairAndAmount({
    requirement: normalizedRequirement,
    side,
  });
  if (!pairAndAmount.amount) {
    throw new Error('请写明交易数量，例如“用 100 USDC 买入 ETH”');
  }
  if (pairAndAmount.baseSymbol === pairAndAmount.quoteSymbol) {
    throw new Error(
      `支付币和购买币不能都是 ${pairAndAmount.baseSymbol}，请重新说明交易对`,
    );
  }
  const trigger = parseTrigger(normalizedRequirement);
  return {
    baseSymbol: pairAndAmount.baseSymbol,
    quoteSymbol: pairAndAmount.quoteSymbol,
    trigger,
    orderPlan: parseOrderPlan({
      requirement: normalizedRequirement,
      side,
      amount: pairAndAmount.amount,
      amountUnit: pairAndAmount.amountUnit,
      trigger,
      inferredLimitPrice:
        'inferredLimitPrice' in pairAndAmount
          ? pairAndAmount.inferredLimitPrice
          : undefined,
    }),
  };
};

const parsePolicyNumber = (value: string, label: string) => {
  const parsed = new BigNumber(value);
  if (!parsed.isFinite() || parsed.lte(0)) {
    throw new Error(`${label}必须大于 0`);
  }
  return parsed;
};

export const assertUnionKeyAssistRiskPolicy = (
  policy: IUnionKeyAssistRiskPolicy,
  now = Date.now(),
) => {
  if (!policy.allowedSymbols.length) {
    throw new Error('至少允许一个交易币种');
  }
  parsePolicyNumber(policy.maxOrderNotional, '单笔上限');
  parsePolicyNumber(policy.maxDailyNotional, '每日交易上限');
  const maxSlippage = parsePolicyNumber(
    policy.maxSlippagePercent,
    '代理最大滑点',
  );
  if (maxSlippage.gt(5)) {
    throw new Error('代理最大滑点不能超过 5%');
  }
  if (
    !Number.isInteger(policy.maxLeverage) ||
    policy.maxLeverage < 1 ||
    policy.maxLeverage > 50
  ) {
    throw new Error('代理最大杠杆必须是 1 到 50 之间的整数');
  }
  if (policy.expiresAt <= now + 60_000) {
    throw new Error('代理授权有效期至少需要 1 分钟');
  }
  if (policy.expiresAt > now + MAX_POLICY_DURATION_MS) {
    throw new Error('代理授权有效期不能超过 7 天');
  }
};

export const assessUnionKeyAssistRisk = ({
  requirement,
  currentPrice,
  policy,
  dailyNotionalUsed = '0',
  now = Date.now(),
}: {
  requirement: IUnionKeyAssistRequirement;
  currentPrice: string;
  policy: IUnionKeyAssistRiskPolicy;
  dailyNotionalUsed?: string;
  now?: number;
}): IUnionKeyAssistRiskAssessment => {
  assertUnionKeyAssistRiskPolicy(policy, now);

  const price = new BigNumber(currentPrice);
  if (!price.isFinite() || price.lte(0)) {
    throw new Error('实时价格无效，无法完成风控检查');
  }
  const amount = new BigNumber(requirement.orderPlan.amount);
  const estimatedNotional =
    requirement.orderPlan.amountUnit === 'quote'
      ? amount
      : amount.multipliedBy(price);
  const dailyNotionalAfterOrder = new BigNumber(dailyNotionalUsed).plus(
    estimatedNotional,
  );
  const estimatedMaxLoss = requirement.orderPlan.stopLossPercent
    ? estimatedNotional
        .multipliedBy(requirement.orderPlan.stopLossPercent)
        .dividedBy(100)
    : undefined;
  const normalizedAllowedSymbols = policy.allowedSymbols.map(normalizeSymbol);
  const leverage = requirement.orderPlan.leverage ?? 1;
  const stopLossPercent = requirement.orderPlan.stopLossPercent;
  let stopLossStatus: IUnionKeyAssistRiskCheck['status'] = 'passed';
  let stopLossDetail = stopLossPercent
    ? `触发后按 ${stopLossPercent}% 止损`
    : '';
  if (!stopLossPercent) {
    if (policy.requireStopLoss) {
      stopLossStatus = 'blocked';
      stopLossDetail = '受限代操必须设置止损';
    } else {
      stopLossStatus = 'warning';
      stopLossDetail = '未设置止损，请在签名前再次核对';
    }
  }
  const checks: IUnionKeyAssistRiskCheck[] = [
    {
      id: 'symbol',
      status: normalizedAllowedSymbols.includes(requirement.baseSymbol)
        ? 'passed'
        : 'blocked',
      label: '交易币种',
      detail: normalizedAllowedSymbols.includes(requirement.baseSymbol)
        ? `${requirement.baseSymbol} 在授权白名单内`
        : `${requirement.baseSymbol} 不在授权白名单内`,
    },
    {
      id: 'orderNotional',
      status: estimatedNotional.lte(policy.maxOrderNotional)
        ? 'passed'
        : 'blocked',
      label: '单笔额度',
      detail: `${estimatedNotional.toFixed(2)} / ${new BigNumber(
        policy.maxOrderNotional,
      ).toFixed(2)} ${requirement.quoteSymbol}`,
    },
    {
      id: 'dailyNotional',
      status: dailyNotionalAfterOrder.lte(policy.maxDailyNotional)
        ? 'passed'
        : 'blocked',
      label: '每日额度',
      detail: `${dailyNotionalAfterOrder.toFixed(2)} / ${new BigNumber(
        policy.maxDailyNotional,
      ).toFixed(2)} ${requirement.quoteSymbol}`,
    },
    {
      id: 'leverage',
      status: leverage <= policy.maxLeverage ? 'passed' : 'blocked',
      label: '杠杆限制',
      detail: `${leverage}x / 最高 ${policy.maxLeverage}x`,
    },
    {
      id: 'slippage',
      status: new BigNumber(requirement.orderPlan.maxSlippagePercent).lte(
        policy.maxSlippagePercent,
      )
        ? 'passed'
        : 'blocked',
      label: '滑点限制',
      detail: `${requirement.orderPlan.maxSlippagePercent}% / 最高 ${policy.maxSlippagePercent}%`,
    },
    {
      id: 'stopLoss',
      status: stopLossStatus,
      label: '止损保护',
      detail: stopLossDetail,
    },
    {
      id: 'expiry',
      status: policy.expiresAt > now ? 'passed' : 'blocked',
      label: '授权有效期',
      detail:
        policy.expiresAt > now
          ? new Date(policy.expiresAt).toLocaleString()
          : '授权已经过期',
    },
  ];

  return {
    passed: !checks.some((check) => check.status === 'blocked'),
    estimatedNotional: estimatedNotional.toFixed(2),
    estimatedMaxLoss: estimatedMaxLoss?.toFixed(2),
    dailyNotionalAfterOrder: dailyNotionalAfterOrder.toFixed(2),
    checks,
  };
};

export const isUnionKeyAssistTriggerMet = ({
  trigger,
  currentPrice,
  signal,
}: {
  trigger: IUnionKeyAssistTrigger;
  currentPrice: string;
  signal?: IUnionKeyAssistMarketSignal;
}) => {
  if (trigger.type === 'immediate') {
    return true;
  }
  const currentPriceNumber = Number(currentPrice);
  if (!Number.isFinite(currentPriceNumber)) {
    return false;
  }
  if (trigger.type === 'price') {
    const targetPrice = Number(trigger.value);
    return trigger.operator === 'gte'
      ? currentPriceNumber >= targetPrice
      : currentPriceNumber <= targetPrice;
  }
  if (!signal) {
    return false;
  }
  const shortAverage = Number(signal.shortAverage);
  const longAverage = Number(signal.longAverage);
  const momentumPercent = Number(signal.momentumPercent);
  if (
    !Number.isFinite(shortAverage) ||
    !Number.isFinite(longAverage) ||
    !Number.isFinite(momentumPercent)
  ) {
    return false;
  }
  if (trigger.side === 'buy') {
    return shortAverage >= longAverage * 1.001;
  }
  return shortAverage <= longAverage * 0.999;
};
