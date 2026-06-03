import { memo } from 'react';

import type { IStackProps } from '@unionkey/components';
import type { IDecodedTxExtraDnx } from '@unionkey/core/src/chains/dnx/types';
import { useDecodedTxsAtom } from '@unionkey/kit/src/states/jotai/contexts/signatureConfirm';

import { SignatureConfirmItem } from '../../SignatureConfirmItem';

function TxExtraInfoDnx({ style }: { style?: IStackProps }) {
  const [{ decodedTxs }] = useDecodedTxsAtom();

  const decodedTx = decodedTxs?.[0];

  const extraInfo = decodedTx?.extraInfo as IDecodedTxExtraDnx;

  if (!decodedTx || !extraInfo || !extraInfo.paymentId) return null;

  return (
    <SignatureConfirmItem {...style}>
      <SignatureConfirmItem.Label>Payment ID</SignatureConfirmItem.Label>
      <SignatureConfirmItem.Value>
        {extraInfo.paymentId}
      </SignatureConfirmItem.Value>
    </SignatureConfirmItem>
  );
}

export default memo(TxExtraInfoDnx);
