import { memo } from 'react';

import type { IStackProps } from '@unionkey/components';
import type { IDecodedTxExtraXrp } from '@unionkey/core/src/chains/xrp/types';
import { useDecodedTxsAtom } from '@unionkey/kit/src/states/jotai/contexts/signatureConfirm';

import { SignatureConfirmItem } from '../../SignatureConfirmItem';

function TxExtraInfoXrp({ style }: { style?: IStackProps }) {
  const [{ decodedTxs }] = useDecodedTxsAtom();

  const decodedTx = decodedTxs?.[0];

  const extraInfo = decodedTx?.extraInfo as IDecodedTxExtraXrp;

  if (!decodedTx || !extraInfo || !extraInfo.destinationTag) return null;

  return (
    <SignatureConfirmItem {...style}>
      <SignatureConfirmItem.Label>Memo/Tag/Note</SignatureConfirmItem.Label>
      <SignatureConfirmItem.Value>
        {extraInfo.destinationTag}
      </SignatureConfirmItem.Value>
    </SignatureConfirmItem>
  );
}

export default memo(TxExtraInfoXrp);
