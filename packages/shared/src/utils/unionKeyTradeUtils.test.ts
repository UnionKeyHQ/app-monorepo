import {
  assessUnionKeyAssistRisk,
  getUnionKeyMarketSymbol,
  getUnionKeyTradeInstrument,
  isUnionKeyAssistTriggerMet,
  parseUnionKeyAssistClosePositionIntent,
  parseUnionKeyAssistRequirement,
} from './unionKeyTradeUtils';

describe('getUnionKeyTradeInstrument', () => {
  it('defaults regular buy and swap language to spot', () => {
    expect(getUnionKeyTradeInstrument('用 100 USDC 购买 ETC')).toBe('spot');
    expect(getUnionKeyTradeInstrument('swap 1 ETH to USDC')).toBe('spot');
  });

  it('only selects perpetuals for explicit derivative language', () => {
    expect(getUnionKeyTradeInstrument('3 倍杠杆做多 ETH')).toBe('perp');
    expect(getUnionKeyTradeInstrument('平掉 BTC 仓位')).toBe('perp');
  });
});

describe('getUnionKeyMarketSymbol', () => {
  it('ignores English analysis control words', () => {
    expect(getUnionKeyMarketSymbol('show me BTC price')).toBe('BTC');
    expect(getUnionKeyMarketSymbol('please analyze the DOGE market')).toBe(
      'DOGE',
    );
  });

  it('returns no symbol for a broad Chinese market request', () => {
    expect(getUnionKeyMarketSymbol('看看大盘')).toBeUndefined();
  });

  it('normalizes asset names to Hyperliquid market symbols', () => {
    expect(getUnionKeyMarketSymbol('分析 Tron 趋势')).toBe('TRX');
    expect(getUnionKeyMarketSymbol('analyze TRON trend')).toBe('TRX');
    expect(getUnionKeyMarketSymbol('show TRX price')).toBe('TRX');
    expect(getUnionKeyMarketSymbol('看看比特币走势')).toBe('BTC');
    expect(getUnionKeyMarketSymbol('analyze Ethereum')).toBe('ETH');
  });
});

describe('unionKeyTradeUtils', () => {
  test('parses a Chinese quote-sized market order', () => {
    expect(
      parseUnionKeyAssistRequirement(
        'BTC/USDT 价格低于 68,500 时，用 1,000 USDT 买入 BTC，最大滑点 0.3%',
      ),
    ).toEqual({
      baseSymbol: 'BTC',
      quoteSymbol: 'USDT',
      trigger: {
        type: 'price',
        operator: 'lte',
        value: '68500',
      },
      orderPlan: {
        side: 'buy',
        orderType: 'market',
        amount: '1000',
        amountUnit: 'quote',
        limitPrice: undefined,
        maxSlippagePercent: '0.3',
        leverage: undefined,
        marginMode: 'isolated',
        takeProfitPercent: undefined,
        stopLossPercent: undefined,
      },
    });
  });

  test('parses an English base-sized limit order', () => {
    expect(
      parseUnionKeyAssistRequirement(
        'Watch ETH to USDC and sell 0.25 ETH above 4200, limit price 4210',
      ),
    ).toEqual({
      baseSymbol: 'ETH',
      quoteSymbol: 'USDC',
      trigger: {
        type: 'price',
        operator: 'gte',
        value: '4200',
      },
      orderPlan: {
        side: 'sell',
        orderType: 'limit',
        amount: '0.25',
        amountUnit: 'base',
        limitPrice: '4210',
        maxSlippagePercent: '0.5',
        leverage: undefined,
        marginMode: 'isolated',
        takeProfitPercent: undefined,
        stopLossPercent: undefined,
      },
    });
  });

  test('requires an explicit side and amount', () => {
    expect(() =>
      parseUnionKeyAssistRequirement('观察 ETH/USDC 的交易机会'),
    ).toThrow('请明确写出买入、卖出、做多或做空');
    expect(() =>
      parseUnionKeyAssistRequirement('观察 ETH/USDC 并在出现信号时买入'),
    ).toThrow('请写明交易数量');
    expect(() => parseUnionKeyAssistRequirement('购买 ETC')).toThrow(
      '请写明交易数量',
    );
  });

  test('parses a concise Chinese purchase request', () => {
    expect(parseUnionKeyAssistRequirement('购买 1 ETC')).toMatchObject({
      baseSymbol: 'ETC',
      quoteSymbol: 'USDC',
      orderPlan: {
        side: 'buy',
        amount: '1',
        amountUnit: 'base',
      },
    });
    expect(parseUnionKeyAssistRequirement('我要买1ETC')).toMatchObject({
      baseSymbol: 'ETC',
      orderPlan: {
        side: 'buy',
        amount: '1',
        amountUnit: 'base',
      },
    });
    expect(parseUnionKeyAssistRequirement('卖 0.2 ETH')).toMatchObject({
      baseSymbol: 'ETH',
      orderPlan: {
        side: 'sell',
        amount: '0.2',
        amountUnit: 'base',
      },
    });
  });

  test('understands compact amounts, measure words and asset names', () => {
    expect(parseUnionKeyAssistRequirement('购买1sol')).toMatchObject({
      baseSymbol: 'SOL',
      quoteSymbol: 'USDC',
      orderPlan: { side: 'buy', amount: '1', amountUnit: 'base' },
    });
    expect(parseUnionKeyAssistRequirement('购买 1 个索拉纳')).toMatchObject({
      baseSymbol: 'SOL',
      quoteSymbol: 'USDC',
      orderPlan: { side: 'buy', amount: '1', amountUnit: 'base' },
    });
    expect(parseUnionKeyAssistRequirement('buy 0.01 Bitcoin')).toMatchObject({
      baseSymbol: 'BTC',
      quoteSymbol: 'USDC',
      orderPlan: { side: 'buy', amount: '0.01', amountUnit: 'base' },
    });
  });

  test('parses native take-profit, stop-loss and leverage protections', () => {
    expect(
      parseUnionKeyAssistRequirement(
        'ETH/USDC 低于 2400 时买入 0.1 ETH，逐仓 2x，止盈 6%，止损 3%',
      ).orderPlan,
    ).toMatchObject({
      side: 'buy',
      amount: '0.1',
      amountUnit: 'base',
      leverage: 2,
      marginMode: 'isolated',
      takeProfitPercent: '6',
      stopLossPercent: '3',
    });
  });

  test('evaluates price and moving-average triggers', () => {
    expect(
      isUnionKeyAssistTriggerMet({
        trigger: { type: 'price', operator: 'gte', value: '2000' },
        currentPrice: '2001',
      }),
    ).toBe(true);
    expect(
      isUnionKeyAssistTriggerMet({
        trigger: { type: 'immediate' },
        currentPrice: '2001',
        signal: {
          shortAverage: '2005',
          longAverage: '2000',
          momentumPercent: '0.25',
        },
      }),
    ).toBe(true);
  });

  test('only waits for a signal when the user explicitly requests one', () => {
    expect(
      parseUnionKeyAssistRequirement('等待趋势信号后用 100 USDC 买入 ETH')
        .trigger,
    ).toEqual({ type: 'signal', side: 'buy' });
  });

  test('rejects conflicting multi-action and quantity instructions', () => {
    expect(() =>
      parseUnionKeyAssistRequirement('去购买etc用100sol买1000sol'),
    ).toThrow('检测到多个交易动作');
    expect(() =>
      parseUnionKeyAssistRequirement('用 100 USDC 买 1 ETH'),
    ).toThrow('不能同时指定');
    expect(() =>
      parseUnionKeyAssistRequirement('用 100 SOL 买 1000 SOL'),
    ).toThrow('支付币和购买币不能都是 SOL');
  });

  test('parses receive-first spend-last instructions without defaulting to USDC', () => {
    expect(parseUnionKeyAssistRequirement('买100sol用100etc')).toMatchObject({
      baseSymbol: 'SOL',
      quoteSymbol: 'ETC',
      trigger: { type: 'immediate' },
      orderPlan: {
        side: 'buy',
        orderType: 'limit',
        amount: '100',
        amountUnit: 'base',
        limitPrice: '1',
      },
    });
    expect(parseUnionKeyAssistRequirement('买入1eth用sol')).toMatchObject({
      baseSymbol: 'ETH',
      quoteSymbol: 'SOL',
      trigger: { type: 'immediate' },
      orderPlan: {
        side: 'buy',
        orderType: 'market',
        amount: '1',
        amountUnit: 'base',
      },
    });
    expect(parseUnionKeyAssistRequirement('buy 1 ETH with SOL')).toMatchObject({
      baseSymbol: 'ETH',
      quoteSymbol: 'SOL',
      orderPlan: {
        side: 'buy',
        amount: '1',
        amountUnit: 'base',
      },
    });
  });

  test('blocks delegated execution when the requested symbol exceeds its grant', () => {
    const requirement = parseUnionKeyAssistRequirement(
      'ETH/USDC 低于 2400 时买入 0.1 ETH，止损 3%',
    );
    const assessment = assessUnionKeyAssistRisk({
      requirement,
      currentPrice: '2300',
      policy: {
        allowedSymbols: ['BTC'],
        maxOrderNotional: '500',
        maxDailyNotional: '1000',
        maxLeverage: 3,
        maxSlippagePercent: '0.5',
        requireStopLoss: true,
        expiresAt: Date.now() + 60 * 60 * 1000,
      },
    });

    expect(assessment.passed).toBe(false);
    expect(assessment.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'symbol', status: 'blocked' }),
      ]),
    );
  });

  test('parses a natural-language position close request', () => {
    expect(
      parseUnionKeyAssistClosePositionIntent('把 ETH 仓位减仓 50%'),
    ).toEqual({
      baseSymbol: 'ETH',
      percentage: '50',
    });
    expect(parseUnionKeyAssistClosePositionIntent('平掉 BTC 仓位')).toEqual({
      baseSymbol: 'BTC',
      percentage: '100',
    });
  });
});
