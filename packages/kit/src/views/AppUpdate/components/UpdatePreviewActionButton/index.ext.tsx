import { useIntl } from 'react-intl';

import { Page } from '@unionkeyhq/components';
import { useHelpLink } from '@unionkeyhq/kit/src/hooks/useHelpLink';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import { openUrlExternal } from '@unionkeyhq/shared/src/utils/openUrlUtils';

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
