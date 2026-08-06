import BigNumber from 'bignumber.js';

import {
  ESwapQuoteKind,
  type IFetchQuoteResult,
} from '@onekeyhq/shared/types/swap/types';

const toFiniteBigNumber = (value?: BigNumber.Value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const result = new BigNumber(value);
  return result.isFinite() && !result.isNaN() ? result : undefined;
};

export const isSwapQuoteAvailable = (
  quote: IFetchQuoteResult,
  fromAmount?: string,
) => {
  const toAmount = toFiniteBigNumber(quote.toAmount);
  if (!toAmount?.isGreaterThan(0)) {
    return false;
  }

  if (!quote.limit?.min && !quote.limit?.max) {
    return true;
  }

  const amount = toFiniteBigNumber(fromAmount);
  if (!amount) {
    return false;
  }

  const minimum = toFiniteBigNumber(quote.limit.min);
  const maximum = toFiniteBigNumber(quote.limit.max);
  return !(
    (minimum && amount.isLessThan(minimum)) ||
    (maximum && amount.isGreaterThan(maximum))
  );
};

const getQuoteFeeFiatValue = (quote: IFetchQuoteResult) =>
  new BigNumber(quote.fee?.estimatedFeeFiatValue ?? 0).plus(
    quote.oneKeyFeeExtraInfo?.oneKeyFeeUsd ?? 0,
  );

export const canCompareSwapQuoteNetCost = ({
  quoteKind,
  fromTokenPrice,
  toTokenPrice,
}: {
  quoteKind?: ESwapQuoteKind;
  fromTokenPrice?: string;
  toTokenPrice?: string;
}) => {
  const comparisonPrice =
    quoteKind === ESwapQuoteKind.BUY ? fromTokenPrice : toTokenPrice;
  return Boolean(toFiniteBigNumber(comparisonPrice)?.isGreaterThan(0));
};

export const getLowestCostSwapQuote = ({
  quotes,
  fromTokenPrice,
  toTokenPrice,
}: {
  quotes: IFetchQuoteResult[];
  fromTokenPrice?: string;
  toTokenPrice?: string;
}) => {
  const availableQuotes = quotes.filter((quote) => quote.toAmount);
  if (!availableQuotes.length) {
    return undefined;
  }

  const quoteKind =
    availableQuotes.find((quote) => quote.kind)?.kind ?? ESwapQuoteKind.SELL;
  const comparisonPrice = toFiniteBigNumber(
    quoteKind === ESwapQuoteKind.BUY ? fromTokenPrice : toTokenPrice,
  );

  const getComparableValue = (quote: IFetchQuoteResult) => {
    const amount = toFiniteBigNumber(
      quoteKind === ESwapQuoteKind.BUY ? quote.fromAmount : quote.toAmount,
    );
    if (!amount) {
      return undefined;
    }
    if (!comparisonPrice?.isGreaterThan(0)) {
      return amount;
    }

    const amountFiatValue = amount.multipliedBy(comparisonPrice);
    const feeFiatValue = getQuoteFeeFiatValue(quote);
    return quoteKind === ESwapQuoteKind.BUY
      ? amountFiatValue.plus(feeFiatValue)
      : amountFiatValue.minus(feeFiatValue);
  };

  return availableQuotes.reduce<IFetchQuoteResult | undefined>(
    (currentBest, quote) => {
      if (!currentBest) {
        return quote;
      }
      const currentValue = getComparableValue(currentBest);
      const nextValue = getComparableValue(quote);
      if (!nextValue) {
        return currentBest;
      }
      if (!currentValue) {
        return quote;
      }

      const comparison = nextValue.comparedTo(currentValue);
      const nextIsBetter =
        quoteKind === ESwapQuoteKind.BUY ? comparison < 0 : comparison > 0;
      return nextIsBetter ? quote : currentBest;
    },
    undefined,
  );
};

export const isSameSwapQuote = (
  left?: IFetchQuoteResult,
  right?: IFetchQuoteResult,
) => {
  if (!left || !right) {
    return false;
  }
  if (left.quoteId && right.quoteId) {
    return left.quoteId === right.quoteId;
  }
  return (
    left.info.provider === right.info.provider &&
    left.info.providerName === right.info.providerName
  );
};
