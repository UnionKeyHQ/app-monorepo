import { useMemo } from 'react';

import { useIntl } from 'react-intl';

import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import { AccountSelectorProviderMirror } from '@unionkeyhq/kit/src/components/AccountSelector';
import useAppNavigation from '@unionkeyhq/kit/src/hooks/useAppNavigation';
import { usePromiseResult } from '@unionkeyhq/kit/src/hooks/usePromiseResult';
import { useUserWalletProfile } from '@unionkeyhq/kit/src/hooks/useUserWalletProfile';
import { useAccountSelectorActions } from '@unionkeyhq/kit/src/states/jotai/contexts/accountSelector';
import type { IValidateGeneralInputParams } from '@unionkeyhq/kit-bg/src/vaults/types';
import { WALLET_TYPE_IMPORTED } from '@unionkeyhq/shared/src/consts/dbConsts';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import { defaultLogger } from '@unionkeyhq/shared/src/logger/logger';
import { EAccountSelectorSceneName } from '@unionkeyhq/shared/types';

import { Tutorials } from '../../components';

import {
  ImportSingleChainBase,
  fixInputImportSingleChain,
} from './ImportSingleChainBase';
import importWalletUiUtils from './importWalletUiUtils';

function ImportPrivateKey() {
  const intl = useIntl();
  const validationParams = useMemo<IValidateGeneralInputParams>(
    () => ({
      input: '',
      validateXprvt: true,
      validatePrivateKey: true,
    }),
    [],
  );

  const actions = useAccountSelectorActions();
  const navigation = useAppNavigation();
  const { isSoftwareWalletOnlyUser } = useUserWalletProfile();

  const { result: networkIds } = usePromiseResult(
    async () => {
      const networks =
        await backgroundApiProxy.serviceNetwork.getImportedAccountEnabledNetworks();
      const result = networks.map((o) => o.id);
      return result;
    },
    [],
    { initResult: [] },
  );

  return (
    <ImportSingleChainBase
      title={intl.formatMessage({
        id: ETranslations.global_import_private_key,
      })}
      inputLabel={intl.formatMessage({ id: ETranslations.global_private_key })}
      inputPlaceholder={intl.formatMessage({
        id: ETranslations.form_enter_private_key_placeholder,
      })}
      inputIsSecure
      inputTestID="private-key"
      invalidMessage={intl.formatMessage({
        id: ETranslations.form_private_key_error_invalid,
      })}
      validationParams={validationParams}
      onConfirm={async (form) => {
        const values = form.getValues();
        if (!values.input || !values.networkId) {
          return;
        }
        console.log('add imported account', values);
        const input =
          await backgroundApiProxy.servicePassword.encodeSensitiveText({
            text: fixInputImportSingleChain(values.input),
          });
        const r = await backgroundApiProxy.serviceAccount.addImportedAccount({
          input,
          deriveType: values.deriveType,
          networkId: values.networkId,
          name: values.accountName,
          shouldCheckDuplicateName: true,
        });
        console.log(r, values);
        // global.success

        const accountId = r?.accounts?.[0]?.id;

        importWalletUiUtils.toastSuccessWhenImportAddressOrPrivateKey({
          isOverrideAccounts: r?.isOverrideAccounts,
          accountId,
        });

        void actions.current.updateSelectedAccountForSingletonAccount({
          num: 0,
          networkId: values.networkId,
          walletId: WALLET_TYPE_IMPORTED,
          othersWalletAccountId: accountId,
        });
        navigation.popStack();
        defaultLogger.account.wallet.walletAdded({
          status: 'success',
          addMethod: 'ImportWallet',
          details: {
            importType: 'privateKey',
          },
          isSoftwareWalletOnlyUser,
        });
      }}
      networkIds={networkIds}
    >
      <Tutorials
        list={[
          {
            title: intl.formatMessage({ id: ETranslations.faq_private_key }),
            description: intl.formatMessage({
              id: ETranslations.faq_private_key_desc,
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
    </ImportSingleChainBase>
  );
}

function ImportPrivateKeyPage() {
  return (
    <AccountSelectorProviderMirror
      config={{
        sceneName: EAccountSelectorSceneName.home,
      }}
      enabledNum={[0]}
    >
      <ImportPrivateKey />
    </AccountSelectorProviderMirror>
  );
}

export default ImportPrivateKeyPage;
