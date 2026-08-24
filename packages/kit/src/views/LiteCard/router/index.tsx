import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components/src/layouts/Navigation/Navigator';
import LazyLoad from '@unionkeyhq/shared/src/lazyLoad';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import { ELiteCardRoutes } from '@unionkeyhq/shared/src/routes';
import type { ILiteCardParamList } from '@unionkeyhq/shared/src/routes';

const LiteCardHome = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/LiteCard/pages/Home'),
);

const LiteCardSelectWallet = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/LiteCard/pages/SelectWallet'),
);

export const LiteCardPages: IModalFlowNavigatorConfig<
  ELiteCardRoutes,
  ILiteCardParamList
>[] = [
  {
    name: ELiteCardRoutes.LiteCardHome,
    component: LiteCardHome,
    translationId: ETranslations.global_unionkey_lite,
  },
  {
    name: ELiteCardRoutes.LiteCardSelectWallet,
    component: LiteCardSelectWallet,
    translationId: ETranslations.settings_select_wallet,
  },
];
