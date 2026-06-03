import { useIntl } from 'react-intl';

import { XStack } from '@unionkey/components';
import { NetworkAvatar } from '@unionkey/kit/src/components/NetworkAvatar';
import { useAccountData } from '@unionkey/kit/src/hooks/useAccountData';
import { ETranslations } from '@unionkey/shared/src/locale';
import type { IDisplayComponentNetwork } from '@unionkey/shared/types/signatureConfirm';

import { SignatureConfirmItem } from '../SignatureConfirmItem';

type IProps = {
  component: IDisplayComponentNetwork;
};

function Network(props: IProps) {
  const intl = useIntl();
  const { component } = props;
  const { network } = useAccountData({ networkId: component.networkId });
  return (
    <SignatureConfirmItem>
      <SignatureConfirmItem.Label>
        {component.label ||
          intl.formatMessage({ id: ETranslations.network__network })}
      </SignatureConfirmItem.Label>
      <XStack gap="$2">
        <NetworkAvatar size="$5" networkId={component.networkId} />
        <SignatureConfirmItem.Value>{network?.name}</SignatureConfirmItem.Value>
      </XStack>
    </SignatureConfirmItem>
  );
}

export { Network };
