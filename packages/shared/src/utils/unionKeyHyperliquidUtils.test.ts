/* eslint-disable spellcheck/spell-checker */
import type { IUnionKeyHyperliquidOrderAction } from '@unionkeyhq/shared/types/unionkey/trade';

import {
  buildUnionKeyHyperliquidActionHash,
  buildUnionKeyHyperliquidTypedData,
  formatUnionKeyHyperliquidPrice,
} from './unionKeyHyperliquidUtils';

describe('unionKeyHyperliquidUtils', () => {
  test('matches the official Python MessagePack action hash algorithm', () => {
    const action: IUnionKeyHyperliquidOrderAction = {
      type: 'order',
      orders: [
        {
          a: 0,
          b: true,
          p: '2050.5',
          s: '0.25',
          r: false,
          t: {
            limit: {
              tif: 'Ioc',
            },
          },
        },
      ],
      grouping: 'na',
    };
    expect(
      buildUnionKeyHyperliquidActionHash({
        action,
        nonce: 1_700_000_000_123,
        expiresAfter: 1_700_000_120_123,
      }),
    ).toBe(
      '0x8d73edd2ff7517a3da9a5748768ef6a1cb5e068d93ddfc92398edb5ab8466eeb',
    );
  });

  test('builds the Hyperliquid phantom agent typed data', () => {
    const connectionId = `0x${'12'.repeat(32)}`;
    const typedData = buildUnionKeyHyperliquidTypedData(connectionId);
    expect(typedData.domain.chainId).toBe(1337);
    expect(typedData.primaryType).toBe('Agent');
    expect(typedData.message).toEqual({
      source: 'a',
      connectionId,
    });
  });

  test('formats prices to Hyperliquid significant digit rules', () => {
    expect(
      formatUnionKeyHyperliquidPrice({
        value: '1234.56789',
        sizeDecimals: 4,
      }),
    ).toBe('1234.6');
  });
});
