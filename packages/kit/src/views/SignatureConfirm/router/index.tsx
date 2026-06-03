import type { IModalFlowNavigatorConfig } from '@unionkey/components';
import type { IModalSignatureConfirmParamList } from '@unionkey/shared/src/routes';
import { EModalSignatureConfirmRoutes } from '@unionkey/shared/src/routes';

import { LazyLoadPage } from '../../../components/LazyLoadPage';

const TxConfirmFromDApp = LazyLoadPage(
  () =>
    import(
      '@unionkey/kit/src/views/Send/pages/SendConfirmFromDApp/SendConfirmFromDApp'
    ),
);

const MessageConfirmFromDApp = LazyLoadPage(
  () =>
    import(
      '@unionkey/kit/src/views/SignatureConfirm/pages/MessageConfirm/MessageConfirmFromDapp'
    ),
);
const TxConfirmFromSwap = LazyLoadPage(
  () =>
    import(
      '@unionkey/kit/src/views/Send/pages/SendConfirmFromSwap/SendConfirmFromSwap'
    ),
);

const TxTokenSelector = LazyLoadPage(
  () => import('@unionkey/kit/src/views/AssetSelector/pages/TokenSelector'),
);

const TxDeriveTypesAddress = LazyLoadPage(
  () =>
    import('@unionkey/kit/src/views/WalletAddress/pages/DeriveTypesAddress'),
);

const TxDataInput = LazyLoadPage(
  () =>
    import(
      '@unionkey/kit/src/views/Send/pages/SendDataInput/SendDataInputContainer'
    ),
);

const TxReplace = LazyLoadPage(
  () =>
    import(
      '@unionkey/kit/src/views/Send/pages/SendReplaceTx/SendReplaceTxContainer'
    ),
);

const TxConfirm = LazyLoadPage(
  () =>
    import(
      '@unionkey/kit/src/views/SignatureConfirm/pages/TxConfirm/TxConfirm'
    ),
);

const MessageConfirm = LazyLoadPage(
  () =>
    import(
      '@unionkey/kit/src/views/SignatureConfirm/pages/MessageConfirm/MessageConfirm'
    ),
);

const LnurlPayRequestModal = LazyLoadPage(
  () =>
    import(
      '@unionkey/kit/src/views/LightningNetwork/pages/Send/LnurlPayRequestModal'
    ),
);

const LnurlWithdrawModal = LazyLoadPage(
  () =>
    import(
      '@unionkey/kit/src/views/LightningNetwork/pages/Send/LnurlWithdrawModal'
    ),
);

const LnurlAuthModal = LazyLoadPage(
  () =>
    import(
      '@unionkey/kit/src/views/LightningNetwork/pages/Send/LnurlAuthModal'
    ),
);

const WeblnSendPaymentModal = LazyLoadPage(
  () =>
    import(
      '@unionkey/kit/src/views/LightningNetwork/pages/Webln/WeblnSendPaymentModal'
    ),
);

export const ModalSignatureConfirmStack: IModalFlowNavigatorConfig<
  EModalSignatureConfirmRoutes,
  IModalSignatureConfirmParamList
>[] = [
  {
    name: EModalSignatureConfirmRoutes.TxConfirm,
    component: TxConfirm,
  },
  {
    name: EModalSignatureConfirmRoutes.MessageConfirm,
    component: MessageConfirm,
  },
  {
    name: EModalSignatureConfirmRoutes.TxConfirmFromDApp,
    component: TxConfirmFromDApp,
  },
  {
    name: EModalSignatureConfirmRoutes.MessageConfirmFromDApp,
    component: MessageConfirmFromDApp,
  },
  {
    name: EModalSignatureConfirmRoutes.TxConfirmFromSwap,
    component: TxConfirmFromSwap,
  },

  {
    name: EModalSignatureConfirmRoutes.TxDataInput,
    component: TxDataInput,
  },

  {
    name: EModalSignatureConfirmRoutes.TxReplace,
    component: TxReplace,
  },

  {
    name: EModalSignatureConfirmRoutes.TxSelectToken,
    component: TxTokenSelector,
  },

  {
    name: EModalSignatureConfirmRoutes.TxSelectDeriveAddress,
    component: TxDeriveTypesAddress,
  },

  {
    name: EModalSignatureConfirmRoutes.LnurlPayRequest,
    component: LnurlPayRequestModal,
  },

  {
    name: EModalSignatureConfirmRoutes.LnurlWithdraw,
    component: LnurlWithdrawModal,
  },

  {
    name: EModalSignatureConfirmRoutes.WeblnSendPayment,
    component: WeblnSendPaymentModal,
  },

  {
    name: EModalSignatureConfirmRoutes.LnurlAuth,
    component: LnurlAuthModal,
  },
];
