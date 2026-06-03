/* eslint max-classes-per-file: "off" */

import { ETranslations } from '@unionkey/shared/src/locale';
// import type { LocaleKeyInfoMap } from '@unionkey/shared/src/localeKeyInfoMap';

import { EUnionKeyErrorClassNames } from '../types/errorTypes';
import { normalizeErrorProps } from '../utils/errorUtils';

import { UnionKeyError } from './baseErrors';

import type {
  IUnionKeyError,
  IUnionKeyErrorI18nInfo,
  IUnionKeyJsError,
} from '../types/errorTypes';

const map = {
  hello: 'world',
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ILocaleKeyInfoMap = typeof map;

// Generic errors.
export class NotAutoPrintError extends Error {}

export class UnionKeyAppError<
  I18nInfoT = IUnionKeyErrorI18nInfo | any,
  DataT = IUnionKeyJsError | any,
> extends UnionKeyError<I18nInfoT, DataT> {
  override className = EUnionKeyErrorClassNames.UnionKeyAppError;

  override name = EUnionKeyErrorClassNames.UnionKeyAppError;
}

export class IncorrectPassword extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'UnionKeyError: IncorrectPassword',
        defaultKey: ETranslations.auth_error_passcode_incorrect,
      }),
    );
  }

  override className = EUnionKeyErrorClassNames.IncorrectPassword;
}

export class IncorrectMasterPassword extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'UnionKeyError: IncorrectMasterPassword',
        defaultKey: ETranslations.prime_incorrect_password,
      }),
    );
  }

  override className = EUnionKeyErrorClassNames.IncorrectMasterPassword;
}

export class LocalDBRecordNotFoundError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'LocalDBRecordNotFoundError',
        // defaultKey: ETranslations.local_db_record_not_found,
      }),
    );
  }

  override className = EUnionKeyErrorClassNames.LocalDBRecordNotFoundError;
}

export class SystemDiskFullError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'System Disk is full',
      }),
    );
  }
}
export class NotImplemented extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'UnionKeyError: NotImplemented',
        defaultKey: ETranslations.send_engine_not_implemented,
      }),
    );
  }

  override name = EUnionKeyErrorClassNames.UnionKeyErrorNotImplemented;

  override className = EUnionKeyErrorClassNames.UnionKeyErrorNotImplemented;
}

export class UnionKeyErrorAirGapStandardWalletRequiredWhenCreateHiddenWallet extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage:
          'UnionKeyErrorAirGapStandardWalletRequiredWhenCreateHiddenWallet',
      }),
    );
  }

  override name =
    EUnionKeyErrorClassNames.UnionKeyErrorAirGapStandardWalletRequiredWhenCreateHiddenWallet;

  override className =
    EUnionKeyErrorClassNames.UnionKeyErrorAirGapStandardWalletRequiredWhenCreateHiddenWallet;
}

export class UnionKeyErrorAirGapAccountNotFound extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'UnionKeyErrorAirGapAccountNotFound',
      }),
    );
  }

  override name = EUnionKeyErrorClassNames.UnionKeyErrorAirGapAccountNotFound;

  override className = EUnionKeyErrorClassNames.UnionKeyErrorAirGapAccountNotFound;
}

export class UnionKeyErrorAirGapWalletMismatch extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'UnionKeyErrorAirGapWalletMismatch',
        defaultKey: ETranslations.feedback_invalid_qr_code,
      }),
    );
  }

  override autoToast?: boolean | undefined = true;
}

export class UnionKeyErrorAirGapInvalidQrCode extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'UnionKeyErrorAirGapInvalidQrCode',
        defaultKey: ETranslations.feedback_invalid_qr_code,
      }),
    );
  }
}

export class UnionKeyErrorScanQrCodeCancel extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'UnionKeyErrorScanQrCodeCancel',
        defaultAutoToast: false,
      }),
    );
  }

  override className = EUnionKeyErrorClassNames.UnionKeyErrorScanQrCodeCancel;

  override name = EUnionKeyErrorClassNames.UnionKeyErrorScanQrCodeCancel;
}

export class UnionKeyErrorPrimeLoginInvalidToken extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'UnionKeyID login invalid, please login again',
        defaultAutoToast: true,
        defaultKey: ETranslations.id_login_expired_description,
      }),
    );
  }
}

export class UnionKeyErrorPrimeMasterPasswordInvalid extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'Prime master password invalid',
        defaultAutoToast: true,
      }),
    );
  }

  override className =
    EUnionKeyErrorClassNames.UnionKeyErrorPrimeMasterPasswordInvalid;
}

export class UnionKeyErrorPrimeLoginExceedDeviceLimit extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'Prime exceed device limit',
        defaultAutoToast: true,
      }),
    );
  }
}

export class UnionKeyErrorPrimePaidMembershipRequired extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        // Prime subscription is not active
        defaultMessage: 'Prime Paid membership required',
        defaultAutoToast: true,
      }),
    );
  }
}

export class UnionKeyInternalError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'UnionKeyError: InternalError',
        defaultKey: ETranslations.send_engine_internal_error,
      }),
    );
  }
}

export class VaultKeyringNotDefinedError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'VaultKeyringNotDefinedError',
      }),
    );
  }

  override className = EUnionKeyErrorClassNames.VaultKeyringNotDefinedError;

  override name = EUnionKeyErrorClassNames.VaultKeyringNotDefinedError;
}

export class PasswordPromptDialogCancel extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'PasswordPromptDialogCancel',
        defaultKey: ETranslations.global_cancel,
      }),
    );
  }

  override className = EUnionKeyErrorClassNames.PasswordPromptDialogCancel;

  override name = EUnionKeyErrorClassNames.PasswordPromptDialogCancel;
}

export class PrimeLoginDialogCancelError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'PrimeLoginDialogCancelError',
        defaultKey: ETranslations.global_cancel,
      }),
    );
  }

  override className = EUnionKeyErrorClassNames.PrimeLoginDialogCancelError;

  override name = EUnionKeyErrorClassNames.PrimeLoginDialogCancelError;
}

export class FailedToTransfer extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'FailedToTransfer',
        defaultKey: ETranslations.send_engine_failed_to_transfer,
      }),
    );
  }
}

export class RenameDuplicateNameError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'RenameDuplicateNameError',
        defaultKey: ETranslations.form_rename_error_exist,
      }),
    );
  }
}

export class WrongPassword extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'WrongPassword',
        defaultKey: ETranslations.send_engine_incorrect_passcode,
        defaultAutoToast: false,
      }),
    );
  }
}

export class SecureQRCodeDialogCancel extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'SecureQRCodeDialogCancel',
        defaultKey: ETranslations.global_cancel,
        defaultAutoToast: false,
      }),
    );
  }

  override className: EUnionKeyErrorClassNames =
    EUnionKeyErrorClassNames.SecureQRCodeDialogCancel;
}

export class PreCheckBeforeSendingCancelError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'PreCheckBeforeSendingCancelError',
        defaultKey: ETranslations.global_cancel,
        defaultAutoToast: true,
      }),
    );
  }
}

export class PasswordNotSet extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'PasswordNotSet',
        defaultKey: ETranslations.send_engine_passcode_not_set,
        defaultAutoToast: true,
      }),
    );
  }
}

export class PasswordStrengthValidationFailed extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'PasswordStrengthValidationFailed',
        defaultKey: ETranslations.send_passcode_validation,
      }),
    );
  }
}

export class PasswordUpdateSameFailed extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'PasswordUpdateSameFailed',
        defaultKey: ETranslations.auth_error_passcode_incorrect,
      }),
    );
  }
}

export class BiologyAuthFailed extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'BiologyAuthFailed',
        defaultKey: ETranslations.send_verification_failure,
      }),
    );
  }
}

export class PasswordAlreadySetFailed extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'PasswordAlreadySetFaield',
        defaultKey: ETranslations.auth_error_passcode_incorrect,
      }),
    );
  }
}

// Simple input errors.

export class InvalidMnemonic extends UnionKeyAppError {
  // give the default constructor to ensure unittest expect.toThrow() checking passed
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'InvalidMnemonic',
        defaultKey: ETranslations.feedback_invalid_phrases,
        defaultAutoToast: true,
      }),
    );
  }
}

export type IMinimumBalanceRequiredInfo = {
  token: string;
  amount: string;
};
export class MinimumBalanceRequired extends UnionKeyAppError<IMinimumBalanceRequiredInfo> {
  constructor(props?: IUnionKeyError<IMinimumBalanceRequiredInfo>) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'MimimumBalanceRequired',
        defaultKey: ETranslations.send_str_minimum_balance_is_str,
      }),
    );
  }
}

export class InvalidAddress extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'InvalidAddress',
        defaultKey: ETranslations.send_engine_incorrect_address,
      }),
    );
  }
}

export class FirmwareUpdateExit extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'FirmwareUpdateExit',
      }),
    );
  }

  override className = EUnionKeyErrorClassNames.FirmwareUpdateExit;

  override name = EUnionKeyErrorClassNames.FirmwareUpdateExit;
}

export class FirmwareUpdateTasksClear extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'FirmwareUpdateTasksClear',
      }),
    );
  }

  override className = EUnionKeyErrorClassNames.FirmwareUpdateTasksClear;

  override name = EUnionKeyErrorClassNames.FirmwareUpdateTasksClear;
}

export class InvalidAccount extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'InvalidAccount',
        defaultKey: ETranslations.send_engine_account_not_activated,
      }),
    );
  }
}

export type INetworkFeeInsufficientInfo = {
  symbol: string;
};

export class NetworkFeeInsufficient extends UnionKeyAppError<INetworkFeeInsufficientInfo> {
  constructor(props?: IUnionKeyError<INetworkFeeInsufficientInfo>) {
    super(
      normalizeErrorProps(
        {
          ...props,
          info: {
            'crypto': props?.info?.symbol,
          },
        },
        {
          defaultMessage: 'NetworkFeeInsufficient',
          defaultKey:
            ETranslations.msg__str_is_required_for_network_fees_top_up_str_to_make_tx,
        },
      ),
    );
  }
}

export class InvalidTokenAddress extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'InvalidTokenAddress',
        defaultKey: ETranslations.send_engine_incorrect_token_address,
      }),
    );
  }
}

export type IInvalidTransferValueInfo = {
  amount: string;
  unit: string;
};
export class InvalidTransferValue extends UnionKeyAppError<IInvalidTransferValueInfo> {
  constructor(props?: IUnionKeyError<IInvalidTransferValueInfo> | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'InvalidTransferValue',
        defaultKey: ETranslations.send_engine_incorrect_transfer_value,
      }),
    );
  }
}

export type IBalanceLowerMinimumInfo = {
  amount: string;
  symbol: string;
};
export class BalanceLowerMinimum extends UnionKeyAppError<IBalanceLowerMinimumInfo> {
  constructor(props?: IUnionKeyError<IBalanceLowerMinimumInfo> | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'BalanceLowerMinimum',
        defaultKey: ETranslations.feedback_transfer_cause_balance_lower_1_dot,
      }),
    );
  }
}

export class TransferValueTooSmall extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'TransferValueTooSmall',
        defaultKey: ETranslations.send_amount_too_small,
      }),
    );
  }
}

// **** only for Native Token  InsufficientBalance

export type IInsufficientBalanceInfo = {
  symbol: string;
};

export class InsufficientBalance extends UnionKeyAppError<IInsufficientBalanceInfo> {
  override className =
    EUnionKeyErrorClassNames.UnionKeyErrorInsufficientNativeBalance;

  // For situations that utxo selection failed.
  constructor(props?: IUnionKeyError<IInsufficientBalanceInfo>) {
    super(
      normalizeErrorProps(
        {
          ...props,
          info: {
            '0': props?.info?.symbol,
          },
        },
        {
          defaultMessage: 'InsufficientBalance',
          defaultKey: ETranslations.send_amount_invalid,
        },
      ),
    );
  }
}

export type IStringLengthRequirementInfo = {
  minLength: string | number;
  maxLength: string | number;
};
export class StringLengthRequirement<
  T = IStringLengthRequirementInfo,
> extends UnionKeyAppError<T> {
  constructor(props: IUnionKeyError<T>) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'StringLengthRequirement',
        defaultKey: ETranslations.wallet_generic_string_length_requirement,
      }),
    );
  }
}
export class WalletNameLengthError extends StringLengthRequirement {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'WalletNameLengthError',
        defaultKey: ETranslations.wallet_engine_wallet_name_length_error,
      }),
    );
  }
}

export type IAccountNameLengthErrorInfo = {
  name: string;
  minLength: number;
  maxLength: number;
};
export class AccountNameLengthError extends UnionKeyAppError<IAccountNameLengthErrorInfo> {
  constructor(props?: IUnionKeyError<IAccountNameLengthErrorInfo>) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'AccountNameLengthError',
        defaultKey: ETranslations.wallet_engine_account_name_length_error,
      }),
    );
  }
}

export class WatchedAccountTradeError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'WatchedAccountTradeError',
        defaultKey: ETranslations.wallet_error_trade_with_watched_acocunt,
      }),
    );
  }
}

export class AccountAlreadyExists extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'AccountAlreadyExists',
        defaultKey: ETranslations.wallet_engine_account_already_exists,
      }),
    );
  }
}

export type INumberLimitInfo = {
  limit: string | number;
};
export class NumberLimit<T = INumberLimitInfo> extends UnionKeyAppError<T> {
  constructor({
    limit,
    key,
    defaultMessage,
  }: {
    limit: number;
    key?: ETranslations;
    defaultMessage?: string;
  }) {
    const info: INumberLimitInfo = { limit: limit.toString() };
    const keyWithDefault: ETranslations =
      key || ('generic_number_limitation' as any);
    super(
      normalizeErrorProps(
        {
          info: info as T,
          key: keyWithDefault,
        },
        {
          defaultMessage: defaultMessage ?? 'NumberLimit',
          defaultKey: keyWithDefault,
        },
      ),
    );
  }
}
export class TooManyWatchingAccounts extends NumberLimit {
  constructor(
    limit: number,
    key: ETranslations = ETranslations.wallet_engine_too_many_watching_accounts,
  ) {
    super({ limit, key, defaultMessage: 'TooManyWatchingAccounts' });
  }
}

export class TooManyExternalAccounts extends NumberLimit {
  constructor(
    limit: number,
    key: ETranslations = ETranslations.wallet_engine_ttoo_many_external_accounts,
  ) {
    super({ limit, key, defaultMessage: 'TooManyExternalAccounts' });
  }
}

export class TooManyImportedAccounts extends NumberLimit {
  constructor(
    limit: number,
    key: ETranslations = ETranslations.wallet_engine_too_many_imported_accounts,
  ) {
    super({ limit, key, defaultMessage: 'TooManyImportedAccounts' });
  }
}

export class TooManyHDWallets extends NumberLimit {
  constructor(
    limit: number,
    key: ETranslations = ETranslations.wallet_engine_too_many_hd_wallets,
  ) {
    super({ limit, key, defaultMessage: 'TooManyHDWallets' });
  }
}

export class TooManyHWWallets extends NumberLimit {
  constructor(
    limit: number,
    key: ETranslations = ETranslations.wallet_engine_too_many_hw_wallets,
  ) {
    super({ limit, key, defaultMessage: 'TooManyHWWallets' });
  }
}

export class TooManyHWPassphraseWallets extends NumberLimit {
  constructor(
    limit: number,
    key: ETranslations = ETranslations.wallet_engine_too_many_hw_passphrase_wallets,
  ) {
    super({ limit, key, defaultMessage: 'TooManyHWPassphraseWallets' });
  }
}

export class PendingQueueTooLong extends NumberLimit {
  constructor(
    limit: number,
    key: ETranslations = ETranslations.send_engine_pending_queue_too_long,
  ) {
    super({ limit, key, defaultMessage: 'PendingQueueTooLong' });
  }
}

export type ITooManyDerivedAccountsInfo = {
  limit: string | number;
  coinType: string;
  purpose: string;
};
export class TooManyDerivedAccounts extends UnionKeyAppError<ITooManyDerivedAccountsInfo> {
  constructor(props?: IUnionKeyError<ITooManyDerivedAccountsInfo>) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'TooManyDerivedAccounts',
        defaultKey: ETranslations.send_engine_too_many_derived_accounts,
      }),
    );
  }
}

export class UnionKeyWalletConnectModalCloseError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'UnionKeyWalletConnectModalCloseError',
        defaultKey: ETranslations.send_engine_internal_error,
      }),
    );
  }
}

export class FailedToEstimatedGasError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'FailedToEstimatedGasError',
        defaultKey: ETranslations.send_estimated_gas_failure,
      }),
    );
  }
}

export class InvalidLightningPaymentRequest extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'InvalidLightningPaymentRequest',
        defaultKey: ETranslations.send_invalid_lightning_payment_request,
      }),
    );
  }
}

export class InvoiceAlreadyPaid extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'InvoiceAlreadPaid',
        defaultKey: ETranslations.send_invoice_is_already_paid,
      }),
    );
  }
}

export class NoRouteFoundError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'NoRouteFoundError',
        defaultKey: ETranslations.send_no_route_found,
      }),
    );
  }
}

export class ChannelInsufficientLiquidityError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'ChannelInsufficientLiquidityError',
        defaultKey:
          ETranslations.send_insufficient_liquidity_of_lightning_node_channels,
      }),
    );
  }
}

export class BadAuthError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'BadAuthError',
        defaultKey: ETranslations.send_authentication_failed_verify_again,
      }),
    );
  }
}

export class InvoiceExpiredError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'InvoiceExpiredError',
        defaultKey: ETranslations.send_the_invoice_has_expired,
      }),
    );
  }
}

export class TaprootAddressError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'TaprootAddressError',
        defaultKey:
          ETranslations.send_invalid_address_ordinal_can_only_be_sent_to_taproot_address,
      }),
    );
  }
}

export class UtxoNotFoundError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'UtxoNotFoundError',
        defaultKey: ETranslations.send_nft_does_not_exist,
      }),
    );
  }
}

export class AllNetworksMinAccountsError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'AllNetworksMinAccountsError',
        defaultKey:
          ETranslations.wallet_you_need_str_accounts_on_any_network_to_create,
      }),
    );
  }
}

export class AllNetworksUpToThreeLimitsError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'AllNetworksUpto3LimitsError',
        defaultKey:
          ETranslations.wallet_currently_supports_up_to_str_all_networks_accounts,
      }),
    );
  }
}

export type IInsufficientGasFeeInfo = {
  token: string;
  amount: string;
};
export class InsufficientGasFee extends UnionKeyAppError<IInsufficientGasFeeInfo> {
  constructor(props: IUnionKeyError<IInsufficientGasFeeInfo>) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'InsufficientGasFee',
        defaultKey: ETranslations.send_suggest_reserving_str_as_gas_fee,
      }),
    );
  }
}

export type IMinimumTransferBalanceRequiredErrorInfo = {
  amount: string;
  symbol: string;
};
export class MinimumTransferBalanceRequiredError extends UnionKeyAppError<IMinimumTransferBalanceRequiredErrorInfo> {
  constructor(props: IUnionKeyError<IMinimumTransferBalanceRequiredErrorInfo>) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'MinimumTransferBalanceRequiredError',
        defaultKey:
          ETranslations.send_the_minimum_value_for_transffering_to_a_new_account_is_str_str,
      }),
    );
  }
}

export type IMinimumTransferBalanceRequiredForSendingAssetErrorInfo = {
  name: string;
  amount: string;
  symbol: string;
};

export class MinimumTransferBalanceRequiredForSendingAssetError extends UnionKeyAppError<IMinimumTransferBalanceRequiredForSendingAssetErrorInfo> {
  constructor(
    props: IUnionKeyError<IMinimumTransferBalanceRequiredForSendingAssetErrorInfo>,
  ) {
    super(
      normalizeErrorProps(
        {
          ...props,
          info: {
            '0': props.info?.name,
            '1': props.info?.amount,
            '2': props.info?.symbol,
          },
        },
        {
          defaultMessage: 'MinimumTransferBalanceRequiredForSendingAssetError',
          defaultKey:
            ETranslations.send_sending_str_requires_an_account_balance_of_at_least_str_str,
        },
      ),
    );
  }
}

export type IMinimumTransferAmountErrorInfo = {
  amount: string;
};

export class MinimumTransferAmountError extends UnionKeyAppError<IMinimumTransferAmountErrorInfo> {
  constructor(props: IUnionKeyError<IMinimumTransferAmountErrorInfo>) {
    super(
      normalizeErrorProps(
        {
          ...props,
          info: {
            '0': props.info?.amount,
          },
        },
        {
          defaultMessage: 'MinimumTransferAmountError',
          defaultKey: ETranslations.send_str_minimum_transfer,
        },
      ),
    );
  }
}

export type IChangeLessThanMinInputCapacityError = {
  amount: string;
};

export class AddressNotSupportSignMethodError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'AddressNotSupportSignMethodError',
        defaultKey:
          ETranslations.feedback_address_type_does_not_support_sign_method,
      }),
    );
  }
}

export class LowerTransactionAmountError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'LowerTransactionAmountError',
        defaultKey: ETranslations.send_amount_invalid,
      }),
    );
  }
}

export class Expect24WordsMnemonicError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'Expect24WordsMnemonicError',
        defaultKey:
          ETranslations.feedback_polkadot_supported_recover_phrases_type,
      }),
    );
  }
}

export type IRemainingMinBalanceErrorInfo = {
  miniAmount: string;
};

export class RemainingMinBalanceError extends UnionKeyAppError<IRemainingMinBalanceErrorInfo> {
  constructor(props?: IUnionKeyError<IRemainingMinBalanceErrorInfo>) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'RemainingMinBalanceError',
        defaultKey: ETranslations.feedback_transaction_ckb_error_less,
      }),
    );
  }
}

export class ConvertTxError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'ConvertTxError',
        defaultKey: ETranslations.feedback_transaction_ckb_error_convert,
      }),
    );
  }
}

export class CanNotSendZeroAmountError extends UnionKeyAppError {
  constructor(props?: IUnionKeyError) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'CanNotSendZeroAmountError',
        defaultKey: ETranslations.send_cannot_send_amount_zero,
      }),
    );
  }
}

export type IManageTokenInsufficientBalanceErrorInfo = {
  token: string;
};
export class ManageTokenInsufficientBalanceError extends UnionKeyAppError<IManageTokenInsufficientBalanceErrorInfo> {
  constructor(props?: IUnionKeyError<IManageTokenInsufficientBalanceErrorInfo>) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'ManageTokenInsufficientBalanceError',
        defaultKey: ETranslations.manage_token_account_no_found,
      }),
    );
  }
}
