import { useCallback, useEffect, useRef } from 'react';

import backgroundApiProxy from '@unionkeyhq/kit/src/background/instance/backgroundApiProxy';
import { AccountSelectorProviderMirror } from '@unionkeyhq/kit/src/components/AccountSelector';
import {
  useAccountSelectorActions,
  useAccountSelectorContextDataAtom,
} from '@unionkeyhq/kit/src/states/jotai/contexts/accountSelector';
import type { IAccountSelectorSelectedAccount } from '@unionkeyhq/kit-bg/src/dbs/simple/entity/SimpleDbEntityAccountSelector';
import { useSettingsPersistAtom } from '@unionkeyhq/kit-bg/src/states/jotai/atoms';
import {
  EAppEventBusNames,
  appEventBus,
} from '@unionkeyhq/shared/src/eventBus/appEventBus';
import { ESpotlightTour } from '@unionkeyhq/shared/src/spotlight';
import accountUtils from '@unionkeyhq/shared/src/utils/accountUtils';
import { EAccountSelectorSceneName } from '@unionkeyhq/shared/types';
import { EAlignPrimaryAccountMode } from '@unionkeyhq/shared/types/dappConnection';
import type { IConnectionAccountInfo } from '@unionkeyhq/shared/types/dappConnection';

import { useSpotlight } from '../../../components/Spotlight';

export function useSyncDappAccountToHomeAccount() {
  const actions = useAccountSelectorActions();

  const syncDappAccountToWallet = useCallback(
    async ({
      dAppAccountInfos,
    }: {
      dAppAccountInfos: IConnectionAccountInfo[] | null;
    }) => {
      if (!Array.isArray(dAppAccountInfos) || dAppAccountInfos.length !== 1) {
        return;
      }

      const { serviceAccount } = backgroundApiProxy;
      const dAppAccount = dAppAccountInfos[0];
      const { indexedAccountId, accountId, networkId } = dAppAccount;
      const account = await serviceAccount.getAccount({
        accountId,
        networkId: networkId ?? '',
      });
      const isOtherWallet = accountUtils.isOthersAccount({
        accountId,
      });

      if (isOtherWallet) {
        await actions.current.confirmAccountSelect({
          num: 0,
          indexedAccount: undefined,
          othersWalletAccount: account,
          autoChangeToAccountMatchedNetworkId: networkId,
        });
      } else {
        const indexedAccount = await serviceAccount.getIndexedAccount({
          id: indexedAccountId ?? '',
        });
        await actions.current.confirmAccountSelect({
          num: 0,
          indexedAccount,
          othersWalletAccount: undefined,
          autoChangeToAccountMatchedNetworkId: undefined,
          forceSelectToNetworkId: networkId,
        });
      }
    },
    [actions],
  );

  return { syncDappAccountToWallet };
}

function SyncDappAccountToHomeCmp({
  dAppAccountInfos,
}: {
  origin: string;
  dAppAccountInfos: IConnectionAccountInfo[] | null;
}) {
  const actions = useAccountSelectorActions();
  const [settings] = useSettingsPersistAtom();
  const { syncDappAccountToWallet } = useSyncDappAccountToHomeAccount();
  const { isFirstVisit, tourVisited } = useSpotlight(
    ESpotlightTour.switchDappAccount,
  );
  const isFirstVisitRef = useRef(isFirstVisit);

  useEffect(() => {
    isFirstVisitRef.current = isFirstVisit;
  }, [isFirstVisit]);

  // Sync dApp account to home page
  useEffect(() => {
    const sync = async () => {
      if (
        settings.alignPrimaryAccountMode !==
        EAlignPrimaryAccountMode.AlignDappToWallet
      ) {
        return;
      }
      await syncDappAccountToWallet({
        dAppAccountInfos,
      });
      if (isFirstVisitRef.current) {
        void tourVisited(1);
      }
    };
    void sync();
  }, [
    dAppAccountInfos,
    actions,
    settings.alignPrimaryAccountMode,
    tourVisited,
    syncDappAccountToWallet,
  ]);

  return null;
}

function SyncHomeAccountPageToDappAccount() {
  const [accountSelectorContextData] = useAccountSelectorContextDataAtom();
  const actions = useAccountSelectorActions();
  useEffect(() => {
    const fn = async (params: {
      selectedAccount: IAccountSelectorSelectedAccount;
    }) => {
      if (
        accountSelectorContextData?.sceneName !== EAccountSelectorSceneName.home
      ) {
        return;
      }
      await actions.current.updateSelectedAccount({
        num: 0,
        builder: () => params.selectedAccount,
      });
      void backgroundApiProxy.serviceDApp.setIsAlignPrimaryAccountProcessing({
        processing: false,
      });
    };
    appEventBus.on(EAppEventBusNames.SyncDappAccountToHomeAccount, fn);
    return () => {
      appEventBus.off(EAppEventBusNames.SyncDappAccountToHomeAccount, fn);
    };
  }, [actions, accountSelectorContextData?.sceneName]);

  return null;
}

function SyncDappAccountToHomeProvider({
  origin,
  dAppAccountInfos,
}: {
  origin: string;
  dAppAccountInfos: IConnectionAccountInfo[] | null;
}) {
  return (
    <AccountSelectorProviderMirror
      config={{
        sceneName: EAccountSelectorSceneName.home,
      }}
      enabledNum={[0]}
    >
      <SyncDappAccountToHomeCmp
        origin={origin}
        dAppAccountInfos={dAppAccountInfos}
      />
    </AccountSelectorProviderMirror>
  );
}

function SyncHomeAccountToDappAccountProvider() {
  return (
    <AccountSelectorProviderMirror
      config={{
        sceneName: EAccountSelectorSceneName.home,
      }}
      enabledNum={[0]}
    >
      <SyncHomeAccountPageToDappAccount />
    </AccountSelectorProviderMirror>
  );
}

export { SyncHomeAccountToDappAccountProvider, SyncDappAccountToHomeProvider };
