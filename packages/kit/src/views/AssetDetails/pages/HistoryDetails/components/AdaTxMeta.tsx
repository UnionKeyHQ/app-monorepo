import { useIntl } from 'react-intl';

import { AddressInfo } from '@unionkeyhq/kit/src/components/AddressInfo';
import { ETranslations } from '@unionkeyhq/shared/src/locale';
import type { IAddressInfo } from '@unionkeyhq/shared/types/address';
import { type IDecodedTx } from '@unionkeyhq/shared/types/tx';

import { InfoItem } from './TxDetailsInfoItem';

function AdaTxFlow({
  decodedTx,
  addressMap,
}: {
  decodedTx: IDecodedTx;
  addressMap?: Record<string, IAddressInfo>;
}) {
  const intl = useIntl();
  const { networkId, accountId } = decodedTx;

  if (decodedTx.signer && decodedTx.to) {
    return (
      <>
        <InfoItem
          label={intl.formatMessage({ id: ETranslations.global_from })}
          renderContent={decodedTx.signer}
          showCopy
          description={
            <AddressInfo
              address={decodedTx.signer}
              accountId={accountId}
              networkId={networkId}
              addressMap={addressMap}
            />
          }
        />
        <InfoItem
          label={intl.formatMessage({ id: ETranslations.global_to })}
          showCopy
          renderContent={decodedTx.to}
          description={
            <AddressInfo
              address={decodedTx.to}
              accountId={accountId}
              networkId={networkId}
              addressMap={addressMap}
            />
          }
        />
      </>
    );
  }

  return null;
}

export { AdaTxFlow };
