import type { IFuseResultMatch } from '@unionkeyhq/shared/src/modules3rdParty/fuse';
import type { IServerNetwork } from '@unionkeyhq/shared/types';

export type IAddressItem = {
  id?: string; // generateUUID
  address: string;
  name: string;
  networkId: string;
  isAllowListed?: boolean;
  createdAt?: number;
  updatedAt?: number;
};

export type IAddressNetworkItem = IAddressItem & {
  network: IServerNetwork;
};

export type IAddressNetworkExtendMatch = IAddressNetworkItem & {
  addressMatch?: IFuseResultMatch;
  nameMatch?: IFuseResultMatch;
};
