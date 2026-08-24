import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components/src/layouts/Navigation/Navigator';
import { LazyLoadPage } from '@unionkeyhq/kit/src/components/LazyLoadPage';
import type { IDiscoveryModalParamList } from '@unionkeyhq/shared/src/routes';
import { EDiscoveryModalRoutes } from '@unionkeyhq/shared/src/routes';

const SearchModal = LazyLoadPage(
  () => import('@unionkeyhq/kit/src/views/Discovery/pages/SearchModal'),
);

const MobileTabListModal = LazyLoadPage(
  () => import('@unionkeyhq/kit/src/views/Discovery/pages/MobileTabListModal'),
);

const BookmarkListModal = LazyLoadPage(
  () => import('@unionkeyhq/kit/src/views/Discovery/pages/BookmarkListModal'),
);

const HistoryListModal = LazyLoadPage(
  () => import('@unionkeyhq/kit/src/views/Discovery/pages/HistoryListModal'),
);

export const ModalDiscoveryStack: IModalFlowNavigatorConfig<
  EDiscoveryModalRoutes,
  IDiscoveryModalParamList
>[] = [
  {
    name: EDiscoveryModalRoutes.MobileTabList,
    component: MobileTabListModal,
  },
  {
    name: EDiscoveryModalRoutes.SearchModal,
    component: SearchModal,
  },

  {
    name: EDiscoveryModalRoutes.BookmarkListModal,
    component: BookmarkListModal,
  },

  {
    name: EDiscoveryModalRoutes.HistoryListModal,
    component: HistoryListModal,
  },
];
