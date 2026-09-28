export const enum UnionKeyLiteModalRoutes {
  UnionKeyLiteChangePinInputPinModal = 'UnionKeyLiteChangePinInputPinModal',
  UnionKeyLiteChangePinSetModal = 'UnionKeyLiteChangePinSetModal',
  UnionKeyLiteChangePinRepeatModal = 'UnionKeyLiteChangePinRepeatModal',
  UnionKeyLiteChangePinModal = 'UnionKeyLiteChangePinModal',
  UnionKeyLiteRestorePinCodeVerifyModal = 'UnionKeyLiteRestorePinCodeVerifyModal',
  UnionKeyLiteRestoreModal = 'UnionKeyLiteRestoreModal',
  UnionKeyLiteRestoreDoneModal = 'UnionKeyLiteRestoreDoneModal',
  UnionKeyLiteBackupPinCodeVerifyModal = 'UnionKeyLiteBackupPinCodeVerifyModal',
  UnionKeyLiteBackupModal = 'UnionKeyLiteBackupModal',
  UnionKeyLiteResetModal = 'UnionKeyLiteResetModal',
}

export type UnionKeyLiteRoutesParams = {
  [UnionKeyLiteModalRoutes.UnionKeyLiteChangePinInputPinModal]: undefined;
  [UnionKeyLiteModalRoutes.UnionKeyLiteChangePinSetModal]: {
    currentPin: string;
  };
  [UnionKeyLiteModalRoutes.UnionKeyLiteChangePinRepeatModal]: {
    currentPin: string;
    newPin: string;
  };
  [UnionKeyLiteModalRoutes.UnionKeyLiteChangePinModal]: {
    oldPin: string;
    newPin: string;
  };
  [UnionKeyLiteModalRoutes.UnionKeyLiteRestorePinCodeVerifyModal]: undefined;
  [UnionKeyLiteModalRoutes.UnionKeyLiteRestoreModal]: {
    pinCode: string;
  };
  [UnionKeyLiteModalRoutes.UnionKeyLiteRestoreDoneModal]: {
    mnemonic: string;
    onSuccess: () => void;
  };
  [UnionKeyLiteModalRoutes.UnionKeyLiteBackupPinCodeVerifyModal]: {
    walletId: string | null;
    backupData: string;
    onSuccess: () => void;
  };
  [UnionKeyLiteModalRoutes.UnionKeyLiteBackupModal]: {
    walletId: string | null;
    pinCode: string;
    backupData: string;
    onSuccess: () => void;
  };
  [UnionKeyLiteModalRoutes.UnionKeyLiteResetModal]: undefined;
};
