import type { IModalFlowNavigatorConfig } from '@unionkey/components';
import { LazyLoadPage } from '@unionkey/kit/src/components/LazyLoadPage';
import type { IChainSelectorParamList } from '@unionkey/shared/src/routes';
import { EChainSelectorPages } from '@unionkey/shared/src/routes';

const AccountChainSelector = LazyLoadPage(
  () => import('../pages/AccountChainSelector'),
);
const ChainSelector = LazyLoadPage(() => import('../pages/ChainSelector'));

const SettingCustomNetworkModal = LazyLoadPage(
  () => import('@unionkey/kit/src/views/Setting/pages/CustomNetwork'),
);

const AllNetworksManager = LazyLoadPage(
  () => import('../pages/AllNetworksManager'),
);

export const ChainSelectorRouter: IModalFlowNavigatorConfig<
  EChainSelectorPages,
  IChainSelectorParamList
>[] = [
  {
    name: EChainSelectorPages.AccountChainSelector,
    component: AccountChainSelector,
  },
  {
    name: EChainSelectorPages.ChainSelector,
    component: ChainSelector,
  },
  {
    name: EChainSelectorPages.AddCustomNetwork,
    component: SettingCustomNetworkModal,
  },
  {
    name: EChainSelectorPages.AllNetworksManager,
    component: AllNetworksManager,
  },
];
