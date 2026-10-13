export const PAGE_MOTION_STORAGE_KEY = 'page-motion:next';

export function getPageMotion(
  navigationType: string | undefined,
  href: string,
  pendingNavigation: string | null,
  now = Date.now(),
): 'full' | 'light' {
  if (navigationType === 'back_forward') return 'light';
  if (navigationType !== 'navigate' || !pendingNavigation) return 'full';

  try {
    const pending: unknown = JSON.parse(pendingNavigation);
    if (!pending || typeof pending !== 'object'
      || !('href' in pending) || pending.href !== href
      || !('timestamp' in pending) || typeof pending.timestamp !== 'number') {
      return 'full';
    }

    const age = now - pending.timestamp;
    return age >= 0 && age < 30_000 ? 'light' : 'full';
  } catch {
    return 'full';
  }
}
