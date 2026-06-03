/* eslint-disable max-classes-per-file */

import { Web3RpcError } from '@unionkeyfe/cross-inpage-provider-errors';
import { isObject, isString } from 'lodash';

import type {
  ETranslations,
  ETranslationsMock,
} from '@unionkey/shared/src/locale';

import { EUnionKeyErrorClassNames } from '../types/errorTypes';
import { normalizeErrorProps } from '../utils/errorUtils';

import type { IUnionKeyAPIBaseResponse } from '../../../types/request';
import type {
  IUnionKeyError,
  IUnionKeyErrorI18nInfo,
  IUnionKeyHardwareErrorPayload,
  IUnionKeyJsError,
} from '../types/errorTypes';

// const fakeMessage = 'FAKE_MESSAGE:F43E2460-AB7F-4EA5-9651-7D38C189AB45';

export class UnionKeyWeb3RpcError<T = IUnionKeyJsError> extends Web3RpcError<T> {}

export class UnionKeyError<
    I18nInfoT = IUnionKeyErrorI18nInfo | any,
    DataT = IUnionKeyJsError | any,
  >
  extends UnionKeyWeb3RpcError<DataT>
  implements IUnionKeyError<I18nInfoT, DataT>
{
  className?: EUnionKeyErrorClassNames;

  // i18n key
  readonly key?: ETranslations | ETranslationsMock =
    'unionkey_error' as ETranslations;

  // i18n params
  readonly info?: I18nInfoT;

  // raw payload from hardware sdk error response
  payload: IUnionKeyHardwareErrorPayload | undefined;

  autoToast?: boolean | undefined;

  requestId?: string | undefined;

  override name = 'UnionKeyError';

  constructor(
    errorProps?: IUnionKeyError<I18nInfoT, DataT> | string,
    info?: I18nInfoT,
  ) {
    let msg;
    let code;
    let data;
    let key;
    let infoData: I18nInfoT | undefined;
    let hardwareErrorPayload: IUnionKeyHardwareErrorPayload | undefined;
    let autoToast: boolean | undefined;
    let requestId: string | undefined;
    let className: EUnionKeyErrorClassNames | undefined;
    let name: string | undefined;
    let disableFallbackMessage: boolean | undefined;

    if (!isString(errorProps) && errorProps && isObject(errorProps)) {
      ({
        message: msg,
        code,
        data,
        info: infoData,
        key,
        autoToast,
        requestId,
        payload: hardwareErrorPayload,
        className,
        name,
        disableFallbackMessage,
      } = errorProps);
    } else {
      msg = isString(errorProps) ? errorProps : '';
      code = -99_999;
      infoData = info;
    }
    super(
      code ?? -99_999,
      // * empty string not allowed in Web3RpcError, give a fakeMessage by default
      // * can not access this.key before constructor
      msg ||
        (disableFallbackMessage
          ? ''
          : `Unknown Unionkey Internal Error. ${[key]
              .filter(Boolean)
              .join(':')}`),
      data,
    );

    if (key) {
      this.key = key;
    }
    if (infoData) {
      this.info = infoData;
    }
    if (hardwareErrorPayload) {
      this.payload = hardwareErrorPayload;
    }
    this.autoToast = autoToast;
    this.requestId = requestId;
    if (className) {
      this.className = className;
    }
    if (name) {
      this.name = name;
    }
  }

  // for jest only: this is not stable, do not use it. may be different in compressed code
  get constructorName() {
    return this?.constructor?.name;
  }

  override serialize() {
    const serialized: {
      code: number;
      message: string;
      requestId?: string;
      data?: DataT;
      stack?: string;
    } = {
      code: this.code,
      message: this.message,
    };
    if (this.data !== undefined) {
      serialized.data = this.data;
    }
    if (this.requestId !== undefined) {
      serialized.requestId = this.requestId;
    }
    // TODO read error.stack cause app crash
    // if (this.stack) {
    //   // serialized.stack = this.stack;
    // }
    // TODO Crash in Android hermes engine (error.stack serialize fail, only if Web3Errors object)

    return serialized;
  }
}

export class UnionKeyServerApiError extends UnionKeyError<
  any,
  IUnionKeyAPIBaseResponse
> {
  constructor(props?: IUnionKeyError | string) {
    super(
      normalizeErrorProps(props, {
        defaultMessage: 'UnionKeyServerApiError',
        // defaultKey: ETranslations.auth_error_passcode_incorrect,
      }),
    );
  }

  override className?: EUnionKeyErrorClassNames | undefined =
    EUnionKeyErrorClassNames.UnionKeyServerApiError;
}
