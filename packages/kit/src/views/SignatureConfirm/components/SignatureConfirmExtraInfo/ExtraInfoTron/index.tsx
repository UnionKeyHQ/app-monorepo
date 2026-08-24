import { memo, useCallback, useRef } from 'react';

import { useIntl } from 'react-intl';

import type { IDialogInstance, IStackProps } from '@unionkeyhq/components';
import { Icon, SizableText, XStack } from '@unionkeyhq/components';
import type { IUnsignedTxPro } from '@unionkeyhq/core/src/types';
import { showResourceDetailsDialog } from '@unionkeyhq/kit/src/components/Resource';
import { useSendSelectedFeeInfoAtom } from '@unionkeyhq/kit/src/states/jotai/contexts/signatureConfirm';
import { ETranslations } from '@unionkeyhq/shared/src/locale';

import { SignatureConfirmItem } from '../../SignatureConfirmItem';

function ExtraInfoTron({
  accountId,
  networkId,
  unsignedTxs,
  style,
}: {
  accountId: string;
  networkId: string;
  unsignedTxs: IUnsignedTxPro[];
  style?: IStackProps;
}) {
  const intl = useIntl();
  const [selectedFeeInfo] = useSendSelectedFeeInfoAtom();

  const feeTron = selectedFeeInfo?.feeInfos?.[0]?.feeInfo?.feeTron;

  const resourceDialogInstance = useRef<IDialogInstance | null>(null);

  const handleResourceDetailsOnPress = useCallback(() => {
    if (resourceDialogInstance?.current) {
      return;
    }
    resourceDialogInstance.current = showResourceDetailsDialog({
      accountId,
      networkId,
      onClose: () => {
        resourceDialogInstance.current = null;
      },
    });
  }, [accountId, networkId]);

  if (!feeTron) return null;

  if (unsignedTxs.length > 1) {
    return null;
  }

  return (
    <SignatureConfirmItem {...style}>
      <XStack
        alignSelf="flex-start"
        gap="$1.5"
        px="$1"
        mx="$-1"
        alignItems="center"
        userSelect="none"
        borderRadius="$1"
        hoverStyle={{
          bg: '$bgSubdued',
        }}
        pressStyle={{
          bg: '$bgActive',
        }}
        focusable
        focusVisibleStyle={{
          outlineColor: '$focusRing',
          outlineWidth: 2,
          outlineStyle: 'solid',
          outlineOffset: 0,
        }}
        onPress={handleResourceDetailsOnPress}
      >
        <SignatureConfirmItem.Label>
          {intl.formatMessage({ id: ETranslations.global_resources })}
        </SignatureConfirmItem.Label>
        <Icon name="InfoCircleOutline" size="$4.5" color="$iconSubdued" />
      </XStack>
      <SignatureConfirmItem.Value>
        {intl.formatMessage(
          {
            id: ETranslations.global_energy_bandwidth_num,
          },
          {
            num_1: feeTron.requiredEnergy ?? '0',
            num_2: feeTron.requiredBandwidth ?? '0',
          },
        )}
      </SignatureConfirmItem.Value>
      <SizableText color="$textSubdued" size="$bodySm">
        {intl.formatMessage({
          id: ETranslations.global_energy_bandwidth_transaction_desc,
        })}
      </SizableText>
    </SignatureConfirmItem>
  );
}

export default memo(ExtraInfoTron);
