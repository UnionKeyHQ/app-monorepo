import { ESwapQuoteKind, type IFetchQuoteResult } from '../../types/swap/types';

import {
  canCompareSwapQuoteNetCost,
  getLowestCostSwapQuote,
  isSwapQuoteAvailable,
} from './unionKeySwapQuoteUtils';

const createQuote = (
  provider: string,
  overrides: Partial<IFetchQuoteResult> = {},
) =>
  ({
    quoteId: provider,
    info: {
      provider,
      providerName: provider,
    },
    fromTokenInfo: {
      networkId: 'evm--1',
      contractAddress: 'from',
      symbol: 'ETH',
      decimals: 18,
    },
    toTokenInfo: {
      networkId: 'evm--1',
      contractAddress: 'to',
      symbol: 'USDC',
      decimals: 6,
    },
    kind: ESwapQuoteKind.SELL,
    fromAmount: '1',
    toAmount: '100',
    ...overrides,
  } as IFetchQuoteResult);

describe('UnionKey swap quote selection', () => {
  it('rejects quotes outside their actual provider limits', () => {
    const quote = createQuote('limited', {
      limit: { min: '10', max: '100' },
    });

    expect(isSwapQuoteAvailable(quote, '9')).toBe(false);
    expect(isSwapQuoteAvailable(quote, '10')).toBe(true);
    expect(isSwapQuoteAvailable(quote, '100')).toBe(true);
    expect(isSwapQuoteAvailable(quote, '101')).toBe(false);
  });

  it('selects the highest net proceeds for a sell quote', () => {
    const highOutputHighFee = createQuote('high-output', {
      toAmount: '100',
      fee: { percentageFee: 0, estimatedFeeFiatValue: 20 },
    });
    const lowerOutputLowFee = createQuote('low-fee', {
      toAmount: '99',
      fee: { percentageFee: 0, estimatedFeeFiatValue: 1 },
    });

    expect(
      getLowestCostSwapQuote({
        quotes: [highOutputHighFee, lowerOutputLowFee],
        toTokenPrice: '1',
      })?.quoteId,
    ).toBe('low-fee');
  });

  it('selects the lowest total spend for a buy quote', () => {
    const lowerInputHighFee = createQuote('lower-input', {
      kind: ESwapQuoteKind.BUY,
      fromAmount: '100',
      fee: { percentageFee: 0, estimatedFeeFiatValue: 5 },
    });
    const higherInputLowFee = createQuote('low-fee', {
      kind: ESwapQuoteKind.BUY,
      fromAmount: '101',
      fee: { percentageFee: 0, estimatedFeeFiatValue: 1 },
    });

    expect(
      getLowestCostSwapQuote({
        quotes: [lowerInputHighFee, higherInputLowFee],
        fromTokenPrice: '1',
      })?.quoteId,
    ).toBe('low-fee');
  });

  it('only calls a quote cheapest when a fiat comparison is possible', () => {
    expect(
      canCompareSwapQuoteNetCost({
        quoteKind: ESwapQuoteKind.SELL,
        toTokenPrice: '1',
      }),
    ).toBe(true);
    expect(
      canCompareSwapQuoteNetCost({
        quoteKind: ESwapQuoteKind.SELL,
      }),
    ).toBe(false);
  });
});
