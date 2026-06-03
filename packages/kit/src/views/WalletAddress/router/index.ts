import type { IModalFlowNavigatorConfig } from '@unionkey/components/src/layouts/Navigation/Navigator';
import LazyLoad from '@unionkey/shared/src/lazyLoad';
import { EModalWalletAddressRoutes } from '@unionkey/shared/src/routes';
import type { IModalWalletAddressParamList } from '@unionkey/shared/src/routes';

const DeriveTypesAddress = LazyLoad(
  () =>
    import('@unionkey/kit/src/views/WalletAddress/pages/DeriveTypesAddress'),
);

const WalletAddress = LazyLoad(
  () => import('@unionkey/kit/src/views/WalletAddress/pages/WalletAddress'),
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
