import { memo, useMemo } from 'react';

import { ProviderJotaiContextSignatureConfirm } from '@unionkeyhq/kit/src/states/jotai/contexts/signatureConfirm/atoms';
import { useJotaiContextRootStore } from '@unionkeyhq/kit/src/states/jotai/utils/useJotaiContextRootStore';
import { EJotaiContextStoreNames } from '@unionkeyhq/kit-bg/src/states/jotai/atoms';

export function useSignatureConfirmContextStoreInitData() {
  const data = useMemo(
    () => ({
      storeName: EJotaiContextStoreNames.signatureConfirm,
    }),
    [],
  );
  return data;
}

export const SignatureConfirmRootProvider = memo(() => {
  const data = useSignatureConfirmContextStoreInitData();
  const store = useJotaiContextRootStore(data);
  return <ProviderJotaiContextSignatureConfirm store={store} />;
});
SignatureConfirmRootProvider.displayName = 'SignatureConfirmRootProvider';
