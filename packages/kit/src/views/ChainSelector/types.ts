import type { IFuseResultMatch } from '@unionkey/shared/src/modules3rdParty/fuse';
import type { IServerNetwork } from '@unionkey/shared/types';

export type IServerNetworkMatch = IServerNetwork & {
  titleMatch?: IFuseResultMatch;
};

export type IPureChainSelectorSectionListItem = {
  title?: string;
  data: IServerNetworkMatch[];
  isUnavailable?: boolean;
};
