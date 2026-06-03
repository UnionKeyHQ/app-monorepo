import type { IUnionKeyAPIBaseResponse } from '@unionkey/shared/types/request';

/** Accounts */
export type ICreateUserResponse = IUnionKeyAPIBaseResponse<{
  id: number;
  login: string;
}>;

export type IAuthParams = {
  login: string;
  password: string;
  refresh_token: string;
};

export type IAuthResponse = IUnionKeyAPIBaseResponse<{
  accessToken: string;
  refreshToken: string;
}>;

export type IBalanceResponse = {
  balance: number;
  currency: string;
  unit: string;
};

export type IBatchBalanceResponse = {
  balance: number;
  address: string;
};
