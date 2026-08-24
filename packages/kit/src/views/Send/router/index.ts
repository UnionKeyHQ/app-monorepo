import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components';
import { SendConfirmWithProvider } from '@unionkeyhq/kit/src/views/Send';
import type { IModalSendParamList } from '@unionkeyhq/shared/src/routes';
import { EModalSendRoutes } from '@unionkeyhq/shared/src/routes';

import { LazyLoadPage } from '../../../components/LazyLoadPage';

const SendDataInput = LazyLoadPage(
  () =>
    import(
      '@unionkeyhq/kit/src/views/Send/pages/SendDataInput/SendDataInputContainer'
    ),
);

const SendReplaceTx = LazyLoadPage(
  () =>
    import(
      '@unionkeyhq/kit/src/views/Send/pages/SendReplaceTx/SendReplaceTxContainer'
    ),
);

const TokenSelector = LazyLoadPage(
  () => import('@unionkeyhq/kit/src/views/AssetSelector/pages/TokenSelector'),
);

const DeriveTypesAddress = LazyLoadPage(
  () =>
    import('@unionkeyhq/kit/src/views/WalletAddress/pages/DeriveTypesAddress'),
);

const SendConfirmFromDApp = LazyLoadPage(
  () =>
    import(
      '@unionkeyhq/kit/src/views/Send/pages/SendConfirmFromDApp/SendConfirmFromDApp'
    ),
);

const SendConfirmFromSwap = LazyLoadPage(
  () =>
    import(
      '@unionkeyhq/kit/src/views/Send/pages/SendConfirmFromSwap/SendConfirmFromSwap'
    ),
);

export const ModalSendStack: IModalFlowNavigatorConfig<
  EModalSendRoutes,
  IModalSendParamList
>[] = [
  {
    name: EModalSendRoutes.SendDataInput,
    component: SendDataInput,
  },
  {
    name: EModalSendRoutes.SendConfirm,
    component: SendConfirmWithProvider,
  },
  {
    name: EModalSendRoutes.SendConfirmFromDApp,
    component: SendConfirmFromDApp,
  },
  {
    name: EModalSendRoutes.SendConfirmFromSwap,
    component: SendConfirmFromSwap,
  },
  {
    name: EModalSendRoutes.SendReplaceTx,
    component: SendReplaceTx,
  },
  // TODO: The following two pages seem to not be referenced anywhere, consider removing them
  {
    name: EModalSendRoutes.SendSelectToken,
    component: TokenSelector,
  },
  {
    name: EModalSendRoutes.SendSelectDeriveAddress,
    component: DeriveTypesAddress,
  },
];
