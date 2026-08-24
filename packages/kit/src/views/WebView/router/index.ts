import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components';
import { LazyLoadPage } from '@unionkeyhq/kit/src/components/LazyLoadPage';
import type { IModalWebViewParamList } from '@unionkeyhq/shared/src/routes';
import { EModalWebViewRoutes } from '@unionkeyhq/shared/src/routes';

const WebViewModal = LazyLoadPage(() => import('../pages/WebViewModal'));

export const ModalWebViewStack: IModalFlowNavigatorConfig<
  EModalWebViewRoutes,
  IModalWebViewParamList
>[] = [
  {
    name: EModalWebViewRoutes.WebView,
    component: WebViewModal,
  },
];
