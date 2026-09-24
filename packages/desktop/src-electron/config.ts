export const allowedDomains = [
  'localhost',
  '127.0.0.1',
  'api.github.com',
  'o554666.ingest.sentry.io',
  'unionkey.io',
  'api.unionkey.io',
  'onekey-asset.com',
];

export const cspRules = [
  // Default to only own resources
  "default-src 'self' 'unsafe-inline' onekey-asset.com",
  // Allow all API calls (Can't be restricted bc of custom backends)
  'connect-src *',
  // Allow images from trezor.io
  "img-src 'self' unionkey.io *.unionkey.io onekey-asset.com",
];
