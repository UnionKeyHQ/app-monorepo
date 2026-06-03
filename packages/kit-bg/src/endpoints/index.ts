import { filter, forEach } from 'lodash';

import { getEndpointsMapByDevSettings } from '@unionkey/shared/src/config/endpointsMap';
import { UnionKeyError } from '@unionkey/shared/src/errors';
import errorUtils from '@unionkey/shared/src/errors/utils/errorUtils';
import platformEnv from '@unionkey/shared/src/platformEnv';
import type {
  EServiceEndpointEnum,
  IEndpointDomainWhiteList,
  IEndpointInfo,
} from '@unionkey/shared/types/endpoint';

import { devSettingsPersistAtom } from '../states/jotai/atoms';

export async function getEndpoints() {
  if (platformEnv.isWebEmbed) {
    const enableTestEndpoint =
      globalThis?.WEB_EMBED_UNIONKEY_APP_SETTINGS?.enableTestEndpoint ?? false;
    return getEndpointsMapByDevSettings({
      enabled: enableTestEndpoint,
      settings: {
        enableTestEndpoint,
      },
    });
  }
  const settings = await devSettingsPersistAtom.get();
  return getEndpointsMapByDevSettings(settings);
}

export async function getEndpointInfo({
  name,
}: {
  name: EServiceEndpointEnum;
}): Promise<IEndpointInfo> {
  const endpoints = await getEndpoints();
  const endpoint = endpoints[name];
  if (!endpoint) {
    throw new UnionKeyError(`Invalid endpoint name:${name}`);
  }
  return { endpoint, name };
}

export async function getEndpointDomainWhitelist() {
  const whitelist: IEndpointDomainWhiteList = [];
  const endpoints = await getEndpoints();
  forEach(endpoints, (endpoint) => {
    try {
      if (endpoint) {
        const url = new URL(endpoint);
        whitelist.push(url.host);
      }
    } catch (e) {
      errorUtils.autoPrintErrorIgnore(e);
    }
  });
  whitelist.push('localhost:3443');

  return filter(whitelist, Boolean);
}

export async function checkIsUnionKeyDomain(url: string) {
  try {
    const whitelist = await getEndpointDomainWhitelist();
    return whitelist.includes(new URL(url).host);
  } catch (e) {
    errorUtils.autoPrintErrorIgnore(e);
    return false;
  }
}
