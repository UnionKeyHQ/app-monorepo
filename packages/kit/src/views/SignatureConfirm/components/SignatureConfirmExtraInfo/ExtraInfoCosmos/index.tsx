import { memo } from 'react';

import type { IStackProps } from '@unionkey/components';
import type { IDecodedTxExtraCosmos } from '@unionkey/core/src/chains/cosmos/types';
import { useDecodedTxsAtom } from '@unionkey/kit/src/states/jotai/contexts/signatureConfirm';

import { SignatureConfirmItem } from '../../SignatureConfirmItem';

function TxExtraInfoCosmos({ style }: { style?: IStackProps }) {
  const [{ decodedTxs }] = useDecodedTxsAtom();

  const decodedTx = decodedTxs?.[0];

  const extraInfo = decodedTx?.extraInfo as IDecodedTxExtraCosmos;

  if (!decodedTx || !extraInfo || !extraInfo.memo) return null;

  return (
    <SignatureConfirmItem {...style}>
      <SignatureConfirmItem.Label>Memo/Tag/Note</SignatureConfirmItem.Label>
      <SignatureConfirmItem.Value>{extraInfo.memo}</SignatureConfirmItem.Value>
    </SignatureConfirmItem>
  );
}

export default memo(TxExtraInfoCosmos);
