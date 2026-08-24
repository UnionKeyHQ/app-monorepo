import { useCallback } from 'react';

import type {
  IDBDevice,
  IDBWallet,
} from '@unionkeyhq/kit-bg/src/dbs/local/types';
import type {
  IAnimationValue,
  IQRCodeHandlerParseResult,
} from '@unionkeyhq/kit-bg/src/services/ServiceScanQRCode/utils/parseQRCode/type';
import type { IAirGapUrJson } from '@unionkeyhq/qr-wallet-sdk';
import { airGapUrUtils } from '@unionkeyhq/qr-wallet-sdk';
import { UnionKeyErrorAirGapWalletMismatch } from '@unionkeyhq/shared/src/errors';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import { appLocale } from '@unionkeyhq/shared/src/locale/appLocale';
import { EOnboardingPages } from '@unionkeyhq/shared/src/routes';
import appStorage from '@unionkeyhq/shared/src/storage/appStorage';
import { EAppSyncStorageKeys } from '@unionkeyhq/shared/src/storage/syncStorage';
import accountUtils from '@unionkeyhq/shared/src/utils/accountUtils';
import { EQRCodeHandlerNames } from '@unionkeyhq/shared/types/qrCode';

import backgroundApiProxy from '../../../background/instance/backgroundApiProxy';
import useAppNavigation from '../../../hooks/useAppNavigation';
import { useAccountSelectorActions } from '../../../states/jotai/contexts/accountSelector';
import useScanQrCode from '../../../views/ScanQrCode/hooks/useScanQrCode';

type ICreateQrWalletByScanParams = {
  isOnboarding?: boolean;
  byWallet?: IDBWallet;
  byDevice?: IDBDevice;
  onFinalizeWalletSetupError?: () => void;
};
export function useCreateQrWallet() {
  const {
    start: startScan,
    // close,
  } = useScanQrCode();
  const actions = useAccountSelectorActions();
  const navigation = useAppNavigation();

  const createQrWalletByUr = useCallback(
    async (
      params: ICreateQrWalletByScanParams & {
        urJson: IAirGapUrJson;
      },
    ) => {
      const { urJson, byWallet, isOnboarding } = params;
      const { qrDevice, airGapAccounts, airGapMultiAccounts } =
        await backgroundApiProxy.serviceQrWallet.buildAirGapMultiAccounts({
          urJson,
        });
      console.log(
        'startScan qrDevice:',
        qrDevice,
        airGapAccounts,
        airGapMultiAccounts,
      );
      if (
        qrDevice?.xfp &&
        byWallet?.xfp &&
        accountUtils.getShortXfp({ xfp: qrDevice?.xfp }) !==
          accountUtils.getShortXfp({ xfp: byWallet?.xfp })
      ) {
        throw new UnionKeyErrorAirGapWalletMismatch();
      }
      if (isOnboarding) {
        navigation.push(EOnboardingPages.FinalizeWalletSetup);
      }
      try {
        const result = await actions.current.createQrWallet({
          qrDevice,
          airGapAccounts,
          isOnboarding,
        });
        return result;
      } catch (error) {
        params?.onFinalizeWalletSetupError?.();
        throw error;
      }
    },
    [actions, navigation],
  );

  const createQrWallet = useCallback(
    async (params: ICreateQrWalletByScanParams) => {
      const scanResult = await startScan({
        handlers: [EQRCodeHandlerNames.animation],
        qrWalletScene: true,
        autoHandleResult: false,
      });
      const fullURText = scanResult.raw?.trim();
      console.log('startScan:', fullURText);
      if (process.env.NODE_ENV !== 'production') {
        if (fullURText) {
          appStorage.syncStorage.set(
            EAppSyncStorageKeys.last_scan_qr_code_text,
            fullURText,
          );
        }
      }

      const urScanResult =
        scanResult as IQRCodeHandlerParseResult<IAnimationValue>;
      const qrcode = urScanResult?.data?.fullData || urScanResult?.raw || '';
      const ur = await airGapUrUtils.qrcodeToUr(qrcode);
      const urJson = airGapUrUtils.urToJson({ ur });
      return createQrWalletByUr({
        ...params,
        urJson,
      });
    },
    [createQrWalletByUr, startScan],
  );

  // const createQrWalletByTwoWayScan = useCallback(
  //   async (params: ICreateQrWalletByScanParams) => {
  //     backgroundApiProxy.serviceQrWallet.startTwoWayAirGapScan()
  //   },
  //   [],
  // );

  const createQrWalletByAccount = useCallback(
    async ({
      walletId,
      networkId,
      indexedAccountId,
    }: {
      walletId: string;
      networkId: string;
      indexedAccountId: string;
    }) => {
      let byDevice: IDBDevice | undefined;
      const byWallet = await backgroundApiProxy.serviceAccount.getWallet({
        walletId,
      });
      if (byWallet.associatedDevice) {
        byDevice = await backgroundApiProxy.serviceAccount.getDevice({
          dbDeviceId: byWallet.associatedDevice,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // const { wallet: walletCreated } = await createQrWallet({
      //   isOnboarding: false,
      //   byDevice,
      //   byWallet,
      // });
      const urJson =
        await backgroundApiProxy.serviceQrWallet.prepareQrcodeWalletAddressCreate(
          {
            walletId,
            networkId,
            indexedAccountId,
            appQrCodeModalTitle: appLocale.intl.formatMessage({
              // eslint-disable-next-line spellcheck/spell-checker
              id: ETranslations.scan_to_create_an_adderss,
            }),
          },
        );
      const result = await createQrWalletByUr({
        urJson,
        byDevice,
        byWallet,
      });
      return result;
    },
    [createQrWalletByUr],
  );

  return {
    createQrWallet,
    createQrWalletByUr,
    createQrWalletByAccount,
  };
}
