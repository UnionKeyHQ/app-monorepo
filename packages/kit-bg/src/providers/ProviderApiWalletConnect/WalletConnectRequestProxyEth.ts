import { IInjectedProviderNames } from '@unionkeyfe/cross-inpage-provider-types';

import { WalletConnectRequestProxy } from './WalletConnectRequestProxy';

export class WalletConnectRequestProxyEth extends WalletConnectRequestProxy {
  override providerName = IInjectedProviderNames.ethereum;
}
