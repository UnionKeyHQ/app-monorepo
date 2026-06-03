import type { IModalFlowNavigatorConfig } from '@unionkey/components';
import { LazyLoadPage } from '@unionkey/kit/src/components/LazyLoadPage';
import type { IScanQrCodeModalParamList } from '@unionkey/shared/src/routes';
import { EScanQrCodeModalPages } from '@unionkey/shared/src/routes';

const ScanQrCodeModal = LazyLoadPage(() => import('../pages/ScanQrCodeModal'));

export const ScanQrCodeModalRouter: IModalFlowNavigatorConfig<
  EScanQrCodeModalPages,
  IScanQrCodeModalParamList
>[] = [
  {
    name: EScanQrCodeModalPages.ScanQrCodeStack,
    component: ScanQrCodeModal,
  },
];
