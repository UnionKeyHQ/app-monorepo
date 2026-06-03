import { type PropsWithChildren, useEffect } from 'react';

import { Portal } from '@unionkey/components';
import hooks from '@unionkey/kit/src/components/WalletConnect/WalletConnectModal';

const { useModal } = hooks;
export function AppStateContainer({ children }: PropsWithChildren) {
  // The WalletConnect Modal is above the Android lock screen, it needs to be closed when the lock screen appears
  const { closeModal } = useModal();
  useEffect(() => {
    closeModal();
  }, [closeModal]);
  return (
    <>
      {children}
      <Portal.Container
        name={Portal.Constant.APP_STATE_LOCK_CONTAINER_OVERLAY}
      />
    </>
  );
}
