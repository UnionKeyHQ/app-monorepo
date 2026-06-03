import type { ISwapTokenBase } from '@unionkey/shared/types/swap/types';

export type IToken = ISwapTokenBase & {
  speedSwapDefaultAmount: number[];
};
