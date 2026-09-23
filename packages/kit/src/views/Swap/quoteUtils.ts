import BigNumber from 'bignumber.js';

import type { FetchQuoteResponse } from './typings';

const toFiniteBigNumber = (value?: BigNumber.Value) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const result = new BigNumber(value);
  return result.isFinite() && !result.isNaN() ? result : undefined;
};

export const isSwapQuoteResponseAvailable = (response: FetchQuoteResponse) => {
  const quote = response.data;
  if (!quote) {
    return false;
  }
  const outputAmount = toFiniteBigNumber(
    quote.estimatedBuyAmount ?? quote.buyAmount,
  );
  return !response.limited && Boolean(outputAmount?.isGreaterThan(0));
};

const getClosestLimitedResponse = (responses: FetchQuoteResponse[]) => {
  let selectedResponse: FetchQuoteResponse | undefined;
  let closestDistance: BigNumber | undefined;

  responses.forEach((response) => {
    if (!response.data) {
      return;
    }
    const amount = toFiniteBigNumber(response.data.sellAmount);
    if (!amount) {
      return;
    }
    const distances = [response.limited?.min, response.limited?.max]
      .map(toFiniteBigNumber)
      .filter((value): value is BigNumber => Boolean(value))
      .map((value) => amount.minus(value).abs());
    if (!distances.length) {
      return;
    }
    const distance = BigNumber.min(...distances);
    if (!closestDistance || distance.isLessThan(closestDistance)) {
      selectedResponse = response;
      closestDistance = distance;
    }
  });

  return selectedResponse;
};

export const getBestSwapQuoteResponse = ({
  responses,
  selectedQuoter,
}: {
  responses: FetchQuoteResponse[];
  selectedQuoter?: string;
}) => {
  const availableResponses = responses.filter(isSwapQuoteResponseAvailable);
  if (selectedQuoter) {
    const selectedResponse = availableResponses.find(
      (response) => response.data?.type === selectedQuoter,
    );
    if (selectedResponse) {
      return selectedResponse;
    }
  }

  const bestAvailableResponse = availableResponses.reduce<
    FetchQuoteResponse | undefined
  >((best, response) => {
    if (!best?.data || !response.data) {
      return response;
    }
    const bestAmount = toFiniteBigNumber(
      best.data.estimatedBuyAmount ?? best.data.buyAmount,
    );
    const nextAmount = toFiniteBigNumber(
      response.data.estimatedBuyAmount ?? response.data.buyAmount,
    );
    if (!nextAmount) {
      return best;
    }
    return !bestAmount || nextAmount.isGreaterThan(bestAmount)
      ? response
      : best;
  }, undefined);

  if (bestAvailableResponse) {
    return bestAvailableResponse;
  }
  return getClosestLimitedResponse(responses);
};
