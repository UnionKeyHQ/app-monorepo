import type { IDappSourceInfo } from '@unionkeyhq/shared/types';

import { WeblnModalRoutes } from '../../../routes/routesEnum';

export { WeblnModalRoutes };

export type WeblnRoutesParams = {
  [WeblnModalRoutes.MakeInvoice]: {
    sourceInfo: IDappSourceInfo;
  };
  [WeblnModalRoutes.VerifyMessage]: {
    sourceInfo: IDappSourceInfo;
  };
  [WeblnModalRoutes.WeblnAuthentication]: {
    onDone: (password: string) => void;
    walletId: string;
  };
};
