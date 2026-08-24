import { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { Page } from '@unionkeyhq/components';
import { EMnemonicType } from '@unionkeyhq/core/src/secret';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import { useUserWalletProfile } from '@unionkeyhq/kit/src/hooks/useUserWalletProfile';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import { defaultLogger } from '@unionkeyhq/shared/src/logger/logger';
import { EOnboardingPages } from '@unionkeyhq/shared/src/routes';

import { PhaseInputArea } from '../../components/PhaseInputArea';
import { showTonMnemonicDialog } from '../../components/TonMnemonicDialog';
import { Tutorials } from '../../components/Tutorials';

export function ImportRecoveryPhrase() {
  const intl = useIntl();
  const navigation = useAppNavigation();
  const { isSoftwareWalletOnlyUser } = useUserWalletProfile();

  const handleConfirmPress = useCallback(
    async (params: { mnemonic: string; mnemonicType: EMnemonicType }) => {
      if (params.mnemonicType === EMnemonicType.TON) {
        // **** TON mnemonic case - Show dialog
        showTonMnemonicDialog({
          onConfirm: () => {
            navigation.push(EOnboardingPages.FinalizeWalletSetup, {
              mnemonic: params.mnemonic,
              mnemonicType: params.mnemonicType,
              isWalletBackedUp: true,
            });
          },
        });
        defaultLogger.account.wallet.walletAdded({
          status: 'success',
          addMethod: 'ImportWallet',
          details: {
            importType: 'recoveryPhrase',
          },
          isSoftwareWalletOnlyUser,
        });
        return;
      }

      navigation.push(EOnboardingPages.FinalizeWalletSetup, {
        mnemonic: params.mnemonic,
        mnemonicType: params.mnemonicType,
        isWalletBackedUp: true,
      });
      defaultLogger.account.wallet.walletAdded({
        status: 'success',
        addMethod: 'ImportWallet',
        details: {
          importType: 'recoveryPhrase',
        },
        isSoftwareWalletOnlyUser,
      });
    },
    [navigation, isSoftwareWalletOnlyUser],
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
          id: ETranslations.global_import_recovery_phrase,
        })}
      />
      {renderPhaseInputArea}
    </Page>
  );
}

export default ImportRecoveryPhrase;
