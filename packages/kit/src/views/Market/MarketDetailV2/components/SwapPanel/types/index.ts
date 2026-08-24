import type { ISwapTokenBase } from '@unionkeyhq/shared/types/swap/types';

export type IToken = ISwapTokenBase & {
  speedSwapDefaultAmount: number[];
};
