import type {
  IBaseExternalAccountInfo,
  IExternalAccountType,
} from '@unionkeyhq/engine/src/dbs/simple/entity/SimpleDbEntityWalletConnect';
import simpleDb from '@unionkeyhq/engine/src/dbs/simple/simpleDb';
import type { WalletService } from '@unionkeyhq/kit/src/components/WalletConnect/types';
import {
  backgroundClass,
  backgroundMethod,
} from '@unionkeyhq/shared/src/background/backgroundDecorators';

import ServiceBase from './ServiceBase';

@backgroundClass()
export default class ServiceExternalAccount extends ServiceBase {
  @backgroundMethod()
  async getExternalAccountImage({ accountId }: { accountId: string }) {
    return simpleDb.walletConnect.getExternalAccountImage({ accountId });
  }

  @backgroundMethod()
  async generateExternalAccountInfoFromWalletService({
    walletService,
    externalAccountType,
  }: {
    walletService: WalletService;
    externalAccountType: IExternalAccountType;
  }) {
    const accountInfo =
      simpleDb.walletConnect.getBaseExternalAccountInfoFromWalletService({
        walletService,
      });
    accountInfo.type = externalAccountType;
    return Promise.resolve(accountInfo);
  }

  @backgroundMethod()
  async saveExternalAccountInfo({
    accountId,
    accountInfo,
  }: {
    accountId: string;
    accountInfo: IBaseExternalAccountInfo;
  }) {
    return simpleDb.walletConnect.saveExternalAccountInfo({
      accountId,
      accountInfo,
    });
  }
}
