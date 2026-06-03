import { defaultLogger } from '@unionkey/shared/src/logger/logger';

import { EUnionKeyErrorClassNames } from '../types/errorTypes';

import { UnionKeyError } from './baseErrors';

import type { IUnionKeyErrorI18nInfo, IUnionKeyJsError } from '../types/errorTypes';

export class UnionKeyPlainTextError<
  I18nInfoT = IUnionKeyErrorI18nInfo | any,
  DataT = IUnionKeyJsError | any,
> extends UnionKeyError<I18nInfoT, DataT> {
  override className = EUnionKeyErrorClassNames.UnionKeyPlainTextError;

  override name = EUnionKeyErrorClassNames.UnionKeyPlainTextError;

  constructor(message: string) {
    super(message);
    defaultLogger.app.error.log(message);
  }
}
