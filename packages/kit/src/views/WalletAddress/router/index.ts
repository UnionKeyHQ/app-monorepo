import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components/src/layouts/Navigation/Navigator';
import LazyLoad from '@unionkeyhq/shared/src/lazyLoad';
import { EModalWalletAddressRoutes } from '@unionkeyhq/shared/src/routes';
import type { IModalWalletAddressParamList } from '@unionkeyhq/shared/src/routes';

const DeriveTypesAddress = LazyLoad(
  () =>
    import('@unionkeyhq/kit/src/views/WalletAddress/pages/DeriveTypesAddress'),
);

const WalletAddress = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/WalletAddress/pages/WalletAddress'),
);

export const WalletAddressModalRouter: IModalFlowNavigatorConfig<
  EModalWalletAddressRoutes,
  IModalWalletAddressParamList
>[] = [
  {
    name: EModalWalletAddressRoutes.DeriveTypesAddress,
    component: DeriveTypesAddress,
  },
  {
    name: EModalWalletAddressRoutes.WalletAddress,
    component: WalletAddress,
  },
];
