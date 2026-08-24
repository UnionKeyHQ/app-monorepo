import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components/src/layouts/Navigation/Navigator';
import { LazyLoadPage } from '@unionkeyhq/kit/src/components/LazyLoadPage';
import type { IModalAddressBookParamList } from '@unionkeyhq/shared/src/routes/addressBook';
import { EModalAddressBookRoutes } from '@unionkeyhq/shared/src/routes/addressBook';

const AddressBookListModal = LazyLoadPage(
  () => import('@unionkeyhq/kit/src/views/AddressBook/pages/ListItem'),
);

const AddressBookEditItemModal = LazyLoadPage(
  () => import('@unionkeyhq/kit/src/views/AddressBook/pages/EditItem'),
);

const AddressBookPickItemModal = LazyLoadPage(
  () => import('@unionkeyhq/kit/src/views/AddressBook/pages/PickItem'),
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
