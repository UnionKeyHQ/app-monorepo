import type {
  ETranslations,
  ETranslationsMock,
} from '@unionkey/shared/src/locale';

export enum ECustomUnionKeyHardwareError {
  NeedUnionKeyBridge = 3030,
  // TODO: remove this error code
  NeedFirmwareUpgrade = 4030,
  NeedUnionKeyBridgeUpgrade = 4031,
  NeedFirmwareUpgradeFromWeb = 4032,
  DeviceMethodCallTimeout = 4080,
  FirmwareUpdateBatteryTooLow = 4081,
}

export enum EUnionKeyErrorClassNames {
  UnionKeyError = 'UnionKeyError',
  UnionKeyAppError = 'UnionKeyAppError',
  UnionKeyPlainTextError = 'UnionKeyPlainTextError',
  UnionKeyHardwareError = 'UnionKeyHardwareError',
  UnknownHardwareError = 'UnknownHardwareError',
  UnionKeyServerApiError = 'UnionKeyServerApiError',
  LocalDBRecordNotFoundError = 'LocalDBRecordNotFoundError',
  UnionKeyValidatorError = 'UnionKeyValidatorError',
  UnionKeyValidatorTip = 'UnionKeyValidatorTip',
  UnionKeyAbortError = 'UnionKeyAbortError',
  IncorrectPassword = 'IncorrectPassword',
  IncorrectMasterPassword = 'IncorrectMasterPassword',
  AxiosAbortCancelError = 'AxiosAbortCancelError',
  AxiosNetworkError = 'AxiosNetworkError',
  UnionKeyWalletConnectModalCloseError = 'UnionKeyWalletConnectModalCloseError',
  UnionKeyAlreadyExistWalletError = 'UnionKeyAlreadyExistWalletError',
  PasswordPromptDialogCancel = 'PasswordPromptDialogCancel',
  PrimeLoginDialogCancelError = 'PrimeLoginDialogCancelError',
  UnionKeyErrorPrimeMasterPasswordInvalid = 'UnionKeyErrorPrimeMasterPasswordInvalid',
  VaultKeyringNotDefinedError = 'VaultKeyringNotDefinedError',
  UnionKeyErrorInsufficientNativeBalance = 'UnionKeyErrorInsufficientNativeBalance',
  UnionKeyErrorNotImplemented = 'UnionKeyErrorNotImplemented',
  UnionKeyErrorAirGapAccountNotFound = 'UnionKeyErrorAirGapAccountNotFound',
  UnionKeyErrorAirGapStandardWalletRequiredWhenCreateHiddenWallet = 'UnionKeyErrorAirGapStandardWalletRequiredWhenCreateHiddenWallet',
  UnionKeyErrorScanQrCodeCancel = 'UnionKeyErrorScanQrCodeCancel',
  SecureQRCodeDialogCancel = 'SecureQRCodeDialogCancel',
  HardwareUserCancelFromOutside = 'HardwareUserCancelFromOutside',
  FirmwareUpdateExit = 'FirmwareUpdateExit',
  FirmwareUpdateTasksClear = 'FirmwareUpdateTasksClear',
  WebDeviceNotFoundOrNeedsPermission = 'WebDeviceNotFoundOrNeedsPermission',
}

export type IUnionKeyErrorI18nInfo = Record<string | number, string | number>;

// @ts-ignore
export interface IUnionKeyJsError extends Error {
  // ES5 Error props
  message?: string;
  name?: string;
  stack?: string;
  // ES2022 Error props
  cause?: unknown;
}

export interface IUnionKeyError<
  InfoT = IUnionKeyErrorI18nInfo | any,
  DataT = IUnionKeyJsError | any,
> extends IUnionKeyJsError {
  // ---- Web3RpcError props
  code?: number;
  data?: DataT;
  // ---- UnionKeyError props
  className?: EUnionKeyErrorClassNames;
  key?: ETranslations | ETranslationsMock; // i18n key
  info?: InfoT; // i18n params
  constructorName?: string;
  /*
  error.autoToast workflow:
    UI -> BackgroundApiProxyBase.constructor -> globalErrorHandler.addListener -> error.autoToast===true -> appEventBus.emit(EAppEventBusNames.ShowToast) -> ErrorToastContainer -> appEventBus.on('ShowToast') -> Toast.show

  example: 
    ErrorToastGallery.tsx
  */
  autoToast?: boolean; // TODO move to $$config: { autoToast, reconnect }
  // ---- hardwareError props
  payload?: IUnionKeyHardwareErrorPayload; // raw payload from hardware sdk error response
  reconnect?: boolean;
  $isHardwareError?: boolean;

  // ---server props
  requestId?: string;
  disableFallbackMessage?: boolean;
}

export type IUnionKeyHardwareErrorPayload = {
  code?: number | string;
  error?: string;
  message?: string;
  params?: any;
  connectId?: string;
  deviceId?: string;
};

export type IUnionKeyHardwareErrorData = {
  reconnect?: boolean | undefined;
  connectId?: string;
  deviceId?: string;
};

export type IUnionKeyErrorMeta = {
  defaultMessage?: string;
};

export type IUnionKeyRpcError = {
  req: {
    method: string;
    params: [any];
  };
  res: {
    id: number;
    jsonrpc: string;
    error: {
      code: number;
      message: string;
      data: string;
    };
  };
};
