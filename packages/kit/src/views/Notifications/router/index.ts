import type { IModalFlowNavigatorConfig } from '@unionkeyhq/components';
import { LazyLoadPage } from '@unionkeyhq/kit/src/components/LazyLoadPage';
import type { IModalNotificationsParamList } from '@unionkeyhq/shared/src/routes/notifications';
import { EModalNotificationsRoutes } from '@unionkeyhq/shared/src/routes/notifications';

const NotificationList = LazyLoadPage(
  () => import('@unionkeyhq/kit/src/views/Notifications/pages/NotificationList'),
);

const NotificationIntroduction = LazyLoadPage(
  () =>
    import(
      '@unionkeyhq/kit/src/views/Notifications/pages/NotificationIntroduction'
    ),
);

export const ModalNotificationsRouter: IModalFlowNavigatorConfig<
  EModalNotificationsRoutes,
  IModalNotificationsParamList
>[] = [
  {
    name: EModalNotificationsRoutes.NotificationList,
    component: NotificationList,
  },

  {
    name: EModalNotificationsRoutes.NotificationIntroduction,
    component: NotificationIntroduction,
  },
];
