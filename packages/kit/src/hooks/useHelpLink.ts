import { HELP_CENTER_URL } from '@unionkeyhq/shared/src/config/appConfig';

function normalizePath(path?: string) {
  return path ? path.replace(/^\/|\/$/g, '') : '';
}

export const HELP_LINK = HELP_CENTER_URL;

export function useHelpLink({ path = '' }: { path: string }) {
  // Remove the first and last "/" char
  const normalizedPath = normalizePath(path);
  const finalHref = `${HELP_LINK}/${normalizedPath}`;
  // In case theres no path at the end, remove the last '/' char
  return normalizePath(finalHref);
}
