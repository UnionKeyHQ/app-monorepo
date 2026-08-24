import platformEnv from '../platformEnv';

// Be consistent with backend platform definition
// Public request metadata shared by UnionKey API clients.
export const headerPlatform = [platformEnv.appPlatform, platformEnv.appChannel]
  .filter(Boolean)
  .join('-');
