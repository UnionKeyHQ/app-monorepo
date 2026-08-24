import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components/src/layouts/Navigation/Navigator';
import { LazyLoadPage } from '@unionkeyhq/kit/src/components/LazyLoadPage';
import type { IAppUpdatePagesParamList } from '@unionkeyhq/shared/src/routes';
import { EAppUpdateRoutes } from '@unionkeyhq/shared/src/routes';

const UpdatePreview = LazyLoadPage(
  () => import('@unionkeyhq/kit/src/views/AppUpdate/pages/UpdatePreview'),
);

const WhatsNew = LazyLoadPage(
  () => import('@unionkeyhq/kit/src/views/AppUpdate/pages/WhatsNew'),
);

const DownloadVerify = LazyLoadPage(
  () => import('@unionkeyhq/kit/src/views/AppUpdate/pages/DownloadVerify'),
);

const ManualInstall = LazyLoadPage(
  () => import('@unionkeyhq/kit/src/views/AppUpdate/pages/ManualInstall'),
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
