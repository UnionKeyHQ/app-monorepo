import type { IModalFlowNavigatorConfig } from '@unionkey/components/src/layouts/Navigation/Navigator';
import { LazyLoadPage } from '@unionkey/kit/src/components/LazyLoadPage';
import type { IAppUpdatePagesParamList } from '@unionkey/shared/src/routes';
import { EAppUpdateRoutes } from '@unionkey/shared/src/routes';

const UpdatePreview = LazyLoadPage(
  () => import('@unionkey/kit/src/views/AppUpdate/pages/UpdatePreview'),
);

const WhatsNew = LazyLoadPage(
  () => import('@unionkey/kit/src/views/AppUpdate/pages/WhatsNew'),
);

const DownloadVerify = LazyLoadPage(
  () => import('@unionkey/kit/src/views/AppUpdate/pages/DownloadVerify'),
);

const ManualInstall = LazyLoadPage(
  () => import('@unionkey/kit/src/views/AppUpdate/pages/ManualInstall'),
);

export const AppUpdateRouter: IModalFlowNavigatorConfig<
  EAppUpdateRoutes,
  IAppUpdatePagesParamList
>[] = [
  {
    name: EAppUpdateRoutes.UpdatePreview,
    component: UpdatePreview,
  },
  {
    name: EAppUpdateRoutes.WhatsNew,
    component: WhatsNew,
  },
  {
    name: EAppUpdateRoutes.DownloadVerify,
    component: DownloadVerify,
  },
  {
    name: EAppUpdateRoutes.ManualInstall,
    component: ManualInstall,
  },
];
