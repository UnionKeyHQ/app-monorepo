export function normalizeHardwareDeviceName(name?: string | null) {
  if (!name) return '';
  if (/^unionkey/i.test(name)) {
    return name.replace(/^unionkey/i, 'UnionKey');
  }
  if (/^onekey/i.test(name)) {
    return name.replace(/^onekey/i, 'UnionKey');
  }
  if (/^(touch|pro)(\s|$)/i.test(name)) {
    return `UnionKey ${name}`;
  }
  return name;
}
