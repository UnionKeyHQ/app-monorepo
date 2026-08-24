import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components';
import { LazyLoadPage } from '@unionkeyhq/kit/src/components/LazyLoadPage';
import { EAssetSelectorRoutes } from '@unionkeyhq/shared/src/routes';
import type { IAssetSelectorParamList } from '@unionkeyhq/shared/src/routes';

const TokenSelector = LazyLoadPage(() => import('../pages/TokenSelector'));

const DeriveTypesAddressSelector = LazyLoadPage(
  () =>
    import('@unionkeyhq/kit/src/views/WalletAddress/pages/DeriveTypesAddress'),
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
