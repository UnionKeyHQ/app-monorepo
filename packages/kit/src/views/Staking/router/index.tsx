import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components/src/layouts/Navigation/Navigator';
import LazyLoad from '@unionkeyhq/shared/src/lazyLoad';
import { EModalStakingRoutes } from '@unionkeyhq/shared/src/routes';
import type { IModalStakingParamList } from '@unionkeyhq/shared/src/routes';
import type {
  EModalAssetDetailRoutes,
  IModalAssetDetailsParamList,
} from '@unionkeyhq/shared/src/routes/assetDetails';

import { ModalAssetDetailsStack } from '../../AssetDetails/router';

const InvestmentDetails = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/Staking/pages/InvestmentDetails'),
);

const ProtocolDetails = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/Staking/pages/ProtocolDetails'),
);

const ProtocolDetailsV2 = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/Staking/pages/ProtocolDetailsV2'),
);

const Withdraw = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/Staking/pages/Withdraw'),
);

const Stake = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/Staking/pages/Stake'),
);

const Claim = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/Staking/pages/Claim'),
);

const AssetProtocolList = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/Staking/pages/AssetProtocolList'),
);

const ClaimOptions = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/Staking/pages/ClaimOptions'),
);

const WithdrawOptions = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/Staking/pages/WithdrawOptions'),
);

const PortfolioDetails = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/Staking/pages/PortfolioDetails'),
);

const HistoryList = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/Staking/pages/HistoryList'),
);

export const StakingModalRouter: IModalFlowNavigatorConfig<
  EModalStakingRoutes | EModalAssetDetailRoutes,
  IModalStakingParamList & IModalAssetDetailsParamList
>[] = [
  {
    name: EModalStakingRoutes.ProtocolDetails,
    component: ProtocolDetails,
    exact: true,
    rewrite: '/earn/staking/:symbol/:provider',
  },
  {
    name: EModalStakingRoutes.ProtocolDetailsV2,
    component: ProtocolDetailsV2,
    exact: true,
    rewrite: '/earn/staking/v2/:symbol/:provider',
  },
  {
    name: EModalStakingRoutes.Stake,
    component: Stake,
  },
  {
    name: EModalStakingRoutes.Withdraw,
    component: Withdraw,
  },
  {
    name: EModalStakingRoutes.AssetProtocolList,
    component: AssetProtocolList,
  },
  {
    name: EModalStakingRoutes.Claim,
    component: Claim,
  },
  {
    name: EModalStakingRoutes.ClaimOptions,
    component: ClaimOptions,
  },
  {
    name: EModalStakingRoutes.WithdrawOptions,
    component: WithdrawOptions,
  },
  {
    name: EModalStakingRoutes.InvestmentDetails,
    component: InvestmentDetails,
  },
  {
    name: EModalStakingRoutes.PortfolioDetails,
    component: PortfolioDetails,
  },
  {
    name: EModalStakingRoutes.HistoryList,
    component: HistoryList,
  },
  ...(ModalAssetDetailsStack as IModalFlowNavigatorConfig<
    EModalStakingRoutes | EModalAssetDetailRoutes,
    IModalStakingParamList & IModalAssetDetailsParamList
  >[]),
];
