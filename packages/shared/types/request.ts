import type { IJsonRpcResponse } from '@unionkeyfe/cross-inpage-provider-types';

export interface IJsonRpcResponsePro<T> extends IJsonRpcResponse<T> {
  error?: any;
}

export type IUnionKeyAPIBaseResponse<T = any> = {
  code: number;
  message: string;
  messageId?: string;
  translatedMessage?: string;
  data: T;
  disableAutoToast?: boolean;
};
