import uuid from 'react-native-uuid';

import platformEnv from '../../platformEnv';

export enum RequestLibNames {
  axios = 'axios',
  fetch = 'fetch',
  superagent = 'superagent',
}

// TODO baseURL support like https://github.com/zurfyx/fetch-absolute/blob/master/index.js
function getFirstPartyRequestTarget({ url }: { url: string }) {
  if (url.includes('unionkey.io')) {
    return 'unionkey' as const;
  }
  const hosts = [
    'onekey.so',
    'onekeycn.com',
    'onekeytest.com',
    'localhost',
    '127.0.0.1',
    '192.168',
    // 'onekey-asset.com',
  ];
  for (const host of hosts) {
    if (url.includes(host)) {
      return 'legacy' as const;
    }
  }
  return undefined;
}

function generateTraceParent(requestId: string) {
  return `00-${requestId.replace(/-/g, '')}-08e5841cdcbc1c47-01`;
}

export abstract class RequestInterceptorBase {
  abstract setHeader(key: string, val: string): void;

  abstract setDefaultTimeout(ms: number): void;

  abstract setDefaultRetry(count: number): void;

  abstract requestLibName: RequestLibNames;

  normalizeHeaderKey(key: string) {
    return key?.toLowerCase() ?? key;
  }

  interceptRequest({ url }: { url: string }) {
    const requestTarget = url ? getFirstPartyRequestTarget({ url }) : undefined;
    if (requestTarget) {
      const requestId = uuid.v4() as string;
      this.setHeader(
        this.normalizeHeaderKey('X-Request-By'),
        JSON.stringify({
          agent: `UnionKey/${this.requestLibName}`,
          isNativeIOS: platformEnv.isNativeIOS,
          isNativeAndroid: platformEnv.isNativeAndroid,
          isDesktop: platformEnv.isDesktop,
          isExtChrome: platformEnv.isExtChrome,
          isExtFirefox: platformEnv.isExtFirefox,
          version: platformEnv.version,
          buildNumber: platformEnv.buildNumber,
          requestId,
        }),
      );
      this.setHeader(
        this.normalizeHeaderKey('x-unionkey-request-id'),
        requestId,
      );
      // The legacy API still requires its original request-id header. Keep it
      // only for that compatibility path while UnionKey services use the new
      // first-party header above.
      if (requestTarget === 'legacy') {
        this.setHeader(
          this.normalizeHeaderKey('x-onekey-request-id'),
          requestId,
        );
      }
      this.setHeader(
        this.normalizeHeaderKey('traceparent'),
        generateTraceParent(requestId),
      );
    }
    this.setDefaultTimeout(60 * 1000);
    this.setDefaultRetry(0);
  }
}
