import type { IModalFlowNavigatorConfig } from '@unionkey/components';
import { LazyLoadPage } from '@unionkey/kit/src/components/LazyLoadPage';
import type { IModalWebViewParamList } from '@unionkey/shared/src/routes';
import { EModalWebViewRoutes } from '@unionkey/shared/src/routes';

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
