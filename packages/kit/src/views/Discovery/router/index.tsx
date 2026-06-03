import type { IModalFlowNavigatorConfig } from '@unionkey/components/src/layouts/Navigation/Navigator';
import { LazyLoadPage } from '@unionkey/kit/src/components/LazyLoadPage';
import type { IDiscoveryModalParamList } from '@unionkey/shared/src/routes';
import { EDiscoveryModalRoutes } from '@unionkey/shared/src/routes';

const SearchModal = LazyLoadPage(
  () => import('@unionkey/kit/src/views/Discovery/pages/SearchModal'),
);

const MobileTabListModal = LazyLoadPage(
  () => import('@unionkey/kit/src/views/Discovery/pages/MobileTabListModal'),
);

const BookmarkListModal = LazyLoadPage(
  () => import('@unionkey/kit/src/views/Discovery/pages/BookmarkListModal'),
);

const HistoryListModal = LazyLoadPage(
  () => import('@unionkey/kit/src/views/Discovery/pages/HistoryListModal'),
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
