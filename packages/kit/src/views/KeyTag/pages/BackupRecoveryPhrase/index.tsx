import { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { Page } from '@unionkeyhq/components';
import type { EMnemonicType } from '@unionkeyhq/core/src/secret';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import { PhaseInputArea } from '@unionkeyhq/kit/src/views/Onboarding/components/PhaseInputArea';
import { Tutorials } from '@unionkeyhq/kit/src/views/Onboarding/components/Tutorials';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import { EModalKeyTagRoutes } from '@unionkeyhq/shared/src/routes';

export function ImportRecoveryPhrase() {
  const intl = useIntl();
  const navigation = useAppNavigation();

  const handleConfirmPress = useCallback(
    (params: { mnemonic: string; mnemonicType: EMnemonicType }) => {
      navigation.push(EModalKeyTagRoutes.BackupDotMap, {
        encodedText: params.mnemonic,
        title: '',
      });
    },
    [navigation],
  );

  const renderPhaseInputArea = useMemo(
    () => (
      <PhaseInputArea
        defaultPhrases={[]}
        onConfirm={handleConfirmPress}
        FooterComponent={
          <Tutorials
            px="$5"
            list={[
              {
                title: intl.formatMessage({
                  id: ETranslations.faq_recovery_phrase,
                }),
                description: intl.formatMessage({
                  id: ETranslations.faq_recovery_phrase_explaination,
                }),
              },
              {
                title: intl.formatMessage({
                  id: ETranslations.faq_recovery_phrase_safe_store,
                }),
                description: intl.formatMessage({
                  id: ETranslations.faq_recovery_phrase_safe_store_desc,
                }),
              },
            ]}
          />
        }
      />
    ),
    [handleConfirmPress, intl],
  );
  return (
    <Page scrollEnabled>
      <Page.Header
        title={intl.formatMessage({
          id: ETranslations.global_enter_recovery_phrase,
        })}
      />
      {renderPhaseInputArea}
    </Page>
  );
}

export default ImportRecoveryPhrase;
