import { checkIsDefined } from '@unionkey/shared/src/utils/assertUtils';
import type {
  IExternalConnectionInfo,
  IExternalConnectorEvm,
} from '@unionkey/shared/types/externalWallet.types';

import type { EvmConnectorManager } from './EvmConnectorManager';

export class ExternalConnectorEvmEIP6963 {
  constructor() {
    throw new Error(
      'ExternalConnectorEvmEIP6963 is mocked class, use ExternalConnectorEvmEIP6963.createConnector()',
    );
  }

  static async createConnector({
    manager,
    connectionInfo,
  }: {
    manager: EvmConnectorManager;
    connectionInfo: IExternalConnectionInfo;
  }): Promise<IExternalConnectorEvm> {
    const connectorFn = manager.providerDetailToConnector({
      info: checkIsDefined(connectionInfo.evmEIP6963?.info),
    });
    const connector = await manager.setup(connectorFn, connectionInfo);
    return connector;
  }
}
