import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components/src/layouts/Navigation/Navigator';
import { LazyLoadPage } from '@unionkeyhq/kit/src/components/LazyLoadPage';
import { EModalFiatCryptoRoutes } from '@unionkeyhq/shared/src/routes/fiatCrypto';
import type { IModalFiatCryptoParamList } from '@unionkeyhq/shared/src/routes/fiatCrypto';

const FiatCryptoBuyModal = LazyLoadPage(
  () => import('@unionkeyhq/kit/src/views/FiatCrypto/pages/Buy'),
);

const FiatCryptoSellModal = LazyLoadPage(
  () => import('@unionkeyhq/kit/src/views/FiatCrypto/pages/Sell'),
);

const DeriveTypesAddress = LazyLoadPage(
  () =>
    import('@unionkeyhq/kit/src/views/WalletAddress/pages/DeriveTypesAddress'),
);

export const ModalFiatCryptoRouter: IModalFlowNavigatorConfig<
  EModalFiatCryptoRoutes,
  IModalFiatCryptoParamList
>[] = [
  {
    name: EModalFiatCryptoRoutes.BuyModal,
    component: FiatCryptoBuyModal,
  },
  {
    name: EModalFiatCryptoRoutes.SellModal,
    component: FiatCryptoSellModal,
  },
  {
    name: EModalFiatCryptoRoutes.DeriveTypesAddress,
    component: DeriveTypesAddress,
  },
];
