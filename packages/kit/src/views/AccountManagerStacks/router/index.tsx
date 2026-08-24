import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components';
import { LazyLoadPage } from '@unionkeyhq/kit/src/components/LazyLoadPage';
import type { IAccountManagerStacksParamList } from '@unionkeyhq/shared/src/routes';
import { EAccountManagerStacksRoutes } from '@unionkeyhq/shared/src/routes/accountManagerStacks';

const AccountSelectorStackPage = LazyLoadPage(
  () => import('../pages/AccountSelectorStack'),
);

const ExportPrivateKeys = LazyLoadPage(
  () => import('../pages/ExportKeys/ExportPrivateKeys'),
);

const BatchCreateAccountForm = LazyLoadPage(
  () => import('../pages/BatchCreateAccount/BatchCreateAccountForm'),
);

const BatchCreateAccountPreview = LazyLoadPage(
  () => import('../pages/BatchCreateAccount/BatchCreateAccountPreview'),
);

const HardwareHomeScreenModal = LazyLoadPage(
  () => import('../pages/HardwareHomeScreen/HardwareHomeScreenModal'),
);

const PageResolveSameWallets = LazyLoadPage(
  () => import('../pages/PageResolveSameWallets'),
);

export const AccountManagerStacks: IModalFlowNavigatorConfig<
  EAccountManagerStacksRoutes,
  IAccountManagerStacksParamList
>[] = [
  {
    name: EAccountManagerStacksRoutes.AccountSelectorStack,
    component: AccountSelectorStackPage,
  },
  {
    name: EAccountManagerStacksRoutes.ExportPrivateKeysPage,
    component: ExportPrivateKeys,
  },
  {
    name: EAccountManagerStacksRoutes.BatchCreateAccountForm,
    component: BatchCreateAccountForm,
  },
  {
    name: EAccountManagerStacksRoutes.BatchCreateAccountPreview,
    component: BatchCreateAccountPreview,
  },
  {
    name: EAccountManagerStacksRoutes.HardwareHomeScreenModal,
    component: HardwareHomeScreenModal,
  },
  {
    name: EAccountManagerStacksRoutes.PageResolveSameWallets,
    component: PageResolveSameWallets,
  },
];
