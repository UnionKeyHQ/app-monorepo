import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components';
import type { IModalAssetListParamList } from '@unionkeyhq/shared/src/routes';
import { EModalAssetListRoutes } from '@unionkeyhq/shared/src/routes';

import { LazyLoadPage } from '../../../components/LazyLoadPage';
import { TokenListWithProvider } from '../pages/TokenList';

const TokenManagerModal = LazyLoadPage(
  () => import('../pages/TokenManagerModal'),
);

const AddCustomTokenModal = LazyLoadPage(
  () => import('../pages/AddCustomTokenModal'),
);

export const ModalAssetListStack: IModalFlowNavigatorConfig<
  EModalAssetListRoutes,
  IModalAssetListParamList
>[] = [
  {
    name: EModalAssetListRoutes.TokenList,
    component: TokenListWithProvider,
  },
  {
    name: EModalAssetListRoutes.TokenManagerModal,
    component: TokenManagerModal,
  },
  {
    name: EModalAssetListRoutes.AddCustomTokenModal,
    component: AddCustomTokenModal,
  },
];
