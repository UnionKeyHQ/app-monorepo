import type { ComponentProps, FC } from 'react';

import { Text } from '@unionkeyhq/components';
import { UnionKeyNetwork } from '@unionkeyhq/shared/src/config/networkIds';

export const floorPriceSymbolMap: Record<string, string> = {
  [UnionKeyNetwork.eth]: 'ETH',
  [UnionKeyNetwork.optimism]: 'ETH',
  [UnionKeyNetwork.bsc]: 'BNB',
  [UnionKeyNetwork.polygon]: 'MATIC',
  [UnionKeyNetwork.arbitrum]: 'ETH',
  [UnionKeyNetwork.sol]: 'SOL',
  [UnionKeyNetwork.avalanche]: 'AVAX',
};
type Props = {
  prefix?: string;
  price?: number | string | null;
  symbol?: string;
  networkId?: string;
} & ComponentProps<typeof Text>;

export function PriceString({ prefix, price, networkId, symbol }: Props) {
  const innderSymbol = symbol ?? floorPriceSymbolMap[networkId ?? ''];
  let value = '–';
  if (price && price !== null) {
    value = `${price} ${innderSymbol ?? ''}`;
  }
  if (prefix) {
    return `${prefix} ${value}`;
  }
  return `${value}`;
}

const PriceText: FC<Props> = ({
  prefix = '',
  price,
  networkId,
  symbol,
  ...textProps
}) => (
  <Text {...textProps}>
    {PriceString({ prefix, price, networkId, symbol })}
  </Text>
);

export default PriceText;
