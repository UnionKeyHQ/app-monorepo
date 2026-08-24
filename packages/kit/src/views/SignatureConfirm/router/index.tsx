import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components';
import type { IModalSignatureConfirmParamList } from '@unionkeyhq/shared/src/routes';
import { EModalSignatureConfirmRoutes } from '@unionkeyhq/shared/src/routes';

import { LazyLoadPage } from '../../../components/LazyLoadPage';

const TxConfirmFromDApp = LazyLoadPage(
  () =>
    import(
      '@unionkeyhq/kit/src/views/Send/pages/SendConfirmFromDApp/SendConfirmFromDApp'
    ),
);

const MessageConfirmFromDApp = LazyLoadPage(
  () =>
    import(
      '@unionkeyhq/kit/src/views/SignatureConfirm/pages/MessageConfirm/MessageConfirmFromDapp'
    ),
);
const TxConfirmFromSwap = LazyLoadPage(
  () =>
    import(
      '@unionkeyhq/kit/src/views/Send/pages/SendConfirmFromSwap/SendConfirmFromSwap'
    ),
);

const TxTokenSelector = LazyLoadPage(
  () => import('@unionkeyhq/kit/src/views/AssetSelector/pages/TokenSelector'),
);

const TxDeriveTypesAddress = LazyLoadPage(
  () =>
    import('@unionkeyhq/kit/src/views/WalletAddress/pages/DeriveTypesAddress'),
);

const TxDataInput = LazyLoadPage(
  () =>
    import(
      '@unionkeyhq/kit/src/views/Send/pages/SendDataInput/SendDataInputContainer'
    ),
);

const TxReplace = LazyLoadPage(
  () =>
    import(
      '@unionkeyhq/kit/src/views/Send/pages/SendReplaceTx/SendReplaceTxContainer'
    ),
);

const TxConfirm = LazyLoadPage(
  () =>
    import(
      '@unionkeyhq/kit/src/views/SignatureConfirm/pages/TxConfirm/TxConfirm'
    ),
);

const MessageConfirm = LazyLoadPage(
  () =>
    import(
      '@unionkeyhq/kit/src/views/SignatureConfirm/pages/MessageConfirm/MessageConfirm'
    ),
);

const LnurlPayRequestModal = LazyLoadPage(
  () =>
    import(
      '@unionkeyhq/kit/src/views/LightningNetwork/pages/Send/LnurlPayRequestModal'
    ),
);

const LnurlWithdrawModal = LazyLoadPage(
  () =>
    import(
      '@unionkeyhq/kit/src/views/LightningNetwork/pages/Send/LnurlWithdrawModal'
    ),
);

const LnurlAuthModal = LazyLoadPage(
  () =>
    import(
      '@unionkeyhq/kit/src/views/LightningNetwork/pages/Send/LnurlAuthModal'
    ),
);

const WeblnSendPaymentModal = LazyLoadPage(
  () =>
    import(
      '@unionkeyhq/kit/src/views/LightningNetwork/pages/Webln/WeblnSendPaymentModal'
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
