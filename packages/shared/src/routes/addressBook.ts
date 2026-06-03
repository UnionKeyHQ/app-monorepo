import type { IAddressItem } from '@unionkey/kit/src/views/AddressBook/type';

export enum EModalAddressBookRoutes {
  ListItemModal = 'ListItemModal',
  EditItemModal = 'EditItemModal',
  PickItemModal = 'PickItemModal',
}

export type IModalAddressBookParamList = {
  [EModalAddressBookRoutes.ListItemModal]: undefined;
  [EModalAddressBookRoutes.EditItemModal]: IAddressItem;
  [EModalAddressBookRoutes.PickItemModal]: {
    networkId?: string;
    onPick?: (item: IAddressItem) => void;
  };
};
