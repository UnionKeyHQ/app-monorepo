import { useIntl } from 'react-intl';

import { Page } from '@unionkey/components';
import { useHelpLink } from '@unionkey/kit/src/hooks/useHelpLink';
import { ETranslations } from '@unionkey/shared/src/locale';
import { openUrlExternal } from '@unionkey/shared/src/utils/openUrlUtils';

import type { IUpdatePreviewActionButton } from './type';

export const UpdatePreviewActionButton: IUpdatePreviewActionButton = () => {
  const intl = useIntl();
  const helpLink = useHelpLink({
    path: 'articles/9131347902223-Update-your-UnionKey-App',
  });
  return (
    <Page.Footer
      confirmButtonProps={{
        onPress: () => {
          openUrlExternal(helpLink);
        },
        iconAfter: 'ArrowTopRightOutline',
      }}
      onConfirmText={intl.formatMessage({
        id: ETranslations.update_manual_update,
      })}
    />
  );
};
