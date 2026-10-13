import { getPageMotion, PAGE_MOTION_STORAGE_KEY } from '../../utils/page-motion';

let pendingNavigation = null;
try {
  pendingNavigation = window.sessionStorage.getItem(PAGE_MOTION_STORAGE_KEY);
  window.sessionStorage.removeItem(PAGE_MOTION_STORAGE_KEY);
} catch {
  // Keep the full entrance if browser storage is unavailable.
}

const navigation = window.performance.getEntriesByType('navigation')[0];
document.documentElement.dataset.pageMotion = getPageMotion(
  navigation?.type, window.location.href, pendingNavigation,
);

document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0
    || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    || !(event.target instanceof window.Element)) return;

  const link = event.target.closest('a[href]');
  if (!(link instanceof window.HTMLAnchorElement) || link.hasAttribute('download')
    || (link.target && link.target.toLowerCase() !== '_self')) return;

  try {
    const current = new window.URL(window.location.href);
    const destination = new window.URL(link.href);
    if (destination.origin !== current.origin
      || (destination.hash && destination.pathname === current.pathname
        && destination.search === current.search)) return;

    window.sessionStorage.setItem(PAGE_MOTION_STORAGE_KEY, JSON.stringify({
      href: destination.href,
      timestamp: Date.now(),
    }));
  } catch {
    // Invalid links and blocked storage must not interfere with navigation.
  }
});

window.addEventListener('pageshow', event => {
  if (event.persisted) document.documentElement.dataset.pageMotion = 'light';
});
