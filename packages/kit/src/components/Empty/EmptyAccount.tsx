import { useMemo } from 'react';

import { useIntl } from 'react-intl';

import type { IKeyOfIcons } from '@unionkeyhq/components';
import { Empty } from '@unionkeyhq/components';
import {
  EAppEventBusNames,
  appEventBus,
} from '@unionkeyhq/shared/src/eventBus/appEventBus';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import accountUtils from '@unionkeyhq/shared/src/utils/accountUtils';
import networkUtils from '@unionkeyhq/shared/src/utils/networkUtils';

import { useActiveAccount } from '../../states/jotai/contexts/accountSelector';
import { AccountSelectorCreateAddressButton } from '../AccountSelector/AccountSelectorCreateAddressButton';

type IProps = {
  name: string;
  chain: string;
  type: string;
  autoCreateAddress?: boolean;
  createAllDeriveTypes?: boolean;
  createAllEnabledNetworks?: boolean;
};

const num = 0;

function EmptyAccount(props: IProps) {
  const { autoCreateAddress, createAllDeriveTypes, createAllEnabledNetworks } =
    props;
  const intl = useIntl();
  const { activeAccount } = useActiveAccount({ num });

  const emptyMessage = useMemo(() => {
    let icon: IKeyOfIcons | undefined;
    let title = intl.formatMessage({ id: ETranslations.wallet_no_address });
    let description: string | undefined;
    if (activeAccount?.canCreateAddress) {
      description = intl.formatMessage({
        id: ETranslations.wallet_no_address_desc,
      });
    } else if (activeAccount?.isNetworkNotMatched) {
      description = intl.formatMessage({
        id: ETranslations.global_network_not_matched,
      });
    }
    const isQrWallet = accountUtils.isQrWallet({
      walletId: activeAccount?.wallet?.id,
    });
    if (isQrWallet && activeAccount?.isNetworkNotMatched) {
      icon = 'GlobusOutline';
      title = intl.formatMessage(
        {
          id: ETranslations.wallet_unsupported_network_title,
        },
        {
          'network': activeAccount?.network?.name || '',
        },
      );
      description = intl.formatMessage({
        id: ETranslations.wallet_unsupported_network_desc,
      });
    }
    return { title, description, icon };
  }, [intl, activeAccount]);

  return (
    <Empty
      testID="Wallet-No-Address-Empty"
      icon={emptyMessage.icon}
      title={emptyMessage.title}
      description={emptyMessage.description}
      button={
        activeAccount?.canCreateAddress ? (
          <AccountSelectorCreateAddressButton
            num={num}
            selectAfterCreate
            autoCreateAddress={autoCreateAddress}
            createAllDeriveTypes={createAllDeriveTypes}
            createAllEnabledNetworks={createAllEnabledNetworks}
            account={{
              walletId: activeAccount?.wallet?.id,
              networkId: activeAccount?.network?.id,
              indexedAccountId: activeAccount?.indexedAccount?.id,
              deriveType: activeAccount?.deriveType,
            }}
            buttonRender={Empty.Button}
            onCreateDone={() => {
              if (
                networkUtils.isAllNetwork({
                  networkId: activeAccount?.network?.id,
                })
              ) {
                appEventBus.emit(
                  EAppEventBusNames.AccountDataUpdate,
                  undefined,
                );
              }
            }}
          />
        ) : null
      }
    />
  );
}

export { EmptyAccount };
