import type { IModalFlowNavigatorConfig } from '@unionkey/components';
import { LazyLoadPage } from '@unionkey/kit/src/components/LazyLoadPage';
import { EAssetSelectorRoutes } from '@unionkey/shared/src/routes';
import type { IAssetSelectorParamList } from '@unionkey/shared/src/routes';

const TokenSelector = LazyLoadPage(() => import('../pages/TokenSelector'));

const DeriveTypesAddressSelector = LazyLoadPage(
  () =>
    import('@unionkey/kit/src/views/WalletAddress/pages/DeriveTypesAddress'),
);

export const AssetSelectorRouter: IModalFlowNavigatorConfig<
  EAssetSelectorRoutes,
  IAssetSelectorParamList
>[] = [
  {
    name: EAssetSelectorRoutes.TokenSelector,
    component: TokenSelector,
  },
  {
    name: EAssetSelectorRoutes.DeriveTypesAddressSelector,
    component: DeriveTypesAddressSelector,
  },
];
