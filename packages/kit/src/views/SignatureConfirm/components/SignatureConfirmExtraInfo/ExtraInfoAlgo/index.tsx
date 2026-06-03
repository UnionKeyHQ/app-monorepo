import { memo } from 'react';

import type { IStackProps } from '@unionkey/components';
import type { IDecodedTxExtraAlgo } from '@unionkey/core/src/chains/algo/types';
import { useDecodedTxsAtom } from '@unionkey/kit/src/states/jotai/contexts/signatureConfirm';

import { SignatureConfirmItem } from '../../SignatureConfirmItem';

function TxExtraInfoAlgo({ style }: { style?: IStackProps }) {
  const [{ decodedTxs }] = useDecodedTxsAtom();

  const decodedTx = decodedTxs?.[0];

  const extraInfo = decodedTx?.extraInfo as IDecodedTxExtraAlgo;

  if (!decodedTx || !extraInfo || !extraInfo.note) return null;

  return (
    <SignatureConfirmItem {...style}>
      <SignatureConfirmItem.Label>Memo/Tag/Note</SignatureConfirmItem.Label>
      <SignatureConfirmItem.Value>{extraInfo.note}</SignatureConfirmItem.Value>
    </SignatureConfirmItem>
  );
}

export default memo(TxExtraInfoAlgo);
