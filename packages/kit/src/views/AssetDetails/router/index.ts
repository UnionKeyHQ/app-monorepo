import type { IModalFlowNavigatorConfig } from '@unionkey/components';
import type { IModalAssetDetailsParamList } from '@unionkey/shared/src/routes/assetDetails';
import { EModalAssetDetailRoutes } from '@unionkey/shared/src/routes/assetDetails';

import { LazyLoadPage } from '../../../components/LazyLoadPage';

const NFTDetails = LazyLoadPage(() => import('../pages/NFTDetails'));
const HistoryDetails = LazyLoadPage(
  () => import('../pages/HistoryDetails/HistoryDetails'),
);
const TokenDetails = LazyLoadPage(() => import('../pages/TokenDetails'));
const UTXODetails = LazyLoadPage(() => import('../pages/UTXODetails'));
const MarketDetail = LazyLoadPage(() => import('../../Market/MarketDetail'));

export const ModalAssetDetailsStack: IModalFlowNavigatorConfig<
  EModalAssetDetailRoutes,
  IModalAssetDetailsParamList
>[] = [
  {
    name: EModalAssetDetailRoutes.TokenDetails,
    component: TokenDetails,
  },
  {
    name: EModalAssetDetailRoutes.MarketDetail,
    component: MarketDetail,
  },
  {
    name: EModalAssetDetailRoutes.NFTDetails,
    component: NFTDetails,
  },
  {
    name: EModalAssetDetailRoutes.HistoryDetails,
    component: HistoryDetails,
  },
  {
    name: EModalAssetDetailRoutes.UTXODetails,
    component: UTXODetails,
  },
];
