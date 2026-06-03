import { useCallback, useMemo, useRef } from 'react';

import { useIntl } from 'react-intl';

import type { IDialogInstance } from '@unionkey/components';
import { Dialog } from '@unionkey/components';
import { useSettingsAtom } from '@unionkey/kit-bg/src/states/jotai/atoms';
import { ETranslations } from '@unionkey/shared/src/locale';
import accountUtils from '@unionkey/shared/src/utils/accountUtils';
import { mevSwapNetworks } from '@unionkey/shared/types/swap/SwapProvider.constants';
import type { ISwapSlippageSegmentItem } from '@unionkey/shared/types/swap/types';
import {
  ESwapDirectionType,
  ESwapSlippageSegmentKey,
} from '@unionkey/shared/types/swap/types';

import SlippageSettingDialog from '../../../components/SlippageSettingDialog';
import { useSwapSlippageDialogOpeningAtom } from '../../../states/jotai/contexts/swap';

import { useSwapAddressInfo } from './useSwapAccount';
import { useSwapSlippagePercentageModeInfo } from './useSwapState';

export function useSwapSlippageActions() {
  const intl = useIntl();
  const { slippageItem, autoValue } = useSwapSlippagePercentageModeInfo();
  const [, setSwapSlippageDialogOpening] = useSwapSlippageDialogOpeningAtom();
  const [, setSettings] = useSettingsAtom();
  const swapFromAddressInfo = useSwapAddressInfo(ESwapDirectionType.FROM);
  const isMEV = useMemo(() => {
    return (
      !accountUtils.isExternalWallet({
        walletId: swapFromAddressInfo.accountInfo?.wallet?.id,
      }) &&
      mevSwapNetworks.includes(
        swapFromAddressInfo.accountInfo?.network?.id ?? '',
      )
    );
  }, [
    swapFromAddressInfo.accountInfo?.wallet?.id,
    swapFromAddressInfo.accountInfo?.network?.id,
  ]);
  const dialogRef = useRef<ReturnType<typeof Dialog.show> | null>(null);
  const slippageOnSave = useCallback(
    (item: ISwapSlippageSegmentItem, close: IDialogInstance['close']) => {
      setSettings((v) => ({ ...v, swapSlippagePercentageMode: item.key }));
      if (item.key === ESwapSlippageSegmentKey.CUSTOM) {
        setSettings((v) => ({
          ...v,
          swapSlippagePercentageMode: item.key,
          swapSlippagePercentageCustomValue: item.value,
        }));
      }
      void close({ flag: 'save' });
    },
    [setSettings],
  );
  const onSlippageHandleClick = useCallback(() => {
    dialogRef.current = Dialog.show({
      title: intl.formatMessage({ id: ETranslations.slippage_tolerance_title }),
      renderContent: (
        <SlippageSettingDialog
          swapSlippage={slippageItem}
          autoValue={autoValue}
          onSave={slippageOnSave}
          isMEV={isMEV}
        />
      ),
      onOpen: () => {
        setSwapSlippageDialogOpening({ status: true });
      },
      onClose: (extra) => {
        setSwapSlippageDialogOpening({ status: false, flag: extra?.flag });
      },
    });
  }, [
    autoValue,
    intl,
    isMEV,
    setSwapSlippageDialogOpening,
    slippageItem,
    slippageOnSave,
  ]);
  return {
    onSlippageHandleClick,
    slippageOnSave,
    slippageItem,
  };
}
