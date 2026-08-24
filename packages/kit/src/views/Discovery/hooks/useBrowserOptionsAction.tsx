import { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';
import { Share } from 'react-native';

import { Dialog, Input, Toast } from '@unionkeyhq/components';
import { useBrowserTabActions } from '@unionkeyhq/kit/src/states/jotai/contexts/discovery';
import type { IWebTab } from '@unionkeyhq/kit/src/views/Discovery/types';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import platformEnv from '@unionkeyhq/shared/src/platformEnv';

function useBrowserOptionsAction() {
  const handleShareUrl = useCallback((url: string) => {
    if (!url) {
      throw new Error('url is required');
    }
    setTimeout(() => {
      void Share.share(
        platformEnv.isNativeIOS
          ? {
              url,
            }
          : {
              message: url,
            },
      );
    }, 300);
  }, []);

  const intl = useIntl();
  const { setWebTabData, setTabs } = useBrowserTabActions().current;

  const handleRenameTab = useCallback(
    (item: IWebTab) =>
      new Promise((resolve) => {
        Dialog.confirm({
          title: intl.formatMessage({
            id: ETranslations.explore_rename,
          }),
          renderContent: (
            <Dialog.Form
              formProps={{
                defaultValues: {
                  name:
                    (item?.customTitle?.length ?? 0) > 0
                      ? item?.customTitle
                      : item?.title,
                },
              }}
            >
              <Dialog.FormField name="name">
                <Input
                  autoFocus
                  flex={1}
                  placeholder={item.title}
                  clearButtonMode="always"
                />
              </Dialog.FormField>
            </Dialog.Form>
          ),
          onConfirm: (dialogInstance) => {
            const form = dialogInstance.getForm()?.getValues();
            setWebTabData({
              ...item,
              customTitle: form?.name,
            });
            setTabs();
            Toast.success({
              title: intl.formatMessage({
                id: ETranslations.global_success,
              }),
            });
            resolve(true);
          },
        });
      }),
    [intl, setWebTabData, setTabs],
  );

  return useMemo(
    () => ({ handleShareUrl, handleRenameTab }),
    [handleShareUrl, handleRenameTab],
  );
}

export default useBrowserOptionsAction;
