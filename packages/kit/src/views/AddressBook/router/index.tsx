import type { IModalFlowNavigatorConfig } from '@unionkey/components/src/layouts/Navigation/Navigator';
import { LazyLoadPage } from '@unionkey/kit/src/components/LazyLoadPage';
import type { IModalAddressBookParamList } from '@unionkey/shared/src/routes/addressBook';
import { EModalAddressBookRoutes } from '@unionkey/shared/src/routes/addressBook';

const AddressBookListModal = LazyLoadPage(
  () => import('@unionkey/kit/src/views/AddressBook/pages/ListItem'),
);

const AddressBookEditItemModal = LazyLoadPage(
  () => import('@unionkey/kit/src/views/AddressBook/pages/EditItem'),
);

const AddressBookPickItemModal = LazyLoadPage(
  () => import('@unionkey/kit/src/views/AddressBook/pages/PickItem'),
);

export const ModalAddressBookRouter: IModalFlowNavigatorConfig<
  EModalAddressBookRoutes,
  IModalAddressBookParamList
>[] = [
  {
    name: EModalAddressBookRoutes.ListItemModal,
    component: AddressBookListModal,
  },
  {
    name: EModalAddressBookRoutes.EditItemModal,
    component: AddressBookEditItemModal,
  },
  {
    name: EModalAddressBookRoutes.PickItemModal,
    component: AddressBookPickItemModal,
  },
];
