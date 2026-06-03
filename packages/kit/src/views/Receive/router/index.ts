import type { IModalFlowNavigatorConfig } from '@unionkey/components';
import type { IModalReceiveParamList } from '@unionkey/shared/src/routes';
import { EModalReceiveRoutes } from '@unionkey/shared/src/routes';

import { LazyLoadPage } from '../../../components/LazyLoadPage';

const ReceiveToken = LazyLoadPage(
  () => import('@unionkey/kit/src/views/Receive/pages/ReceiveToken'),
);
const CreateInvoice = LazyLoadPage(
  () => import('@unionkey/kit/src/views/Receive/pages/CreateInvoice'),
);
const ReceiveInvoice = LazyLoadPage(
  () => import('@unionkey/kit/src/views/Receive/pages/ReceiveInvoice'),
);

const TokenSelector = LazyLoadPage(
  () => import('@unionkey/kit/src/views/AssetSelector/pages/TokenSelector'),
);

const DeriveTypesAddress = LazyLoadPage(
  () =>
    import('@unionkey/kit/src/views/WalletAddress/pages/DeriveTypesAddress'),
);

export const ModalReceiveStack: IModalFlowNavigatorConfig<
  EModalReceiveRoutes,
  IModalReceiveParamList
>[] = [
  {
    name: EModalReceiveRoutes.ReceiveToken,
    component: ReceiveToken,
  },
  {
    name: EModalReceiveRoutes.CreateInvoice,
    component: CreateInvoice,
  },
  {
    name: EModalReceiveRoutes.ReceiveInvoice,
    component: ReceiveInvoice,
  },
  {
    name: EModalReceiveRoutes.ReceiveSelectToken,
    component: TokenSelector,
  },
  {
    name: EModalReceiveRoutes.ReceiveSelectDeriveAddress,
    component: DeriveTypesAddress,
  },
];
