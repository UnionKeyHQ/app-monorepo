import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components';
import { LazyLoadPage } from '@unionkeyhq/kit/src/components/LazyLoadPage';
import type { IScanQrCodeModalParamList } from '@unionkeyhq/shared/src/routes';
import { EScanQrCodeModalPages } from '@unionkeyhq/shared/src/routes';

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
