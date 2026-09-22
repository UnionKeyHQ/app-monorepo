import simpleDb from '@unionkeyhq/engine/src/dbs/simple/simpleDb';
import type { WalletService } from '@unionkeyhq/kit/src/components/WalletConnect/types';
import {
  backgroundClass,
  backgroundMethod,
} from '@unionkeyhq/shared/src/background/backgroundDecorators';

import ServiceBase from './ServiceBase';

import type { IWalletConnectSession } from '@walletconnect/types';

@backgroundClass()
class ServiceWalletConnect extends ServiceBase {
  @backgroundMethod()
  async findWalletServiceBySession({
    session,
  }: {
    session: IWalletConnectSession;
  }) {
    return simpleDb.walletConnect.findWalletServiceBySession({ session });
  }

  @backgroundMethod()
  async getWalletServicesList() {
    return simpleDb.walletConnect.getWalletServicesList();
  }

  @backgroundMethod()
  async saveWalletServicesList(list: WalletService[]) {
    return simpleDb.walletConnect.saveWalletServicesList(list);
  }

  @backgroundMethod()
  async removeWalletSession(walletUrl: string | undefined) {
    return simpleDb.walletConnect.removeWalletSession(walletUrl);
  }

  @backgroundMethod()
  async getWalletConnectSessionOfAccount({ accountId }: { accountId: string }) {
    return simpleDb.walletConnect.getWalletConnectSessionOfAccount({
      accountId,
    });
  }

  @backgroundMethod()
  async saveWalletConnectSessionOfAccount({
    accountId,
    session,
    walletService,
  }: {
    accountId: string;
    session: IWalletConnectSession;
    walletService?: WalletService;
  }) {
    return simpleDb.walletConnect.saveWalletConnectSessionOfAccount({
      accountId,
      session,
      walletService,
    });
  }
}

export default ServiceWalletConnect;
