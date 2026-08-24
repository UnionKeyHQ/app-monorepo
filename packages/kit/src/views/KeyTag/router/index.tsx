import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components/src/layouts/Navigation/Navigator';
import LazyLoad from '@unionkeyhq/shared/src/lazyLoad';
import { EModalKeyTagRoutes } from '@unionkeyhq/shared/src/routes';
import type { IModalKeyTagParamList } from '@unionkeyhq/shared/src/routes';

const BackupWallet = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/KeyTag/pages/BackupWallet'),
);

const UserOptions = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/KeyTag/pages/UserOptions'),
);

const BackupDotMap = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/KeyTag/pages/BackupDotMap'),
);

const BackupRecoveryPhrase = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/KeyTag/pages/BackupRecoveryPhrase'),
);

const BackupDocs = LazyLoad(
  () => import('@unionkeyhq/kit/src/views/KeyTag/pages/BackupDocs'),
);

export const KeyTagModalRouter: IModalFlowNavigatorConfig<
  EModalKeyTagRoutes,
  IModalKeyTagParamList
>[] = [
  {
    name: EModalKeyTagRoutes.BackupWallet,
    component: BackupWallet,
  },
  {
    name: EModalKeyTagRoutes.UserOptions,
    component: UserOptions,
  },
  {
    name: EModalKeyTagRoutes.BackupDotMap,
    component: BackupDotMap,
  },
  {
    name: EModalKeyTagRoutes.BackupRecoveryPhrase,
    component: BackupRecoveryPhrase,
  },
  {
    name: EModalKeyTagRoutes.BackupDocs,
    component: BackupDocs,
  },
];
