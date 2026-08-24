import type { IFuseResultMatch } from '@unionkeyhq/shared/src/modules3rdParty/fuse';
import type { IServerNetwork } from '@unionkeyhq/shared/types';

export type IServerNetworkMatch = IServerNetwork & {
  titleMatch?: IFuseResultMatch;
};

export type IPureChainSelectorSectionListItem = {
  title?: string;
  data: IServerNetworkMatch[];
  isUnavailable?: boolean;
};
