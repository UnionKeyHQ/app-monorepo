import type { Account as AccountEngineType } from '@unionkeyhq/engine/src/types/account';
import type { Network } from '@unionkeyhq/engine/src/types/network';

export type AccountGroup = { title: Network; data: AccountEngineType[] };
