import type { Token } from '@unionkeyhq/engine/src/types/token';

import type { StyleProp, ViewStyle } from 'react-native';

export type SwapChartProps = {
  style?: StyleProp<ViewStyle>;
  fromToken: Token;
  toToken: Token;
};
