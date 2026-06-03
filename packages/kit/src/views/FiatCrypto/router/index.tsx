import type { IModalFlowNavigatorConfig } from '@unionkey/components/src/layouts/Navigation/Navigator';
import { LazyLoadPage } from '@unionkey/kit/src/components/LazyLoadPage';
import { EModalFiatCryptoRoutes } from '@unionkey/shared/src/routes/fiatCrypto';
import type { IModalFiatCryptoParamList } from '@unionkey/shared/src/routes/fiatCrypto';

const FiatCryptoBuyModal = LazyLoadPage(
  () => import('@unionkey/kit/src/views/FiatCrypto/pages/Buy'),
);

const FiatCryptoSellModal = LazyLoadPage(
  () => import('@unionkey/kit/src/views/FiatCrypto/pages/Sell'),
);

const DeriveTypesAddress = LazyLoadPage(
  () =>
    import('@unionkey/kit/src/views/WalletAddress/pages/DeriveTypesAddress'),
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
